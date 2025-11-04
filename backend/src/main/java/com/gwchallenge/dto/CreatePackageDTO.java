package com.gwchallenge.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

/**
 * DTO para criação de um novo pacote.
 * Usado no endpoint POST /api/packages
 */
public class CreatePackageDTO {
    
    @NotBlank(message = "Tracking code cannot be blank")
    @Size(min = 1, max = 50, message = "Tracking code must be between 1 and 50 characters")
    private String trackingCode;
    
    @NotBlank(message = "Client name cannot be blank")
    @Size(min = 1, max = 100, message = "Client name must be between 1 and 100 characters")
    private String clientName;
    
    @NotBlank(message = "Delivery address cannot be blank")
    private String deliveryAddress;
    
    // ==================== CONSTRUTORES ====================
    
    public CreatePackageDTO() {
    }
    
    public CreatePackageDTO(String trackingCode, String clientName, String deliveryAddress) {
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
    
    // ==================== TOSTRING ====================
    
    @Override
    public String toString() {
        return "CreatePackageDTO{" +
                "trackingCode='" + trackingCode + '\'' +
                ", clientName='" + clientName + '\'' +
                ", deliveryAddress='" + deliveryAddress + '\'' +
                '}';
    }
}