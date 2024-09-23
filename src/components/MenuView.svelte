<script>
    import FileInput from "./FileInput.svelte";

	
</script>

<div class="navbar">
    <div class="logo">InvestBoard</div>
    <ul class="menu">
        <li>Général</li>
        <li>Diversification</li>
        <li>Revenu</li>
    </ul>
    <div class="fileInput">
        <FileInput/>
    </div>
</div>

<style>
.navbar {
    background-color: whi;
    box-shadow: 2px 10px 10px rgba(0, 0, 0, 0.1);
    padding: 15px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
}

.navbar .logo {
    font-size: 24px;
    font-weight: bold;
    color: #333;
}

.navbar .menu {
    list-style-type: none;
    margin: 0;
    padding: 0;
    display: flex;
    gap: 20px;
}

.navbar .menu li {
    display: inline-block;
}

.navbar .fileInput {
    display: flex;
    align-items: center;
}
</style>

