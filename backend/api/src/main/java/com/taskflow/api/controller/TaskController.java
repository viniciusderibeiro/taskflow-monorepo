package com.taskflow.api.controller;

import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.taskflow.api.dto.request.UpdatePriorityRequest;
import com.taskflow.api.dto.request.UpdateStatusRequest;
import com.taskflow.api.model.Task;
import com.taskflow.api.model.User;
import com.taskflow.api.service.TaskService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/tasks")
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    public List<Task> findAll(@AuthenticationPrincipal User user) {
        return taskService.findAll(user);
    }

    @GetMapping("/{id}")
    public Task findById(@PathVariable Long id) {
        return taskService.findById(id);
    }

    @PostMapping
    public Task save(@RequestBody Task task, @AuthenticationPrincipal User user) {
        return taskService.save(task, user);
    }

    @PutMapping("/{id}")
    public Task update(@PathVariable Long id, @RequestBody Task task,
            @AuthenticationPrincipal User user) {
        return taskService.update(id, task, user);
    }

    @PatchMapping("/{id}/priority")
    public Task updatePriority(@PathVariable Long id, @RequestBody UpdatePriorityRequest request,
            @AuthenticationPrincipal User user) {
        return taskService.updatePriority(id, request.priority(), user);
    }

    @PatchMapping("/{id}/status")
    public Task updateStatus(@PathVariable Long id, @RequestBody UpdateStatusRequest request,
            @AuthenticationPrincipal User user) {
        return taskService.updateStatus(id, request.status(), user);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id, @AuthenticationPrincipal User user) {
        taskService.delete(id, user);
    }
}
