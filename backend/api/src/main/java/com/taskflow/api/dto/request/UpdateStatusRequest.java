package com.taskflow.api.dto.request;

import com.taskflow.api.model.enums.TaskStatus;

public record UpdateStatusRequest(TaskStatus status) {
}
