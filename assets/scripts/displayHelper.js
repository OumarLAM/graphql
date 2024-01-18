function displayBasicUserData(userData) {
  document.getElementById("userId").innerText = userData[0].id;
  document.getElementById("userLogin").innerText = userData[0].login;
}

function displayXPAmount(xpAmount) {
  document.getElementById("xpAmount").innerText = xpAmount;
}

function displayListData(data, containerId, property1, property2) {
  data.forEach((item) => {
    const itemElement = document.createElement("li");
    itemElement.innerText = `${property1}: ${item[property1]}, ${property2}: ${item[property2]}`;
    document.getElementById(containerId).appendChild(itemElement);
  });
}

export { displayBasicUserData, displayXPAmount, displayListData };
