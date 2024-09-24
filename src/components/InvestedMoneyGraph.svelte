<script>
    import { onMount } from "svelte";
    import { transactionsStore } from "../store/transactionsStore";
    import Chart from "chart.js/auto";
    import { replaceCommaByDot } from "../services/utils";

    let chart;
    let chartCanvas;
    let dates = "01/05/2023";
    let investedMoney = [];

    // Fonction pour mettre à jour les données du graphique
    function updateChart() {
        if (chart) {
            console.log("test : ", investedMoney);
            chart.data.labels = Object.keys(investedMoney);
            chart.data.datasets[0].data = Object.values(investedMoney);
            chart.update();
        }
    }

    // S'abonner aux modifications du store et mettre à jour le graphique
    transactionsStore.subscribe((transactions) => {
        let remboursements = transactionsStore.getProjectByMonth(dates);

        if (Object.values(remboursements).length > 0) {
            let montant = 0;
            investedMoney = [];
            for (let r of Object.values(remboursements)) {
                montant += r["Montant"];
            }
            investedMoney[dates] = montant;
        }
        // Met à jour le graphique avec les nouvelles données
        updateChart();
    });

    onMount(() => {
        if (investedMoney[0] == null) {
            let today = new Date().toLocaleDateString();
            investedMoney[today] = 0;
        }
        console.log(investedMoney);
        chart = new Chart(chartCanvas, {
            type: "bar", // Type de graphique (line, bar, pie, etc.)
            data: {
                labels: Object.keys(investedMoney),
                datasets: [
                    {
                        label: "Remboursement",
                        data: Object.values(investedMoney),
                        borderColor: "rgba(75, 192, 192, 1)",
                        backgroundColor: "rgba(117, 255, 51, 0.2)",
                    },
                ],
            },
            options: {
                maintainAspectRatio: false,
            },
        });
    });
</script>

{#if investedMoney.length == 0}
    <h2>Aucune donnée disponible pour la plage de dates sélectionnée.</h2>
{/if}

<div class="graph">
    <canvas bind:this={chartCanvas}></canvas>
</div>

<style>
    .graph {
        height: 200px;
        width: 100%;
    }
</style>
