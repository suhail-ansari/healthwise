var config = require('./config');

var knex = require('knex')({
  client: 'mysql',
  connection: config.mysql
});

var moment = require('moment');

var bookshelf = require('bookshelf')(knex);
bookshelf.plugin('registry');

var FoodItem = bookshelf.model('FoodItem', {
  tableName: 'hwadmin_hwfooditem',
  hasTimestamps: ['created_at', 'updated_at'],
  user: function(){
    return this.belongsTo('User', 'user_id');
  },
  journal: function(){
    return this.belongsTo('Journal', 'journal_id');
  }
});

var UserSubmittedFoodItem = bookshelf.model('UserSubmittedFoodItem', {
  tableName: 'hwadmin_hwusersubmittedfood',
  hasTimestamps: ['created_at', 'updated_at'],
  user: function(){
    return this.belongsTo('User', 'user_id');
  },
  journal: function(){
    return this.belongsTo('Journal', 'journal_id');
  }
});

var FoodItems = bookshelf.Collection.extend({
  model: FoodItem
});

var ActivityItem = bookshelf.model('ActivityItem', {
  tableName: 'hwadmin_hwactivityitem',
  hasTimestamps: ['created_at', 'updated_at'],
  user: function(){
    return this.belogsTo('User', 'user_id');
  },
  journal: function(){
    return this.belongsTo('Journal', 'journal_id');
  }
});

var ActivityItems = bookshelf.Collection.extend({
  model: ActivityItem
});

var Journal = bookshelf.model('Journal', {
  tableName: 'hwadmin_hwjournal',
  hasTimestamps: ['created_at', 'updated_at'],
  food_items: function(){
    return this.hasMany('FoodItem', 'journal_id');
  },
  activity_items: function(){
    return this.hasMany('ActivityItem', 'journal_id');
  },
  user: function(){
    return this.belogsTo('User', 'user_id');
  },
  total_intake_calories: function(){
    return bookshelf.knex('hwadmin_hwfooditem').sum('calories').where({journal_id: this.id});
  },
  total_burnt_calories: function(){
    return bookshelf.knex('hwadmin_hwactivityitem').sum('calories_burnt').where({journal_id: this.id});
  }
});

var Profile = bookshelf.model('Profile', {
  tableName: 'hwadmin_hwprofile',
  hasTimestamps: ['created_at', 'updated_at'],
  user: function(){
    return this.belongsTo('User', 'user_id');
  }
});

var User = bookshelf.model('User', {
	tableName: 'hwadmin_hwuser',
  hasTimestamps: ['created_at', 'updated_at'],
	profile: function(){
		return this.hasOne('Profile', 'user_id');
	},

  journals: function(){
    return this.hasMany('Journal', 'user_id')
  },

  food_items: function(){
    return this.hasMany('FoodItem', 'user_id')
  },

  activity_items: function(){
    return this.hasMany('ActivityItem', 'user_id');
  },
  journals_between: function(lower, upper){
    return bookshelf.knex('hwadmin_hwjournal')
    .select()
    .whereBetween('journal_date',[ lower, upper])
    .andWhere('user_id', '=', this.id);
  },
  journal_latest: function(){
    return bookshelf.knex('hwadmin_hwjournal')
    .select()
    .where('user_id', '=', this.id)
    .orderBy('journal_date', 'desc')
    .limit(1)
  }
});

module.exports = {
	User: User,
	Profile: Profile,
  Journal: Journal,
  FoodItem: FoodItem,
  ActivityItem: ActivityItem,
  bookshelf: bookshelf,
  FoodItems: FoodItems,
  ActivityItems: ActivityItems,
  UserSubmittedFoodItem: UserSubmittedFoodItem
}

//models.User.forge({}).fetch({withRelated: ['food_items', 'journals']})
