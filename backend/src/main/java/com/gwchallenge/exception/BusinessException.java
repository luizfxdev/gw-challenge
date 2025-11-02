package com.gwchallenge.exception;

/**
 * BusinessException
 *
 * Exceção personalizada para representar erros de regra de negócio.
 * Exemplo: tentativa de criar um pacote com código duplicado.
 */
public class BusinessException extends RuntimeException {

    // Construtor que recebe uma mensagem de erro
    public BusinessException(String message) {
        super(message);
    }
}
