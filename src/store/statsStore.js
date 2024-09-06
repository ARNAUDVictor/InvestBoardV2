import { derived } from "svelte/store";
import { transactionsStore } from "./transactionsStore";

function getNumberProject(transactions) {
    if (Object.keys(transactions).length > 0) {
        return Object.keys(transactions.projects).length;
    }
    return 0;
}

function getTotalLoanedMoney(transactions) {
    if (Object.keys(transactions).length > 0) {
        let money = 0;
        for (let project of transactions.projects) {
            money += Number(project.Montant);
        }
        return money;
    }
    return 0;
}

function getTotalCurrentlyLoanedMoney(transactions) {
    if (Object.keys(transactions).length > 0) {
        let projects = transactions.projects.filter((project) => project["Statut"] == "Prêt en cours");
        let money = 0;
        for (let project of projects) {
            money += Number(project.Montant);
        }
        return money;
    }
    return 0;
}

function getNumberCompletedProjects(transaction) {
    if (Object.keys(transaction).length > 0) {
        let projects = transaction.projects.filter((project) => project["Statut"] == "Prêt remboursé");
        return projects.length;
    }
    return 0;
}

function convertNumberStringToNumber(numberString){
    if (typeof numberString === "string") {
        numberString = numberString.replace(",", ".");
        return Number(numberString)
    }
    return numberString;
}

function getTotalInterests(transactions) {
    if (Object.keys(transactions).length > 0) {
        let money = 0;
        for (let remboursement of transactions.remboursements) {
            let remb = convertNumberStringToNumber(remboursement["Intérêts remboursés"]);
            money += remb;
        }
        return money.toFixed(2);
    }
    return 0;
}

function getAverageDuration(transaction) {
    if (Object.keys(transaction).length > 0) {
        let duration = 0;
        for(let project of transaction.projects){
            duration += project["Durée de remboursements (mois)"];
        }
        duration = duration / transaction.projects.length;
        return duration.toFixed(2);
    }
    return 0;
}

function getAverageRate(transaction){
    if (Object.keys(transaction).length > 0) {
        let averageRate = 0;
        let projects =  transaction.projects.filter((project) => project["Statut"] == "Prêt en cours");
        let i = 0;
        for(let project of projects){
            i++;
            console.log(project["Montant"], convertNumberStringToNumber(project["Taux"]));
            averageRate = averageRate + project["Montant"] * convertNumberStringToNumber(project["Taux"]);
            console.log(averageRate);
        }
        console.log(averageRate);
        averageRate = averageRate / getTotalCurrentlyLoanedMoney(transaction);
        return averageRate.toFixed(2);
    }
    return 0;
}

function getMaxExposition(transaction){
    if (Object.keys(transaction).length > 0) {
        let projects =  transaction.projects.filter((project) => project["Statut"] == "Prêt en cours");
        //let max = 
    } 
}

function createStatsStore() {
    // Création du store dérivé du store "transactionsStore"
    const store = derived(transactionsStore, $transactionsStore => {
        const totalProjectAmount = getNumberProject($transactionsStore) || 0;
        const totalLoanedMoney = getTotalLoanedMoney($transactionsStore) || 0;
        const totalCurrentlyLoanedMoney = getTotalCurrentlyLoanedMoney($transactionsStore) || 0;
        const numberCompletedProjects = getNumberCompletedProjects($transactionsStore) || 0;
        const percentageOfCompletedProjects = totalProjectAmount > 0 ? Math.round((numberCompletedProjects / totalProjectAmount) * 100) : 0;
        const totalInterest = getTotalInterests($transactionsStore) || 0;
        const averageDuration = getAverageDuration($transactionsStore) || 0;
        const averageRate = getAverageRate($transactionsStore) || 0;

        return {
            totalProjectAmount,
            totalLoanedMoney,
            totalCurrentlyLoanedMoney,
            numberCompletedProjects,
            percentageOfCompletedProjects,
            totalInterest,
            averageDuration,
            averageRate,
        };
    });

    // return le store avec l'interface d'abonnement.
    return { subscribe: store.subscribe }
}


export const statsStore = createStatsStore();
