<script>
    import { onMount } from "svelte";
    import { transactionsStore } from "../store/transactionsStore";
    import Chart from "chart.js/auto";
    import { RemoteChunkSize } from "papaparse";

    let remboursements = {};
    $: remboursements= transactionsStore.getProjectByMonth("01/01/2022", "01/03/2022");

    let chart;
    let montants = [];
    let chartCanvas;
    let dates = [];

    console.log("test : ", remboursements);
    if (Object.values(remboursements).length > 0) {
        console.log("remb : ", remboursements);


        dates = remboursements.map((r) => r["Date"]);
        //let montants = remboursements.map((r) => Number(replaceCommaByDot(r["Intérêts remboursés"])));
        dates = dates.reverse();
        //montants = montants.reverse();
    }else{
        dates = [0]
    }



    function updateChart() {
        if (chart) {
            chart.data.labels = dates;
            chart.data.datasets[0].data = [0];
            chart.update();
        }
    }

    // S'abonner aux modifications du store et mettre à jour le graphique
    transactionsStore.subscribe((transactions) => {
        if (transactions) {
            let remboursements = transactionsStore.getProjectByMonth("01/01/2022", "01/03/2022");

            if (Object.values(remboursements).length > 0) {
                dates = [1]; //remboursements.map((r) => r["Date"]).reverse();
                montants = [3]; //remboursements.map((r) => Number(replaceCommaByDot(r["Intérêts remboursés"]))).reverse();
            } else {
                dates = [0];
                montants = [0];
            }

            // Met à jour le graphique avec les nouvelles données
            updateChart();
        }
    });


    onMount(() => {
        new Chart(chartCanvas, {
            type: "bar", // Type de graphique (line, bar, pie, etc.)
            data: {
                labels: dates,
                datasets: [
                    {
                        label: "Remboursement",
                        data: [0], //montants,
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

{#if dates.length > 0}
    <div class="graph">
        <canvas bind:this={chartCanvas}></canvas>
    </div>
{/if}

<style>
    .graph {
        height: 200px;
        width: 100%;
    }
</style>
