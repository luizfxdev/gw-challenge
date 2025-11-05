package com.gwchallenge.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

/**
 * AuthController
 * 
 * Controlador REST responsável pela autenticação de usuários.
 * Implementa login simples sem JWT (para simplificar o MVP).
 * Em produção, deve ser substituído por autenticação JWT/OAuth2.
 */
@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*") // Permite requisições de qualquer origem (ajustar em produção)
public class AuthController {

    /**
     * Endpoint de login simples.
     * Valida credenciais hardcoded (apenas para desenvolvimento).
     * 
     * @param credentials Map contendo username e password
     * @return ResponseEntity com sucesso/erro e dados do usuário
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");
        Map<String, Object> response = new HashMap<>();
        
        // Validação simples (SUBSTITUIR POR AUTENTICAÇÃO REAL EM PRODUÇÃO)
        if ("admin".equals(username) && "gw@sist123".equals(password)) {
            response.put("success", true);
            response.put("message", "Login realizado com sucesso");
            response.put("token", "mock-jwt-token-12345"); // Token mock (implementar JWT real depois)
            Map<String, String> user = new HashMap<>();
            user.put("username", username);
            user.put("role", "ADMIN");
            response.put("user", user);
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "Credenciais inválidas");
            return ResponseEntity.status(401).body(response);
        }
    }

    /**
     * Endpoint de logout (placeholder).
     * Em implementação JWT real, invalidaria o token.
     */
    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Logout realizado com sucesso");
        return ResponseEntity.ok(response);
    }
}
