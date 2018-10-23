var barChartData = {
		labels : [
    "FC Barcelona",
     "AC Milan",
    "Real Madrid",    
    "Bayern Munich",
    "Manchester united",
    "Porto",
    ],
		datasets : [
			{
				fillColor : "#8DB986",
				strokeColor : "#8DB986",
				highlightFill: "#ACCE91",
				highlightStroke: "#ACCE91",
				data : [5,5,4,2,2,2]
			}
		],
  scaleGridLineColor : "#000"

	}
	window.onload = function(){
		var ctx = document.getElementById("myChart").getContext("2d");
		window.myBar = new Chart(ctx).Bar(barChartData, {
			responsive : false
		});
	}
