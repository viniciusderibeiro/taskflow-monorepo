package com.taskflow.api.dto.request;

import com.taskflow.api.model.enums.TaskPriority;
import com.taskflow.api.model.enums.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateTaskRequest(

        @NotBlank(message = "O título é obrigatório")
        @Size(max = 100, message = "O título deve ter no máximo 100 caracteres")
        String title,

        @Size(max = 500, message = "A descrição deve ter no máximo 500 caracteres")
        String description,

        @NotNull(message = "O status é obrigatório")
        TaskStatus status,

        @NotNull(message = "A prioridade é obrigatória")
        TaskPriority priority
) {}
