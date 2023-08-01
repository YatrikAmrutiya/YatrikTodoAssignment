document.addEventListener("DOMContentLoaded", () => {
  // API Gateway URL (replace with your actual API Gateway endpoint URL)
  // const apiBaseUrl =
  //   "https://qjshit20kd.execute-api.us-east-1.amazonaws.com/prod";

    const apiBaseUrl =process.env.API_GATEWAY_URL;
  console.log("Here is the url: "+process.env.API_GATEWAY_URL);
  // Registration form submission handler
  const registerForm = document.getElementById("registerForm");
  const registrationResult = document.getElementById("registrationResult");
  const apiKey = "LwVpN7lXGCZaJREn8xi26lwvRc83Cv56ElMDAzIc";

  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      // Make a POST request to the registration API endpoint
      const response = await fetch(`${apiBaseUrl}/register`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();
      registrationResult.textContent = JSON.parse(data.body).message;
      console.log("register called");
    } catch (error) {
      console.error("Error:", error);
      registrationResult.textContent = "Registration failed. Please try again.";
    }
  });

  // Login form submission handler
  const loginForm = document.getElementById("loginForm");
  const loginResult = document.getElementById("loginResult");
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
      // Make a POST request to the login API endpoint
      const response = await fetch(`${apiBaseUrl}/login`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();
      loginResult.textContent = JSON.parse(data.body).message;

      if (loginResult.textContent === "Login successful") {
        // If login is successful, redirect to "home.html"
        window.location.href = "home.html";
      }

      console.log(data);
    } catch (error) {
      console.error("Error:", error);
      loginResult.textContent = "Login failed. Please try again.";
    }
  });
});
