module.exports = function(app){
	
	var models = app.locals.models;
	var checkit = app.locals.checkit;
	var middleware = app.locals.middleware;
	
	var _ = app.locals._;
	
	app.get('/user/:user_id/journal/food', middleware.checkJWTToken, function(req, res){
		
		models.FoodItem.collection().query().where('user_id', '=', req.params.user_id).whereIn('journal_id', req.query.journal)
		.then(function(food_items){
			
			if(req.query.group === '1'){
				return res.json({
					food_items : _.groupBy(food_items, 'journal_id')
				});	
			
			}else{
				return res.json({
					food_items : food_items
				});
			}
		})
		.catch(function(bs_err){
			console.log(bs_err);
			return res.status(500).json({
				error: 'mysql error'
			});
		});
	});
	
	app.get('/user/:user_id/journal/:journal_id/food', middleware.checkJWTToken, function(req, res){
		models.FoodItems.query().where({user_id: req.params.user_id, journal_id: req.params.journal_id})
		.then(function(food_items){
			return res.json({
				food_items :food_items
			})
		})
		.catch(function(bs_err){
			console.log(bs_err);
			return res.status(500).json({
				error: 'mysql error'
			});
		});
	});
	
	app.post('/user/:user_id/journal/:journal_id/food', middleware.checkJWTToken, function(req, res){
		
		if(isNaN(parseInt(req.params.user_id)) || isNaN(parseInt(req.params.journal_id))){
			return res.status(400).json({
				error: 'invalid URL parameter'
			});
		}
	
		checkit.FoodItemRules.run(req.body)
		.then(function(validatedData){
			
			models.FoodItem.forge({
				user_id: req.params.user_id,
				journal_id: req.params.journal_id,
				food_name: validatedData.food_name,
				meal_type: validatedData.meal_type,
				calories: validatedData.calories,
				carbohydrates: validatedData.carbohydrates,
				proteins: validatedData.proteins,
				sodium: validatedData.sodium,
				cholesterol: validatedData.cholesterol, 
				portion_size: validatedData.portion_size,
				potassium: validatedData.potassium,
				fats: validatedData.fats
			}).save()
			.then(function(newFoodItem){
				return res.json({
					food_item: newFoodItem
				});
			})
			.catch(function(bs_err){
				console.log(bs_err);
				return res.status(500).json({
				error: 'mysql error'
			});
			})
		})
		.catch(function(checkit_err){
			return res.status(400).json({
				error: checkit_err.toJSON()
			});
		});
	});
	
	app.post('/user/:user_id/journal/:journal_id/food/submit', middleware.checkJWTToken, function(req, res){
		
		if(isNaN(parseInt(req.params.user_id)) || isNaN(parseInt(req.params.journal_id))){
			return res.status(400).json({
				error: 'invalid URL parameter'
			});
		}
	
		checkit.FoodItemRules.run(req.body)
		.then(function(validatedData){
			
			models.UserSubmittedFoodItem.forge({
				user_id: req.params.user_id,
				journal_id: req.params.journal_id,
				food_name: validatedData.food_name,
				meal_type: validatedData.meal_type,
				calories: validatedData.calories,
				carbohydrates: validatedData.carbohydrates,
				proteins: validatedData.proteins,
				sodium: validatedData.sodium,
				cholesterol: validatedData.cholesterol, 
				portion_size: validatedData.portion_size,
				potassium: validatedData.potassium,
				approved: 0,
				fats: validatedData.fats
			}).save()
			.then(function(newFoodItem){
				return res.json({
					submitted_food_item: newFoodItem
				});
			})
			.catch(function(bs_err){
				console.log(bs_err);
				return res.status(500).json({
					error: 'mysql error'
				});
			})
		})
		.catch(function(checkit_err){
			return res.status(400).json({
				error: checkit_err.toJSON()
			});
		});
	});
	
}