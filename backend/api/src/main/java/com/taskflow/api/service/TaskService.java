package com.taskflow.api.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.taskflow.api.dto.request.CreateTaskRequest;
import com.taskflow.api.dto.request.UpdateTaskRequest;
import com.taskflow.api.model.Task;
import com.taskflow.api.model.User;
import com.taskflow.api.model.enums.TaskPriority;
import com.taskflow.api.model.enums.TaskStatus;
import com.taskflow.api.repository.TaskRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;

    public List<Task> findAll(User user) {
        return taskRepository.findByUser(user);
    }

    public Task findById(Long id, User user) {
        return taskRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Tarefa não encontrada"));
    }

    public Task save(CreateTaskRequest request, User user) {
        Task task = new Task();
        task.setTitle(request.title());
        task.setDescription(request.description());
        task.setStatus(request.status());
        task.setPriority(request.priority());
        task.setUser(user);
        return taskRepository.save(task);
    }

    public Task update(Long id, UpdateTaskRequest request, User user) {
        Task task = findById(id, user);
        task.setTitle(request.title());
        task.setDescription(request.description());
        task.setPriority(request.priority());
        task.setStatus(request.status());
        return taskRepository.save(task);
    }

    public Task updatePriority(Long id, TaskPriority priority, User user) {
        Task task = findById(id, user);
        task.setPriority(priority);
        return taskRepository.save(task);
    }

    public Task updateStatus(Long id, TaskStatus status, User user) {
        Task task = findById(id, user);
        task.setStatus(status);
        return taskRepository.save(task);
    }

    public void delete(Long id, User user) {
        Task task = findById(id, user);
        taskRepository.delete(task);
    }
}
