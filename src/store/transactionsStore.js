import { get, writable } from "svelte/store";
import { convertStringToDate, replaceCommaByDot } from "../services/utils";


/**
 * Creation of the store 
 * @returns several function to interact with stored data
 */
function createTransactionsStore() {
    const { subscribe, set, update } = writable({});

    /**
     * Get one project with all it data by project ID
     * @param {string} projectId 
     * @returns {Object} project with all data
     */
    function getRemboursementByProject(projectId){
        const transactions = get(transactionsStore);
        return transactions["remboursements"].filter((remboursement) => remboursement["N°Contrat"] == projectId);
    }

    /**
     * Get all remboursements between "beginDate" and "endDate"
     * @param {string} beginDateStr - beginning date of asked data. Format : "DD-MM-YYYY"
     * @param {string} endDateStr - ending date of asked data. Format : "DD-MM-YYYY"
     * @returns {Array<object>} - array contain all remboursement
     */
    function getRemboursementByDate(beginDateStr, endDateStr) {
        const beginDate = convertStringToDate(beginDateStr).getTime();
        const endDate = convertStringToDate(endDateStr).getTime();

        let filtredTransactions = [];
        const transactions = get(transactionsStore);

        if (transactions && transactions["remboursements"]) {
            filtredTransactions = transactions["remboursements"].filter((remboursement) => {
                const remboursementDate = convertStringToDate(remboursement["Date"]).getTime();
                return remboursementDate >= beginDate && remboursementDate <= endDate;
            });
        }
        return filtredTransactions;
    }

    /**
     * Get all projects of month and yeard of "date"
     * @param {string} datestr - month and year of asked data. Format : "DD-MM-YYYY"
     * @returns {Array} - array contain all project of the entered month's date
     */
    function getProjectByMonth(datestr){
        const date = convertStringToDate(datestr);
        const month = date.getMonth();
        const year = date.getFullYear();

        let filtredTransactions = [];
        const transactions = get(transactionsStore);

        if (transactions && transactions["projects"]) {
            filtredTransactions = transactions["projects"].filter((projet) => {
                const projectDate = convertStringToDate(projet["Date de financement"]);
                const dateMonth = projectDate.getMonth();
                const dateYear = projectDate.getFullYear();
                return dateMonth == month && dateYear == year;
            });
        }
        return filtredTransactions;
    }

    /**
     * get the amount of money invested on one month
     * @param {string} date - month and year of asked data. Format : "DD-MM-YY"
     * @returns {Object<String, Number>} key = date, value = money off asked month and year
     */
    function getInvestedMoneyByMonth(date){
        let investedMoney = {};
        let projects = getProjectByMonth(date);
        const totalMoney = projects.reduce((total, project) => {
            return total + project.Montant;
        }, 0); // 0 est la valeur initiale
        investedMoney[date] = totalMoney
        return investedMoney;
    }

    /**
     * Get money invested by month from the begining of investements
     */
    function getInvestedMoneyByMonthFromBeginning(){
        let investedMoney = {};
        const transactions = get(transactionsStore);
        
        if(transactions["projects"]){
            let currentDate = getBeginningDate();
            const todayDate = new Date(); // recupère la date d'aujourd'hui
            todayDate.setDate(1); //  et set le jour à 1
            while (currentDate <= todayDate) {
                let monthdata = getInvestedMoneyByMonth(currentDate.toLocaleDateString());
                investedMoney[Object.keys(monthdata)] = Object.values(monthdata)[0];
                currentDate.setMonth(currentDate.getMonth() + 1); // Passe au mois suivant
            }
            return investedMoney;
        }
    }
    
    /**
     *  Get the date of the first investement
     * @returns {Date} - Date of the first investissement
     */
    function getBeginningDate(){
        const transactions = get(transactionsStore);
        let dates = transactions["projects"].map(transaction => new Date(convertStringToDate(transaction["Date de financement"])));
        return new Date(Math.min(...dates));
    }

    /**
     * get deposits cumul by month
     * @returns {Object} - key = date, value = sum of all precedent deposits
     */
    function getAccountValueByMonth(){
        const deposits = getDepositsBetweenDates();
        let cumulativeSum = 0;
        let cumulativeDeposits = {};

        for(const [date, amount] of Object.entries(deposits)){
            cumulativeSum += amount;
            cumulativeDeposits[date] = cumulativeSum;
        }
        console.log(cumulativeDeposits);
        return cumulativeDeposits;
    }

    /**
     * get all deposit ordonned by month
     * @returns {Object} key = date, value = sum of all deposit of the month
     */
    function getDepositsBetweenDates(){
        const transactions = get(transactionsStore);
        
        if(transactions["depots"]){
            let currentDate = getBeginningDate(); 
            const todayDate = new Date(); // recupère la date d'aujourd'hui
            todayDate.setDate(1); //  et set le jour à 1
            let deposits = {};
            while (currentDate <= todayDate) {
                const currentDateStr = currentDate.toLocaleDateString();
                deposits[currentDateStr] = getDepositsSum(getDepotByMonth(currentDateStr));
                currentDate.setMonth(currentDate.getMonth() + 1); // Passe au mois suivant
            }
            return deposits;
        }
    }

    /**
     * Get the sum of all given deposit
     * @param {Array} deposits 
     * @returns {Number} - sum of all deposits
     */
    function getDepositsSum(deposits){
        const totalDepot = deposits.reduce((total, deposit) => {
            console.log(replaceCommaByDot(deposit.Montant));
            return total + parseFloat(replaceCommaByDot(deposit.Montant));
        }, 0); // 0 est la valeur initiale
        return totalDepot;
    }
    

    /**
     * Get all depot of a given month
     * @param {string} datestr - string of the given month and year for filter
     * @returns {Array} array with all depot corresponding to given date
     */
    function getDepotByMonth(datestr){
        const date = convertStringToDate(datestr);
        const month = date.getMonth();
        const year = date.getFullYear();
        const transactions = get(transactionsStore);
        return filterByMonthAndYear(transactions["depots"], month, year);
    }

    /** 
     * Get all transaction corresponding to the date given in the given array
     * @param {Array}  transactions - Array of all transactions to filter
     * @param {number} month - month for filter
     * @param {number} year - year for filter
     * @returns {Array} Filtred transations corresponding to month and year
     */
    function filterByMonthAndYear(transactions, month, year){
        if (!transactions || transactions.length == 0){
            console.error("Error : La liste de transaction est vide ou n'existe pas");
            return;
        }

        let dateKey = "";
        let filtredTransaction = [];

        switch(transactions[0]["Opération"]){
            case "Dépôt de fonds":
                 dateKey = "Date";
                 break;
            default:
                console.log("Opération inconnu : ", transactions[0]["Opération"]);
        }

        filtredTransaction = transactions.filter((depot) => {
            const depotDate = convertStringToDate(depot[dateKey]);
            const dateMonth = depotDate.getMonth();
            const dateYear = depotDate.getFullYear();
            return dateMonth == month && dateYear == year;
        });
        return filtredTransaction;
    }



    return {
        subscribe,
        set,
        get,
        update,
        getRemboursementByDate,
        getRemboursementByProject,
        getProjectByMonth,
        getInvestedMoneyByMonth,
        getInvestedMoneyByMonthFromBeginning,
        getDepotByMonth,
        getAccountValueByMonth,
    };
}


export let transactionsStore = createTransactionsStore();

