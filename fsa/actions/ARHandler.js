var ARHandler = {
	tracker: null,
	loaded: false,
	productsInfo: null,
	selectedProduct: null,
	productsOverlays: [],
	productsTrackable: [],
	
	callback:null,
	
	init: function initFn(callback) {
		this.callback = callback;
		
		if (typeof AR === 'undefined') {
			return;
		}

		// Initialize Tracker
		this.tracker = new AR.Tracker(CONFIG.appURL + "/FSA_local.zip", {
			onLoaded: function () {
				log('tracker loaded', true);
				if (ARHandler.callback) {
					ARHandler.callback()
				}
			},
			onError: function () {
				log('tracker not loaded!', true);
			},
			onDisabled: function () {
				log('tracker disabled!!!', true);
			}
		});

		this.productsInfo = [{
				id: "p1",
				name: "Product 1",
				description: "This is product 1",
				ingredients: [],
				price: 3
        },
			{
				id: "p2",
				name: "Product 2",
				description: "This is product 2",
				ingredients: [],
				price: 4
        },
			{
				id: "p3",
				name: "Product 3",
				description: "This is product 3",
				ingredients: [],
				price: 5
        }];

		for (var i = 0; i < this.productsInfo.length; i++) {
			var info = this.productsInfo[i];

			//create a Style, red fill color, green outline
			var myStyle = {
				fillColor: '#FFFFFF',
				outlineSize: 5,
				outlineColor: '#FF0000'
			};

			//applying style options on creation of circle
			var overlay = new AR.Circle(0.5, {
				style: myStyle
			});

			var htmlDrawable2 = new AR.HtmlDrawable({
				uri: "https://www.google.ro/"
			}, 1, {
				scale: 1,
				updateRate: AR.HtmlDrawable.UPDATE_RATE.STATIC,
				zOrder: 4
			})

			var htmlDrawable3 = new AR.HtmlDrawable({
				uri: "https://www.google.ro/" //"http://students.info.uaic.ro/~george.chetreanu/fsa/app/sections/productDetails.html#"+info.id
			}, 1, {
				scale: 1,
				updateRate: AR.HtmlDrawable.UPDATE_RATE.STATIC
				//zOrder:3
			})

			//create a new label and pass some setup parameters
			var label = new AR.Label(info.name, 0.25, {
				opacity: 0.75,
				style: {
					backgroundColor: "#4b75c2",
					textColor: "#ffffff"
				} //,
				//zOrder:2
			});

			var imgReset = new AR.ImageResource("images/btn-details.png");
			var buttonReset = new AR.ImageDrawable(imgReset, 0.25, {
				offsetX: 0.5,
				offsetY: 0.5 //,
				//zOrder:1
			});

			var trackable = new AR.Trackable2DObject(this.tracker, info.id, {
				drawables: {
					cam: [label, buttonReset]
				},
				onEnterFieldOfVision: function () {
					//log('now visible', true);
				},
				onExitFieldOfVision: function () {
					//log('now gone', true);
				}
			});

			info.select = this.selectproduct;

			buttonReset.onClick = this.btnClicked(trackable);
			label.onClick = this.productClicked(info);
		}

		/*AR.context.onScreenClick = this.screenClick;*/
	},

	btnClicked: function btnClickedFn(t) {
		return function () {
			t.enabled = false;
			log('btnClickedFn', true);
			log(t, true);
			return true;
		}
	},

	productClicked: function productClickedFn(product) {
		return function () {
			product.select(true);
			log(product.name, true);
			log(AppEngine, true);
			AppEngine.viewProduct();
			return true;
		};
	},

	selectproduct: function selectproductFn(select) {
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