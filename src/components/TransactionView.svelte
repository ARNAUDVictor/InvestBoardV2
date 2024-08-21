<script>
    import { getAllTransactions } from "../services/dataCollector";

    let promise = getAllTransactions();
</script>

{#await promise}
    <p>Chargement des données</p>
{:then transactions}
    {#each transactions as transaction}
        <p>{transaction}</p>
    {/each}
{:catch error}
    <p>{error.message}</p>
{/await}