__author__ = 'suhailansari'

from django.contrib import admin

from models import HwUser, HwProfile, HwJournal, HwActivityItem, HwFoodItem, HwUserSubmittedFood

admin.site.register(HwUser)
admin.site.register(HwProfile)
admin.site.register(HwJournal)
admin.site.register(HwActivityItem)
admin.site.register(HwFoodItem)
admin.site.register(HwUserSubmittedFood)

