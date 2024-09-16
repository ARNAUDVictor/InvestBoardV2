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

return {
    subscribe,
    set,
    update,
    getRemboursementByDate,
};
}


export let transactionsStore = createTransactionsStore();

