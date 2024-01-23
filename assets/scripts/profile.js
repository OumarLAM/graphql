import { fetchData } from "./graphqlFetcher.js";
import { displayBasicUserData, displayData } from "./displayHelper.js";

document.addEventListener("DOMContentLoaded", async function () {
  const jwt = localStorage.getItem("jwt");

  if (!jwt) {
    window.location.href = "index.html";
  }

  try {
    // ******************* Query basic user Identification ************************* //
    const responseData = await fetchData(
      jwt,
      `{
        user {
          id
          firstName
          lastName
          createdAt
        }
      }`
    );
    const userData = responseData.data.user;
    displayBasicUserData(userData);

    // ***************************** Query XP Amount ****************************** //
    const xpPiscineGo = await fetchData(
      jwt,
      `{
        event_user(where: {userId: { _eq: ${userData[0].id}}} limit: 1) {
          user {
            transactions_aggregate(
              where: {type: {_eq: "xp"}, _and: {event: {object: {id: {_eq: 100051}}}}}
            ) {
              aggregate {
                sum {
                  amount
                }
              }
            }
          }
        }
      }`
    );

    displayData(
      "xpPiscineGoAmount",
      Math.round(
        xpPiscineGo.data.event_user[0].user.transactions_aggregate.aggregate.sum
          .amount / 1000
      )
    );

    const xpdiv01 = await fetchData(
      jwt,
      `{
        event_user(where: {userId: {_eq: ${userData[0].id}}} limit: 1) {
          user {
            transactions_aggregate(
              where: {type: {_eq: "xp"}, _and: {event: {object: {id: {_eq: 100256}}}}}
            ) {
              aggregate {
                sum {
                  amount
                }
              }
            }
          }
        }
      }`
    );

    displayData(
      "xpDiv01Amount",
      Math.round(
        xpdiv01.data.event_user[0].user.transactions_aggregate.aggregate.sum
          .amount / 1000
      )
    );

    const xpPiscineJs = await fetchData(
      jwt,
      `{
        event_user(where: {userId: { _eq: ${userData[0].id}}} limit: 1) {
          user {
            transactions_aggregate(
              where: {type: {_eq: "xp"}, _and: {event: {object: {id: {_eq: 100466}}}}}
            ) {
              aggregate {
                sum {
                  amount
                }
              }
            }
          }
        }
      }`
    );

    displayData(
      "xpPiscineJsAmount",
      Math.round(
        xpPiscineJs.data.event_user[0].user.transactions_aggregate.aggregate.sum
          .amount / 1000
      )
    );

    // ***************************** Query Audits ********************************* //
    const auditsResponse = await fetchData(
      jwt,
      `{
        user {
          auditRatio
          totalUp
          totalDown
        }
      }`
    );

    const auditRatio = auditsResponse.data.user[0].auditRatio.toFixed(2);
    const auditDone = Math.round(auditsResponse.data.user[0].totalUp / 1000);
    const auditReceived = Math.round(
      auditsResponse.data.user[0].totalDown / 1000
    );

    displayData("auditRatio", auditRatio);
    displayData("auditDone", auditDone);
    displayData("auditReceived", auditReceived);

    // ******************************** Query Levels ****************************** //
    const piscineGoLevel = await fetchData(
      jwt,
      `{
        user {
          events(where: {id: { _eq: 367}}) {
            level
          }
        }
      }`
    );

    const goLevel = piscineGoLevel.data.user[0].events[0].level;
    displayData("goLevel", goLevel);

    const div01LevelResponse = await fetchData(
      jwt,
      `{
        user {
          events(where: {id: { _eq: 3320}}) {
            level
          }
        }
      }`
    );

    const div01Level = div01LevelResponse.data.user[0].events[0].level;
    displayData("div01Level", div01Level);

    const piscineJsLevel = await fetchData(
      jwt,
      `{
        user {
          events(where: {id: { _eq: 5098}}) {
            level
          }
        }
      }`
    );

    const jsLevel = piscineJsLevel.data.user[0].events[0].level;
    displayData("jsLevel", jsLevel);

    // ******************************** Query Projects ****************************** //
    const projectsResponse = await fetchData(
      jwt,
      `{
        transaction(
          where: {userId: {_eq: ${userData[0].id}}, type: {_eq: "xp"}, event: {path: {_eq: "/dakar/div-01"}}, path: {_nlike: "%checkpoint%", _nilike: "%piscine-js%"}}
        ) {
          amount
          path
        }
      }`
    );
    const projects = projectsResponse.data.transaction;
    displayData("projects", projects.length)

    const transaction = projectsResponse.data.transaction
    // Create svg container
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "800");
    svg.setAttribute("height", "600");

    // Create bars
    for (let i = 0; i < transaction.length; i++) {
      let bar = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect"
        );
      bar.setAttribute("x", i * 50);
      bar.setAttribute("y", 600 - transaction[i].amount / 100);
      bar.setAttribute("width", "40");
      bar.setAttribute("height", transaction[i].amount / 100);
      bar.setAttribute("fill", "steelblue");

      // Add interactivity
      bar.addEventListener("mouseover", () => {
        // Change color to green
        bar.setAttribute("fill", "green");

        // Show project name below the bar
        let textBelow = document.createElementNS("http://www.w3.org/2000/svg", "text");
        textBelow.setAttribute("x", i * 50);
        textBelow.setAttribute("y", 600);
        textBelow.textContent = transaction[i].path.split("/").pop();
        svg.appendChild(textBelow);

        // Show amount of xp above the bar
        let textAbove = document.createElementNS("http://www.w3.org/2000/svg", "text");
        textAbove.setAttribute("x", i * 50);
        textAbove.setAttribute("y", 600 - transaction[i].amount / 100);
        textAbove.textContent = transaction[i].amount;
        svg.appendChild(textAbove);
      });

      // Reset on mouseout
      bar.addEventListener("mouseout", () => {
        // Change color back to steelblue
        bar.setAttribute("fill", "steelblue");

        // Remove texts
        svg.querySelectorAll("text").forEach((text) => {
          svg.removeChild(text);
        });
      });
      svg.appendChild(bar);
    }

    // Append SVG to the body of the document
    document.getElementById('graph').appendChild(svg);

    // Add event listener for the logout button
    document.getElementById("logoutButton").addEventListener("click", () => {
      localStorage.removeItem("jwt");
      window.location.href = "index.html";
    });
  } catch (error) {
    console.error("GraphQL request failed:", error.message);
  }
});
