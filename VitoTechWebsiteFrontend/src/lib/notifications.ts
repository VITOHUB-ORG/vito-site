// src/lib/notifications.ts
import { formDataRequest, authedRequest } from "./api";

export type NotificationDto = {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  message: string;
  attachment: string | null;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  updated_at: string;
};

export type NotificationStats = {
  total: number;
  read: number;
  unread: number;
};

export type NotificationPayload = {
  name: string;
  email: string;
  phone: string;
  company?: string;
  service?: string;
  message: string;
  attachment?: File;
};

// Create notification with file upload support - PUBLIC (no auth required)
export async function createNotification(
  payload: NotificationPayload
): Promise<NotificationDto> {
  const formData = new FormData();
  
  // Append all fields
  formData.append('name', payload.name);
  formData.append('email', payload.email);
  formData.append('phone', payload.phone);
  formData.append('message', payload.message);
  
  if (payload.company) formData.append('company', payload.company);
  if (payload.service) formData.append('service', payload.service);
  if (payload.attachment) formData.append('attachment', payload.attachment);

  return formDataRequest<NotificationDto>("/api/notifications/", formData, "POST");
}

// Get all notifications (admin only)
export async function getNotifications(): Promise<NotificationDto[]> {
  return authedRequest<NotificationDto[]>("/api/notifications/");
}

// Get notification by ID (admin only)
export async function getNotification(id: number): Promise<NotificationDto> {
  return authedRequest<NotificationDto>(`/api/notifications/${id}/`);
}

// Mark notification as read (admin only)
export async function markNotificationRead(id: number): Promise<NotificationDto> {
  return authedRequest<NotificationDto>(`/api/notifications/${id}/mark_read/`, {
    method: "POST",
  });
}

// Mark notification as unread (admin only)
export async function markNotificationUnread(id: number): Promise<NotificationDto> {
  return authedRequest<NotificationDto>(`/api/notifications/${id}/mark_unread/`, {
    method: "POST",
  });
}

// Get notification statistics (admin only)
export async function getNotificationStats(): Promise<NotificationStats> {
  return authedRequest<NotificationStats>("/api/notifications/stats/");
}