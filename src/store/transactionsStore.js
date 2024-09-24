import { get, writable } from "svelte/store";
import { convertStringToDate } from "../services/utils";



function createTransactionsStore() {
    const { subscribe, set, update } = writable({});

    function getRemboursementByDate(beginDate, endDate) {
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

    function getProjectByDate(date){
        date = convertStringToDate(date);
        const month = date.getMonth();
        const year = date.getYear();

        let filtredTransactions = {};
        const transactions = get(transactionsStore);

        if (transactions && transactions["projects"]) {
            filtredTransactions = transactions["projects"].filter((projet) => {
                const projectDate = convertStringToDate(projet["Date de financement"]);
                const dateMonth = projectDate.getMonth();
                const dateYear = projectDate.getYear();
                return dateMonth == month && dateYear == year;
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
        getRemboursementByDate: getRemboursementByDate,
        getRemboursementByProject,
        getProjectByMonth: getProjectByDate,
    };
}


export let transactionsStore = createTransactionsStore();

