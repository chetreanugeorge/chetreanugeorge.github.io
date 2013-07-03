Lungo.ready(function () {
	// Events for buttons
	
	// Authentication
	$$("img[data-action=loginFB]").tap(function () {
		UserHandler.loginFB();
	})
	$$("img[data-action=loginTT]").tap(function () {
		UserHandler.loginTT();
	})
	$$("a[data-action=logout]").tap(function () {
		UserHandler.confirmLogout();
	});
	
	
	// Similar product (in product details pop-up)
	$$("li[data-action=viewProduct]").tap(function () {
		AppEngine.viewSimilarProduct($$(this).data('id'));
	});

	
	// Profile details section
	$$("#personalInfo input[type='checkbox']").on("change", function (e) {
		//var pos = Number($$(this).attr("id").substring(1))-1;
		//UserHandler.userInfo.allergies[pos] = (this.checked==true? 1:0);
	});
	
	$$("#dietType").on("change", function (e) {
		UserHandler.userInfo.dietType=this.options[this.selectedIndex].value;
	});
	
	// Preferences section
	$$("input[type='range']").tap(function (e) {
		var setting = $$(this).attr("id");
		var enable = $$(this).hasClass("active");
		
		AppEngine.appSettings[setting] = enable;
		
		switch (setting) {
			case "historyON":
				enable? $$("#menuList li:nth-child(1)").show():$$("#menuList li:nth-child(1)").hide() 
			break;
			case "cartOn":
				enable? $$("#menuList li:nth-child(2)").show():$$("#menuList li:nth-child(2)").hide() 
			break;
		}
	});

	// "I bought this" button
	$$("div[data-action=bought]").tap(function () {
		var isOnReview = AppEngine.currentSection == "review";
		
		//console.log('AppEngine.reviewCarousel:'+AppEngine.reviewCarousel);
		var product = isOnReview ? ARHandler.identifiedProducts[AppEngine.reviewCarousel.position()] : ARHandler.selectedProduct;

		UserHandler.boughtProduct(product);

		$$("#shoppingBasket ul").append("<li class=''>" + "<div class='right' data-icon='cart'><strong id='productPrice'>" + product.price + "</strong> RON</div>" + "<strong id='productName'>" + product.name + "</strong> <small class='productDescription'>" + product.description + "</small> </li>");

		$$("#boughtTotalItems").html(UserHandler.boughtProducts.length);

		if (isOnReview) {
			$$(this).parent().html("Product was added to your cart!");
			$$(this).remove();
		} else {
			Lungo.Router.article("main", "default");
			
			if (ARHandler.tracker)  {
				ARHandler.tracker.enabled = true;
			}
		}
		
	});
	
	// Recommend product "Yes" button
	$$("span[data-action=recommendYes]").tap(function () {
		var product = ARHandler.identifiedProducts[AppEngine.reviewCarousel.position()];
		
		UserHandler.recommendedProduct(product, true);
		
		$$(this).parent().html("Thank you for your feedback");
	});
	// Recommend product "No" button
	$$("span[data-action=recommendNo]").tap(function () {
		var product = ARHandler.identifiedProducts[AppEngine.reviewCarousel.position()];
		
		UserHandler.recommendedProduct(product, false);
		
		$$(this).parent().html("Thank you for your feedback");
	});

	// Continue button
	$$("a[data-action=resumeRadar]").tap(function () {
		if (ARHandler.tracker)  {
			ARHandler.tracker.enabled = true;
		}
	});
	
	// Menu button
	/*$$("a[href='#menu']").tap(function () {
		if (ARHandler.tracker)  {
			ARHandler.tracker.enabled = false;
		}
	});
	
	// Back button
	$$("a[href='#back']").tap(function () {
		if (ARHandler.tracker)  {
			ARHandler.tracker.enabled = true;
		}
	});*/
	
	

	// Events for sections
	
	// Main
	$$("#main").on("load", function (event) {
		AppEngine.currentSection = "main"
	});
	
	// History
	$$("#review").on("load", function (event) {
		AppEngine.currentSection = "review"

		if (ARHandler.identifiedProducts.length == 0) {
			$$("#review nav[class='right']").hide();
		}
		else {
			$$("#review nav[class='right']").show();

			$$("#reviewList").html("");

			for (var i in ARHandler.identifiedProducts) {
				var product = ARHandler.identifiedProducts[i];
				
				var alreadyBoughtIt = Lungo.Core.findByProperty(UserHandler.boughtProducts, 'id', product.id);
				
				var alreadyRatedIt = false;
				if (product.recommendedBy) {
					if (product.recommendedBy.indexOf(UserHandler.userInfo.id)!=-1) {
						alreadyRatedIt = true;
					}
				}
				//console.log('UserHandler.userInfo.id', UserHandler.userInfo.id);
				//console.log('product.recommendedBy', product.recommendedBy);
				//console.log('product.notRecommendedBy', product.notRecommendedBy);
				
				if (product.notRecommendedBy) {
					if (product.notRecommendedBy.indexOf(UserHandler.userInfo.id)!=-1) {
						alreadyRatedIt = true;
					}
				}
				
				$$("#reviewList").append(" <div align='center' class='list'> <img src='media/products/"+product.id+".jpg' style='max-height:200px' />" 
					+ "        <div class='details margined'>" 
					+ "          <ul>" 
					+ "            <li class='theme'>" 
					+ "              <div class='right' data-icon='cart'><strong class='productPrice'>"+ product.price+ "</strong> RON</div>" 
					+ "              <strong class='productName'>"+ product.name+ "</strong> <small class='productDescription'>"+ product.description+ "</small></li>" 
					+ "            <li class='anchor'></li>" 
					+ "            <li>"
					+ (alreadyBoughtIt==null ? "              <div class='anchor button' data-icon='check' data-action='bought'>I bought this!</div>" :"Product was added to your cart")
					+ "            </li>" 
					+ (alreadyRatedIt == false ? "            <li><strong>Recommend this product? </strong> <span href='#' class='button accept' data-icon='thumbs-up' data-action='recommendYes'> Yes</span> <span href='#' class='button cancel' data-icon='thumbs-down' data-action='recommendNo'> No</span></li>" : "You already rated this product")
					+ "          </ul>" 
					+ "        </div>" 
					+ "      </div>");
			}
		
			$$("section#review .title").html(ARHandler.identifiedProducts[0].name);
			
			AppEngine.reviewCarousel = Lungo.Element.Carousel($$("[data-control=review]")[0], function (index, element) {
				$$("section#review .title").html(ARHandler.identifiedProducts[index].name);
			});
			
			Lungo.Events.init({
				"tap section#review > header [data-direction=left]": review.prev,
				"tap section#review > header [data-direction=right]": review.next
			});
		}
	});
	
	// Cart
	$$("#shoppingBasket").on("load", function (event) {
		AppEngine.currentSection = "shoppingBasket"
	
		var totalItems = UserHandler.boughtProducts.length;
		var totalCost = 0;
		for (var i = 0; i < totalItems; i++) {
			totalCost += UserHandler.boughtProducts[i].price;
		}
	
		$$("#totalCost").remove();
		$$("#shoppingBasket ul").append("<li class='theme' id='totalCost'><strong>Total cost: " + totalCost + " RON </strong></li>")
	});
	
	// Profile
	$$("#personalInfo").on("load", function (event) {
		AppEngine.currentSection = "personalInfo";
	});
	
	// Preferences
	$$("#preferences").on("load", function (event) {
		AppEngine.currentSection = "preferences";
		
		$$("input[type='range']").each(function (i, element) {	
			if (AppEngine.appSettings[$$(element).attr("id")]) {
				$$(element).addClass("active")
			}
			else {
				$$(element).removeClass("active")
			}
		})
	});
});

