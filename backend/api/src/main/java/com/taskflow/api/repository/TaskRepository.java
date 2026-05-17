package com.taskflow.api.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.taskflow.api.model.Task;
import com.taskflow.api.model.User;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUser(User user);

    Optional<Task> findByIdAndUser(Long id, User user);
}
