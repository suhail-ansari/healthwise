var Checkit = require('checkit');

var UserRules = new Checkit({
	email: ['required', 'email'],
	password: 'required' 
});

var UserPasswordChangeRules = new Checkit({
	email: ['required', 'email'],
	old_password: 'required',
	new_password: 'required'
})

var UserReloginRules = new Checkit({
	email: ['required', 'email'],
	token: 'required'
});


/**
 * id                | int(11)     | NO   | PRI | NULL              | auto_increment              |
| fullname          | varchar(50) | NO   |     | NULL              |                             |
| age               | int(11)     | NO   |     | NULL              |                             |
| gender            | varchar(1)  | NO   |     | NULL              |                             |
| height            | int(11)     | NO   |     | NULL              |                             |
| activity_level    | varchar(2)  | NO   |     | NULL              |                             |
| starting_weight   | double(4,3) | NO   |     | NULL              |                             |
| goal_weight       | double(4,3) | NO   |     | NULL              |                             |
| goal_time         | date        | NO   |     | NULL              |                             |
| meal_preferences  | text        | NO   |     | NULL              |                             |
| health_conditions | text        | NO   |     | NULL              |                             |
| user_id           | int(11)     | NO   | MUL | NULL              |                             |
| created_at        | timestamp   | NO   |     | CURRENT_TIMESTAMP |                             |
| updated_at
 */
var NewProfileRules = new Checkit({
	firstname:  ['required', 'alpha'],
	lastname:  ['required', 'alpha'],
	age: ['required', function(val){
		var intVal = parseInt(val);
		
		if(!intVal){
			throw new Error('invalid age paramater');
		}
		
		if(intVal <= 10 || intVal > 110){
			throw new Error('invalid age range');
		}
	}],
	gender: ['required', function(val){
		if(['M', 'F'].indexOf(val) == -1){
			throw new Error('invalid gender');
		}
	}],
	height: ['required', function(val){
		var intVal = parseInt(val);
		
		if(intVal > 300){
			throw new Error('invalid height')
		}
		
	}],
	activity_level: ['required', function(val){
		if(['SD', 'LA', 'MA', 'VA', 'EA'].indexOf(val) == -1){
			throw new Error('invalid activity level value');
		}
	}],
	starting_weight: ['required', function(val){
		var intVal = parseInt(val);
		
		if(!intVal){
			throw new Error('invalid starting weight value');
		}
		
		if(intVal < 0){
			throw new Error('invalid starting weight value');
		}
	}],
	goal_weight: ['required', function(val){
		var intVal = parseInt(val);
		
		if(!intVal){
			throw new Error('invalid goal weight value');
		}
		
		if(intVal < 0){
			throw new Error('invalid goal weight value');
		}
	}],
	goal_time: ['required', function(val){
		var goal_date = new Date(parseInt(val));
		
		if(!goal_date){
			throw new Error('invalid goal date');
		}
		
	}],
	meal_preferences: 'required',
});

var UpdateProfileRules = new Checkit({
	firstname: ['alpha'],
	lastname: ['alpha'],
	age: [function(val){
		var intVal = parseInt(val);
		
		if(!intVal){
			throw new Error('invalid age paramater');
		}
		
		if(intVal <= 10 || intVal > 110){
			throw new Error('invalid age range');
		}
	}],
	gender: [function(val){
		if(['M', 'F'].indexOf(val) == -1){
			throw new Error('invalid gender');
		}
	}],
	height: [function(val){
		var intVal = parseInt(val);
		
		if(intVal > 300){
			throw new Error('invalid height')
		}
		
	}],
	activity_level: [function(val){
		if(['SD', 'LA', 'MA', 'VA', 'EA'].indexOf(val) == -1){
			throw new Error('invalid activity level value');
		}
	}],
	starting_weight: [function(val){
		var intVal = parseInt(val);
		
		if(!intVal){
			throw new Error('invalid starting weight value');
		}
		
		if(intVal < 0){
			throw new Error('invalid starting weight value');
		}
	}],
	goal_weight: [function(val){
		var intVal = parseInt(val);
		
		if(!intVal){
			throw new Error('invalid goal weight value');
		}
		
		if(intVal < 0){
			throw new Error('invalid goal weight value');
		}
	}],
	goal_time: [function(val){
		var goal_date = new Date(parseInt(val));
		
		if(!goal_date){
			throw new Error('invalid goal date');
		}
		
	}],
})

