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

	$$('img[data-action=loginFB]').tap(function() {
		UserHandler.loginFB();
	})
	$$('img[data-action=loginTT]').tap(function() {
		UserHandler.loginTT();
	})
	$$('a[data-action=logout]').tap(function() {
		UserHandler.confirmLogout();
	})
});

function messageClicked() {alert('messageClicked');}

/*$$("[data-action=clean_console]").tap(function (event) {
	$$('.console.output').html("");
});

$$("[data-action=loginFB]").tap(function (event) {

});

$$("#themeroller li").tap(function () {

});
*/
// When the Facebook SDK script has finished loading init the SDK
window.fbAsyncInit = function () {
	// init the FB JS SDK
			FB.init({
				appId:'169299926577053',
				status: true,
				cookie: true,
				oauth: true
			});
	
	UserHandler.init();
};