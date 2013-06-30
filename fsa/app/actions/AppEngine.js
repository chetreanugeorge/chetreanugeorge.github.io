Lungo.ready(function () {
	Lungo.dom('img[data-action=loginFB]').tap(function () {
		UserHandler.loginFB();
	})
	Lungo.dom('img[data-action=loginTT]').tap(function () {
		UserHandler.loginTT();
	})
	Lungo.dom('a[data-action=logout]').tap(function () {
		UserHandler.confirmLogout();
	});

	Lungo.dom('div[data-action=bought]').tap(function () {
		Lungo.Router.article("main","default");
		
		$$("#shoppingBasket ul").append("<li class=''>"
			+"<div class='right' data-icon='cart'><strong id='productPrice'>"+ARHandler.selectedProduct.price+"</strong> RON</div>"
			+"<strong id='productName'>"+ARHandler.selectedProduct.name+"</strong> <small class='productDescription'>"+ARHandler.selectedProduct.description+"</small> </li>");
		
		UserHandler.boughtProduct(ARHandler.selectedProduct);

		$$("#boughtTotalItems").html(UserHandler.boughtProducts.length);
	});
	
	
	Lungo.dom('#shoppingBasket').on('load', function(event) {
		var totalItems = UserHandler.boughtProducts.length;
		var totalCost = 0;
		for (var i=0; i<totalItems;i++) {
			totalCost+=UserHandler.boughtProducts[i].price;
		}
		
		$$("#totalCost").remove();
		$$("#shoppingBasket ul").append("<li class='theme' id='totalCost'><strong>Total cost: "+ totalCost+ " RON </strong></li>")
	});
});

var AppEngine = {
	currentSection: "main",
	currentArticle: "default",

	init: function initFn() {

		UserHandler.init(function () {
			log(UserHandler.profileInfo);
			
			//init module (start Recommedantions for the current user)
			RecommendationGenerator.init();

			// init module (start AR World)
			ARHandler.init(function () {
				AppEngine.setHeaderText("Waiting...");
			});

		});

		//this.show("carousel");
		this.initCarousel();
	},

	setHeaderText: function setHeaderTextFn(text) {
		Lungo.dom("section#main span.title").html(text);
	},

	initCarousel: function initCarouselFn() {
		var carousel_example = Lungo.Element.Carousel($$('[data-control=carousel]')[0], function (index, element) {
			Lungo.dom("section#carousel .title span").html(index + 1);
		});

		Lungo.Events.init({
			'tap section#carousel > header [data-direction=left]': carousel_example.prev,
			'tap section#carousel > header [data-direction=right]': carousel_example.next
		});

	},

	showSection: function showFn(sectionName) {
		Lungo.Router.section(sectionName);
		AppEngine.currentSection = sectionName;
	},

	showArticle: function showFn(sectionName, articleName) {
		Lungo.Router.article(sectionName, articleName);
		AppEngine.currentArticle = articleName
	},

	viewProduct: function viewProductFn(product) {

		Lungo.dom("#productName").html(product.name);
		Lungo.dom("#productDescription").html(product.description);
		Lungo.dom("#productPrice").html(product.price);
		Lungo.dom("#productIngredients").html(product.ingredients.join());
		Lungo.dom("#productNotes").html("");
		
		var issues = RecommendationGenerator.checkIngredients(UserHandler.userInfo(), product.ingredients);
		if (issues  == false) {
			Lungo.dom("#productNotes").html("<li class='accept'> <strong>None</strong> <small>This product looks fine!</small> </li>");
		}
		if (issues != false) {
			for (var i in issues) {
				Lungo.dom("#productNotes").append("<li class='cancel'> <strong>"+issues[i].title+"</strong> <small>"+issues[i].text+"</small> </li>");
			}
		}
		
		this.showArticle("main", "product");
	},
	
	productIdentified: function productIdentifiedFn(product) {
		$$("#allProducts").append(" <div align='center' class='list'> <img src='http://lorempixel.com/320/418/food/' style='height:150px; width:auto;' />"
			+"        <div class='details margined'>"
			+"          <ul>"
			+"            <li class='theme'>"
			+"              <div class='right' data-icon='cart'><strong class='productPrice'>"+product.price+"</strong> RON</div>"
			+"              <strong class='productName'>"+product.name+"</strong> <small class='productDescription'>"+product.description+"</small></li>"
			+"            <li class='anchor'></li>"
			+"            <li>"
			+"              <div class='anchor button' data-icon='check' data-action='bought'>I bought this!</div>"
			+"            </li>"
			+"            <li><strong>Recommend this product? </strong> <span href='#' class='button accept' data-icon='thumbs-up'> Yes</span> <span href='#' class='button cancel' data-icon='thumbs-down'> No</span></li>"
			+"          </ul>"
			+"        </div>"
			+"      </div>");
	}
}