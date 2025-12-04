# notifications/models.py
import os
import uuid
from django.db import models
from django.core.validators import FileExtensionValidator


def attachment_upload_path(instance, filename):
    """Generate upload path for attachments: attachments/2024/01/unique_filename.pdf"""
    ext = filename.split('.')[-1]
    filename = f"{uuid.uuid4().hex}.{ext}"
    return os.path.join('attachments', filename)


class Notification(models.Model):
    """
    A contact message submitted from the public website with file attachment support.
    """

    # Contact information
    name = models.CharField("Full Name", max_length=150)
    email = models.EmailField("Business Email")
    phone = models.CharField("Phone Number", max_length=30, blank=True)
    
    # Company and service information
    company = models.CharField("Company/Organization", max_length=150, blank=True)
    
    SERVICE_CHOICES = [
        ("AI Services", "AI Services"),
        ("Website Development", "Website Development"),
        ("Mobile App Development", "Mobile App Development"),
        ("Branding & Design", "Branding & Design"),
        ("Bulk SMS Integration", "Bulk SMS Integration"),
        ("IT Consulting", "IT Consulting"),
        ("Other", "Other"),
    ]
    service = models.CharField(
        "Service Interested In",
        max_length=50,
        choices=SERVICE_CHOICES,
        blank=True
    )
    
    # Message content
    message = models.TextField("Message")
    
    # File attachment - HII MPYA KABISA, HUHIFADHI FILE HALISI
    attachment = models.FileField(
        "Attachment File",
        upload_to=attachment_upload_path,
        validators=[
            FileExtensionValidator([
                'pdf', 'doc', 'docx', 'ppt', 'pptx', 
                'zip', 'jpg', 'jpeg', 'png'
            ])
        ],
        max_length=500,
        blank=True,
        null=True,
        help_text="Uploaded file (max 5MB)"
    )

    # Internal management fields
    is_read = models.BooleanField("Read", default=False)
    read_at = models.DateTimeField("Read At", null=True, blank=True)

    created_at = models.DateTimeField("Created At", auto_now_add=True)
    updated_at = models.DateTimeField("Updated At", auto_now=True)

    class Meta:
        ordering = ("-created_at",)
        verbose_name = "Contact Message"
        verbose_name_plural = "Contact Messages"

    def __str__(self) -> str:
        status = "read" if self.is_read else "unread"
        service_info = f" - {self.service}" if self.service else ""
        attachment_info = " 📎" if self.attachment else ""
        return f"{self.name} <{self.email}>{service_info}{attachment_info} ({status})"

    @property
    def has_attachment(self) -> bool:
        """Check if this notification has a file attachment"""
        return bool(self.attachment)

    @property
    def attachment_filename(self) -> str:
        """Get the original filename of the attachment"""
        if self.attachment:
            return os.path.basename(self.attachment.name)
        return ""

    def delete(self, *args, **kwargs):
        """Override delete to remove the actual file from storage"""
        if self.attachment:
            storage, path = self.attachment.storage, self.attachment.path
            super().delete(*args, **kwargs)
            storage.delete(path)
        else:
            super().delete(*args, **kwargs)