# users/views.py
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response

from .serializers import (
    ChangePasswordSerializer,
    ChangeUsernameSerializer,
    AdminCreateSerializer,
)


class ChangePasswordView(generics.GenericAPIView):
    """
    Change password for the currently authenticated user.
    """
    serializer_class = ChangePasswordSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"detail": "Password changed successfully."},
                status=status.HTTP_200_OK,
            )

        return Response(
            {
                "detail": "Failed to change password.",
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


class ChangeUsernameView(generics.GenericAPIView):
    """
    Change username for the currently authenticated user.
    """
    serializer_class = ChangeUsernameSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "detail": "Username updated successfully.",
                    "username": request.user.username,
                },
                status=status.HTTP_200_OK,
            )

        return Response(
            {
                "detail": "Failed to update username.",
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


class AdminCreateView(generics.GenericAPIView):
    """
    Create another admin user (is_staff + is_superuser).
    """
    serializer_class = AdminCreateSerializer
    permission_classes = [IsAdminUser]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {
                    "detail": "Admin user created successfully.",
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(
            {
                "detail": "Failed to create admin user.",
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )
