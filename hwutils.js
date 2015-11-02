/*
	input: (weight in kgs), (height in cms), (sex - m/f), (age in years)
	output: BMR-Female = 655 + (9.6*w) + (1.8*h) - (4.7*age)
			BMR-Male = 66 + (13.7*w) + (5*h) - (6.8*age)
	
	input: (BMR), (activity_level)
	output: calories-requirement-weight-management = CRW
				sedentary (little/no exercise): 1.2*BMR
				lightly active (light exercise/sports 1-3 days/week): 1.375*BMR
				moderately active (moderate exercise/sports 3-5 days/week): 1.55*BMR
				Very Active (hard exercise/ sports 6-7 days/week): 1.725*BMR
				Extra Active (very hard exercise & physical job): 1.9*BMR
	
	calculate input/(deafult = 30 mins walking per week) exercise per day in calories burnt using MET table = CREP
	
	calculate the average weight loss/week from the goal_time and goal_weight = GWPW
	
	0.453kg = 3500cal	
	recommended calorie deficit per week = (3500/0.453)*GWPW = RCDW
	
	recommended calories deficit per day = RCDW/7 = RCDD
	
	calorie intake recommended  = (CRW + CREP) - RCDD = CIR
	
	calories range
		lower range = CRW - RCDD
		higher range = CIR
		
*/
var moment = require('moment');

function calculate_bmr(weight, height, gender, age) {
	switch(gender){
		case 'M':
			return (66 + (13.7*weight) + (5*height) + (6.8*age));
		
		case 'F': 
			return (655 + (9.6*weight) + (1.8*height) + (4.7*age));
	}
}

function calorie_requirement_wo_exercise(_bmr, activity_level) {
	switch(activity_level){
		case 'SD':
			return (1.2*_bmr);
			
		case 'LA':
			return (1.375*_bmr);
		
		case 'MA':
			return (1.55*_bmr);
			
		case 'VA':
			return (1.725*_bmr);
			
		case 'EA':
			return (1.9*_bmr);		
	}
}

function calorie_deficit_per_day(current_date, goal_date, current_weight, goal_weight) {
	
	var days_till_goal_date =  Math.floor(( Date.parse(goal_date) - Date.parse(current_date) ) / 86400000);
	var weight_diff = (current_weight - goal_weight);
	
	console.log([days_till_goal_date, weight_diff]);
	
	var total_calorie_loss_till_goal_date = (weight_diff/days_till_goal_date)*(3500/0.453);
	
	return total_calorie_loss_till_goal_date;
}

function calorie_range(height, gender, age, activity_level, current_date, goal_date, current_weight, goal_weight, daily_exercise) {
	console.log(arguments);
	daily_exercise = daily_exercise?daily_exercise:0;
	
	var bmr = calculate_bmr(current_weight, height, gender, age);
	var daily_calories = calorie_requirement_wo_exercise(bmr, activity_level);
	var deficit = calorie_deficit_per_day(current_date, goal_date, current_weight, goal_weight, daily_exercise);
	
	console.log([bmr, daily_calories, deficit]);
	
	return {
		lower: (daily_calories - deficit),
		upper: (daily_calories + daily_exercise - deficit)
	}
}

module.exports = {
	calorie_range: calorie_range
}