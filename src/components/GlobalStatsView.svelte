<script>
    import { statsStore } from "../store/statsStore";
</script>

<div id="cardContainer">
    <div class="card">
        <p class="title">Projet en cours</p>
        <p class="value">
            {$statsStore.totalProjectAmount - $statsStore.numberCompletedProjects}
        </p>
    </div>
    <div class="card">
        <p class="title">Valeur totale</p>
        <p class="value">{$statsStore.totalLoanedMoney}</p>
    </div>
    <div class="card">
        <p class="title">Taux moyen</p>
        <p class="value">{$statsStore.averageRate} %</p>
    </div>
    <div class="card">
        <p class="title">Durée moyenne</p>
        <p class="value">{$statsStore.averageDuration} mois</p>
    </div>
    <div class="card">
        <p class="title">Intérets reçus <br> (brut)</p>
        <p class="value">{$statsStore.totalInterest} €</p>
    </div>
</div>
<!--
<div>
    <p>Nombre total de projet : {$statsStore.totalProjectAmount}</p>
    <p>
        Nombre de projet terminés : {$statsStore.numberCompletedProjects} soit {$statsStore.percentageOfCompletedProjects}
        %
    </p>
    <p>
        Argent actuellement investie : {$statsStore.totalCurrentlyLoanedMoney} €
    </p>
    
    <p>Taux exposition MAX : {$statsStore.maxExposure} %</p>
</div>
-->

<style>
    #cardContainer{
        display: flex;
        justify-content: space-around;
        margin: 15px;
    }

    .card {
        width: 200px;
        background-color: #009FB7;
        border-radius: 15px;
        padding: 20px;
        text-align: center;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        max-width: 200px;
    }

    .card .title {
        font-size: 24px;
        margin-bottom: 10px;
    }

    .card .value {
            font-size: 36px;
            font-weight: bold;
        }
</style>
