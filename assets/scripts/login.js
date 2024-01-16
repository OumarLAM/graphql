const domain = "https://learn.zone01dakar.sn";

document
  .getElementById("loginForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const usernameOrEmail = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch(`${domain}/api/auth/signin`, {
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

      const jwt = await response.json();

      // Save JWT to local storage for future API requests
      localStorage.setItem("jwt", jwt);

      window.location.href = "profile.html";
    } catch (error) {
      console.error("Login failed:", error.message);
      alert("OOPS! Login failed. Check your credentials and retry.");
    }
  });
