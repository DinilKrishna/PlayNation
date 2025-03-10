from django.db import models
from apps.user.models import UserProfile
from apps.turf.models import Turf

class Booking(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    turf = models.ForeignKey(Turf, on_delete=models.CASCADE)
    date = models.DateField()
    time_slot = models.CharField(max_length=50)
    status = models.CharField(max_length=20, choices=[("confirmed", "Confirmed"), ("cancelled", "Cancelled")], default="confirmed")

    def __str__(self):
        return f"{self.user.email} - {self.turf.name} - {self.date}"
