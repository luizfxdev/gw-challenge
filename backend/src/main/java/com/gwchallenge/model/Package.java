package com.gwchallenge.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;

/**
 * Entidade JPA que representa um pacote/encomenda rastreável.
 * Contém informações do destinatário e histórico de eventos.
 */
@Entity
@Table(name = "package")
public class Package {

    @Id
    @Column(name = "tracking_code", length = 50, nullable = false)
    @NotBlank(message = "Tracking code cannot be blank")
    @Size(min = 1, max = 50, message = "Tracking code must be between 1 and 50 characters")
    private String trackingCode;

    @Column(name = "client_name", length = 100, nullable = false)
    @NotBlank(message = "Client name cannot be blank")
    @Size(min = 1, max = 100, message = "Client name must be between 1 and 100 characters")
    private String clientName;

    @Column(name = "delivery_address", length = 255, nullable = false)
    @NotBlank(message = "Delivery address cannot be blank")
    private String deliveryAddress;

    /**
     * Lista de eventos deste pacote.
     * @JsonManagedReference permite serialização dos eventos.
     */
    @JsonManagedReference
    @OneToMany(
        mappedBy = "packageEntity",
        cascade = CascadeType.ALL,
        orphanRemoval = true,
        fetch = FetchType.LAZY
    )
    private List<Event> events = new ArrayList<>();

    // ==================== CONSTRUTORES ====================
    
    public Package() {
    }
    
    public Package(String trackingCode, String clientName, String deliveryAddress) {
        this.trackingCode = trackingCode;
        this.clientName = clientName;
        this.deliveryAddress = deliveryAddress;
    }

    // ==================== GETTERS E SETTERS ====================
    
    public String getTrackingCode() {
        return trackingCode;
    }

    public void setTrackingCode(String trackingCode) {
        this.trackingCode = trackingCode;
    }

    public String getClientName() {
        return clientName;
    }

    public void setClientName(String clientName) {
        this.clientName = clientName;
    }

    public String getDeliveryAddress() {
        return deliveryAddress;
    }

    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }

    public List<Event> getEvents() {
        return events;
    }

    public void setEvents(List<Event> events) {
        this.events = events;
    }

    // ==================== MÉTODOS AUXILIARES ====================
    
    /**
     * Adiciona evento mantendo consistência bidirecional
     */
    public void addEvent(Event event) {
        events.add(event);
        event.setPackageEntity(this);
    }

    /**
     * Remove evento mantendo consistência bidirecional
     */
    public void removeEvent(Event event) {
        events.remove(event);
        event.setPackageEntity(null);
    }

    // ==================== TOSTRING (SEM events para evitar loop) ====================
    
    @Override
    public String toString() {
        return "Package{" +
                "trackingCode='" + trackingCode + '\'' +
                ", clientName='" + clientName + '\'' +
                ", deliveryAddress='" + deliveryAddress + '\'' +
                '}';
    }
}