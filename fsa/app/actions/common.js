(function () {
	var method;
	var noop = function () {};
	var methods = [
	'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
	'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
	'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
	'timeStamp', 'trace', 'warn'
	];
	var length = methods.length;
	var console = (window.console = window.console || {});

	while (length--) {
		method = methods[length];

		// Only stub undefined methods.
		if (!console[method]) {
			console[method] = noop;
		}
	}
}());

function createCookie(name, value, days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		var expires = "; expires=" + date.toUTCString();
	}
	else var expires = "";
	document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name, "", -1);
}

function URLDecode(encodedString) {
	var output = encodedString;
	var binVal, thisString;
	var myregexp = /(%[^%]{2})/;
	while ((match = myregexp.exec(output)) != null && match.length > 1 && match[1] != '') {
		binVal = parseInt(match[1].substr(1), 16);
		thisString = String.fromCharCode(binVal);
		output = output.replace(match[1], thisString);
	}
	return output;
}

function openURL(link) {
	try {
		window.location.href = link
	}
	catch (e) {
		try {
			window.location = link
		}
		catch (e) {
			try {
				top.location.href = link
			}
			catch (e) {
				try {
					location.href = link
				}
				catch (e) {
					try {
						location = link
					}
					catch (e) {}
				}
			}
		}
	}
}


var mathUtils = {};
 
mathUtils.getPearsonsCorrelation = function(x, y) 
{
	var shortestArrayLength = 0;
	if(x.length == y.length)
	{
		shortestArrayLength = x.length;
	}
	else if(x.length > y.length)
	{
		shortestArrayLength = y.length;
		console.error('x has more items in it, the last ' + (x.length - shortestArrayLength) + ' item(s) will be ignored');
	}
	else
	{
		shortestArrayLength = x.length;
		console.error('y has more items in it, the last ' + (y.length - shortestArrayLength) + ' item(s) will be ignored');
	}
 
	var xy = [];
	var x2 = [];
	var y2 = [];
 
	for(var i=0; i<shortestArrayLength; i++)
	{
		xy.push(x[i] * y[i]);
		x2.push(x[i] * x[i]);
		y2.push(y[i] * y[i]);
	}
 
	var sum_x = 0;
	var sum_y = 0;
	var sum_xy = 0;
	var sum_x2 = 0;
	var sum_y2 = 0;
 
	for(var i=0; i<shortestArrayLength; i++)
	{
		sum_x += x[i];
		sum_y += y[i];
		sum_xy += xy[i];
		sum_x2 += x2[i];
		sum_y2 += y2[i];
	}
 
	var step1 = (shortestArrayLength * sum_xy) - (sum_x * sum_y);
	var step2 = (shortestArrayLength * sum_x2) - (sum_x * sum_x);
	var step3 = (shortestArrayLength * sum_y2) - (sum_y * sum_y);
	var step4 = Math.sqrt(step2 * step3);
	var answer = step1 / step4;
 
	return answer;
}
/*
var array1 = [1, 3, 4, 4];
var array2 = [2, 5, 5, 8];
 
var correlationValue = mathUtils.getPearsonsCorrelation(array1, array2);
*/


var CONFIG = {
	appURL: "http://students.info.uaic.ro/~george.chetreanu/fsa/"
}