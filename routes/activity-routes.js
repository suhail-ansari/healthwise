module.exports = function(app){
	
	var models = app.locals.models;
	var checkit = app.locals.checkit;
	var middleware = app.locals.middleware;
	var _ = app.locals._;
	
	app.get('/user/:user_id/journal/activity', middleware.checkJWTToken, function(req, res){
		
		models.ActivityItem.collection().query().where('user_id', '=', req.params.user_id).whereIn('journal_id', req.query.journal)
		.then(function(activity_items){
			
			if(req.query.group === '1'){
				return res.json({
					activity_items : _.groupBy(activity_items, 'journal_id')
				});	
			
			}else{
				return res.json({
					activity_items : activity_items
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
	
	app.get('/user/:user_id/journal/:journal_id/activity', middleware.checkJWTToken, function(req, res){
		models.ActivityItems.query().where({user_id: req.params.user_id, journal_id: req.params.journal_id})
		.then(function(activity_items){
			return res.json({
				activity_items :activity_items
			})
		})
		.catch(function(bs_err){
			console.log(bs_err);
			return res.status(500).json({
				error: 'mysql error'
			});
		});
	});
	
	app.post('/user/:user_id/journal/:journal_id/activity', middleware.checkJWTToken, function(req, res){
		
		if(isNaN(parseInt(req.params.user_id)) || isNaN(parseInt(req.params.journal_id))){
			return res.status(400).json({
				error: 'invalid URL parameter'
			});
		}
		
		checkit.ActivityItemRules.run(req.body)
		.then(function(validatedData){
			
			models.ActivityItem.forge({
				user_id: req.params.user_id,
				journal_id: req.params.journal_id,
				activity_name: validatedData.activity_name,
				activity_type: validatedData.activity_type,
				calories_burnt: validatedData.calories_burnt,
				duration: validatedData.duration
			}).save()
			.then(function(newActivityItem){
				return res.json({
					activity_item: newActivityItem
				});
			})
			.catch(function(bs_err){
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