var App = (function (lng, undefined) {
	triggerCapture = function (event) {
		event.stopPropagation();
		lng.Notification.success("Event: " + event.type, "Layout events manager", "info", 2);
	};

	return {
		triggerCapture: triggerCapture
	};
})(Lungo);

Lungo.ready(function () {
	//Lungo.View.Aside.show('right');
	// Lungo.Router.section("notification");

	UserHandler.init();

	ev();

});

function ev () {
	Lungo.Events.init({
		'tap img[data-action=loginFB]': function () {
			UserHandler.loginFB();
		},
		'tap img[data-action=loginTT]': function () {
			UserHandler.loginTT();
		},
		'tap a[data-action=logout]': function () {
			UserHandler.confirmLogout();
		}
	});
}

/*$$("[data-action=clean_console]").tap(function (event) {
	$$('.console.output').html("");
});

$$("[data-action=loginFB]").tap(function (event) {

});

$$("#themeroller li").tap(function () {

});

// When the Facebook SDK script has finished loading init the
// SDK and then get the login status of the user. The status is
// reported in the handler.
window.fbAsyncInit = function () {
	//debugger;
	
};

*/