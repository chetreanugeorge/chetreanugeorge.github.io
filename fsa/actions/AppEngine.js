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
	
});

var AppEngine = {
	currentSection:"main",
	currentArticle: "default",
	
	init: function initFn() {
		
		UserHandler.init(function() {
			//setTimeout(function() {
				//Show loading screen
				//Lungo.Notification.show();
			//}, 750);
			
			// init module (start Recommedantions for the current user)
			//RecommendationGenerator.init();
			
			log('done auth, now init AR', true);
			// init module (start AR World)
			ARHandler.init(function() {
				//Lungo.Notification.hide();
				AppEngine.setHeaderText("Product Radar waiting...");
			});
			
		});
		
		//this.show("carousel");
		//this.initCarousel();
	},
	
	
	setHeaderText: function setHeaderTextFn(text) {
		Lungo.dom("section#main span.title").html(text);
	},
	
	initCarousel: function initCarouselFn() {
		var carousel_example = Lungo.Element.Carousel($$('[data-control=carousel]')[0], function(index, element) {
			Lungo.dom("section#carousel .title span").html(index + 1);
		});
		
		Lungo.Events.init({
			'tap section#carousel > header [data-direction=left]':  carousel_example.prev,
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
	
	viewProduct:function viewProductFn() {
		log('view product', true);
		//var productInfo = ARHandler.selectedProduct;
		
		//Lungo.dom("section#main article#product .details li strong").html(productInfo.name);
		this.showArticle("main", "product");
	}
}
