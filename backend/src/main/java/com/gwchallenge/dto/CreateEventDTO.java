package com.gwchallenge.dto;

import com.gwchallenge.model.EventStatus;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * DTO para criação de um novo evento.
 * Recebe dados do frontend e converte para entidade Event.
 */
public class CreateEventDTO {
    
    /**
     * Status do evento (obrigatório)
     */
    @NotNull(message = "Status cannot be null")
    private EventStatus status;
    
    /**
     * Descrição textual do evento (opcional)
     */
    private String description;
    
    /**
     * Data e hora do evento em formato ISO 8601 (ex: 2025-11-05T14:33:00.000Z)
     */
    @NotBlank(message = "Event timestamp cannot be blank")
    private String eventTimestamp;
    
    // ==================== CONSTRUTORES ====================
    
    public CreateEventDTO() {
    }
    
    public CreateEventDTO(EventStatus status, String description, String eventTimestamp) {
        this.status = status;
        this.description = description;
        this.eventTimestamp = eventTimestamp;
    }
    
    // ==================== GETTERS E SETTERS ====================
    
    public EventStatus getStatus() {
        return status;
    }
    
    public void setStatus(EventStatus status) {
        this.status = status;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getEventTimestamp() {
        return eventTimestamp;
    }
    
    public void setEventTimestamp(String eventTimestamp) {
        this.eventTimestamp = eventTimestamp;
    }
    
    // ==================== MÉTODO AUXILIAR ====================
    
    /**
     * Converte a String eventTimestamp para LocalDateTime.
     * Suporta formatos ISO 8601 com ou sem milissegundos/timezone.
     * 
     * @return LocalDateTime parseado
     */
    public LocalDateTime getEventTimestampAsLocalDateTime() {
        // Remove 'Z' do final se existir (timezone UTC)
        String cleanTimestamp = eventTimestamp.replace("Z", "");
        
        // Remove milissegundos se existirem (.000)
        if (cleanTimestamp.contains(".")) {
            cleanTimestamp = cleanTimestamp.substring(0, cleanTimestamp.indexOf('.'));
        }
        
        // Parseia para LocalDateTime
        return LocalDateTime.parse(cleanTimestamp, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
    }
    
    // ==================== TOSTRING ====================
    
    @Override
    public String toString() {
        return "CreateEventDTO{" +
                "status=" + status +
                ", description='" + description + '\'' +
                ", eventTimestamp='" + eventTimestamp + '\'' +
                '}';
    }
}