<svelte:head>
	<title>Home</title>
	<link rel="stylesheet" href="https://unpkg.com/@picocss/pico@latest/css/pico.classless.min.css">
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<div class='wrapper'>
    <h1>
        Log Data
    </h1>



<div class='grid-container'>
        <div>
            <span>symptom name</span>
        </div>
        <div>
            <span>symptom name</span>
        </div>
        <div>
            <span>symptom name</span>
        </div>
        <div>
            <span>symptom name</span>
        </div>
        <div>
            <span>symptom name</span>
        </div>
        <div>
            <span>symptom name</span>
        </div>

</div>
</div>

<style>

.grid-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    justify-content: space-around;

}

* {
    display: grid;
    place-items: center;
}

.grid-container > div {
    height: 8rem;
    width: 8rem;
    background: var(--secondary-color);
    border-radius: var(--radius-blob-4);
    color: var(--text-color);
    font-size: 1rem;
}
</style>