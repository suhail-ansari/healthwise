module.exports = function(app){
	
	var jwt = app.locals.jwt;
	
	function checkJWTToken(req, res, next){
		
		var token = req.query.token?req.query.token:req.body.token;
		var user_id = req.params.user_id;
		
		if(!token){
			return res.status(403).json({
				error: 'token required'
			});
		}
		
		if(!user_id){
			return res.status(400).json({
				error: 'invalid request parameters'
			});
		}
		
		jwt.verify(token, app.locals.jwtSecret, function(jwt_err, decoded_jwt){
			if(jwt_err){
				return res.status(403).json({
					error: 'invalid token'
				});
			}
			
			var now = parseInt((new Date()).getTime()/1000);
			
			if(now > decoded_jwt.exp){
				return res.status(403).json({
					error: 'expired token'
				});
			}
			
			if(user_id == decoded_jwt.user_id){
				return next();
			}
			
			return res.status(403).json({
				error: 'unauthorized request'
			});
			
		});
	}
	
	return {
		checkJWTToken: checkJWTToken
	}
}