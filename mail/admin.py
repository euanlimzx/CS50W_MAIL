from django.contrib import admin

from mail.models import Email, User
# Register your models

admin.register(User)
admin.register(Email)