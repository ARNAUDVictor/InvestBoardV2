import { derived } from "svelte/store";
import { transactionsStore } from "./transactionsStore";

function getNumberProject(transactions){
    if(Object.keys(transactions).length > 0){
        return Object.keys(transactions.projects).length;
    }
    return 0;
}

function getTotalLoanedMoney(transactions){
    if(Object.keys(transactions).length > 0){
        let money = 0;
        for(let project of transactions.projects){
            money += Number(project.Montant);
        }
        return money;
    }
    return 0;
}

function getTotalCurrentlyLoanedMoney(transactions){
    if(Object.keys(transactions).length > 0){
        console.log(transactions.projects)
        let projects = transactions.projects.filter((transaction) => transaction["Statut"] == "Prêt en cours");
        let money = 0;
        for(let project of projects){
            money += Number(project.Montant);
        }
        return money;
    }
    return 0;
}

function createStatsStore() {
        //création du store derivé du store "transactionStore"
    const store = derived(transactionsStore, $transactionsStore => {
        return {
            totalProjectAmount: getNumberProject($transactionsStore),
            totalLoanedMoney: getTotalLoanedMoney($transactionsStore),
            totalCurrentlyLoanedMoney: getTotalCurrentlyLoanedMoney($transactionsStore),
        };
    });

    // return le store avec l'interface d'abonnement.
    return {subscribe: store.subscribe}
}


export const statsStore = createStatsStore();
