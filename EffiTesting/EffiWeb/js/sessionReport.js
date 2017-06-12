function loadJSON(callback) {

  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', 'http://localhost:8000/session_result.json', true); // Replace 'my_data' with the path to your file
  xobj.onreadystatechange = function() {
    if (xobj.readyState == 4 && xobj.status == "200") {
      // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
      callback(xobj.responseText);
    }
  };
  xobj.send(null);
}
var obj;
var list = [];
loadJSON(function(response) {
  // Parse JSON string into object
  obj = JSON.parse(response);
  var sessions_result = obj.sessions_result;
  var recent_days_sessions = sessions_result[sessions_result.length - 1].sessions;
  var recent_analysis = recent_days_sessions[recent_days_sessions.length - 1];
  console.log(recent_analysis);
  console.log(sessions_result.length);
  console.log(recent_days_sessions);
  list.push(recent_analysis.num_of_errors);
  list.push(recent_analysis.num_of_warnings);
  list.push(recent_analysis.num_of_notes);
  console.log(list);

  var ctx = document.getElementById("myChart").getContext('2d');

  var myChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ["Errors", "Warnings", "Notes"],
      datasets: [{
        backgroundColor: [
           "#ff3333",
           "#ffd633",
           "#95a5a6",
           "#9b59b6",
           "#f1c40f",
           "#e74c3c",
           "#34495e"
         ],
        data: list
       }]
    }
  });

  console.log(list);

});

function loadJSON1(callback) {

   var xobj1 = new XMLHttpRequest();
       xobj1.overrideMimeType("application/json");
   xobj1.open('GET', 'http://localhost:8000/session_dump.json', true); // Replace 'my_data' with the path to your file
   xobj1.onreadystatechange = function () {
         if (xobj1.readyState == 4 && xobj1.status == "200") {
           // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
           callback(xobj1.responseText);
         }
   };
   xobj1.send(null);
}
var recent_session;
loadJSON1(function(response) {
 // Parse JSON string into object

   obj = JSON.parse(response);
   var table = obj.table;
   // recent_analysis_of_the_day = sessions_result[sessions_result.length-1];
   var recent_analysis_of_the_day = table[table.length - 1];
   console.log(recent_analysis_of_the_day);

   var list_of_errors = [];
   recent_session = recent_analysis_of_the_day.sessions[recent_analysis_of_the_day.sessions.length - 1];
    console.log(recent_session);
    console.log(recent_session.table_of_errors);
  var table = document.getElementById('correctionTable');
  recent_session.table_of_errors.forEach(entry => {
    
    tr = table.insertRow(table.rows.length);
    if(entry.type == "error" || entry.type == "fatal error"){
      tr.setAttribute("class", "danger");
    }
    else if (entry.type == "note"){
      tr.setAttribute("class", "info");
    }
    else if (entry.type == "warning"){
      tr.setAttribute("class", "warning")
    }
        td = tr.insertCell(tr.cells.length);
        td.innerHTML = entry.type;
        td = tr.insertCell(tr.cells.length);
        td.innerHTML = entry.text;
        td = tr.insertCell(tr.cells.length);
        td.innerHTML = entry.filePath;
  });
 });
  

