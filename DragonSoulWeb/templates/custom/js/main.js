$(function() {
	// Initiate Server Time
	serverTime.init("tServerTime", "tLocalTime", "tServerDate", "tLocalDate");
	
	// Initiate Castle Siege Countdown
	csTime.init();

	iwvTime.init();
	
	// Initiate bootstrap tooltips
	$('[data-toggle="tooltip"]').tooltip();

	// PayPal Buy Credits
/*	if($('#paypal_conversion_rate_value').length) {
		var paypal_cr = parseInt($('#paypal_conversion_rate_value').html());
		if($('#amount').length) {
			document.getElementById('amount').onkeyup = function(ev) {
				var num = 0;
				var c = 0;
				var event = window.event || ev;
				var code = (event.keyCode) ? event.keyCode : event.charCode;
				for(num=0;num<this.value.length;num++) {
					c = this.value.charCodeAt(num);
					if(c<48 || c>57) {
						document.getElementById('result').innerHTML = '0';
						document.getElementById('amount').value = '';
						return false;
					}
				}
				num = parseInt(this.value);
				if(isNaN(num)) {
					document.getElementById('result').innerHTML = '0';
				} else {
					var result = (paypal_cr*num).toString();
					document.getElementById('result').innerHTML = result;
				}
			}
		}
	}*/
});
function convertTo12hours(hour) {
	return hour % 12 || 12;
}
var csTime = {
	csDays: null,
	csHours: null,
	csMinutes: null,
	csSeconds: null,
	csTimeLeft: null,
	csNextStageTimeLeft: null,
	battleMode: false,
	days_module: null,
	hours_module: null,
	minutes_module: null,
	init: function() {
		var a = this;
		$.getJSON(baseUrl + "api/castlesiege.php", function(c) {
			a.csTimeLeft = c.TimeLeft;
			a.csNextStageTimeLeft = c.NextStageTimeLeft;
			setInterval(function() {
				a.update();
			}, 1000)
		})
	},
	update: function() {
		var b = this;
		b.csTimeLeft = b.csTimeLeft-1;
		b.csNextStageTimeLeft = b.csNextStageTimeLeft-1;
		
		if(b.csTimeLeft >= 1) {
			b.days_module = b.csTimeLeft % 86400;
			b.csDays = (b.csTimeLeft-b.days_module)/86400;
			b.hours_module = b.days_module % 3600;
			b.csHours = (b.days_module-b.hours_module)/3600;
			b.minutes_module = b.hours_module % 60;
			b.csMinutes = (b.hours_module-b.minutes_module)/60;
			b.csSeconds = b.minutes_module;
		} else {
			b.battleMode = true;
			b.csDays = 0;
			b.csHours = 0;
			b.csMinutes = 0;
			b.csSeconds = 0;
		}
		
		if(b.battleMode == true) {
			if($('#cscountdown').length) {
				if(b.csTimeLeft < -3600) {
					document.getElementById("cscountdown").innerHTML = 'Ended';
				} else {
					document.getElementById("cscountdown").innerHTML = 'Battle';
				}
			}
			if($('#siegeTimer').length) {
				if(b.csTimeLeft < -3600) {
					document.getElementById("siegeTimer").innerHTML = 'Ended';
				} else {
					document.getElementById("siegeTimer").innerHTML = 'Battle';
				}
			}
		} else {
			
			var countdown = '';
			if(b.csTimeLeft > 86400) countdown += b.csDays + "<span>d</span> ";
			if(b.csTimeLeft > 3600) countdown += b.csHours + "<span>h</span> ";
			if(b.csTimeLeft > 60) countdown += b.csMinutes + "<span>m</span> ";
			countdown += b.csSeconds + "<span>s</span>";
			
			if($('#cscountdown').length) {
				document.getElementById("cscountdown").innerHTML = countdown;
			}
			if($('#siegeTimer').length) {
				document.getElementById("siegeTimer").innerHTML = countdown;
			}
		}
	}
};

