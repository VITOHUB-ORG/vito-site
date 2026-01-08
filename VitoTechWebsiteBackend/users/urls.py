# users/urls.py
from django.urls import path

from .views import ChangePasswordView, ChangeUsernameView, AdminCreateView

urlpatterns = [
    path("change-password/", ChangePasswordView.as_view(), name="change-password"),
    path("change-username/", ChangeUsernameView.as_view(), name="change-username"),
    path("create-admin/", AdminCreateView.as_view(), name="create-admin"),
]
