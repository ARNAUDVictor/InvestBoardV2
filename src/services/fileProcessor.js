import { transactions } from "../store/store";
import Papa from "papaparse";

export function processCSVFile(file){
    Papa.parse(file, {header: true, dynamicTyping: true, skipEmptyLines: true, chunkSize: 1024 *1024, chunk: (results) => {
        transactions.update(existingData => [...existingData, ...results.data]);
    },
    complete: () => {
        console.log("file parsing is complete");
    },
    error: (er) => {
        console.error("File parsing error : ", er);
    }
    });
}

function addToStore(newData) {
    transactions.update((existingData) => {
        return [...existingData, ...newData];
    });
}