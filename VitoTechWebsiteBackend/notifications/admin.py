# notifications/admin.py
from django.contrib import admin
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _

from .models import Notification

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "email",
        "phone",
        "company",
        "service",
        "has_attachment_display",
        "is_read",
        "read_at",
        "created_at",
    )
    list_filter = ("is_read", "service", "created_at")
    search_fields = ("name", "email", "phone", "company", "message")
    ordering = ("-created_at",)
    date_hierarchy = "created_at"
    readonly_fields = (
        "created_at", 
        "updated_at", 
        "read_at", 
        "attachment_preview",
        "has_attachment_display",
    )

    fieldsets = (
        (
            "Contact details",
            {
                "fields": ("name", "email", "phone", "company", "service"),
            },
        ),
        (
            "Message & Attachment",
            {
                "fields": ("message", "attachment", "attachment_preview"),
            },
        ),
        (
            "Status & timestamps",
            {
                "fields": ("is_read", "read_at", "created_at", "updated_at"),
            },
        ),
    )

    def has_attachment_display(self, obj):
        return obj.has_attachment
    has_attachment_display.short_description = "Has Attachment"
    has_attachment_display.boolean = True

    def attachment_preview(self, obj):
        if obj.attachment:
            return format_html(
                '<a href="{}" target="_blank">View Attachment</a>',
                obj.attachment.url
            )
        return "-"
    attachment_preview.short_description = "Attachment Preview"

    # Override to avoid deleting files when deleting notifications in admin
    def delete_queryset(self, request, queryset):
        for obj in queryset:
            # This will call the model's delete method which handles file deletion
            obj.delete()

    def delete_model(self, request, obj):
        obj.delete()