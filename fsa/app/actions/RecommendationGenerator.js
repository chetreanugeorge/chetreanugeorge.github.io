var RecommendationGenerator = {
	dietTypes: {
		"Fasting": [0, 0, 0],
		"Vegetarian": [1, 1, 0],
		"Ovo-Vegetarian": [0, 1, 0],
		"Lacto-Vegetarian": [1, 0, 0],
		"Vegan": [0, 0, 0]
	},
	eatingLimitations: ["dairy, milk, cheese", "egg", "meat, poultry, fish"],
	
	allergiesLimitations: ["peanuts", "fish", "shellfish", "eggs", "milk", "soy", "corn", "wheat"],
	
	init: function initFn() {},
	
	checkIngredients: function checkIngredientsFn(userInfo, ingredients) {
		var issuesFound = false;
		var issuesList = [];
		var cannotEatThis = [];
		
		log(userInfo);
		
		var eatingType;
		if (userInfo.dietType != "none") {
			eatingType = this.dietTypes[userInfo.dietType]
		} 
		/*if (userInfo.Fasting) {			eatingType = this.dietTypes.Fasting		}*/
		
		for (var i = 0; i < 3; i++) {
			if (eatingType[i] == 0) {
				cannotEatThis.push(this.eatingLimitations[i].split(","));
			}
		}
		
		for (var i = 0; i < userInfo.Allergies.length; i++) {
			if (this.allergiesLimitations[i] == 1) {
				cannotEatThis.push(this.allergiesLimitations[i]);
			}
		}
		
		for (var i in ingredients) {
			var ingredient = ingredients[i];
			if (cannotEatThis.indexOf(ingredient) != -1) {
				issuesFound = true;
				issuesList.push({
					"title": "Don't buy this, it contains: " + ingredient + " !",
					"text": "Reason: Your diet type is set to: " + userInfo.dietType
				});
			}
			else {
				for (var j in cannotEatThis) {
					if (ingredient.indexOf(cannotEatThis[j]) != -1) {
						issuesFound = true;
						issuesList.push({
							"title": "Don't buy this, it has an ingredient based on: " + ingredient + " !",
							"text": "Reason: Your diet type is set to: " + userInfo.dietType
						});
					}
				}
			}
		}
		return issuesFound == true ? issuesList : issuesFound;
	}
}