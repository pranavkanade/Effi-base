function loadJSON(callback) {

  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', 'http://localhost:8000/session_list_overall.json', true); // Replace 'my_data' with the path to your file
  xobj.onreadystatechange = function() {
    if (xobj.readyState == 4 && xobj.status == "200") {
      // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
      callback(xobj.responseText);
    }
  };
  xobj.send(null);
}
var obj;
var list_label = [];
var list_data = [];
loadJSON(function(response) {
  // Parse JSON string into object
  obj = JSON.parse(response);
  var sessions_list = obj.list;
  // var recent_days_sessions = sessions_result[sessions_result.length - 1].sessions;
  // var recent_analysis = recent_days_sessions[recent_days_sessions.length - 1];
  // console.log(recent_analysis);
  // console.log(sessions_result.length);
  // console.log(recent_days_sessions);
  // list.push(recent_analysis.num_of_errors);
  // list.push(recent_analysis.num_of_warnings);
  // list.push(recent_analysis.num_of_notes);
  // console.log(list);
  sessions_list.forEach(date_entry => {
    var date = date_entry.date;
    console.log(date_entry.sessions);
    date_entry.sessions.forEach(entry => {
        list_label.push(date + " : " + entry.time);
        list_data.push(entry.num_of_corrections);
    });
  });

  console.log(list_label);

var lineChartData = {
    labels: list_label,
    datasets: [{
        fillColor: "rgba(220,220,220,0)",
        strokeColor: "rgba(220,180,0,1)",
        pointColor: "rgba(220,180,0,1)",
        data: list_data
    }]

}

Chart.defaults.global.animationSteps = 50;
Chart.defaults.global.tooltipYPadding = 16;
Chart.defaults.global.tooltipCornerRadius = 0;
Chart.defaults.global.tooltipTitleFontStyle = "normal";
Chart.defaults.global.tooltipFillColor = "rgba(0,160,0,0.8)";
Chart.defaults.global.animationEasing = "easeOutBounce";
Chart.defaults.global.responsive = true;
Chart.defaults.global.scaleLineColor = "black";
Chart.defaults.global.scaleFontSize = 16;

var ctx = document.getElementById("myChart").getContext("2d");
var LineChartDemo = new Chart(ctx).Line(lineChartData, {
    pointDotRadius: 4,
    bezierCurve: false,
    scaleShowVerticalLines: false,
    scaleGridLineColor: "black",
    scaleOverride: true,
    scaleSteps: 15,
    scaleStepWidth: 2,
    scaleStartValue: 0
});
});