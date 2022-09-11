<svelte:head>
	<title>Tracker-Info</title>
	<link rel="stylesheet" href="https://unpkg.com/@picocss/pico@latest/css/pico.classless.min.css">
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<form action="action_page.php">
    <div class="container">
      <h1>Registration Page</h1>

      <input type="text" placeholder="Enter Username" name="username" id="username" required>
        <br />
      <input type="password" placeholder="Enter Password" name="psw" id="psw" required>
        <br />
      <input type="password" placeholder="Repeat Password" name="psw-repeat" id="psw-repeat" required>
        <br />
      <button type="submit" class="registerbtn">Register</button>
    </div>
  
    <div class="container signin">
      <p>Already have an account? <a href="/login">Sign in</a></p>
    </div>
  </form>


<style>

h1 {
		width: 100%;
		color: var(--text-color);
}

form *{
    border-radius: 10px;
    display: grid;
    place-items: center;
    text-align: center;
}

</style>