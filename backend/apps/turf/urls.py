from django.urls import path
from .views import AddTurfView, UpdateTurfView

urlpatterns = [
    path("add/", AddTurfView.as_view(), name="add-turf"),
    path("update/<int:turf_id>/", UpdateTurfView.as_view(), name="update-turf"),
]
