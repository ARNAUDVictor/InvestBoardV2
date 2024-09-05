<script>
    import { statsStore } from "../store/statsStore";

</script>
<p>Nombre total de projet : {$statsStore.totalProjectAmount}</p>
<p>Nombre de projet terminés : {$statsStore.numberCompletedProjects} soit {$statsStore.percentageOfCompletedProjects} %</p>
<p>Argent total : {$statsStore.totalLoanedMoney} €</p>
<p>Argent actuellement investie : {$statsStore.totalCurrentlyLoanedMoney} €</p>
<p>Total intérets reçus : {$statsStore.totalInterest} €</p>


<style>

</style>
