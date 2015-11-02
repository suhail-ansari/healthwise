module.exports = function(app){
	
	var _ = app.locals._;
	var models = app.locals.models;
	var checkit = app.locals.checkit;
	var bcrypt = app.locals.bcrypt;
	var jwt = app.locals.jwt;
	var middleware = app.locals.middleware;
	
	app.get('/user/:user_id', middleware.checkJWTToken, function(req, res){
		models.User.forge({id: req.params.user_id}).fetch()
		.then(function(user){
			return res.json({
				user: user.omit('password')
			})
		})
		.catch(function(){
			return res.status(500).json({
				error: 'mysql error'
			});
		})
	});
	
	app.post('/user/:user_id', middleware.checkJWTToken, function(req, res){
		checkit.UserPasswordChangeRules.run(req.body)
		.then(function(validatedData){
			models.User.forge({id: req.params.user_id}).fetch()
			.then(function(user){
				bcrypt.compare(validatedData.old_password, user.get('password'), function(bcrypt_err, bcrypt_res){
					if(bcrypt_err){
						return res.status(500).json({
							error: 'hash error'
						});
					}
					
					if(!bcrypt_res){
						return res.status(403).json({
							error: 'wrong or invalid password'
						});
					}
					
					bcrypt.hash(validatedData.new_password, 10, function(bcrypt_err2, passwordHash){
						if(bcrypt_err2){
							return res.status(500).json({
								error: 'hash error'
							});
						}
						
						user.set('password', passwordHash).save()
						.then(function(updated_user){
							return res.json({
								user: updated_user.omit('password')
							})
						})
						.catch(function(bs_err2){
							return res.status(500).json({
								error: 'mysql error'
							});
						});
					});
					
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