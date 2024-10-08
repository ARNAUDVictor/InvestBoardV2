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
    function getRemboursementByProject(projectId) {
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
    function getProjectByMonth(datestr) {
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
    function getInvestedMoneyByMonth(date) {
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
    function getInvestedMoneyByMonthFromBeginning() {
        let investedMoney = {};
        const transactions = get(transactionsStore);

        if (transactions["projects"]) {
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


    /************************************************************************* */
    /**
     *  Get the date of the first investement
     * @returns {Date} - Date of the first investissement
     */
    function getBeginningDate() {
        const transactions = get(transactionsStore);
        let dates = transactions["projects"].map(transaction => new Date(convertStringToDate(transaction["Date de financement"])));
        return new Date(Math.min(...dates));
    }

    /**
     * Get cumulative deposits by month.
     * @returns {Object} - key = date, value = cumulative sum of deposits for each month.
     */
    function getDepositValueByMonth() {
        return getCumulativeValuesByMonth(() =>
            getValuesBetweenDates("depots", (dateStr) => {
                const depots = getValuesByMonth(dateStr, "depots", "Montant");
                return getSum(depots,"Montant");
            })
        );
    }

    /**
     * Get cumulative interests by month.
     * @returns {Object} - key = date, value = cumulative sum of interests for each month.
     */
    function getInterestsValueByMonth() {
        return getCumulativeValuesByMonth(() =>
            getValuesBetweenDates("remboursements", (dateStr) =>{
                const interests = getValuesByMonth(dateStr, "remboursements", "Intérêts remboursés");
                return getSum(interests, "Intérêts remboursés");
            })
        );
    }

    /**
     * Generic function to calculate cumulative sums by month.
     * @param {Function} getValuesFunction - Function that returns the values for each month.
     * @returns {Object} - An object where keys are dates and values are cumulative sums.
     */
    function getCumulativeValuesByMonth(getValuesFunction) {
        let cumulativeSum = 0; 
        let cumulativeValues = {};

        // Call the passed function to get the values by month (deposits or interests)
        const valuesByMonth = getValuesFunction();

        // Iterate over each month (date) and its corresponding value (sum by month)
        for (const [date, amount] of Object.entries(valuesByMonth)) {
            cumulativeSum += amount;
            cumulativeValues[date] = cumulativeSum; // Store the cumulative sum for the current month
        }
        return cumulativeValues; 
    }

    /**
     * Get values (deposits or interests) between the beginning date and today.
     * @param {string} transactionType - Type of transaction to retrieve ('depots', 'remboursements').
     * @param {Function} sumByMonthFunction - Function to calculate the sum for each month.
     * @returns {Object} - An object where keys are dates (month) and values are sums for each month.
     */
    function getValuesBetweenDates(transactionType, sumByMonthFunction) {
        const transactions = get(transactionsStore);
        if (transactions[transactionType]) {
            let currentDate = getBeginningDate(); // starting date
            const todayDate = new Date(); // today / ending date
            todayDate.setDate(1); // day = 1
            let valuesByMonth = {};

            while (currentDate <= todayDate) {
                const currentDateStr = currentDate.toLocaleDateString();
                valuesByMonth[currentDateStr] = sumByMonthFunction(currentDateStr); // sum of the month
                currentDate.setMonth(currentDate.getMonth() + 1); // next month
            }

            return valuesByMonth;
        }
    }

    /**
     * Calculate the sum of the values for a given month.
     * @param {Array} values - Array of values (deposits or interests) to sum.
     * @param {string} valueKey - The key to access the value ('Montant', 'Intérêts remboursés').
     * @returns {Number} - Sum of the values for the given month.
     */
    function getSum(values, valueKey) {
        const total = values.reduce((sum, item) => {
            return sum + parseFloat(replaceCommaByDot(item[valueKey])); // Convert string values to float and add them up
        }, 0); // Initial sum = 0

        return total;
    }

    /**
     * Get all values (deposits or interests) for a given month.
     * @param {string} dateStr - The date string representing the month and year.
     * @param {string} transactionType - The type of transaction to retrieve ('depots', 'remboursements').
     * @param {string} valueKey - The key to access the value in each transaction ('Montant', 'Intérêts remboursés').
     * @returns {Array} - Array of transactions corresponding to the given month.
     */
    function getValuesByMonth(dateStr, transactionType, valueKey) {
        const date = convertStringToDate(dateStr);
        const month = date.getMonth();
        const year = date.getFullYear();
        const transactions = get(transactionsStore); // get all transactions from the store

        // Filter the transactions by the given month and year
        return filterByMonthAndYear(transactions[transactionType], month, year);
    }

    /** 
     * Get all transaction corresponding to the date given in the given array
     * @param {Array}  transactions - Array of all transactions to filter
     * @param {number} month - month for filter
     * @param {number} year - year for filter
     * @returns {Array} Filtred transations corresponding to month and year
     */
    function filterByMonthAndYear(transactions, month, year) {
        if (!transactions || transactions.length == 0) {
            console.error("Error : La liste de transaction est vide ou n'existe pas");
            return;
        }

        let dateKey = "";
        let filtredTransaction = [];

        switch (transactions[0]["Opération"]) {
            case "Dépôt de fonds": // fall through next case will be execute
            case "Remboursement":
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
        getDepositValueByMonth,
        getInterestsValueByMonth,
    };
}


export let transactionsStore = createTransactionsStore();

