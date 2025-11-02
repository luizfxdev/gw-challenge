package com.gwchallenge.exception;

/**
 * ResourceNotFoundException
 *
 * Exceção lançada quando um recurso (pacote, evento, etc.) não é encontrado no sistema.
 */
public class ResourceNotFoundException extends RuntimeException {

    // Construtor simples com a mensagem do erro
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