var AppEngine = {
	appSettings: {historyON:true, cartOn:true, arProductNameOn:true, arInfoIconOn:true},
	
	currentSection: "main",

	reviewInit: false,
	reviewCarousel: null,

	init: function initFn() {

		UserHandler.init(function () {
			UserHandler.getUserInfo();

			//console.log(UserHandler.profileInfo);
			//console.log(UserHandler.userInfo);

			$$("#dietType option[value='" + UserHandler.userInfo.dietType + "']")[0].selected = true
			
			for (var i in UserHandler.userInfo.allergies) {
				$$("#personalInfo #a"+(Number(i)+1)+"")[0].checked = UserHandler.userInfo.allergies[i]==1
			}
			
			

			//init module (start Recommedantions for the current user)
			RecommendationGenerator.init();

			// init module (start AR World)
			ARHandler.init(function () {
				AppEngine.setHeaderText("Product Radar");
			});

		});
		//this.show("review");
	},

	setHeaderText: function setHeaderTextFn(text) {
		$$("section#main span.title").html(text);
	},

	viewProduct: function viewProductFn(product) {

		$$("#productName").html(product.name);
		$$("#productDescription").html(product.description);
		$$("#productPrice").html(product.price);

		$$("#productNotes").html("");

		var results = RecommendationGenerator.checkIngredients(UserHandler.userInfo, product.ingredients);
		var issuesList = results.issuesList;
		var ingredientsWithIssues = results.ingredientsWithIssues;

		if (results == false) {
			$$("#productIngredients").html(product.ingredients.join(", "));
			$$("#productNotes").html("<li class='accept'> <strong>None</strong> <small>This product looks fine!</small> </li>");
		}
		else {
			var productIngredientsText = "";

			for (var i in product.ingredients) {
				var ingredient = product.ingredients[i];

				if (ingredientsWithIssues.indexOf(ingredient) != -1) {
					productIngredientsText += "<span class='redBg'>" + ingredient + "</span>, ";
				}
				else {
					productIngredientsText += ingredient + ", ";
				}
			}

			$$("#productIngredients").html(productIngredientsText);

			for (var i in issuesList) {
				$$("#productNotes").append("<li class='cancel'> <strong>" + issuesList[i].title + "</strong> <small>" + issuesList[i].text + "</small> </li>");
			}
		}
		
		var recommendedProducts = RecommendationGenerator.getRecommendedProducts(product);
		
		//console.log('recommendedProducts', recommendedProducts);
		
		$$("#productRecommendations").html("");
		if (recommendedProducts.length>0) {
			for (var i in recommendedProducts) {
				//console.log(recommendedProducts[i]);
				var product = recommendedProducts[i].product;
				$$("#productRecommendations").append("<li class='selectable arrow' data-action='viewProduct' data-id='"+product.id+"'> <div class='right tag blue'> <span class='icon users'></span> "+recommendedProducts[i].popularity+"</div> <strong>"+product.name+"</strong> <small>"+product.price+" RON</small> </li>");
			};
		} 
			else {$$("#productRecommendations").append("<li class='secondary'> <strong>No suggestions for now</strong> <small>Maybe later!</small> </li>");
		}
		
		Lungo.Router.article("main", "product");
		//this.showArticle("main", "product");
	},
	
	viewSimilarProduct: function viewSimilarProductFn(productId) {
		this.viewProduct(Lungo.Core.findByProperty(ARHandler.productsInfo, 'id', productId));
	}
}