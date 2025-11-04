package com.gwchallenge.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

/**
 * CorsConfig
 * 
 * Configuração global de CORS (Cross-Origin Resource Sharing).
 * Permite que o frontend (Next.js) faça requisições HTTP para o backend (Spring Boot)
 * mesmo estando em portas/domínios diferentes.
 * 
 * Desenvolvimento: http://localhost:3000 (frontend) → http://localhost:8080 (backend)
 * Produção: Ajustar origins para domínios reais
 */
@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();

        // Permite credenciais (cookies, headers de autenticação)
        config.setAllowCredentials(true);

        // Permite requisições de qualquer origem (AJUSTAR EM PRODUÇÃO!)
        config.addAllowedOriginPattern("*");

        // Permite todos os headers
        config.addAllowedHeader("*");

        // Permite todos os métodos HTTP (GET, POST, PUT, DELETE, etc)
        config.addAllowedMethod("*");

        // Aplica configuração para todos os endpoints
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}
