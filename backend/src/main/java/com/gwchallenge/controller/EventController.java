package com.gwchallenge.controller;

import com.gwchallenge.dto.CreateEventDTO;
import com.gwchallenge.dto.EventResponseDTO;
import com.gwchallenge.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

/**
 * Controlador REST para gerenciar eventos de rastreamento.
 * 
 * REFATORADO: Agora delega toda lógica para EventService.
 * O controller apenas:
 * - Recebe requisições HTTP
 * - Valida dados de entrada (@Valid)
 * - Chama o Service apropriado
 * - Retorna ResponseEntity com status HTTP correto
 * 
 * ✅ CRÍTICO: Todos os endpoints retornam DTOs, NUNCA entidades JPA.
 * Isso evita StackOverflowError ao serializar JSON.
 */
@RestController
@RequestMapping("/api/events")
public class EventController {

    // Injeta o serviço que contém a lógica de negócio
    @Autowired
    private EventService eventService;

    /**
     * GET /api/events
     * Lista todos os eventos cadastrados no sistema.
     * 
     * @return Lista de EventResponseDTO com status 200 OK
     */
    @GetMapping
    public ResponseEntity<List<EventResponseDTO>> getAllEvents() {
        List<EventResponseDTO> events = eventService.getAllEvents();
        return ResponseEntity.ok(events);
    }

    /**
     * GET /api/events/package/{trackingCode}
     * Busca todos os eventos de um pacote específico.
     * 
     * @param trackingCode Código de rastreio do pacote
     * @return Lista de EventResponseDTO ordenada por data (mais recentes primeiro)
     */
    @GetMapping("/package/{trackingCode}")
    public ResponseEntity<List<EventResponseDTO>> getEventsByPackage(
            @PathVariable String trackingCode) {
        
        List<EventResponseDTO> events = eventService.getEventsByTrackingCode(trackingCode);
        return ResponseEntity.ok(events);
    }

    /**
     * POST /api/events/package/{trackingCode}
     * Cria um novo evento para um pacote específico.
     * 
     * ANTES: Retornava entidade Event (causava StackOverflowError)
     * ✅ AGORA: Retorna EventResponseDTO (sem referências circulares)
     * 
     * @param trackingCode Código de rastreio do pacote
     * @param createEventDTO Dados do evento (validados com @Valid)
     * @return EventResponseDTO com status 201 Created
     */
    @PostMapping("/package/{trackingCode}")
    public ResponseEntity<EventResponseDTO> createEvent(
            @PathVariable String trackingCode,
            @Valid @RequestBody CreateEventDTO createEventDTO) {

        // Log para debug
        System.out.println("[EventController] Criando evento para pacote: " + trackingCode);
        System.out.println("[EventController] Dados recebidos: " + createEventDTO);

        // Chama o serviço para processar a lógica de negócio
        // O serviço já retorna DTO, não a entidade JPA
        EventResponseDTO createdEvent = eventService.createEvent(trackingCode, createEventDTO);

        System.out.println("[EventController] ✅ Evento criado com ID: " + createdEvent.getId());

        // ✅ Retorna DTO com status 201 Created
        // SEM RISCO de StackOverflowError porque não há referência circular
        return ResponseEntity.status(HttpStatus.CREATED).body(createdEvent);
    }

    /**
     * DELETE /api/events/{eventId}
     * Deleta um evento específico por ID.
     * 
     * @param eventId ID do evento a ser deletado
     * @return Status 204 No Content se deletado com sucesso
     */
    @DeleteMapping("/{eventId}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long eventId) {
        eventService.deleteEvent(eventId);
        return ResponseEntity.noContent().build();
    }
}