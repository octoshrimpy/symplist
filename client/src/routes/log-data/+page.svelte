<svelte:head>
	<title>Log Data</title>
	<link rel="stylesheet" href="https://unpkg.com/@picocss/pico@latest/css/pico.classless.min.css">
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<!-- script added 9/20-->
<script context='module'>
    export async function load({ fetch }) {
        const res = await fetch('/log-data/data.js'); 
        const logs = await res.json();
            
        if (res.ok) {
            return {
                props: {
                    logs
                }
            }
        }

        return {
            status: res.status,
            error: new Error('Could not fetch data')
        }

    }
</script>
<script>
    export let logs
</script>
<!-- end of script -->

<div class='wrapper'>
    <h1>
        Log Data
    </h1>


    <h5>Symptom Type:</h5>
    
    <div class='grid-container'>
        <div>
            <ul>
                <li>
                    <a sveltekit:prefetch href={`/log-data/${logs.id}`}>{logs.title}</a>
                </li>
            </ul>
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
            <div>
                <span>symptom name</span>
            </div>
        
    </div>
</div>

<style>

.grid-container {
    display: flex;
    flex-direction: row;
}

* {
    display: grid;
    place-items: center;
}

.grid-container > div {
    height: 8rem;
    width: 8rem;
    background: var(--secondary-color);
    border-radius: var(--radius-round);
    color: var(--text-color);
    font-size: 1rem;
    border: 1px solid rgb(93, 140, 158);
}


@media (max-width: 1200px) {
    .grid-container {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        justify-content: space-around;
    }
}
</style>