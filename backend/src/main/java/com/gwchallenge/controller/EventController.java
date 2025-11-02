package com.gwchallenge.controller;

import com.gwchallenge.exception.ResourceNotFoundException;
import com.gwchallenge.model.Event;
import com.gwchallenge.model.Package;
import com.gwchallenge.repository.EventRepository;
import com.gwchallenge.repository.PackageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;

/**
 * EventController
 *
 * Controlador REST responsável por gerenciar operações relacionadas a eventos de rastreamento de pacotes.
 * Cada evento pertence a um pacote e registra o status e a descrição de uma atualização.
 *
 * A classe expõe endpoints para criar, listar e buscar eventos de um pacote específico.
 */
@RestController
@RequestMapping("/api/events")
public class EventController {

    // Injeta o repositório de eventos (acesso direto ao banco via JPA)
    @Autowired
    private EventRepository eventRepository;

    // Injeta o repositório de pacotes (usado para validar se o pacote existe)
    @Autowired
    private PackageRepository packageRepository;

    /**
     * Retorna a lista de todos os eventos cadastrados no sistema.
     */
    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {
        List<Event> events = eventRepository.findAll();
        return ResponseEntity.ok(events);
    }

    /**
     * Retorna todos os eventos associados a um pacote, com base no seu código de rastreio.
     *
     * @param trackingCode código de rastreamento do pacote
     */
    @GetMapping("/package/{trackingCode}")
    public ResponseEntity<List<Event>> getEventsByPackage(@PathVariable String trackingCode) {
        // Verifica se o pacote existe antes de buscar eventos
        if (!packageRepository.existsByTrackingCode(trackingCode)) {
            throw new ResourceNotFoundException("Package with tracking code '" + trackingCode + "' not found");
        }

        // Busca eventos ordenados por timestamp decrescente
        List<Event> events = eventRepository.findByPackageEntity_TrackingCodeOrderByEventTimestampDesc(trackingCode);
        return ResponseEntity.ok(events);
    }

    /**
     * Cria um novo evento relacionado a um pacote.
     *
     * @param trackingCode código de rastreamento do pacote
     * @param event        dados do evento (status, descrição, etc.)
     */
    @PostMapping("/package/{trackingCode}")
    public ResponseEntity<Event> createEvent(@PathVariable String trackingCode, @Valid @RequestBody Event event) {

        // Busca o pacote para verificar se ele existe
        Package pkg = packageRepository.findByTrackingCode(trackingCode)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Package with tracking code '" + trackingCode + "' not found"));

        // Define o relacionamento do evento com o pacote
        event.setPackageEntity(pkg);

        // Se o timestamp não foi informado, define como agora
        if (event.getEventTimestamp() == null) {
            event.setEventTimestamp(LocalDateTime.now());
        }

        // Salva o evento no banco
        Event createdEvent = eventRepository.save(event);

        // Retorna 201 Created com o evento salvo
        return ResponseEntity.status(HttpStatus.CREATED).body(createdEvent);
    }

    /**
     * Exclui um evento específico com base em seu ID.
     *
     * @param eventId ID do evento (não pode ser nulo)
     */
    @DeleteMapping("/{eventId}")
    public ResponseEntity<Void> deleteEvent(@PathVariable long eventId) {
        // Busca o evento para verificar se existe
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Event with id '" + eventId + "' not found"));

        // Deleta o evento permanentemente
        eventRepository.delete(event);

        // Retorna 204 No Content indicando sucesso
        return ResponseEntity.noContent().build();
    }
}
