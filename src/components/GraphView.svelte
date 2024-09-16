<script>
    import { onDestroy } from "svelte";
	import { transactionsStore } from "../store/transactionsStore";

	let test;
	const unsubscribe = transactionsStore.subscribe(() => {
		test = transactionsStore.getRemboursementByDate("01/06/2024", "01/08/2024");
		console.log(test);
	});

	onDestroy(() => {
		unsubscribe();
	});
	
</script>