var JournalDateRules = new Checkit({
	journal_date: ['required', function(val){
		var parsedDate = val.split('-');
		
		if(parsedDate.length != 3){
			throw new Error('invalid date. use format yyyy-mm-dd');
		}
		
		var year = parseInt(parsedDate[0]);
		var month = parseInt(parsedDate[1]);
		var day = parseInt(parsedDate[2]);
		
		if(isNaN(year) || (year < 2000 || year > 2050)){
			throw new Error('invalid date: year');
		}
		
		if(isNaN(month) || (month < 1 || month > 12)){
			throw new Error('invalid date: month');
		}
		
		if(isNaN(day) || (day < 1 || day > 31)){
			throw new Error('invalid date: day');
		}	
	}]
}); 


/**
 * id            | int(11)      | NO   | PRI | NULL              | auto_increment              |
| food_name     | varchar(100) | NO   |     | NULL              |                             |
| meal_type     | varchar(1)   | NO   |     | NULL              |                             |
| calories      | double       | NO   |     | NULL              |                             |
| carbohydrates | double       | NO   |     | -1                |                             |
| proteins      | double       | NO   |     | -1                |                             |
| sodium        | double       | NO   |     | -1                |                             |
| cholestrol    | double       | NO   |     | -1                |                             |
| portion_size  | double       | NO   |     | -1                |                             |
| postassium    | double       | NO   |     | -1                |                             |
| fats          | double       | NO   |     | -1                |                             |
| journal_id    | int(11)      | NO   | MUL | NULL              |                             |
| user_id       | int(11)      | NO   | MUL | NULL              |                             |
| created_at    | timestamp    | NO   |     | CURRENT_TIMESTAMP |                             |
| updated_at    | timestamp    | NO   |     | CURRENT_TIMESTAMP | on update CURRENT_TIMESTAMP
 */

var FoodItemRules = new Checkit({
	food_name: ['required'],
	meal_type: ['required', function(val){
		if(['L', 'B', 'S', 'D'].indexOf(val) == -1){
			throw new Error('invalid meal_type');
		}
	}],
	calories: ['required', function(val){
		if(isNaN(parseFloat(val)))
			throw new Error('invalid calories value');
	}],
	carbohydrates: ['required', function(val){
		if(isNaN(parseFloat(val)))
			throw new Error('invalid calories value');
	}],
	proteins: ['required', function(val){
		if(isNaN(parseFloat(val)))
			throw new Error('invalid calories value');
	}],
	sodium: ['required', function(val){
		if(isNaN(parseFloat(val)))
			throw new Error('invalid calories value');
	}],
	cholesterol: ['required', function(val){
		if(isNaN(parseFloat(val)))
			throw new Error('invalid calories value');
	}],
	portion_size: ['required', function(val){
		if(isNaN(parseFloat(val)))
			throw new Error('invalid calories value');
	}],
	potassium: ['required', function(val){
		if(isNaN(parseFloat(val)))
			throw new Error('invalid calories value');
	}],
	fats: ['required', function(val){
		if(isNaN(parseFloat(val)))
			throw new Error('invalid calories value');
	}]
});

/**
 * id             | int(11)      | NO   | PRI | NULL              | auto_increment              |
| activity_name  | varchar(100) | NO   |     | NULL              |                             |
| activity_type  | varchar(1)   | NO   |     | NULL              |                             |
| calories_burnt | double       | NO   |     | NULL              |                             |
| duration       | double       | NO   |     | NULL              |                             |
| journal_id     | int(11)      | NO   | MUL | NULL              |                             |
| user_id        | int(11)      | NO   | MUL | NULL              |                             |
| created_at     | timestamp    | NO   |     | CURRENT_TIMESTAMP |                             |
| updated_at     |
 */
 
 var ActivityItemRules = new Checkit({
	activity_name: ['required'],
	activity_type: ['required', function(val){
		if(['C', 'S'].indexOf(val) == -1){
			throw new Error('invalid activity_type');
		}
	}],
	calories_burnt: ['required', function(val){
		if(isNaN(parseFloat(val)))
			throw new Error('invalid calories value');
	}],
	duration: ['required', function(val){
		if(isNaN(parseFloat(val)))
			throw new Error('invalid duration value');
	}]
 });

module.exports = {
	UserRules: UserRules,
	UserReloginRules: UserReloginRules,
	UserPasswordChangeRules: UserPasswordChangeRules,
	NewProfileRules: NewProfileRules,
	UpdateProfileRules: UpdateProfileRules,
	JournalDateRules: JournalDateRules,
	FoodItemRules: FoodItemRules,
	ActivityItemRules: ActivityItemRules
}