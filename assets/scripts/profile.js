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

    // Create SVG container
    let svg2 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg2.setAttribute("width", "800");
    svg2.setAttribute("height", "600");

    // Calculate the total
    let total = auditDone + auditReceived;

    // Create arcs
    let startAngle = 0;
    let endAngle = (auditDone / total) * 2 * Math.PI - 0.01; // Calculate the end angle based on the ratio

    // Create the first arc (for auditDone)
    let arc1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    arc1.setAttribute("d", describeArc(400, 300, 200, startAngle, endAngle));
    arc1.setAttribute("fill", "steelblue");

    // Add interactivity
    arc1.addEventListener("mouseover", function () {
      this.setAttribute("fill", "green");
    });
    arc1.addEventListener("mouseout", function () {
      this.setAttribute("fill", "steelblue");
    });
    svg2.appendChild(arc1);

    // Create the second arc (for auditReceived)
    startAngle = endAngle + 0.01;
    endAngle = 2 * Math.PI;

    let arc2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    arc2.setAttribute("d", describeArc(400, 300, 200, startAngle, endAngle));
    arc2.setAttribute("fill", "red");

    // Add interactivity
    arc2.addEventListener("mouseover", function () {
      arc2.setAttribute("fill", "green");
    });
    arc2.addEventListener("mouseout", function () {
      arc2.setAttribute("fill", "red");
    });
    svg2.appendChild(arc2);

    // Create labels
    // Create SVG container for labels
    let svgLabels = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    svgLabels.setAttribute("width", "800");
    svgLabels.setAttribute("height", "100");

    // Create a small horizontal bar for 'Audits Done'
    let bar1 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    bar1.setAttribute("x", "0");
    bar1.setAttribute("y", "30");
    bar1.setAttribute("width", "40"); // Fixed width for the label bar
    bar1.setAttribute("height", "10");
    bar1.setAttribute("fill", "steelblue");
    svgLabels.appendChild(bar1);

    // Create a label for 'Audits Done'
    let label1 = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label1.setAttribute("x", "50");
    label1.setAttribute("y", "40");
    label1.textContent = "Audits Done";
    svgLabels.appendChild(label1);

    // Create a small horizontal bar for 'Audits Received'
    let bar2 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    bar2.setAttribute("x", "0");
    bar2.setAttribute("y", "60");
    bar2.setAttribute("width", "40"); // Fixed width for the label bar
    bar2.setAttribute("height", "10");
    bar2.setAttribute("fill", "red");
    svgLabels.appendChild(bar2);

    // Create a label for 'Audits Received'
    let label2 = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label2.setAttribute("x", "50");
    label2.setAttribute("y", "70");
    label2.textContent = "Audits Received";
    svgLabels.appendChild(label2);

    // Append SVG to the body of the document
    document.body.appendChild(svgLabels);

    // Append SVG to the body of the document
    document.getElementById("ratioGraph").appendChild(svg2);

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
    displayData("projects", projects.length);

    const transaction = projectsResponse.data.transaction;
    // Create svg container
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "800");
    svg.setAttribute("height", "600");

    // Create bars
    for (let i = 0; i < transaction.length; i++) {
      let bar = document.createElementNS("http://www.w3.org/2000/svg", "rect");
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
        let textBelow = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text"
        );
        textBelow.setAttribute("x", i * 50);
        textBelow.setAttribute("y", 600);
        textBelow.textContent = transaction[i].path.split("/").pop();
        svg.appendChild(textBelow);

        // Show amount of xp above the bar
        let textAbove = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text"
        );
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
    document.getElementById("graph").appendChild(svg);

    // Add event listener for the logout button
    document.getElementById("logoutButton").addEventListener("click", () => {
      localStorage.removeItem("jwt");
      window.location.href = "index.html";
    });
  } catch (error) {
    console.error("GraphQL request failed:", error.message);
  }
});

// Function to describe an arc
function describeArc(x, y, radius, startAngle, endAngle) {
  let start = {
    x: x + radius * Math.cos(startAngle),
    y: y + radius * Math.sin(startAngle),
  };
  let end = {
    x: x + radius * Math.cos(endAngle),
    y: y + radius * Math.sin(endAngle),
  };

  let largeArcFlag = endAngle - startAngle <= Math.PI ? "0" : "1";

  let d = [
    "M",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
  ].join(" ");

  return d;
}
