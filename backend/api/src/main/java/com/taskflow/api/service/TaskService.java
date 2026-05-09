package com.taskflow.api.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.taskflow.api.model.Task;
import com.taskflow.api.model.enums.TaskPriority;
import com.taskflow.api.model.enums.TaskStatus;
import com.taskflow.api.repository.TaskRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;

    public List<Task> findAll() {
        return taskRepository.findAll();
    }

    public Task findById(Long id) {
        return taskRepository.findById(id).orElseThrow();
    }

    public Task save(Task task) {
        return taskRepository.save(task);
    }

    public Task update(Long id, Task taskData) {
        Task task = findById(id);
        task.setTitle(taskData.getTitle());
        task.setDescription(taskData.getDescription());
        task.setPriority(taskData.getPriority());
        task.setStatus(taskData.getStatus());
        return taskRepository.save(task);
    }

    public Task updatePriority(Long id, TaskPriority priority) {
        Task task = findById(id);
        task.setPriority(priority);
        return taskRepository.save(task);
    }

    public Task updateStatus(Long id, TaskStatus status) {
        Task task = findById(id);
        task.setStatus(status);
        return taskRepository.save(task);
    }

    public void delete(Long id) {
        taskRepository.deleteById(id);
    }

}
