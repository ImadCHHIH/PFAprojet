package com.beautycloud.notification.controller;

import com.beautycloud.notification.dto.NotificationResponse;
import com.beautycloud.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationService service;

    @GetMapping
    public List<NotificationResponse> getAll() {

        return service.getAll();

    }

    @GetMapping("/unread-count")
    public long unreadCount() {

        return service.getUnreadCount();

    }

    @PutMapping("/{id}/read")
    public void read(@PathVariable Long id) {

        service.markAsRead(id);

    }

    @PutMapping("/read-all")
    public void readAll() {

        service.markAllAsRead();

    }

}