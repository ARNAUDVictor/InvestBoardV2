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
    const mergedData = [];

    //creer une map de toutes les lignes du fichier contrat avec pour identifiant le numéro de contrat + la date comme id unique
    const mapContrats = new Map(contrats.map(contrat => [contrat["N°Contrat"] + contrat["Date de financement"], contrat]));

    //parcours du deuxieme fichier :
    for (let transaction of transactions) {
        const compositeKey = transaction["N°Contrat"] + transaction["Date"]; // création de l'identifiant unique pour les transaction
        if (mapContrats.has(compositeKey)) {
            const contrat = mapContrats.get(compositeKey);
            mergedData.push({ ...contrat, ...transaction })
        } else {
            mergedData.push(transaction);
        }
    }
    return mergedData;
}

export async function processCSVFiles(files) {
    let ordonedFiles = orderFileByType(files);

    try {
        const dataFile1 = await parseCSVFile(files[0]);
        const dataFile2 = await parseCSVFile(files[1]);

        transactionsStore.set(mergeData(dataFile1, dataFile2));
    } catch (er) {
        console.error("Error processing files : ", er);
    }
}