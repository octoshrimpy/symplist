<script>
	import header from 'C:/Users/Corinne/Desktop/symplist/client/src/images/symplest.svg'
</script>

<svelte:head>
	<title>Symplest</title>
	<link rel="stylesheet" href="https://unpkg.com/@picocss/pico@latest/css/pico.classless.min.css">
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<h1>
		<a href="./home">
			<img src={header} alt="Symplest" />
		</a>
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
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
</style>
