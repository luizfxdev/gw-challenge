   package com.gwchallenge.model;

   import lombok.AllArgsConstructor;
   import lombok.Data;
   import lombok.NoArgsConstructor;

   import javax.persistence.*;
   import javax.validation.constraints.NotNull;
   import java.time.LocalDateTime;

   /**
    * Entidade JPA que representa um evento de rastreamento de uma encomenda.
    * Um evento é uma atualização de status da Package.
    */
   @Entity
   @Table(name = "event")
   @Data
   @NoArgsConstructor
   @AllArgsConstructor
   public class Event {

       /** Identificador único do evento */
       @Id
       @GeneratedValue(strategy = GenerationType.IDENTITY)
       private Long id;

       /** Data e hora do evento */
       @Column(name = "event_timestamp", nullable = false)
       @NotNull(message = "Event timestamp cannot be null")
       private LocalDateTime eventTimestamp;

       /** Status do evento (enum mapeado no banco) */
       @Enumerated(EnumType.STRING)
       @Column(name = "status", length = 50, nullable = false)
       @NotNull(message = "Event status cannot be null")
       private EventStatus status;

       /** Descrição textual do evento */
       @Column(name = "description", columnDefinition = "TEXT")
       private String description;

       /** Encomenda a que este evento pertence */
       @ManyToOne(fetch = FetchType.LAZY)
       @JoinColumn(name = "tracking_code", nullable = false)
       private Package packageEntity;
   }
