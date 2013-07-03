var ARHandler = {
	// for external use
	selectedProduct: null,

	// for internal use
	tracker: null,

	productsInfo: null,

	callback: null,

	identifiedProducts: [],

	init: function initFn(callback) {
		this.callback = callback;

		if (typeof AR === 'undefined') {
			return;
		}

		// Initialize Tracker
		this.tracker = new AR.Tracker("media/dataset.zip", {
			onLoaded: function () {
				//console.log('tracker loaded!!!', true);
				if (ARHandler.callback) {
					ARHandler.callback()
				}
			},
			onError: function () {
				//console.log('tracker not loaded!', true);
			},
			onDisabled: function () {
				//console.log('tracker disabled!!!', true);
			}
		});

		for (var i = 0; i < this.productsInfo.length; i++) {
			var info = this.productsInfo[i];

			//create a new label and setup parameters
			var label = new AR.Label(info.name, 0.25, {
				opacity: 1,
				style: {
					/*backgroundColor: "#4b75c2",*/
					textColor: "#ffffff",
					fontStyle: AR.CONST.FONT_STYLE.BOLD
				},
				zOrder:3
			});

			// create a new button and setup parameters
			var imgInfo = new AR.ImageResource("app/images/btn-details.png");
			var buttonInfo = new AR.ImageDrawable(imgInfo, 1, {
				offsetX: -1,
				offsetY: 0.5,
				zOrder:2
			});
			
			// create a new button and setup parameters
			var imgBg = new AR.ImageResource("app/images/bg.png");
			var buttonBg = new AR.ImageDrawable(imgBg, 0.5, {
				opacity: 0.75,
				offsetX: 0,
				offsetY: 0,
				zOrder:1
			});

			// register/enable this trackable
			if (info.pictures) {
				for (var j = 1; j <= info.pictures; j++) {
					var _info = info;
					new AR.Trackable2DObject(this.tracker, info.id + "_" + j, {
						drawables: {
							cam: [label, buttonInfo, buttonBg]
						},
						onEnterFieldOfVision: this.productIdentified(info)
					});
				}

			}
			else {
				var trackable = new AR.Trackable2DObject(this.tracker, info.id, {
					drawables: {
						cam: [label, buttonInfo, buttonBg],	
					},
					onEnterFieldOfVision: this.productIdentified(info)
				});
			}

			// linking
			info.pos = i;
			info.select = this.selectProduct;

			
			label.onClick = this.productClicked(info);
			buttonInfo.onClick = this.productClicked(info);
			buttonBg.onClick = this.productClicked(info);
		}
	},

	productIdentified: function productClickedFn(product) {
		return function () {
			if (Lungo.Core.findByProperty(ARHandler.identifiedProducts, 'id', product.id) == null) {
				ARHandler.identifiedProducts.push(product);
			}
			
			return true;
		};
	},
	productClicked: function productClickedFn(product) {
		return function () {
			product.select(true);
			AppEngine.viewProduct(product);
			ARHandler.tracker.enabled = false;
			return true;
		};
	},

	selectProduct: function selectProductFn(select) {
		if (select) {
			// clear previously selected one
			if (ARHandler.selectedProduct !== null) {
				ARHandler.selectedProduct.select(false);
			}
			ARHandler.selectedProduct = this;
		}
		else {

		}
	}
};

