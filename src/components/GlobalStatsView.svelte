<script>
    import { statsStore } from "../store/statsStore";

</script>
<p>Nombre total de projet : {$statsStore.totalProjectAmount}</p>
<p>Nombre de projet terminés : {$statsStore.numberCompletedProjects} soit {$statsStore.percentageOfCompletedProjects} %</p>
<p>Argent total : {$statsStore.totalLoanedMoney} €</p>
<p>Argent actuellement investie : {$statsStore.totalCurrentlyLoanedMoney} €</p>
<p>Total intérets reçus : {$statsStore.totalInterest} €</p>
<p>Durée moyenne : {$statsStore.averageDuration} mois</p>
<p>Taux moyen pondéré : {$statsStore.averageRate} %</p>


<style>

</style>
