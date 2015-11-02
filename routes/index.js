module.exports = function(app){
	
	var bodyParser = require('body-parser');
	
	app.use(bodyParser.urlencoded());
	app.use(bodyParser.json());
	
	require('./login-routes')(app);
	require('./user-routes')(app);
	require('./profile-routes')(app);
	require('./food-routes')(app);
	require('./activity-routes')(app);
	require('./journal-routes')(app);
	
}