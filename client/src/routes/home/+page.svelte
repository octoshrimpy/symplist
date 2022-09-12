<svelte:head>
	<title>Home</title>
	<link rel="stylesheet" href="https://unpkg.com/@picocss/pico@latest/css/pico.classless.min.css">
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<div class='wrapper'>
    <h1>What do you want to log?</h1>
</div>
<span>charts/data</span>

<div id='add-data'>
    <icon>+</icon>
</div>

<style>
    * {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    icon {
        height: 3rem;
        width: 3rem;
        border-radius: var(--radius-round);
        background: var(--heading-color);
        position: fixed;
        right: 50px; bottom: 50px;
    }
</style>