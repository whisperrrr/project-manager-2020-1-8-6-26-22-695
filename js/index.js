var hideWindow = document.getElementById("hide-window");
var hideBox = document.getElementById("hide-box");
var tableMain = document.getElementById("table-main");
var Itemid;
window.onload = function() {
  getListData();
  tableMain.addEventListener("click",function(event) {
    var clickTarget = event.target;
    if (clickTarget.tagName === "BUTTON") {
      Itemid = clickTarget.parentElement.parentElement.getAttribute("data-id");
      showPopWindow();
    }
  })
}
//send "GET" to database, when success, run renderListData
function getListData() {
  var options = {
    url: "http://localhost:3000/projects",
    method: "GET",
    data: "",
    success: function(result) {
      renderListData(result);
    },
    error: function(error) {
      console.log("error",error);
    }
  }
  ajax(options);
}
// render listdata
function renderListData(data) {
  var tableMain = document.getElementById("table-main");
  var statusObj = {"ACTIVE":0,"PENDING":0,"CLOSED":0};
  tableMain.innerHTML = data.reduce((acc,cur) => {
    statusObj[cur.status] += 1;
    return acc += `
    <tr data-id = "${cur.id}">
      <td nowrap>${cur.name}</td>
      <td class = "overFlowHidden" title="${cur.description}">${cur.description}</td>
      <td nowrap>${cur.endTime}</td>
      <td nowrap style = "color:${getStatusColor(cur.status)}">${cur.status}</td>
      <td nowrap><button>删除</button></td>
    </tr>
    `
  },'')
  changeShowcard(statusObj);
}
//change data in showcard
function changeShowcard(statusObj) {
  var showCard = document.getElementById("show-card");
  var taskCardNum = showCard.querySelectorAll(".card-num");
  var taskCardNumLenght = taskCardNum.length;
  var all = 0;
  var taskNumArr = [];  
  for (sta in statusObj) {
    all += statusObj[sta];
    taskNumArr.unshift(statusObj[sta]);
  }
  taskNumArr.unshift(all); //[all,unsettle,processing,settled]

  for (var i = 0; i < taskCardNumLenght;) {
    taskCardNum[i].innerHTML = taskNumArr[Math.floor(i/2)];
    taskCardNum[i + 1].innerHTML = toPercent(taskNumArr[Math.floor(i/2)] / all);
    i += 2;
  }
}
// turn number into 100%
function toPercent(point){
  var str = Number(point*100).toFixed(2);
  str += "%";
  return str;
}
//change status to right color
function getStatusColor(status) {
  var statusColor;
  switch (status) {
    case "ACTIVE":
      statusColor = "#666666";
      break;
    case "PENDING":
      statusColor = "#ee706d";
      break;
    case "CLOSED":
      statusColor = "#f7da47";
      break;
  }
  return statusColor;
}
//when click delete button , pop window
function showPopWindow() {
  hideWindow.style.display = "block";
  hideBox.style.display = "block";
}
//close pop window
function closeWindow() {
  hideWindow.style.display = "none";
  hideBox.style.display = "none";  
}
//when click assert in pop window,send delete request to database
function deleteItemData() {
  var options = {
    url: "http://localhost:3000/projects" + "/" + Itemid,
    method: "DELETE",
    data: "",
    success: function() {
      deleteItem();
    },
    error: function(error) {
      console.log("error",error);
    }
  }
  ajax(options);
}
//deleteItem
function deleteItem() {
  var item = tableMain.querySelector(`tr[data-id="${Itemid}"]`);
  tableMain.removeChild(item);
}
