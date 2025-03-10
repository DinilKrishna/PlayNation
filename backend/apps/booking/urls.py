from django.urls import path
from .views import CreateBookingView, CancelBookingView

urlpatterns = [
    path("create/", CreateBookingView.as_view(), name="create-booking"),
    path("cancel/<int:booking_id>/", CancelBookingView.as_view(), name="cancel-booking"),
]
