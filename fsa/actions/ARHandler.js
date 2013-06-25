var World = {
	tracker: null,
	loaded: false,
	productsInfo: null,
	selectedProduct: null,
	productsOverlays: [],
	productsTrackable: [],

	init: function initFn() {
		if (typeof AR === 'undefined') { return;}
		
		// Initialize Tracker
		this.tracker = new AR.Tracker(CONFIG.appURL+"/FSA_local.zip", {
			onLoaded:  function() { //this.worldLoaded
				log('tracker loaded', true);
			},
			onError:function() { 
				log('tracker not loaded!', true);
			}, 
			onDisabled : function(){
			log('tracker disabled!!!', true);
}
		});
		
		//alert('all ok so far '+ this.tracker);

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
        }
		];

		var productsOverlays = [];

		for (var i = 0; i < this.productsInfo.length; i++) {
			var info = this.productsInfo[i];

			//create a Style, red fill color, green outline
			var myStyle = {
				fillColor: '#FF0000',
				outlineSize: 2,
				outlineColor: '#00FF00'
			};

			//applying style options on creation of circle
			var overlay = new AR.Circle(0.5, {
				style: myStyle
			});

			var trackable = new AR.Trackable2DObject(this.tracker, info.id, {
				drawables: {
					cam: overlay
				}
			});

			this.productsOverlays[i] = overlay;

			this.productsTrackable[i] = trackable;

			info.productOverlay = overlay;
			info.productTrackable = trackable;

			info.select = this.selectproduct;

			overlay.onClick = this.productClicked(info);
		}
		
		AR.context.onScreenClick = this.screenClick;
	},

	selectproduct: function selectproductFn(select) {
		if (select) {
			// clear previously selected one
			if (World.selectedProduct !== null) {
				World.selectedProduct.select(false);
			}
			World.selectedProduct = this;
		}
		else {

		}
	},

	productClicked: function productClickedFn(product) {
		return function () {
			product.select(true);
			alert(product.name);
			return true;
		};
	},

	screenClick: function onScreenClickFn() {
		if (World.selectedProduct !== null) {
			World.selectedProduct.select(false);
		}

		alert('clicked screen');
	},
	
	worldLoaded: function worldLoadedFn() {
		alert('tracker loaded');
	}
};

World.init();