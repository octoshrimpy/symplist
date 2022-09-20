<svelte:head>
	<title>Home</title>
	<link rel="stylesheet" href="https://unpkg.com/@picocss/pico@latest/css/pico.classless.min.css">
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<form action="action_page.php">
    <div class="container">
      <h1>Log In</h1>

      <input type="text" placeholder="Enter Username" name="username" id="username" required>
        <br />
      <input type="password" placeholder="Enter Password" name="psw" id="psw" required>
        <br />
      <button type="submit" class="makinMyWayRoundTown">
        <a href='/home'>
            Log in
        </a>
       </button>
    </div>
  </form>


<style>

h1 {
		width: 100%;
		color: var(	--text-color);
}

form *{
    display: grid;
    place-items: center;
    text-align: center;
}
</style>