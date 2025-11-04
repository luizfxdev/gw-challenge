package com.gwchallenge.model;

import com.fasterxml.jackson.annotation.JsonBackReference;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

/**
 * Entidade JPA que representa um evento de rastreamento de encomenda.
 * Cada evento registra uma atualização de status de um pacote específico.
 */
@Entity
@Table(name = "event")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "event_timestamp", nullable = false)
    @NotNull(message = "Event timestamp cannot be null")
    private LocalDateTime eventTimestamp;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    @NotNull(message = "Event status cannot be null")
    private EventStatus status;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    /**
     * Relacionamento ManyToOne com Package.
     * @JsonBackReference previne serialização infinita.
     */
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tracking_code", nullable = false)
    private Package packageEntity;

    // ==================== CONSTRUTORES ====================
    
    public Event() {
    }
    
    public Event(Long id, LocalDateTime eventTimestamp, EventStatus status, 
                 String description, Package packageEntity) {
        this.id = id;
        this.eventTimestamp = eventTimestamp;
        this.status = status;
        this.description = description;
        this.packageEntity = packageEntity;
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

    public Package getPackageEntity() {
        return packageEntity;
    }

    public void setPackageEntity(Package packageEntity) {
        this.packageEntity = packageEntity;
    }

    // ==================== TOSTRING (SEM packageEntity para evitar loop) ====================
    
    @Override
    public String toString() {
        return "Event{" +
                "id=" + id +
                ", eventTimestamp=" + eventTimestamp +
                ", status=" + status +
                ", description='" + description + '\'' +
                '}';
    }
}