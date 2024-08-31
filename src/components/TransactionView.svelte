<script>
    import { transactions } from "../store/store";

    // Le store est automatiquement réactif grâce à $transactions
    $:transactionFromStore = $transactions;

</script>

{#if transactionFromStore.length > 0}
    <table>
        <thead>
            <tr>
                {#each Object.keys(transactionFromStore[0]) as key}
                    <th>{key}</th>
                {/each}
            </tr>
        </thead>
        <tbody>
            {#each transactionFromStore as row}
                <tr>
                    {#each Object.values(row) as value}
                        <td>{value}</td>
                    {/each}
                </tr>
            {/each}
        </tbody>
    </table>
{:else}
    <p>Pas de transactions enregistrées</p>
{/if}

<style>
    table {
        width: 100%;
        border-collapse: collapse;
    }
    th, td {
        border: solid black 1px;
        padding: 8px;
        text-align: left;
    }
    th {
        background-color: #f2f2f2;
    }
</style>
