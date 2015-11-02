__author__ = 'suhailansari'

from django.db import models


#created_at = models.DateTimeField(auto_now_add=True)
#updated_at = models.DateTimeField(auto_now=True)

class HwUser(models.Model):
    email = models.CharField(max_length=50, null=False)
    password = models.CharField(max_length=100, null=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return ''.join([self.email, str(self.id)])

class HwProfile(models.Model):
    gender_choices = (
        ('M', 'Male'),
        ('F', 'Female')
    )

    activity_level_choices = (
        ('SD', 'Sedentary'),
        ('LA', 'Lightly Active'),
        ('MA', 'Moderately Active'),
        ('VA', 'Very Active'),
        ('EA', 'Extra Active'),
    )

    firstname = models.CharField(max_length=50)
    lastname = models.CharField(max_length=50)
    age = models.IntegerField()
    gender = models.CharField(max_length=1, choices=gender_choices)
    height = models.IntegerField()
    activity_level = models.CharField(max_length=2, choices=activity_level_choices)
    daily_exercise = models.FloatField(default=0, blank=True),
    starting_weight = models.FloatField()
    goal_weight = models.FloatField()
    goal_time = models.DateField()
    meal_preferences = models.CharField(max_length=120)
    health_conditions = models.CharField(max_length=120, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    user = models.ForeignKey(HwUser)

    def __unicode__(self):
        return '%s %s, ProfileID: %i, UserID: %i'%(self.firstname, self.lastname, self.id, self.user_id)


class HwJournal(models.Model):
    journal_date = models.DateField()
    current_weight = models.FloatField()
    recommended_calorie_intake = models.FloatField()
    recommended_calorie_to_burn = models.FloatField()
    user = models.ForeignKey(HwUser)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def __unicode__(self):
        return '%s, JournalID: %i, UserID: %i'%(str(self.journal_date), self.id, self.user_id)

class HwFoodItem(models.Model):
    meal_type_choices = (
        ('B', 'Breakfast'),
        ('L', 'Lunch'),
        ('D', 'Dinner'),
        ('S', 'Snack')
    )

    food_name = models.CharField(max_length=100)
    meal_type = models.CharField(max_length=1, choices=meal_type_choices)
    calories = models.FloatField()
    carbohydrates = models.FloatField(default=-1)
    proteins = models.FloatField(default=-1)
    sodium = models.FloatField(default=-1)
    cholesterol = models.FloatField(default=-1)
    portion_size = models.FloatField(default=-1)
    potassium = models.FloatField(default=-1)
    fats = models.FloatField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    journal = models.ForeignKey(HwJournal)
    user = models.ForeignKey(HwUser)

    def __unicode__(self):
        return '%s, FoodID: %i, UserID: %i, JournalID: %i'%(self.food_name, self.id, self.user_id, self.journal_id)

class HwActivityItem(models.Model):

    activity_type_choices = (
        ('C', 'Custom'),
        ('S', 'Standard')
    )

    activity_name = models.CharField(max_length=100)
    activity_type = models.CharField(max_length=1, choices=activity_type_choices)
    calories_burnt = models.FloatField()
    duration = models.FloatField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    journal = models.ForeignKey(HwJournal)
    user = models.ForeignKey(HwUser)

    def __unicode__(self):
        return '%s, ActivityID: %i, UserID: %i, JournalID: %i'%(self.activity_name, self.id, self.user_id, self.journal_id)

class HwUserSubmittedFood(models.Model):
    meal_type_choices = (
        ('B', 'Breakfast'),
        ('L', 'Lunch'),
        ('D', 'Dinner'),
        ('S', 'Snack')
    )

    food_name = models.CharField(max_length=100)
    meal_type = models.CharField(max_length=1, choices=meal_type_choices, blank=True)
    calories = models.FloatField(blank=True)
    carbohydrates = models.FloatField(default=-1, blank=True)
    proteins = models.FloatField(default=-1, blank=True)
    sodium = models.FloatField(default=-1, blank=True)
    cholesterol = models.FloatField(default=-1, blank=True)
    portion_size = models.FloatField(default=-1, blank=True)
    potassium = models.FloatField(default=-1, blank=True)
    fats = models.FloatField(default=-1, blank=True)
    approved = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return '%s, FoodID: %i, UserID: %i, JournalID: %i'%(self.food_name, self.id, self.user_id, self.journal_id)

    def save(self, *args, **kwargs):
        print self.approved
        if self.approved == True and self.id != None:
            approved_food_item = HwFoodItem()
            approved_food_item.food_name = self.food_name
            approved_food_item.meal_type = self.meal_type
            approved_food_item.calories = self.calories
            approved_food_item.carbohydrates = self.carbohydrates
            approved_food_item.proteins = self.proteins
            approved_food_item.sodium = self.sodium
            approved_food_item.cholesterol = self.cholesterol
            approved_food_item.portion_size = self.portion_size
            approved_food_item.potassium = self.potassium
            approved_food_item.fats = self.fats

            approved_food_item.journal_id = self.journal_id
            approved_food_item.user_id = self.user_id

            approved_food_item.save()

        super(self.__class__, self).save(*args, **kwargs)


    journal = models.ForeignKey(HwJournal)
    user = models.ForeignKey(HwUser)