ARHandler.productsInfo = [{
		"id": "p1",
		"name": "Heidi Bouquette",
		"description": "Assorted Chocolate Pralines - a selection of fine pralines",
		"ingredients": ["sugar", "vegetable fats", "cocoa butter", "cocoa mass", "cocoa powder", "whole milk powder", "skimmed milk powder", "walnut powder 0.6%", "orange powder 0.1% (maltodextrine from maize, orange concentrate 11%, natural flavor: orange)", "ground mint 0.1%", "honey powder 0.02 (dried honey 60%, skimmed milk powder)", "emulsifier: soy lecithin", "natural flavours: vanilla extract", "walnut", "mint", "orange"],
		"price": 30,
		"recommendedBy": [9999999999, 11, 22]
	}, {
		"id": "p2",
		"name": "Weinbrand Bohnem",
		"description": "Alcohol Chocolates with Brandy filling - Brandy filled Chocolates",
		"ingredients": ["sugar", "cocoa mass", "glucose syrup", "brandy (13%)", "cocoa butter", "emulsifier: soya lecithins"],
		"price": 20
	}, {
		"id": "p3",
		"name": "Boromir Cookies",
		"description": "Cookies with Apple filling",
		"ingredients": ["white wheat flour", "water", "non-hydrogenated vegetable fats", "sugar", "apple filling 28% (inverted sugar syrup, saccharose, apples 38%, concentrated lemon juice, gelling agent: pectin, acidity regulator: citric acid, flavours)", "leavening agents: ammonium bicarbonate, baking soda (sodium carbonate, sodium pyrophosphate, corn starch, anti-caking agent: calcium carbonate)", "emulgators: mono and diglycerides of fatty acides", "iodized salt", "flavours"],
		"price": 6.5
	}, {
		"id": "p4",
		"name": "Boromir Cookies",
		"description": "Cookies with Plum jam",
		"ingredients": ["white wheat flour", "water", "non-hydrogenated vegetable oils", "sugar", "plum jam 28% (inverted sugar syrup, saccharose, plums 45%, gelling agent: pectin, acidity regulator: citric acid, flavours)", "leavening agents: ammonium bicarbonate, baking soda (sodium carbonate, sodium pyrophosphate, corn starch, anti-caking agent: calcium carbonate)", "emulgators: mono and diglycerides of fatty acides", "iodized salt", "flavours"],
		"price": 6.5
	}, {
		"id": "p5",
		"name": "Dr.Oetker VITALIS",
		"description": "Crunchy Muesli with Honey - with expanded Wheat Grain",
		"ingredients": ["41% whole oats", "sugar", "wheat 11% expanded (expanded wheat grain)", "vegetable oil", "wheat flour", "rice flour", "honey 3.3%", "3.1% dehydrated coconut flakes", "glucose and fructose syrup", "salt", "low fat cocoa", "dried barley malt extract soy lecithin with emulsifier", "calcium carbonate", "flavor"],
		"price": 10
	}, {
		"id": "p6",
		"name": "Piasten Dolce Delizia",
		"description": "Luxury assortment - assorted chocolates",
		"ingredients": ["sugar", "wheat starch", "glucose syrup", "vegetable fat (in filling)", "whole soy flour", "cocoa butter", "cocoa mass", "lactose", "whole milk powder", "caramel sugar syrup", "dextrose", "humectant: invertasa", "emulsifier : lecithin", "flavor", "rice flour", "citric acid", "concentrated juice of beetroot", "egg powder"],
		"price": 40,
		"recommendedBy": [9999999999]
	}, {
		"id": "p7",
		"name": "Belgique d'Or",
		"description": "Pralines de Belgique - 'Cafe au Lait' flavored Belgian Pralines",
		"ingredients": ["51.5% hazelnut paste (sugar, vegetable fat, hazelnuts, thickening agent: calcium carbonate, skimmed cocoa powder, emulsifier: soy lecithin, flavors)", "milk chocolate 39% (sugar, cocoa butter, whole milk powder, cocoa mass, lactose, whey powder, emulsifier: soy lecithin, natural flavors: vanilla)", "9% white chocolate (sugar, cocoa butter, whole milk powder, lactose, whey powder, emulsifier: soy lecithin, natural flavors: vanilla)"],
		"price": 25,
		"recommendedBy": [9999999999, 11, 22, 33]
	}, {
		"id": "p8",
		"name": "Novatini Candies",
		"description": "Assorted Candies",
		"ingredients": ["sugar", "hydrogenated vegetable vat", "whey powder", "glucose-fructose syrup", "fat-reduced cocoa powder", "humectant agent (sorbitol syrup)", "vegetable fat", "refined ethylic alcohol", "whole milk powder 0.6%", "emulsifiers (soy lecithin", "polyglycerol polyricinoleate)", "stabiliser (invertase)", "flavourings", "acidifiers (lactic acid, citric acid)", "rum 0.03%", "strawberry powder 0.03% (strawberry puree concentrate, maltodextrin)", "cream powder 0.03% ", "sour cherry powder 0.015%", "(sour puree concentrate, maltodextrin)", "colour (anthocyanins)", "sour cherry liqueur 0.007%", "preservative (sorbit acid)"],
		"price": 15,
		"recommendedBy": [9999999999]
	}, {
		"id": "p9",
		"name": "Croco Biscuits",
		"description": "Biscuits with Cocoa cream",
		"ingredients": ["wheat flour", "nonhydrogenated vegetable fat", "sugar", "salt", "raising agents (E500, E503)", "flavours", "cocoa"],
		"price": 1.5
	}
	];