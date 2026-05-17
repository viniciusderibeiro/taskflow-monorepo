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

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/tasks")
@SecurityRequirement(name = "bearerAuth")
public class TaskController {

    private final TaskService taskService;

    @Operation(summary = "Listar tarefas", description = "Retorna todas as tarefas do usuário autenticado")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista retornada com sucesso"),
            @ApiResponse(responseCode = "401", description = "Token ausente ou inválido")
    })
    @GetMapping
    public List<Task> findAll(@AuthenticationPrincipal User user) {
        return taskService.findAll(user);
    }

    @Operation(summary = "Buscar tarefa por ID", description = "Retorna uma tarefa específica do usuário autenticado")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Tarefa encontrada"),
            @ApiResponse(responseCode = "401", description = "Token ausente ou inválido"),
            @ApiResponse(responseCode = "403", description = "Tarefa pertence a outro usuário"),
            @ApiResponse(responseCode = "404", description = "Tarefa não encontrada")
    })
    @GetMapping("/{id}")
    public Task findById(@PathVariable Long id, @AuthenticationPrincipal User user) {
        return taskService.findById(id, user);
    }

    @Operation(summary = "Criar uma nova tarefa", description = "Neste Endpoint podemos criar uma nova tarefa", requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(content = @Content(examples = @ExampleObject(value = """
                {
                    "title": "Criar uma nova tarefa.",
                    "description": "Crie uma nova tarefa",
                    "status": "BACKLOG",
                    "priority": "LOW"
                }
            """))))
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Tarefa criada com sucesso"),
            @ApiResponse(responseCode = "401", description = "Token ausente ou inválido"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos")
    })
    @PostMapping
    public Task save(@RequestBody Task task, @AuthenticationPrincipal User user) {
        return taskService.save(task, user);
    }

    @Operation(summary = "Atualizar tarefa", description = "Atualiza título, descrição, status e prioridade de uma tarefa", requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(content = @Content(examples = @ExampleObject(value = """
                {
                    "title": "Título atualizado",
                    "description": "Descrição atualizada",
                    "status": "IN_PROGRESS",
                    "priority": "HIGH"
                }
            """))))
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Tarefa atualizada com sucesso"),
            @ApiResponse(responseCode = "401", description = "Token ausente ou inválido"),
            @ApiResponse(responseCode = "403", description = "Tarefa pertence a outro usuário"),
            @ApiResponse(responseCode = "404", description = "Tarefa não encontrada")
    })
    @PutMapping("/{id}")
    public Task update(@PathVariable Long id, @RequestBody Task task,
            @AuthenticationPrincipal User user) {
        return taskService.update(id, task, user);
    }

    @Operation(summary = "Atualizar prioridade", description = "Atualiza apenas a prioridade da tarefa. Valores aceitos: LOW, MEDIUM, HIGH", requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(content = @Content(examples = @ExampleObject(value = """
                { "priority": "HIGH" }
            """))))
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Prioridade atualizada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Valor de prioridade inválido"),
            @ApiResponse(responseCode = "401", description = "Token ausente ou inválido"),
            @ApiResponse(responseCode = "403", description = "Tarefa pertence a outro usuário"),
            @ApiResponse(responseCode = "404", description = "Tarefa não encontrada")
    })
    @PatchMapping("/{id}/priority")
    public Task updatePriority(@PathVariable Long id, @RequestBody UpdatePriorityRequest request,
            @AuthenticationPrincipal User user) {
        return taskService.updatePriority(id, request.priority(), user);
    }

    @Operation(summary = "Atualizar status", description = "Move a tarefa entre colunas do Kanban. Valores aceitos: BACKLOG, TODO, IN_PROGRESS, DONE", requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(content = @Content(examples = @ExampleObject(value = """
                { "status": "IN_PROGRESS" }
            """))))
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Status atualizado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Valor de status inválido"),
            @ApiResponse(responseCode = "401", description = "Token ausente ou inválido"),
            @ApiResponse(responseCode = "403", description = "Tarefa pertence a outro usuário"),
            @ApiResponse(responseCode = "404", description = "Tarefa não encontrada")
    })
    @PatchMapping("/{id}/status")
    public Task updateStatus(@PathVariable Long id, @RequestBody UpdateStatusRequest request,
            @AuthenticationPrincipal User user) {
        return taskService.updateStatus(id, request.status(), user);
    }

    @Operation(summary = "Deletar tarefa", description = "Remove permanentemente uma tarefa do usuário autenticado")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Tarefa deletada com sucesso"),
            @ApiResponse(responseCode = "401", description = "Token ausente ou inválido"),
            @ApiResponse(responseCode = "403", description = "Tarefa pertence a outro usuário"),
            @ApiResponse(responseCode = "404", description = "Tarefa não encontrada")
    })
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id, @AuthenticationPrincipal User user) {
        taskService.delete(id, user);
    }
}
