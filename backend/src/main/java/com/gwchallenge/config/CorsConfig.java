package com.gwchallenge.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        
        // ======================== ORIGENS PERMITIDAS ========================
        // Frontend local (desenvolvimento)
        config.addAllowedOrigin("http://localhost:3000");
        // Frontend em produção (Vercel)
        config.addAllowedOrigin("https://gw-challenge.vercel.app");
        
        // ======================== MÉTODOS HTTP PERMITIDOS ========================
        config.addAllowedMethod("GET");
        config.addAllowedMethod("POST");
        config.addAllowedMethod("PUT");
        config.addAllowedMethod("DELETE");
        config.addAllowedMethod("OPTIONS");
        config.addAllowedMethod("PATCH");
        
        // ======================== HEADERS PERMITIDOS ========================
        config.addAllowedHeader("*");
        config.addExposedHeader("Authorization");
        config.addExposedHeader("Content-Type");
        
        // ======================== CREDENCIAIS ========================
        config.setAllowCredentials(true);
        
        // ======================== CACHE ========================
        config.setMaxAge(3600L); // 1 hora
        
        // ======================== REGISTRAR CONFIGURAÇÃO ========================
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        
        return new CorsFilter(source);
    }
}
