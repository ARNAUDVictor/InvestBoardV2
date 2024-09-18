<script>
	
</script>

<div class="navbar">
    <div class="logo">InvestManage</div>
    <ul class="menu">
        <li>Général</li>
        <li>Diversification</li>
        <li>Revenue</li>
    </ul>
    <div class="profile">
        <span>John Doe</span>
        <!-- svelte-ignore a11y-img-redundant-alt -->
        <img src="https://via.placeholder.com/40" alt="Profile Image">
    </div>
</div>

<style>
.navbar {
    background-color: #ffffff;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 15px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
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

.navbar .profile {
    display: flex;
    align-items: center;
}

.navbar .profile img {
    border-radius: 50%;
    width: 40px;
    height: 40px;
    margin-left: 15px;
}
</style>

