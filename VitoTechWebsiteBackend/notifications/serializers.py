# notifications/serializers.py
from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = [
            "id",
            "name",           
            "email",           
            "phone",        
            "company",       
            "service",       
            "message",       
            "attachment",     
            "is_read",        
            "read_at",        
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "is_read",
            "read_at", 
            "created_at",
            "updated_at",
        ]
    
    def validate_attachment(self, value):
        """Validate the uploaded file"""
        if value:
            max_size = 5 * 1024 * 1024 
            if value.size > max_size:
                raise serializers.ValidationError("File size must be less than 5MB.")
            
            allowed_extensions = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'zip', 'jpg', 'jpeg', 'png']
            ext = value.name.split('.')[-1].lower()
            if ext not in allowed_extensions:
                raise serializers.ValidationError(
                    f"File type not allowed. Allowed types: {', '.join(allowed_extensions)}"
                )
        
        return value
