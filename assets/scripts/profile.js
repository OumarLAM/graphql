document.addEventListener("DOMContentLoaded", async function () {
  const jwt = localStorage.getItem("jwt");

  if (!jwt) {
    // If JWT is not present, redirect to the login page
    window.location.href = "index.html";
  }

  const domain = "https://learn.zone01dakar.sn";

  try {
    const response = await fetch(`${domain}/api/graphql-engine/v1/graphql`, {
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
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }

    const responseData = await response.json();
    const userData = responseData.data.user;

    // Display basic user identification in the page
    document.getElementById("userId").innerText = userData[0].id;
    document.getElementById("userLogin").innerText = userData[0].login;

    // Query XP Amount
    const responseXP = await fetch(`${domain}/api/graphql-engine/v1/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + jwt,
      },
      body: JSON.stringify({
        query: `
          {
            transaction(where: {userId: {_eq: ${userData[0].id} }, type: { _eq: "xp"} }) {
              amount
            }
          }
          `,
      }),
    });

    if (!responseXP.ok) {
      const errorData = await responseXP.json();
      throw new Error(errorData.message);
    }

    const responseXPData = await responseXP.json();
    const xpAmount = responseXPData.data.transaction.reduce(
      (sum, tx) => sum + tx.amount,
      0
    );

    // Display XP Amount
    document.getElementById("xpAmount").innerText = xpAmount;

    // Query grades
    const responseGrades = await fetch(
      `${domain}/api/graphql-engine/v1/graphql`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwt,
        },
        body: JSON.stringify({
          query: `
            {
              progress(where: { userId: { _eq: ${userData[0].id} } }) {
                objectId
                grade
              }
            }
          `,
        }),
      }
    );

    if (!responseGrades.ok) {
      const errorData = await responseGrades.json();
      throw new Error(errorData.message);
    }

    const responseGradesData = await responseGrades.json();
    const gradesData = responseGradesData.data.progress;

    // Display grades on the page
    gradesData.forEach((grade) => {
      const gradeElement = document.createElement("li");
      gradeElement.innerText = `Object ID: ${grade.objectId}, Grade: ${grade.grade}`;
      document.getElementById("gradesList").appendChild(gradeElement);
    });

    // Query Audits
    const responseAudits = await fetch(
      `${domain}/api/graphql-engine/v1/graphql`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwt,
        },
        body: JSON.stringify({
          query: `
            {
              result(where: {userId: { _eq: ${userData[0].id}}}) {
                objectId
                type
              }
            }
          `,
        }),
      }
    );

    if (!responseAudits.ok) {
      const errorData = await responseAudits.json();
      throw new Error(errorData.message);
    }

    const responseAuditsData = await responseAudits.json();
    const auditsData = responseAuditsData.data.result;

    // Display audits on the page
    auditsData.forEach(audit => {
      const auditElement = document.createElement("li");
      auditElement.innerText = `Object ID: ${audit.objectId}, Type: ${audit.type}`;
      document.getElementById("auditsList").appendChild(auditElement);
    });

    // Query Skills
    const responseSkills = await fetch(
      `${domain}/api/graphql-engine/v1/graphql`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwt,
        },
        body: JSON.stringify({
          query: `
          {
            object {
              id
              name
              type
            }
          }
          `,
        }),
      }
    );

    if (!responseSkills.ok) {
      const errorData = await responseSkills.json();
      throw new Error(errorData.message);
    }

    const responseSkillsData = await responseSkills.json();
    const skillsData = responseSkillsData.data.object;

    // Display skills on the page
    skillsData.forEach(skill => {
      const skillElement = document.createElement("li");
      skillElement.innerText = `Skill ID: ${skill.id}, Name: ${skill.name}, Type: ${skill.type}`;
      document.getElementById("skillsList").appendChild(skillElement);
    });
    // Add event listener for the logout button
    document.getElementById("logoutButton").addEventListener("click", () => {
      localStorage.removeItem("jwt");
      window.location.href = "index.html";
    });
  } catch (error) {
    console.error("GraphQL request failed:", error.message);
  }
});
