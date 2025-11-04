package com.gwchallenge.dto;

import com.gwchallenge.model.EventStatus;

import java.time.LocalDateTime;

/**
 * DTO para retornar dados de um evento para o frontend.
 * Evita serialização circular ao não incluir o objeto Package completo.
 */
public class EventResponseDTO {
    
    private Long id;
    private LocalDateTime eventTimestamp;
    private EventStatus status;
    private String description;
    private String trackingCode; // ✅ Apenas String, não o objeto Package
    
    // ==================== CONSTRUTORES ====================
    
    public EventResponseDTO() {
    }
    
    public EventResponseDTO(Long id, LocalDateTime eventTimestamp, EventStatus status, 
                           String description, String trackingCode) {
        this.id = id;
        this.eventTimestamp = eventTimestamp;
        this.status = status;
        this.description = description;
        this.trackingCode = trackingCode;
    }
    
    // ==================== GETTERS E SETTERS ====================
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public LocalDateTime getEventTimestamp() {
        return eventTimestamp;
    }
    
    public void setEventTimestamp(LocalDateTime eventTimestamp) {
        this.eventTimestamp = eventTimestamp;
    }
    
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
    
    public String getTrackingCode() {
        return trackingCode;
    }
    
    public void setTrackingCode(String trackingCode) {
        this.trackingCode = trackingCode;
    }
    
    // ==================== TOSTRING ====================
    
    @Override
    public String toString() {
        return "EventResponseDTO{" +
                "id=" + id +
                ", eventTimestamp=" + eventTimestamp +
                ", status=" + status +
                ", description='" + description + '\'' +
                ", trackingCode='" + trackingCode + '\'' +
                '}';
    }
}