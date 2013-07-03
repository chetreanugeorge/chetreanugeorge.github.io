var RecommendationGenerator = {
	dietTypes: {
		"Fasting": [0, 0, 0],
		"Vegetarian": [1, 1, 0],
		"Ovo-Vegetarian": [0, 1, 0],
		"Lacto-Vegetarian": [1, 0, 0],
		"Vegan": [0, 0, 0]
	},
	dietLimitations: ["dairy, milk, cheese", "egg", "meat, poultry, fish"],

	allergiesLimitations: ["walnut", "fish", "shellfish", "egg", "milk", "soy", "corn", "wheat"],

	init: function initFn() {},

	checkIngredients: function checkIngredientsFn(userInfo, ingredients) {
		var issuesFound = false;

		var issuesList = [];

		var ingredientsWithIssues = [];

		var cannotEatThese = [];

		var reasons = {};

		var eatingType;
		if (userInfo.dietType != "regular") {
			eatingType = this.dietTypes[userInfo.dietType];

			/*if (userInfo.Fasting) {
				eatingType = this.dietTypes.Fasting;
			}*/

			for (var i = 0; i < 3; i++) {
				if (eatingType[i] == 0) {
					var list = this.dietLimitations[i].split(",");
					for (var j in list) {
						cannotEatThese.push(list[j]);
						reasons[list[j]] = "diet"
					}
				}
			}
		}

		for (var i = 0; i < userInfo.allergies.length; i++) {
			if (userInfo.allergies[i] == 1) {
				cannotEatThese.push(this.allergiesLimitations[i]);
				reasons[list[j]] = "allergy"
			}
		}

		var ingredientsWithIssuesInside = new Object;

		for (var i in ingredients) {
			var ingredient = ingredients[i];

			if (cannotEatThese.indexOf(ingredient) != -1) {
				issuesFound = true;

				issuesList.push({
					"title": "Don't buy this, it contains: " + ingredient + " !",
					"text": "You see this warning because " + (reasons[ingredient] == "diet" ? "your diet type is <b>" + userInfo.dietType + "</b>" : "your are allergic to that ingredient")
				});

				ingredientsWithIssues.push(ingredient);
			}
			else {
				for (var j in cannotEatThese) {
					var cannotEatThis = cannotEatThese[j]

					if (ingredient.indexOf(cannotEatThis) != -1) {
						issuesFound = true;

						if (ingredientsWithIssuesInside[cannotEatThis] == null) {
							ingredientsWithIssuesInside[cannotEatThis] = [];
						}

						ingredientsWithIssuesInside[cannotEatThis].push(ingredient);
						ingredientsWithIssues.push(ingredient);
					}
				}
			}
		}

		for (var cannotEatThis in ingredientsWithIssuesInside) {
			issuesList.push({
				"title": "Don't buy this, it has by-product(s) of <u>" + cannotEatThis + "</u>: " + ingredientsWithIssuesInside[cannotEatThis].join(", "),
				"text": "You see this warning because " + (reasons[cannotEatThis] == "diet" ? "your diet type is <b>" + userInfo.dietType + "</b>" : "your are allergic to that ingredient")
			});
		}

		return issuesFound == true ? {
			"issuesList": issuesList,
			"ingredientsWithIssues": ingredientsWithIssues
		} : false;
	},

	getRecommendedProducts: function getSimilarProductsFn(product) {
		var products = [];
		var punique = [];
		if (product.recommendedBy) {
			for (var i in product.recommendedBy) {
				var prods = this.getRecommendedProductsByUser(product.recommendedBy[i], product.id);

				for (var j in prods) {
					var p = prods[j].product;
					if (punique.indexOf(p.id)==-1) 
					{
						punique.push(p.id);
						products.push(prods[j]);
					}
				}
			}
		}
		//console.log('getRecommendedProducts products', products);
		return products;
	},

	getRecommendedProductsByUser: function getRecommendedProductsByUserFn(userId, targetProductId) {
		//console.log('getRecommendedProductsByUserFn', userId);
		var products = [];
		for (var i in ARHandler.productsInfo) {
			var product = ARHandler.productsInfo[i];
			//console.log('product.recommendedBy', product.recommendedBy);
			if (product.recommendedBy && targetProductId != product.id && product.recommendedBy.indexOf(userId) != -1 && product.recommendedBy.length > 1) {
					products.push({
						"product": product,
						"popularity": product.recommendedBy.length
					});
			}
		}
		//console.log('getRecommendedProductsByUserFn products', products);
		return products;
	}

	/*getSimilarProducts: function getSimilarProductsFn(product) {
		var minScore = 1000;
		var mostSimilarProduct;

		for (var i in ARHandler.productsInfo) {
			productCompared = ARHandler.productsInfo[i];
			if (product.id != productCompared.id) {
				
				var currentScore = RecommendationGenerator.productSimilarity(product, productCompared);
				
				if (currentScore < minScore) {
					minScore = currentScore;
					mostSimilarProduct = productCompared;
				}
			}
		}
		return [mostSimilarProduct];
	},

	productSimilarity: function productSimilarity(p1, p2) {
		var ing1 = p1.ingredients;
		var ing2 = p2.ingredients;

		var ingredients1 = this.processIngredients(ing1);
		var ingredients2 = this.processIngredients(ing2);

		var commonIng = ingredients1.filter(function (n) {
			return ((ingredients2.indexOf(n) == -1) ? false : true);
		});

		ingredients1.sort();
		ingredients2.sort();

		ingredients1.forEach(function (element, index, array) {
			element = element.replace('.', '');
			element = element.replace('%', '');
			element = element.replace(/[0-9]/g, '');
			element = element.replace(/ /g, '')
			element = element.trim();
			array[index] = element
		});

		ingredients2.forEach(function (element, index, array) {
			element = element.replace('.', '');
			element = element.replace('%', '');
			element = element.replace(/[0-9]/g, '');
			element = element.replace(/ /g, '')
			element = element.trim();
			array[index] = element
		});

		var str1 = ingredients1.join("");
		var str2 = ingredients2.join("");

		var minChanges = this.getEditDistance(str1, str2);

		return minChanges / str1.length;

	},

	processIngredients: function processIngredientsFn(ingredients) {
		var ret = [];
		for (var i in ingredients) {
			var ing = ingredients[i];

			var split1 = ing.split("(");
			for (var j in split1) {
				var split1Item = split1[j];

				var split2 = split1Item.split(")");

				for (var k in split2) {
					var split2Item = split2[k];

					var split3 = split2Item.split(",");
					for (var l in split3) {
						ret.push(split3[l].trim());
					}
				}
			}
		}
		return ret.filter(function (str) {
			return str.length > 0
		});
	},

	getEditDistance: function getEditDistanceFn(a, b) {
		if (a.length == 0) return b.length;
		if (b.length == 0) return a.length;

		var matrix = [];

		// increment along the first column of each row
		var i;
		for (i = 0; i <= b.length; i++) {
			matrix[i] = [i];
		}

		// increment each column in the first row
		var j;
		for (j = 0; j <= a.length; j++) {
			matrix[0][j] = j;
		}

		// Fill in the rest of the matrix
		for (i = 1; i <= b.length; i++) {
			for (j = 1; j <= a.length; j++) {
				if (b.charAt(i - 1) == a.charAt(j - 1)) {
					matrix[i][j] = matrix[i - 1][j - 1];
				}
				else {
					matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, // substitution
						Math.min(matrix[i][j - 1] + 1, // insertion
							matrix[i - 1][j] + 1)); // deletion
				}
			}
		}

		return matrix[b.length][a.length];
	}
	*/
}