import { derived } from "svelte/store";
import { transactionsStore } from "./transactionsStore";

function filterByType(type){ 
    return (transaction) => transaction.Opération == type;
}

function getNumberProject(transactions){
    const result = transactions.filter(filterByType("Offre acceptée"));
    return result.length;
}

function getTotalLoanedMoney(transactions){
    let total = 0;
    const projets = transactions.filter(filterByType("Offre acceptée"));
    for(let projet of projets){
        total += projet.Montant;
    }
    return Math.abs(total);
    
}

function createStatsStore() {
        //création du store derivé du store "transactionStore"
    const store = derived(transactionsStore, $transactionStore => {
        return {
            totalProjectAmount: getNumberProject($transactionStore),
            getTotalLoanedMoney: getTotalLoanedMoney($transactionStore),
        };
    });

    // return le store avec l'interface d'abonnement.
    return {subscribe: store.subscribe}
}


export const statsStore = createStatsStore();
