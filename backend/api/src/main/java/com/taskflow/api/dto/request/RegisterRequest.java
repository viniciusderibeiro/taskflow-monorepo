package com.taskflow.api.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(

        @NotBlank(message = "O nome é obrigatório") String name,

        @NotBlank(message = "O email é obrigatório") @Email String email,

        @NotBlank(message = "A senha é obrigatória") @Size(min = 4, max = 200, message = "A senha deve ter no mínimo 4") String password) {
}