import { transactionsStore } from "../store/transactionsStore";
import Papa from "papaparse";

function parseCSVFile(file) {
    return new Promise((resolve, reject) => {
        let result = [];

        Papa.parse(file, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            chunkSize: 1024 * 1024,
            chunk: (results) => {
                result.push(...results.data);
            },
            complete: () => {
                console.log("file parsing is complete");
                resolve(result);
            },
            error: (er) => {
                console.error("File parsing error : ", er);
                reject(er);
            }
        });
    })
}

function orderFileByType(files) {
    let ordonedFiles = {};
    if (files[0].name.includes("transactions")) {
        ordonedFiles["transaction"] = files[0];
        ordonedFiles["contrats"] = files[1];
    } else {
        ordonedFiles["contrats"] = files[0];
        ordonedFiles["transaction"] = files[1];
    }
    return ordonedFiles;
}

function mergeData(contrats, transactions) {
    transactions.projects = contrats;
    return transactions;
}

function filterByOperationType(data) {
    let filteredData = {};

    filteredData.remboursements = data.filter(transaction => transaction["Opération"] == "Remboursement");
    filteredData.depots = data.filter(transaction => transaction["Opération"] == "Dépôt de fonds");
    filteredData.bonus = data.filter(transaction => transaction["Opération"] == "Bonus");

    return filteredData;
}

export async function processCSVFiles(files) {
    let ordonedFiles = orderFileByType(files);

    try {
        const contratsFile = await parseCSVFile(ordonedFiles.contrats);
        const transactionsFile = await parseCSVFile(ordonedFiles.transaction);
        try{
            let filtredTransactions = filterByOperationType(transactionsFile);
            let mergedData = mergeData(contratsFile, filtredTransactions);
            try{
                transactionsStore.set(mergedData);
            } catch (er) {
                console.error("Error merging files : ", er);
            }
        } catch (er) {
            console.error("Error processing files : ", er);
        }
    } catch (er) {
        console.error("Error parsing files : ", er);
    }
    
}