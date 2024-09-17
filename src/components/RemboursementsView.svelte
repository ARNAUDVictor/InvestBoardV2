<script>
    import { transactionsStore } from "../store/transactionsStore";

    export let projectID;
    const remboursements =
        transactionsStore.getRemboursementByProject(projectID);
    console.log("remb : ", remboursements);
</script>

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
</style>
