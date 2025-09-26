package com.insurai.insurai.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.insurai.insurai.handler.NotificationWebSocketHandler;
import com.insurai.insurai.model.Notification;
import com.insurai.insurai.repository.NotificationRepository;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final ObjectMapper objectMapper;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
        this.objectMapper = new ObjectMapper();
    }

    public Notification createNotification(String userId, String type, String message) {
        Notification notification = Notification.builder()
                .userId(userId)
                .type(type)
                .message(message)
                .read(false)
                .timestamp(LocalDateTime.now())
                .build();
        Notification saved = notificationRepository.save(notification);
        // Broadcast to WebSocket
        try {
            String json = objectMapper.writeValueAsString(saved);
            NotificationWebSocketHandler.broadcast(json);
        } catch (Exception e) {
            // Handle exception
        }
        return saved;
    }

    public List<Notification> getNotificationsByUserId(String userId) {
        return notificationRepository.findByUserIdOrderByTimestampDesc(userId);
    }

    public List<Notification> getUnreadNotificationsByUserId(String userId) {
        return notificationRepository.findByUserIdAndReadFalseOrderByTimestampDesc(userId);
    }

    public Notification markAsRead(String notificationId) {
        Notification notification = notificationRepository.findById(notificationId).orElse(null);
        if (notification != null) {
            notification.setRead(true);
            return notificationRepository.save(notification);
        }
        return null;
    }
}
