<svelte:head>
	<title>Add Appt</title>
	<link rel="stylesheet" href="https://unpkg.com/@picocss/pico@latest/css/pico.classless.min.css">
	<meta name="description" content="Svelte demo app" />
</svelte:head>


<form id='addAppt'>
    
    <label for='docForm'>Doctor's Name</label>
    <input type='text' id='docForm' method='POST' placeholder="Dr. CleverNameTBD">

    <label for='officeForm'>Office</label>
    <input type='text' id='officeForm' method='POST' placeholder="5173 Cherry St">

    <label for='reasonForm'>Reason</label>
    <input type='text' id='apptForm' method='POST' placeholder="My spleen hurts">

    <label for='medForm'>Relevant Meds</label>
    <input type='text' id='medForm' method='POST' placeholder="Ondansetron 4mg, Tylenol 500mg, etc.">
</form>

<div class='container'>
    <button type="submit" class="makinMyWayRoundTown">
        <a href='/home'>
            Submit
        </a>
    </button>
</div>

<style>
    .container {
        width: 100%;
        display: grid;
        place-items: center;
    }
</style>