var iwvTime = {
	iwvHours: null,
	iwvMinutes: null,
	iwvSeconds: null,
	iwvTimeLeft: null,
	iwvbattleMode: 0,
	iwvdays_module: null,
	iwvhours_module: null,
	iwvminutes_module: null,
	init: function() {
		var a = this;
		$.getJSON(baseUrl + "api/icewindvalley.php", function(c) {
			a.iwvTimeLeft = c.TimeLeft;
			setInterval(function() {
				a.update();
			}, 1000)
		})
	},
	update: function() {
		var b = this;
		b.iwvTimeLeft = b.iwvTimeLeft-1;

		if(b.iwvTimeLeft >= 1) {
			b.iwvdays_module = b.iwvTimeLeft % 86400;
			b.iwvDays = (b.iwvTimeLeft-b.iwvdays_module)/86400;
			b.iwvhours_module = b.iwvdays_module % 3600;
			b.iwvHours = (b.iwvdays_module-b.iwvhours_module)/3600;
			b.iwvminutes_module = b.iwvhours_module % 60;
			b.iwvMinutes = (b.iwvhours_module-b.iwvminutes_module)/60;
			b.iwvSeconds = b.iwvminutes_module;
		} else {
			b.iwvbattleMode = true;
			b.iwvDays = 0;
			b.iwvHours = 0;
			b.iwvMinutes = 0;
			b.iwvSeconds = 0;
		}
		
		if(b.iwvbattleMode == true) {
			if($('#iwvcountdown').length) {
				document.getElementById("iwvcountdown").innerHTML = 'Battle';
			}
		} else {
			var countdown = '';
			if(b.iwvTimeLeft > 86400) countdown += b.iwvDays + "<span>d</span> ";
			if(b.iwvTimeLeft > 3600) countdown += b.iwvHours + "<span>h</span> ";
			if(b.iwvTimeLeft > 60) countdown += b.iwvMinutes + "<span>m</span> ";
			countdown += b.iwvSeconds + "<span>s</span>";
			
			if($('#iwvcountdown').length) {
				document.getElementById("iwvcountdown").innerHTML = countdown;
			}
		}
	}
};

var serverTime = {
	weekDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
	monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
	serverDate: null,
	localDate: null,
	dateOffset: null,
	nowDate: null,
	eleServer: null,
	eleLocal: null,
	eleServerDate: null,
	eleLocalDate: null,
	init: function(e, c, s, l) {
		var f = this;
		f.eleServer = e;
		f.eleLocal = c;
		f.eleServerDate = s;
		f.eleLocalDate = l;
		$.getJSON(baseUrl + "api/servertime.php", function(a) {
			f.serverDate = new Date(a.ServerTime);
			f.localDate = new Date();
			f.dateOffset = f.serverDate - f.localDate;

			if(document.getElementById(f.eleServer) != null) {
				document.getElementById(f.eleServer).innerHTML = f.dateTimeFormat(f.serverDate);
			}
			if(document.getElementById(f.eleLocal) != null) {
				document.getElementById(f.eleLocal).innerHTML = f.dateTimeFormat(f.localDate);
			}
			if(document.getElementById(f.eleServerDate) != null) {
				document.getElementById(f.eleServerDate).innerHTML = f.dateFormat(f.serverDate);
			}
			if(document.getElementById(f.eleLocalDate) != null) {
				document.getElementById(f.eleLocalDate).innerHTML = f.dateFormat(f.localDate);
			}
			setInterval(function() {
				f.update()
			}, 1000)
		})
	},
	update: function() {
		var b = this;
		b.nowDate = new Date();
		if(document.getElementById(b.eleLocal) != null) {
			document.getElementById(b.eleLocal).innerHTML = b.dateTimeFormat(b.nowDate);
		}
		b.nowDate.setTime(b.nowDate.getTime() + b.dateOffset);
		if(document.getElementById(b.eleServer) != null) {
			document.getElementById(b.eleServer).innerHTML = b.dateTimeFormat(b.nowDate);
		}
	},
	dateTimeFormat: function(e) {
		var c = this;
		var f = [];
		f.push(c.digit(convertTo12hours(e.getHours())));
		f.push(":");
		f.push(c.digit(e.getMinutes()));
		f.push(":");
		f.push(c.digit(e.getSeconds()));
		f.push(" ");
		f.push(e.getHours() >= 12 ? "PM" : "AM");
		return f.join("")
	},
	dateFormat: function(e) {
		var c = this;
		var f = [];
		f.push(c.monthNames[e.getMonth()]);
		f.push(" ");
		f.push(e.getDate());
		f.push(", ");
		f.push(e.getFullYear());
		return f.join("")
	},
	digit: function(b) {
		b = String(b);
		b = b.length == 1 ? "0" + b : b;
		return b
	}
};