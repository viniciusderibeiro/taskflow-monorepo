package com.taskflow.api.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

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

    public Task findById(Long id) {
        return taskRepository.findById(id).orElseThrow();
    }

    public Task save(Task task, User user) {
        task.setUser(user);
        return taskRepository.save(task);
    }

    private void verifyOwnership(Task task, User user) {
        if (!task.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Você não tem permissão para modificar esta tarefa");
        }
    }

    public Task update(Long id, Task taskData, User user) {
        Task task = findById(id);
        verifyOwnership(task, user);
        task.setTitle(taskData.getTitle());
        task.setDescription(taskData.getDescription());
        task.setPriority(taskData.getPriority());
        task.setStatus(taskData.getStatus());
        return taskRepository.save(task);
    }

    public Task updatePriority(Long id, TaskPriority priority, User user) {
        Task task = findById(id);
        verifyOwnership(task, user);
        task.setPriority(priority);
        return taskRepository.save(task);
    }

    public Task updateStatus(Long id, TaskStatus status, User user) {
        Task task = findById(id);
        verifyOwnership(task, user);
        task.setStatus(status);
        return taskRepository.save(task);
    }

    public void delete(Long id, User user) {
        Task task = findById(id);
        verifyOwnership(task, user);
        taskRepository.deleteById(id);
    }

}
