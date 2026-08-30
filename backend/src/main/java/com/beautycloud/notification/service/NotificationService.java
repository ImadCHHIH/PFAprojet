package com.beautycloud.notification.service;

import com.beautycloud.notification.dto.NotificationResponse;
import com.beautycloud.notification.entity.Notification;
import com.beautycloud.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository repository;

    public List<NotificationResponse> getAll() {

        return repository
                .findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public long getUnreadCount() {

        return repository.countByReadFalse();

    }

    public void markAsRead(Long id) {

        Notification notification = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        notification.setRead(true);

        repository.save(notification);

    }

    public Notification create(
            String title,
            String message,
            String type) {

        Notification notification = Notification.builder()
                .title(title)
                .message(message)
                .type(type)
                .read(false)
                .build();

        return repository.save(notification);

    }

    private NotificationResponse toResponse(Notification n) {

        return NotificationResponse.builder()
                .id(n.getId())
                .title(n.getTitle())
                .message(n.getMessage())
                .type(n.getType())
                .read(n.getRead())
                .build();

    }
    public void markAllAsRead() {

        List<Notification> notifications = repository.findAll();

        for (Notification notification : notifications) {

            notification.setRead(true);

        }

        repository.saveAll(notifications);

    }

}