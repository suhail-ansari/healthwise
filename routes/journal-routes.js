module.exports = function(app){
	
	var models = app.locals.models;
	var checkit = app.locals.checkit;
	var middleware = app.locals.middleware;
	var hwutils = require('../hwutils');
	
	app.get('/user/:user_id/journal/:from_date/:to_date', middleware.checkJWTToken, function(req, res){
		models.bookshelf.knex('hwadmin_hwjournal').where('user_id', '=', req.params.user_id).whereBetween('journal_date', [req.params.from_date, req.params.to_date])
		.then(function(journals){
			return res.json({
				journals: journals
			})
		})
		.catch(function(bs_err){
			return res.status(500).json({
				error:'mysql error'
			});
		});
	});
	
	app.get('/user/:user_id/journal/:journal_date', middleware.checkJWTToken, function(req, res){
		var query = models.Journal.forge({user_id: req.params.user_id, journal_date:req.params.journal_date})
		
		var relation = [];
		(req.query.food == '1')?relation.push('food_items'):true;
		(req.query.activity == '1')?relation.push('activity_items'):true;
		
		((relation.length > 0)?(query.fetch({withRelated:relation})):(query.fetch()))
		.then(function(journal){
			
			if(!journal){
				return res.status(400).json({
					error: 'journal does not exist'
				});
			}
			
			return res.json({
				journal: journal.toJSON()
			});
		})
		.catch(function(bs_err){
			return res.status(500).json({
				error:'mysql error'
			});
		});
	});
	
	app.post('/user/:user_id/journal/:journal_date', middleware.checkJWTToken, function(req, res){
		
		checkit.JournalDateRules.run({journal_date: req.params.journal_date})
		.then(function(validatedData){
			
			models.User.forge({id: req.params.user_id}).fetch({withRelated: ['profile']})
			.then(function(user){
				user.journal_latest()
				.then(function(journal){
					
					
					var profile = user.related('profile');
					
					var current_weight;
					
					if(journal.length == 1){
						journal = journal[0];
						current_weight = journal.current_weight;
					}else{
						journal = null;
						current_weight = profile.get('starting_weight');
					}
					
					var range = hwutils.calorie_range(
						profile.get('height'), 
						profile.get('gender'), 
						profile.get('age'), 
						profile.get('activity_level'), 
						req.params.journal_date, 
						profile.get('goal_time'), 
						current_weight,
						profile.get('goal_weight'), 
						profile.get('daily_exercise'));
					
					models.Journal.forge({
						user_id: req.params.user_id,
						journal_date: req.params.journal_date,
						current_weight: journal?journal.current_weight:profile.get('starting_weight'),
						recommended_calorie_intake: range.lower.toFixed(2),
						recommended_calorie_to_burn: range.upper.toFixed(2)
					}).save()
					.then(function(newJournal){
						return res.json({
							journal: newJournal.toJSON()
						});
					})
					.catch(function(bs_err2){
						console.log(bs_err2);
						return res.status(500).json({
							error:'mysql error'
						});
					})
				})
				.catch(function(knex_err){
					console.log(knex_err);
					return res.status(500).json({
						error:'mysql error'
					});
				});
			})
			.catch(function(bs_err){
				console.log(bs_err);
				return res.status(500).json({
					error:'mysql error'
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