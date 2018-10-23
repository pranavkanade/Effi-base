function loadJSON(callback) {

  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', 'http://localhost:8000/sessions_sem_analysis.json', true); // Replace 'my_data' with the path to your file
  xobj.onreadystatechange = function() {
    if (xobj.readyState == 4 && xobj.status == "200") {
      // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
      callback(xobj.responseText);
    }
  };
  xobj.send(null);
}
var obj;
var list_data = [];
loadJSON(function(response) {
  // Parse JSON string into object
  obj = JSON.parse(response);
  var sessions_result = obj.list;
  var recent_days_sessions = sessions_result[sessions_result.length - 1].sessions;
  var recent_analysis = recent_days_sessions[recent_days_sessions.length - 1];
  console.log(recent_analysis);
  //console.log(sessions_result.length);
  //console.log(recent_days_sessions);
  list_data.push(recent_analysis.table.lines_Of_Code);
  list_data.push(recent_analysis.table.infinite_loop);
  list_data.push(recent_analysis.table.Namespace_count);
  list_data.push(recent_analysis.table.Operation_with_1);
  list_data.push(recent_analysis.table.Multiple_different_headers);
  list_data.push(recent_analysis.table.Multiple_return_present);
  list_data.push(recent_analysis.table.Number_of_functions_uncommented);
  list_data.push(recent_analysis.table.Number_of_goto_used);
  list_data.push(recent_analysis.table.memory_allocation_leaks);
  console.log(list_data);

var ctx = document.getElementById("myChart").getContext('2d');
var myChart = new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: ["lines Of code", "infinite loops", "Namespace-count", "Operations with 1", "Multiple different headers", "Multiple return Present", "Number of functions uncomented", "Number of goto used", "Dynamic Memory Allocation Leaks"],
    datasets: [{
      backgroundColor: [
        "#2ecc71",
        "#3498db",
        "#95a5a6",
        "#9b59b6",
        "#f1c40f",
        "#e74c3c",
        "#34495e",
        "#42f4d9"
      ],
      data: list_data
    }]
  }
});

});


function loadJSON2(callback) {

   var xobj2 = new XMLHttpRequest();
       xobj2.overrideMimeType("application/json");
   xobj2.open('GET', 'http://localhost:8000/sessions_sem_analysis.json', true); // Replace 'my_data' with the path to your file
   xobj2.onreadystatechange = function () {
         if (xobj2.readyState == 4 && xobj2.status == "200") {
           // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
           callback(xobj2.responseText);
         }
   };
   xobj2.send(null);
}
var recent_session1;
loadJSON2(function(response) {
 // Parse JSON string into object

   obj = JSON.parse(response);
   var table = obj.list;
   // recent_analysis_of_the_day = sessions_result[sessions_result.length-1];
   var recent_analysis_of_the_day = table[table.length - 1];
   console.log(recent_analysis_of_the_day);

   var list_of_errors = [];
   recent_session1 = recent_analysis_of_the_day.sessions[recent_analysis_of_the_day.sessions.length - 1];
    //console.log(recent_session1);
    console.log(recent_session1.table);
  var table = document.getElementById('semCorrectionTable');
  var entry = recent_session1.table;
    entry.Tips_for_the_programmer.forEach(function(sujj) {
      tr = table.insertRow(table.rows.length);
    tr.setAttribute("class", "success")
        td = tr.insertCell(tr.cells.length);
        td.innerHTML = sujj;
        
    });
    
 
 });
