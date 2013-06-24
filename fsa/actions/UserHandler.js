var UserHandler = new function () {
		this.isLogged = false;
		this.redirectUrl = window.location.href;
		this.userInfo = null;
		this.userInfoProvider = null;
		this.logoutHTML = null;

		this.appIdFB = 169299926577053;

		this.init = function () {
			/*if (window.location.href.indexOf("error_reason")>=0) {
			$$(document.body).append("<p>Authorization denied!</p>");
		}*/
			/*if (!this.isLogged) {
				this.callbackTT();
			}
			
			if (!this.isLogged) {
				this.callbackFB();
			}*/

			if (!this.isLogged) {
				console.log('show login');
				Lungo.Notification.html($$("#popup-login").html())
				ev();
			}
		}

		// login with Facebook
		this.loginFB = function () {
			// init the FB JS SDK
			FB.init({
				appId: this.appIdFB,
				status: true,
				cookie: true,
				oauth: true
			});
			console.log("login FB", FB);
			FB.getLoginStatus(this.callbackFB);
		}

		// login with Twitter
		this.loginTT = function () {
			console.log("login tt");
			this.callbackTT();
		}

		this.confirmLogout = function () {
			Lungo.Notification.confirm({
				icon: 'user',
				title: 'You are logged in as',
				description: this.logoutHTML,
				accept: {
					icon: 'checkmark',
					label: 'Log out',
					callback: function () {
						this.logout();
					}
				},
				cancel: {
					icon: 'close',
					label: 'Go Back',
					callback: function () {
						alert("No!");
					}
				}
			});
		}

		this.logout = function () {
			this.isLogged = false;
			this.userInfo = null;
			this.userInfoProvider = null;
			this.logoutHTML = null;
			setTimeout(this.init, 500);
		}

		// Handles the response from getting the user's login status.
		// If the user is logged in and the app is authorized go ahead
		// and start running the application. If they are not logged in
		// then redirect to the auth dialog.
		this.callbackFB = function (response) {
			if (response.status != "connected") {
				top.location.href = "https://www.facebook.com/dialog/oauth?client_id=" + appId + "&redirect_uri=" + encodeURIComponent(redirectUrl) + "&scope=email";
			}
			else {
				this.isLogged = true;
				this.userInfoProvider = "fb";

				FB.api("/me", function (response) {
					this.userInfo = response;
					console.log(this.userInfo);

					$$("#username").html(this.userInfo.first_name);
					$$("#userIcon").html("<img src='http://graph.facebook.com/" + this.userInfo.username + "/picture'/> ");

					this.logoutHTML = "<div id='wrapper-welcome'><img src='http://graph.facebook.com/" + this.userInfo.username + "/picture?type=large' class='block'/> <br/>" + this.userInfo.first_name + "</div>";

					Lungo.Notification.html("<div id='wrapper-welcome'><img src='http://graph.facebook.com/" + this.userInfo.username + "/picture?type=large' class='block'/> <br/> Welcome, " + this.userInfo.first_name + "</div>", "proceed", 5);
				});
			}

		}

		this.callbackTT = function () {
			var cookieTT = readCookie("twitterData");
			if (cookieTT) {
				this.isLogged = true;
				this.userInfoProvider = "tt";
				this.userInfo = JSON.parse(decodeURIComponent((cookieTT + '').replace(/\+/g, '%20')));
				console.log(this.userInfo);

				$$("#username").html(this.userInfo.name);
				$$("#userIcon").html("<img src='" + this.userInfo.profile_image_url_https + "'/> ");

				this.logoutHTML = "<div id='wrapper-welcome'><img src='" + this.userInfo.profile_image_url_https + "' class='block'/> <br/>" + this.userInfo.name + "</div>";

				var _this = this;
				Lungo.Notification.confirm({
					icon: 'user',
					title: "Welcome, " + this.userInfo.name,
					description: "<div id='wrapper-welcome'><img src='" + this.userInfo.profile_image_url_https + "' class='block'/> <br/></div>",
					accept: {
						icon: 'checkmark',
						label: 'Proceed',
						callback: function () {
							//Lungo.Notification.hide();
						}
					},
					cancel: {
						icon: 'close',
						label: 'Log Out',
						callback: function () {
							_this.logout();
						}
					}
				});
			}
			else {
				window.location = './actions/twitter';
			}
		}
	}