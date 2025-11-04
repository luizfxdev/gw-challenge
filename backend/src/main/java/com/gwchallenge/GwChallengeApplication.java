package com.gwchallenge;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Classe principal da aplicação Spring Boot.
 * 
 * A anotação @SpringBootApplication é uma combinação de:
 * - @Configuration: indica que a classe contém definições de beans
 * - @EnableAutoConfiguration: habilita configuração automática do Spring Boot
 * - @ComponentScan: escaneia componentes, configurações e serviços no pacote atual
 * 
 * Esta classe inicializa toda a aplicação e configura o contexto do Spring.
 */
@SpringBootApplication
public class GwChallengeApplication {

    /**
     * Método main que inicia a aplicação Spring Boot.
     * 
     * @param args argumentos de linha de comando (opcional)
     */
    public static void main(String[] args) {
        // Inicializa o contexto Spring e inicia o servidor embutido (Tomcat)
        SpringApplication.run(GwChallengeApplication.class, args);
    }
}
