	function messageClicked() { // set the message DIV text 
		document.getElementById("messageElement").innerHTML = "My text"; } 

		var trackerDataSetPath = "PSA.zip"; 
		var logoTracker = new AR.Tracker(trackerDataSetPath); 
		var model = new AR.Model("model.wt3"); 
		var circle = new AR.Circle(0.25, {
			onClick : function() {
				circle.radius *= 2;
			},
			horizontalAnchor : AR.CONST.HORIZONTAL_ANCHOR.LEFT,
			opacity : 0.5
		})
		var trackable2DObject = new AR.Trackable2DObject(logoTracker, "jb_bottle",{ drawables: { cam: [circle] }}); 
