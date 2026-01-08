# notifications/emails.py
from __future__ import annotations

from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone

from .models import Notification


def _get_default_from_email() -> str:
    """
    Helper to choose a safe from email.
    """
    return getattr(settings, "DEFAULT_FROM_EMAIL", "") or getattr(
        settings, "EMAIL_HOST_USER", ""
    )


def send_admin_notification_email(notification: Notification) -> None:
    """
    E-mail to the VitoTech team when a new contact message is submitted.
    """
    subject = f"[VitoTech Website] New contact message from {notification.name}"
    from_email = _get_default_from_email()
    to_email = [from_email] if from_email else []

    if not to_email:
        # No configured admin e-mail – nothing to send.
        return

    created_local = timezone.localtime(notification.created_at)
    created_str = created_local.strftime("%Y-%m-%d %H:%M")

    # Build the body with all the new fields
    body_lines = [
        "Hello,",
        "",
        "A new contact message has been submitted on the VitoTech website.",
        "",
        f"Name:    {notification.name}",
        f"Email:   {notification.email}",
        f"Phone:   {notification.phone or '-'}",
        f"Company: {notification.company or '-'}",
        f"Service: {notification.service or '-'}",
        f"Date:    {created_str}",
    ]

    # Add attachment info if exists
    if notification.has_attachment:
        body_lines.append(f"Attachment: {notification.attachment_filename}")
    else:
        body_lines.append("Attachment: -")

    body_lines.extend([
        "",
        "Message:",
        "--------------------------------------------------",
        notification.message,
        "--------------------------------------------------",
        "",
        "You can also view and manage this message in the admin panel.",
        "",
        "— VitoTech Website Notification System",
    ])
    body = "\n".join(body_lines)

    try:
        send_mail(
            subject,
            body,
            from_email or None,
            to_email,
            fail_silently=True,
        )
    except Exception:
        # We don't want contact form to fail because of e-mail issues.
        pass


def send_user_ack_email(notification: Notification) -> None:
    """
    Acknowledgement e-mail to the visitor confirming that
    VitoTech has received the message.
    """
    if not notification.email:
        return

    subject = "We have received your message – VitoTech"

    from_email = _get_default_from_email()
    to_email = [notification.email]

    created_local = timezone.localtime(notification.created_at)
    created_str = created_local.strftime("%Y-%m-%d %H:%M")

    greeting_name = notification.name or "there"

    body_lines = [
        f"Hi {greeting_name},",
        "",
        "Thank you for contacting VitoTech through our website.",
        "This e-mail is to confirm that we have received your message and",
        "our team will review it and get back to you as soon as possible.",
        "",
        "Summary of your message:",
        "--------------------------------------------------",
        f"Name:    {notification.name}",
        f"Email:   {notification.email}",
        f"Phone:   {notification.phone or '-'}",
        f"Company: {notification.company or '-'}",
        f"Service: {notification.service or '-'}",
        f"Date:    {created_str}",
    ]

    if notification.has_attachment:
        body_lines.append(f"Attachment: {notification.attachment_filename}")
    else:
        body_lines.append("Attachment: -")

    body_lines.extend([
        "",
        "Message:",
        notification.message,
        "--------------------------------------------------",
        "",
        "If you did not make this request, you can ignore this e-mail.",
        "",
        "Best regards,",
        "VitoTech Team",
    ])
    body = "\n".join(body_lines)

    try:
        send_mail(
            subject,
            body,
            from_email or None,
            to_email,
            fail_silently=True,
        )
    except Exception:
        pass