<script>
    import { transactionsStore } from "../store/transactionsStore";
    import RemboursementsView from "./RemboursementsView.svelte";

    // Le store est automatiquement réactif grâce à $transactions
    $: transactionFromStore = $transactionsStore;

    let visibility = {};

  function toggleVisibility(projectID) {
    visibility[projectID] = !visibility[projectID];
  }
</script>

{#if Object.keys(transactionFromStore).length > 0}
    <table>
        <thead>
            <tr>
                {#each Object.keys(transactionFromStore["projects"][0]) as key}
                    <th>{key}</th>
                {/each}
                <th>Remboursements</th>
            </tr>
        </thead>
        <tbody>
            {#each transactionFromStore["projects"] as row}
                <tr>
                    {#each Object.values(row) as value}
                        <td>{value}</td>
                    {/each}
                    <td>
                        <button on:click={() => toggleVisibility(row["N°Contrat"])}>Afficher remboursement</button>
                        <!--https://stackoverflow.com/questions/69691703/how-can-i-show-a-hidden-text-by-clicking-on-a-button-->
                    </td>
                </tr>
                {#if visibility[row["N°Contrat"]]}
                    <RemboursementsView projectID={row["N°Contrat"]}/>
                {/if}
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
