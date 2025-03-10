from rest_framework.generics import CreateAPIView, UpdateAPIView
from rest_framework.permissions import IsAdminUser
from .models import Turf
from .serializers import TurfSerializer

class AddTurfView(CreateAPIView):
    queryset = Turf.objects.all()
    serializer_class = TurfSerializer
    permission_classes = [IsAdminUser]

class UpdateTurfView(UpdateAPIView):
    queryset = Turf.objects.all()
    serializer_class = TurfSerializer
    lookup_field = "id"
    permission_classes = [IsAdminUser]
