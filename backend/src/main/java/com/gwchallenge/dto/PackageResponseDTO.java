package com.gwchallenge.dto;

import java.util.ArrayList;
import java.util.List;

/**
 * DTO para retornar dados completos de um pacote para o frontend.
 * Inclui lista de eventos convertidos para EventResponseDTO.
 */
public class PackageResponseDTO {
    
    private String trackingCode;
    private String clientName;
    private String deliveryAddress;
    private List<EventResponseDTO> events = new ArrayList<>();
    
    // ==================== CONSTRUTORES ====================
    
    public PackageResponseDTO() {
    }
    
    public PackageResponseDTO(String trackingCode, String clientName, 
                             String deliveryAddress, List<EventResponseDTO> events) {
        this.trackingCode = trackingCode;
        this.clientName = clientName;
        this.deliveryAddress = deliveryAddress;
        this.events = events;
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
    
    public List<EventResponseDTO> getEvents() {
        return events;
    }
    
    public void setEvents(List<EventResponseDTO> events) {
        this.events = events;
    }
    
    // ==================== TOSTRING ====================
    
    @Override
    public String toString() {
        return "PackageResponseDTO{" +
                "trackingCode='" + trackingCode + '\'' +
                ", clientName='" + clientName + '\'' +
                ", deliveryAddress='" + deliveryAddress + '\'' +
                ", events=" + events +
                '}';
    }
}