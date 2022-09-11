<script>

</script>

<svelte:head>
	<title>Symplest</title>
	<link rel="stylesheet" href="https://unpkg.com/@picocss/pico@latest/css/pico.classless.min.css">
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<h1>
			Symplest
	</h1>
	<h2>
		<button class='makinMyWayRoundTown'>
			<a href='./login'>Log in</a>
		</button>
		<br />
		<br />
		<button class='makinMyWayRoundTown'>
			<a href='./register'>Register</a>
		</button>
	</h2>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
	}

	h1 {
		width: 100%;
		color: var(	--text-color);
	}
</style>
