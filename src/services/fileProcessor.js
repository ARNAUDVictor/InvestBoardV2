import { transactionsStore } from "../store/transactionsStore";
import Papa from "papaparse";

export function processCSVFile(file){
    Papa.parse(file, {header: true, dynamicTyping: true, skipEmptyLines: true, chunkSize: 1024 *1024, chunk: (results) => {
        console.log(results.data);
        transactionsStore.update((existingData) => [...existingData, ...results.data]);
    },
    complete: () => {
        console.log("file parsing is complete");
    },
    error: (er) => {
        console.error("File parsing error : ", er);
    }
    });
}