var UserHandler = new function () {
		this.isLogged = false;
		this.userInfo = null;
		this.userInfoProvider = null;
		this.logoutHTML = null;

		this.appIdFB = 169299926577053;
		
		this.callback = null;

		this.init = function (callback) {
			this.callback = callback;
			
			/*if (window.location.href.indexOf("error_reason")>=0) {
				$$(document.body).append("<p>Authorization denied!</p>");
			}*/

			// check if user logged in by Twitter and was redirected back
			if (!this.isLogged) {
				this.callbackTT(false);
			}

			if (!this.isLogged) {
				FB.getLoginStatus(function (response) {
					if (response.status == "connected") {
						UserHandler.callbackFB(response);
					}
					else {
						if (!this.isLogged) {
							Lungo.Notification.html($$("#popup-login").html())
						}
					}
				});
			}
		}

		// login with Facebook
		this.loginFB = function () {
			FB.getLoginStatus(this.callbackFB);
		}

		// login with Twitter
		this.loginTT = function () {
			this.callbackTT(true);
		}

		this.confirmLogout = function () {
			log(UserHandler.logoutHTML);
			Lungo.Notification.confirm({
				icon: "user",
				title: "You are logged in as",
				description: UserHandler.logoutHTML,
				accept: {
					icon: "checkmark",
					label: "Log out",
					callback: function () {
						UserHandler.logout();
						return false;
					}
				},
				cancel: {
					icon: "close",
					label: "Go Back",
					callback: function () {}
				}
			});
		}

		this.logout = function () {
			if (this.userInfoProvider == "fb") {
				FB.logout(function (response) {
					location.reload();
				});
			}
			else {
				openURL("./actions/twitter?q=logout");
			}
		}

		// Handles the response from getting the user's login status.
		// If the user is logged in and the app is authorized go ahead
		// and start running the application. If they are not logged in
		// then redirect to the auth dialog.
		this.callbackFB = function (response) {
			if (response.status != "connected") {
				openURL("https://www.facebook.com/dialog/oauth?client_id=" + UserHandler.appIdFB + "&redirect_uri=" + encodeURIComponent(CONFIG.appURL) + "&scope=email");
			}
			else {
				FB.api("/me", function (response) {
					UserHandler.isLogged = true;
					UserHandler.userInfoProvider = "fb";
					UserHandler.userInfo = response;

					$$("#username").html(UserHandler.userInfo.first_name);
					$$("#userIcon").html("<img src='http://graph.facebook.com/" + UserHandler.userInfo.username + "/picture'/> ");

					UserHandler.logoutHTML = "<div id='wrapper-welcome'><img src='http://graph.facebook.com/" + UserHandler.userInfo.username + "/picture?type=large' class='block'/> <br/>" + UserHandler.userInfo.first_name + "</div>";

					//Lungo.Notification.hide();
					//setTimeout(function() {

					Lungo.Notification.confirm({
						icon: "user",
						title: "Welcome, " + UserHandler.userInfo.first_name,
						description: "<div id='wrapper-welcome'><img src='http://graph.facebook.com/" + UserHandler.userInfo.username + "/picture?type=large' class='block'/> <br/></div>",
						accept: {
							icon: "checkmark",
							label: "Proceed",
							callback: function () {
								if (UserHandler.callback) {UserHandler.callback();}
							}
						},
						cancel: {
							icon: "close",
							label: "Log Out",
							callback: function () {
								UserHandler.logout();
							}
						}
					});
					//}, 500);
					
				});
			}

		}

		this.callbackTT = function (startLogin) {
			var cookieTT = readCookie("twitterData");
			if (cookieTT) {
				UserHandler.isLogged = true;
				UserHandler.userInfoProvider = "tt";
				UserHandler.userInfo = JSON.parse(decodeURIComponent((cookieTT + "").replace(/\+/g, "%20")));

				$$("#username").html(UserHandler.userInfo.name);
				$$("#userIcon").html("<img src='" + UserHandler.userInfo.profile_image_url_https + "'/> ");

				UserHandler.logoutHTML = "<div id='wrapper-welcome'><img src='" + UserHandler.userInfo.profile_image_url_https + "' class='block'/> <br/>" + UserHandler.userInfo.name + "</div>";

				Lungo.Notification.confirm({
					icon: "user",
					title: "Welcome, " + UserHandler.userInfo.name,
					description: "<div id='wrapper-welcome'><img src='" + UserHandler.userInfo.profile_image_url_https + "' class='block'/> <br/></div>",
					accept: {
						icon: "checkmark",
						label: "Proceed",
						callback: function () {
							if (UserHandler.callback) {UserHandler.callback();}
						}
					},
					cancel: {
						icon: "close",
						label: "Log Out",
						callback: function () {
							UserHandler.logout();
						}
					}
				});
			}
			else {
				if (startLogin) {
					openURL("./actions/twitter?q=login");
				}
			}
		}
	}