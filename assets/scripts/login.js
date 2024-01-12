document
  .getElementById("loginForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const usernameOrEmail = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("https://learn.zone01dakar.sn/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + btoa(`${usernameOrEmail}:${password}`),
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const responseData = await response.json();
      const jwt = responseData.token;

      // Save JWT to local storage for future API requests
      localStorage.setItem("jwt", jwt);

      // Redirect to the profile page or perform additional actions
      // Replace the following line with your desired redirection logic
      window.location.href = "profile.html";
    } catch (error) {
      console.error("Login failed:", error.message);
      // Display error message on the page
      alert("Login failed. Please check your credentials.");
    }
  });
