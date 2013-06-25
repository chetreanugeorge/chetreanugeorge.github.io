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

function log(msg, doAlert) {
	if (typeof AR !== 'undefined') AR.logger.debug(msg);
	if (typeof console !== 'undefined') console.log(msg)
	if (doAlert) alert(msg);
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

var CONFIG = {
	appURL: "http://students.info.uaic.ro/~george.chetreanu/fsa/"
}