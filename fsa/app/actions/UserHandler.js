var UserHandler = new function () {
		// to be replaced with db JSON
		this.users = [];
		
		// for external use
		this.boughtProducts = [];
		this.userInfo =  function () {
			// make call to db with this.profileInfo.id and this.profileInfoProvider
			return this.users[0];
		}
		
		// for internal use
		this.profileInfo = null;
		this.isLogged = false;
		this.profileInfoProvider = null;
		this.logoutHTML = null;

		this.appIdFB = 169299926577053;
		
		this.callback = null;
		
		

		this.init = function (callback) {
			this.callback = callback;

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
			if (this.profileInfoProvider == "fb") {
				FB.logout(function (response) {
					location.reload();
				});
			}
			else {
				openURL("./app/actions/twitter?q=logout");
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
					UserHandler.profileInfoProvider = "fb";
					UserHandler.profileInfo = response;

					$$("#userIcon").html(UserHandler.profileInfo.first_name + " <img src='http://graph.facebook.com/" + UserHandler.profileInfo.username + "/picture'/> ");

					UserHandler.logoutHTML = "<div id='wrapper-welcome'><img src='http://graph.facebook.com/" + UserHandler.profileInfo.username + "/picture?type=large' class='centeredBlock'/> <br/>" + UserHandler.profileInfo.first_name + "</div>";

					Lungo.Notification.confirm({
						icon: "user",
						title: "Welcome, " + UserHandler.profileInfo.first_name,
						description: "<div id='wrapper-welcome'><img src='http://graph.facebook.com/" + UserHandler.profileInfo.username + "/picture?type=large' class='centeredBlock'/> <br/></div>",
						accept: {
							icon: "checkmark",
							label: "Proceed",
							callback: function () {
								if (UserHandler.callback) {
									UserHandler.callback();
								}
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
				});
			}

		}

		this.callbackTT = function (startLogin) {
			var cookieTT = readCookie("twitterData");
			if (cookieTT) {
				UserHandler.isLogged = true;
				UserHandler.profileInfoProvider = "tt";
				UserHandler.profileInfo = JSON.parse(decodeURIComponent((cookieTT + "").replace(/\+/g, "%20")));

				$$("#userIcon").html(UserHandler.profileInfo.name + " <img src='" + UserHandler.profileInfo.profile_image_url_https + "'/> ");

				UserHandler.logoutHTML = "<div id='wrapper-welcome'><img src='" + UserHandler.profileInfo.profile_image_url_https + "' class='centeredBlock'/> <br/>" + UserHandler.profileInfo.name + "</div>";

				Lungo.Notification.confirm({
					icon: "user",
					title: "Welcome, " + UserHandler.profileInfo.name,
					description: "<div id='wrapper-welcome'><img src='" + UserHandler.profileInfo.profile_image_url_https + "' class='centeredBlock'/> <br/></div>",
					accept: {
						icon: "checkmark",
						label: "Proceed",
						callback: function () {
							if (UserHandler.callback) {
								UserHandler.callback();
							}
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
					openURL("./app/actions/twitter?q=login");
				}
			}
		}

		this.boughtProduct = function (product) {
			// save to db
			//
			
			this.boughtProducts.push(product);
		}
	}
	
	UserHandler.users = [
		{
			"id":553313237,
			"idProvider":"fb",
			// eating preferences
			"Fasting": true,
			// dietary restrictions
			"dietType": "Ovo-Vegetarian", // none, Vegetarian, Ovo-Vegetarian, Lacto-Vegetarian, Vegan
			// allergies
			"Allergies": [0,0,0,0,0,0,0,0]
		}
	]