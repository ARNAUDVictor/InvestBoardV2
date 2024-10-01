<script>
    import { onMount } from "svelte";
    import { transactionsStore } from "../store/transactionsStore";
    import Chart from "chart.js/auto";
    import { replaceCommaByDot } from "../services/utils";

    export let projectID;
    const remboursements = transactionsStore.getRemboursementByProject(projectID);

    let chartCanvas;
    let dates = remboursements.map((r) => r["Date"])
    let montants = remboursements.map((r) => Number(replaceCommaByDot(r["Intérêts remboursés"])));
    dates = dates.reverse();
    montants = montants.reverse();

    onMount(() => {
        new Chart(chartCanvas, {
            type: 'bar', // Type de graphique (line, bar, pie, etc.)
            data: {
                labels: dates,
                datasets: [{
                    label: 'Remboursement',
                    data: montants,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(117, 255, 51, 0.7)',
                }]
            },
            options:{
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

{#if Object.keys(remboursements).length > 0}
    <table>
        <thead>
            <tr>
                {#each Object.keys(remboursements[0]) as key}
                    <th>{key}</th>
                {/each}
            </tr>
        </thead>
        <tbody>
            {#each remboursements as row}
                <tr>
                    {#each Object.values(row) as value}
                        <td>{value}</td>
                    {/each}
                </tr>
            {/each}
        </tbody>
    </table>
{:else}
    <p>Pas de remboursements enregistrés</p>
{/if}

<style>
    table {
        width: 100%;
        border-collapse: collapse;
    }
    th,
    td {
        border: solid black 1px;
        padding: 8px;
        text-align: left;
    }
    th {
        background-color: #f2f2f2;
    }
    .graph{
        height: 200px;
        width: 100%;
    }
</style>
