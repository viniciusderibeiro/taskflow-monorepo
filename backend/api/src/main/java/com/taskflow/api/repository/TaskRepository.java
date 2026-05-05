package com.taskflow.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.taskflow.api.model.Task;

public interface TaskRepository extends JpaRepository<Long, Task> {

}
