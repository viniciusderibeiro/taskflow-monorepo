package com.taskflow.api.controller;

import com.taskflow.api.dto.request.LoginRequest;
import com.taskflow.api.dto.request.RegisterRequest;
import com.taskflow.api.dto.response.AuthResponse;
import com.taskflow.api.service.AuthService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "Cadastrar usuário", description = "Cria uma nova conta e retorna um token JWT válido por 24h", requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(content = @Content(examples = @ExampleObject(value = """
                {
                    "name": "João Silva",
                    "email": "joao@email.com",
                    "password": "senha123"
                }
            """))))
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Cadastro realizado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos, email mal formatado ou senha curta"),
            @ApiResponse(responseCode = "409", description = "Email já cadastrado")
    })
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @Operation(summary = "Fazer login", description = "Autentica o usuário com email e senha e retorna um token JWT", requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(content = @Content(examples = @ExampleObject(value = """
                {
                    "email": "joao@email.com",
                    "password": "senha123"
                }
            """))))
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Login realizado — retorna o token JWT"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos"),
            @ApiResponse(responseCode = "401", description = "Email ou senha incorretos")
    })
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
