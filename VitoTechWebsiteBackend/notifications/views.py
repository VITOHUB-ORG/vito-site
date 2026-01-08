# notifications/views.py
from __future__ import annotations

from django.db import models
from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response

from .models import Notification
from .serializers import NotificationSerializer
from .emails import send_admin_notification_email, send_user_ack_email


class NotificationViewSet(viewsets.ModelViewSet):
    """
    Contact messages API.

    Public:
      - POST /api/notifications/             -> create (website contact form)

    Admin (JWT + is_staff):
      - GET  /api/notifications/             -> list
      - GET  /api/notifications/{id}/        -> retrieve
      - PATCH/PUT /api/notifications/{id}/   -> update
      - DELETE /api/notifications/{id}/      -> delete
      - POST /api/notifications/{id}/mark_read/
      - POST /api/notifications/{id}/mark_unread/
      - GET  /api/notifications/stats/       -> total, read, unread
    """

    queryset = Notification.objects.all().order_by("-created_at")
    serializer_class = NotificationSerializer
    parser_classes = [MultiPartParser, FormParser]  # MPYA: Support file uploads
    permission_classes = [IsAdminUser]

    def get_permissions(self):
        """
        - POST /api/notifications/ (website contact form) -> AllowAny
        - OPTIONS (browser preflight)                    -> AllowAny
        - All other actions                              -> IsAdminUser
        """
        if self.request.method == "OPTIONS" or self.action == "create":
            return [AllowAny()]
        return [IsAdminUser()]

    def get_queryset(self):
        qs = super().get_queryset()

        # Filter by is_read=true|false if provided
        is_read = self.request.query_params.get("is_read")
        if is_read is not None:
            value = is_read.lower()
            if value in ("true", "1", "yes"):
                qs = qs.filter(is_read=True)
            elif value in ("false", "0", "no"):
                qs = qs.filter(is_read=False)

        # Filter by service if provided
        service = self.request.query_params.get("service")
        if service:
            qs = qs.filter(service=service)

        # Simple text search across name / email / phone / company / message
        search = self.request.query_params.get("search")
        if search:
            qs = qs.filter(
                models.Q(name__icontains=search)
                | models.Q(email__icontains=search)
                | models.Q(phone__icontains=search)
                | models.Q(company__icontains=search)
                | models.Q(message__icontains=search)
            )

        return qs

    def perform_create(self, serializer: NotificationSerializer) -> None:
        """
        Save the notification and send e-mails:

        - one to the VitoTech team (admin notification),
        - one to the visitor confirming receipt.
        """
        notification = serializer.save()

        # E-mail to internal VitoTech address (DEFAULT_FROM_EMAIL)
        send_admin_notification_email(notification)

        # Acknowledgement e-mail to the visitor
        send_user_ack_email(notification)

    @action(detail=True, methods=["post"])
    def mark_read(self, request, pk=None):
        notification = self.get_object()
        if not notification.is_read:
            notification.is_read = True
            notification.read_at = timezone.now()
            notification.save(update_fields=["is_read", "read_at"])
        serializer = self.get_serializer(notification)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"])
    def mark_unread(self, request, pk=None):
        notification = self.get_object()
        if notification.is_read:
            notification.is_read = False
            notification.read_at = None
            notification.save(update_fields=["is_read", "read_at"])
        serializer = self.get_serializer(notification)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=["get"])
    def stats(self, request):
        """
        GET /api/notifications/stats/

        Example response:
        {
          "total": 10,
          "read": 6,
          "unread": 4
        }
        """
        qs = self.get_queryset()
        total = qs.count()
        read = qs.filter(is_read=True).count()
        unread = total - read
        return Response(
            {"total": total, "read": read, "unread": unread},
            status=status.HTTP_200_OK,
        )