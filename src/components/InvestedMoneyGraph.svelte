<script>
    import { onMount } from "svelte";
    import { transactionsStore } from "../store/transactionsStore";
    import Chart from "chart.js/auto";

    let chart;
    let chartCanvas;
    let interets = {};
    let capital = {};

    const test = (tooltipItems) => {
                let sum = 0;

                tooltipItems.forEach(function (tooltipItem) {
                    sum += tooltipItem.parsed.y;
                });
                return "total : " + sum.toFixed(2) + "€";
            };
            console.log(test)

    // Fonction pour mettre à jour les données du graphique
    function updateChart() {
        if (chart) {
            capital = transactionsStore.getDepositValueByMonth();
            interets = transactionsStore.getInterestsValueByMonth();
            chart.data.labels = Object.keys(capital);
            chart.data.datasets[0].data = Object.values(capital);
            chart.data.datasets[1].data = Object.values(interets);
            chart.update();
            
        }
    }

    // S'abonner aux modifications du store et mettre à jour le graphique
    transactionsStore.subscribe(() => {
        // Met à jour le graphique avec les nouvelles données
        updateChart();
    });

    onMount(() => {
        if (capital[0] == null) {
            let today = new Date().toLocaleDateString();
            capital[today] = 0;
            interets[today] = 0;
        }
        chart = new Chart(chartCanvas, {
            type: "bar", // Type de graphique (line, bar, pie, etc.)
            data: {
                labels: Object.keys(capital),
                datasets: [
                    {
                        label: "Capital",
                        data: Object.values(capital),
                        backgroundColor: "rgba(0, 255, 0, 0.7)",
                    },
                    {
                        label: "Interets",
                        data: Object.values(interets),
                        backgroundColor: "rgba(255, 0, 0, 0.7)",
                    },
                ],
            },
            options: {
                maintainAspectRatio: false,
                scales: {
                    x: {
                        stacked: true,
                    },
                    y: {
                        stacked: true,
                    },
                },
                interaction:{
                    intersect: false,
                    mode: "index",
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            footer: test,
                        },
                    },
                },
            },
        });
    });
</script>

<div class="graph">
    <canvas bind:this={chartCanvas}></canvas>
</div>

<style>
    .graph {
        height: 200px;
        width: 100%;
    }
</style>
