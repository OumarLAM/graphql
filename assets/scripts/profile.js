import { fetchData } from "./graphqlFetcher.js";
import {
  displayBasicUserData,
  displayXPAmount,
  displayListData,
} from "./displayHelper.js";

document.addEventListener("DOMContentLoaded", async function () {
  const jwt = localStorage.getItem("jwt");

  if (!jwt) {
    window.location.href = "index.html";
  }

  try {
    // ******************* Query basic user Identification ************************* //
    const responseData = await fetchData(jwt, ` {user { id login} }`);
    const userData = responseData.data.user;

    displayBasicUserData(userData);

    // ***************************** Query XP Amount ****************************** //
    const xpResponse = await fetchData(
      jwt,
      `{
            transaction(where: {userId: {_eq: ${userData[0].id} }, type: { _eq: "xp"} }) {
              amount
            }
          }`
    );

    const xpAmount = xpResponse.data.transaction.reduce(
      (sum, tx) => sum + tx.amount,
      0
    );

    displayXPAmount(xpAmount);

    // ****************************** Query grades ****************************** //
    const gradesResponse = await fetchData(
      jwt,
      `
        {
              progress(where: { userId: { _eq: ${userData[0].id} } }) {
                objectId
                grade
              }
            }
          `
    );

    const gradesData = gradesResponse.data.progress;

    displayListData(gradesData, "gradesList", "objectId", "grade");

    // ***************************** Query Audits ********************************* //
    const auditsResponse = await fetchData(
      jwt,
      `
            {
              result(where: {userId: { _eq: ${userData[0].id}}}) {
                objectId
                type
              }
            }
          `
    );

    const auditsData = auditsResponse.data.result;

    displayListData(auditsData, "auditsList", "objectId", "type");

    // ******************************** Query Skills ****************************** //
    const skillsResponse = await fetchData(
      jwt,
      `
          {
            object {
              id
              name
              type
            }
          }
          `
    );

    const skillsData = skillsResponse.data.object;

    displayListData(skillsData, "skillsList", "name", "type");

    // Add event listener for the logout button
    document.getElementById("logoutButton").addEventListener("click", () => {
      localStorage.removeItem("jwt");
      window.location.href = "index.html";
    });
  } catch (error) {
    console.error("GraphQL request failed:", error.message);
  }
});
