var config = require('./config');

var express = require('express');
var app = express();

app.locals._ = require('underscore');
app.locals.models = require('./models');
app.locals.checkit = require('./validate');
app.locals.bcrypt = require('bcryptjs');
app.locals.jwt = require('jsonwebtoken');
app.locals.jwtSecret = config.app.jwtSecret;
app.locals.jwtExpireMinutes = config.app.jwtExpireMinutes;
app.locals.jwtExpireSeconds = config.app.jwtExpireSeconds;
app.locals.middleware = require('./middlewares')(app);

require('./routes')(app);

var server = new (require('http')).Server(app);

server.listen(config.app.port, function(err){
	if(err){
		return process.exit(new Error('error while starting server @port 8080'));
	}
	console.log('server listening @port ', config.app.port);
});
