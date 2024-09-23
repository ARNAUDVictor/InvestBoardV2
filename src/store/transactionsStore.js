import { get, writable } from "svelte/store";
import { convertStringToDate } from "../services/utils";



function createTransactionsStore() {
    const { subscribe, set, update } = writable({});

    function getRemboursementByMonth(beginDate, endDate) {
        beginDate = convertStringToDate(beginDate).getTime();
        endDate = convertStringToDate(endDate).getTime();

        let filtredTransactions = {};
        const transactions = get(transactionsStore);

        if (transactions && transactions["remboursements"]) {
            filtredTransactions = transactions["remboursements"].filter((remboursement) => {
                const dateTime = convertStringToDate(remboursement["Date"]).getTime();
                return dateTime >= beginDate && dateTime <= endDate;
            });
        }
        return filtredTransactions;
    }

    function getProjectByMonth(beginDate, endDate){
        beginDate = convertStringToDate(beginDate).getTime();
        endDate = convertStringToDate(endDate).getTime();

        let filtredTransactions = {};
        const transactions = get(transactionsStore);
        //console.log("projet : ", transactionsStore.projects);

        if (transactions && transactions["projects"]) {
            filtredTransactions = transactions["projects"].filter((projet) => {
                const dateTime = convertStringToDate(projet["Date"]).getTime();
                return dateTime >= beginDate && dateTime <= endDate;
            });
        }
        return filtredTransactions;
    }

    function getRemboursementByProject(projectId){
        const transactions = get(transactionsStore);
        return transactions["remboursements"].filter((remboursement) => remboursement["N°Contrat"] == projectId);
    }

    return {
        subscribe,
        set,
        get,
        update,
        getRemboursementByDate: getRemboursementByMonth,
        getRemboursementByProject,
        getProjectByMonth,
    };
}


export let transactionsStore = createTransactionsStore();

