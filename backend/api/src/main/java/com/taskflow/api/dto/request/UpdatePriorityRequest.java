package com.taskflow.api.dto.request;

import com.taskflow.api.model.enums.TaskPriority;

public record UpdatePriorityRequest(TaskPriority priority) {
}
