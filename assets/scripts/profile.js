document.addEventListener("DOMContentLoaded", async function () {
  const jwt = localStorage.getItem("jwt");

  if (!jwt) {
    // If JWT is not present, redirect to the login page
    window.location.href = "index.html";
  }

  try {
    const response = await fetch(
      "https://learn.zone01dakar.sn/api/graphql-engine/v1/graphql",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwt,
        },
        body: JSON.stringify({
          query: `
            {
              user {
                id
                login
              }
            }
          `,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }

    const responseData = await response.json();
    const userData = responseData.data.user;

    // Display user information on the page
    console.log("User data:", userData);
  } catch (error) {
    console.error("GraphQL request failed:", error.message);
  }
});
