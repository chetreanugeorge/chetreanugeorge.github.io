	var trackerDataSetPath = "app/targetcollections.wtc"; 
		var tracker = new AR.Tracker(trackerDataSetPath);  
		var circle = new AR.Circle(0.25, {
			onClick : function() {
				circle.radius *= 2;
			},
			horizontalAnchor : AR.CONST.HORIZONTAL_ANCHOR.LEFT,
			opacity : 0.5
		})
		var trackable2DObject = new AR.Trackable2DObject(tracker, "copyoffinalmedium8qv",{ drawables: { cam: [circle] }}); 

alert('all ok so far', tracker, circle, trackable2DObject);
/*var World = {
    productsInfo: null,
    rotating: false,
    selectedPlanet: null,

    init: function initFn() {
        var tracker = new AR.Tracker("app/targetcollections.wtc");

        var sizeFactor = 0.01;
        var distanceFactor = 0.01;


        this.productsInfo = [{
            name: "Sun",
            distance: 0,
            realSize: 109.2 * sizeFactor,
            description: "The Sun is the star at the center of the Solar System. It is almost perfectly spherical and consists of hot plasma interwoven with magnetic fields.",
            mass: "2&nbsp;10<sup>30</sup>&nbsp;kg",
            diameter: "1,392,684&nbsp;km"
        },

        
		];

        var products = [];

        for (var i = 0; i < this.productsInfo.length; i++) {
            var info = this.productsInfo[i];

            info.size = Math.log(info.realSize * 1000) * 0.01;
            if (i > 0) {
                info.distance = this.productsInfo[i - 1].distance + this.productsInfo[i - 1].size + info.size + 0.05;
            }

            products[i] = new AR.Model(info.modelFile, {
                scale: {
                    x: info.size,
                    y: info.size,
                    z: info.size
                },
                translate: {
                    x: this.sunLocation.x + info.distance,
                    y: this.sunLocation.y,
                    z: this.sunLocation.z
                }
            });

            info.planetModel = products[i];
            info.selectedAnimation = this.createSelectedAnimation(info);
            info.select = this.selectPlanet;

            products[i].onClick = this.planetClicked(info);
        }

        var backdropImg = new AR.ImageResource("assets/backdrop.png");
        var backdrop = [new AR.ImageDrawable(backdropImg, 2)];

        var overlay = new AR.Trackable2DObject(tracker, "solarsystem", {
            drawables: {
                cam: backdrop.concat(products)
            }
        });

        AR.context.onScreenClick = this.screenClick;
    },

    selectPlanet: function selectPlanetFn(select) {
        if (select) {
            if (World.selectedPlanet !== null) {
                World.selectedPlanet.select(false);
            }
            World.selectedPlanet = this;
            this.selectedAnimation.start(-1);
        } else {
            this.selectedAnimation.stop();
            this.planetModel.scale = {
                x: this.size,
                y: this.size,
                z: this.size
            };
        }
    },

    planetClicked: function planetClickedFn(planet) {
        return function() {
            planet.select(true);
            document.getElementById("info").setAttribute("class", "info");
            document.getElementById("name").innerHTML = planet.name;
            document.getElementById("mass").innerHTML = planet.mass;
            document.getElementById("diameter").innerHTML = planet.diameter;
            document.getElementById("info").setAttribute("class", "infoVisible");
            return true;
        };
    },

    screenClick: function onScreenClickFn() {
        if (World.selectedPlanet !== null) {
            World.selectedPlanet.select(false);
        }

        document.getElementById("info").setAttribute("class", "info");
    }
};

World.init();*/