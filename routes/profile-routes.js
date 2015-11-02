module.exports = function(app){
	
	var models = app.locals.models;
	var checkit = app.locals.checkit;
	var middleware = app.locals.middleware;
	
	app.get('/user/:user_id/profile', middleware.checkJWTToken, function(req, res){
		models.Profile.forge({user_id: req.params.user_id}).fetch()
		.then(function(profile){
			if(!profile){
				res.json({
					error: 'profile does not exist'
				})
			}
			
			return res.json({
				profile: profile.toJSON()
			});
			
		})
		.catch(function(bs_err){
			return res.status(500).json({
				error: 'mysql error'
			});
		});
	});
	
	app.post('/user/:user_id/profile', middleware.checkJWTToken, function(req, res){
		
		models.Profile.forge({user_id: req.params.user_id}).fetch()
		.then(function(profile){
			if(profile){
				return res.status(400).json({
					error: 'profile already exists'
				});
			}
			
			checkit.NewProfileRules.run(req.body)
			.then(function(validatedData){
				validatedData.user_id = req.params.user_id;
				validatedData.goal_time = new Date(parseInt(validatedData.goal_time)*1000);
				models.Profile.forge(validatedData).save()
				.then(function(profile){
					return res.json({profile: profile.toJSON()});
				})
				.catch(function(bs_err2){
					console.log(bs_err2);
					return res.status(500).json({
						error: 'mysql error'
					});
				})
			})
			.catch(function(checkit_err){
				console.log(checkit_err);
				return res.status(400).json({
					error: checkit_err.toJSON()
				})
			});	
		})
		.catch(function(bs_err){
			return res.status(500).json({
				error: 'mysql error'
			});
		});
	});
	
	app.put('/user/:user_id/profile', middleware.checkJWTToken, function(req, res){
		models.Profile.forge({user_id: req.params.user_id}).fetch()
		.then(function(profile){
			if(!profile){
				return res.status(400).json({
					error: 'profile does not exist'
				});
			}
			
			checkit.UpdateProfileRules.run(req.body)
			.then(function(validatedData){
				console.log(validatedData);
				if(validatedData.goal_time){
					validatedData.goal_time = new Date(parseInt(validatedData.goal_time)*1000);
				}
				profile.set(validatedData).save()
				.then(function(updated_profile){
					return res.json({profile: updated_profile.toJSON()});
				})
				.catch(function(bs_err2){
					throw bs_err2;
					return res.status(500).json({
						error: 'mysql error'
					});
				})
			})
			.catch(function(checkit_err){
				return res.status(400).json({
					error: checkit_err.toJSON()
				})
			});
		})
		.catch(function(bs_err){
			throw bs_err;
			return res.status(500).json({
				error: 'mysql error'
			});
		});
	});
}