module.exports = function(app){
	
	var _ = app.locals._;
	var models = app.locals.models;
	var checkit = app.locals.checkit;
	var bcrypt = app.locals.bcrypt;
	var jwt = app.locals.jwt;
	
	app.post('/sign-up', function(req, res){
		
		models.User.forge({email: req.body.email}).fetch()
		.then(function(user){
			if(user){
				return res.status(400).json({
					error: 'user already exists'
				});
			}
			
			checkit.UserRules.run(req.body)
			.then(function(validatedData){
				bcrypt.hash(validatedData.password, 10, function(bcrypt_err, passwordHash){
					
					if(bcrypt_err){
						return res.status(500).json({
							error: 'unable to create password hash'
						});
					}
					
					models.User.forge({email: validatedData.email, password: passwordHash}).save()
					.then(function(user){
						return res.json(user.omit('password'));
					})
					.catch(function(bs_err){
						console.log('bs_err', bs_err);
						return res.status(500).json({
							error: 'unable to create user'
						});
					});
				});
			})
			.catch(function(err){
				return res.status(400).json({
					error: checkit_err.toJSON()
				});
			});
		})
		.catch(function(err){
			return res.status(500).json({
				error: 'mysql error'
			});
		});
	});
	
	app.post('/login', function(req, res){
		
		checkit.UserRules.run(req.body)
		.then(function(validatedData){
			models.User.forge({email: validatedData.email}).fetch()
			.then(function(user){
				if(!user){
					return res.status(400).json({
						error: 'user doesn not exist'
					});
				}
				console.log('fetch', user);
				bcrypt.compare(validatedData.password, user.get('password'), function(bcrypt_err, bcrypt_res){
					if(bcrypt_err){
						return res.status(500).json({
							error: 'hash error'
						});
					}
					
					if(bcrypt_res){
						var token = jwt.sign({user_id: user.get('id')}, app.locals.jwtSecret, {expiresInMinutes: app.locals.jwtExpireMinutes});
						return res.json({
							user: user.omit('password'),
							token: token
						});
					}
					
					return res.status(403).json({
						error: 'wrong/invalid password'
					});
				});
				
			})
			.catch(function(bs_err){
				return res.status(500).json({
					error: 'mysql error'
				});
			});
		})
		.catch(function(checkit_err){
			return res.status(400).json({
				error: checkit_err.toJSON()
			});
		});
	});
	
	app.post('/relogin', function(req, res){
		
		checkit.UserReloginRules.run(req.body)
		.then(function(validatedData){
			var token = validatedData.token;
			
			jwt.verify(token, app.locals.jwtSecret, function(jwt_err, decoded_jwt){
				if(jwt_err){
					return res.status(403).json({
						error: 'invalid token'
					});
				}
				
				var user_id = decoded_jwt.user_id;
				var token_expiry = decoded_jwt.exp;
				var now = parseInt((new Date()).getTime()/1000);
				
				if(now > token_expiry){
					return res.status(403).json({
						error: 'expired token'
					});
				}
				
				models.User.forge({id: user_id, email: validatedData.email}).fetch()
				.then(function(user){
					if(!user){
						return res.status(403).json({
							error: 'invalid email or token'
						});
					}
					
					var token = jwt.sign({user_id: user.get('id')}, app.locals.jwtSecret, {expiresInMinutes: app.locals.jwtExpireMinutes});
					return res.json({
						user: user.omit('password'),
						token: token
					});
					
				})
				.catch(function(bs_err){
					return res.status(500).json({
						error: 'mysql error'
					})
				});
			});
		})
		.catch(function(checkit_err){
			return res.status(400).json({
				error: checkit_err.toJSON()
			});
		});
	});
	
}