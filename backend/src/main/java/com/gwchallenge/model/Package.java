   package com.gwchallenge.model;

   import lombok.AllArgsConstructor;
   import lombok.Data;
   import lombok.NoArgsConstructor;

   import javax.persistence.*;
   import javax.validation.constraints.NotBlank;
   import javax.validation.constraints.Size;
 import java.util.ArrayList;
   import java.util.List;

   @Entity
   @Table(name = "package")
   @Data
   @NoArgsConstructor
   @AllArgsConstructor
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

       @Column(name = "delivery_address", nullable = false, columnDefinition = "TEXT")
       @NotBlank(message = "Delivery address cannot be blank")
       private String deliveryAddress;

       @OneToMany(
           mappedBy = "packageEntity",
           cascade = CascadeType.ALL,
           orphanRemoval = true,
           fetch = FetchType.LAZY
       )
       private List<Event> events = new ArrayList<>();

       public void addEvent(Event event) {
           events.add(event);
           event.setPackageEntity(this);
       }

       public void removeEvent(Event event) {
           events.remove(event);
           event.setPackageEntity(null);
       }
   }
