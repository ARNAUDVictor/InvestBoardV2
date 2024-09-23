<script>
    import GlobalStatsView from "./components/GlobalStatsView.svelte";
    import InvestedMoneyGraph from "./components/InvestedMoneyGraph.svelte";
    import MenuView from "./components/MenuView.svelte";
    import TransactionView from "./components/TransactionView.svelte";
</script>

<main>
    <MenuView/>
    <GlobalStatsView/>
    <InvestedMoneyGraph/>
    <TransactionView/>
</main>

<style>
    main{
        width: 100%;
        height: 100%;
        margin: 0;
    }

    
</style>
