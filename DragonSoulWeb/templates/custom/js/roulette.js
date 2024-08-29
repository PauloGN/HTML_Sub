function loadJSON(callback) {
	var xobj = new XMLHttpRequest();
	var ticketId = $('#MuRouletteTicketId').text();
	var ticketToken = $('#MuRouletteToken').text();
	xobj.overrideMimeType("application/json");
	xobj.open('GET', baseUrl + 'api/roulette.php?id=' + ticketId + '&token=' + ticketToken, true); 
	xobj.onreadystatechange = function() {
		if (xobj.readyState == 4 && xobj.status == "200") {
			callback(xobj.responseText);
		}
	};
	xobj.send(null);
}

function myResult(e) {
	setTimeout(function() {
		window.location.href = baseUrl + 'roulette/results/';
	}, 10000);
}

function myError(e) {
	
}

function myGameEnd(e) {
	
}

function init() {
	loadJSON(function(response) {
		try {
			var jsonData = JSON.parse(response);
			var myWheel = new Spin2WinWheel();
			myWheel.init({data:jsonData, onResult:myResult, onGameEnd:myGameEnd, onError:myError});
		} catch(e) {
			window.location.href = baseUrl + 'roulette/error/';
		}
	});
}

if($('.wheelContainer').length) {
	var rouletteMedia = $('#MuRouletteMedia').text();
	init();
}