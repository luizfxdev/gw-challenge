package com.gwchallenge.service;

import com.gwchallenge.dto.CreateEventDTO;
import com.gwchallenge.dto.EventResponseDTO;
import com.gwchallenge.exception.ResourceNotFoundException;
import com.gwchallenge.model.Event;
import com.gwchallenge.model.Package;
import com.gwchallenge.repository.EventRepository;
import com.gwchallenge.repository.PackageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Serviço responsável pela lógica de negócio relacionada a eventos.
 * 
 * Responsabilidades:
 * - Criar, buscar e deletar eventos
 * - Converter entidades JPA para DTOs (evitando serialização circular)
 * - Validar regras de negócio
 * 
 * A separação em Service permite:
 * - Controllers mais limpos (apenas delegam)
 * - Lógica reutilizável
 * - Melhor testabilidade
 */
@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private PackageRepository packageRepository;

    /**
     * Cria um novo evento para um pacote específico.
     * 
     * Fluxo:
     * 1. Valida se o pacote existe
     * 2. Cria entidade Event a partir do DTO
     * 3. Salva no banco de dados
     * 4. ✅ Converte para EventResponseDTO (sem referência circular)
     * 5. Retorna DTO para o Controller
     * 
     * @param trackingCode Código de rastreio do pacote
     * @param dto Dados do evento a ser criado
     * @return EventResponseDTO com dados do evento criado
     * @throws ResourceNotFoundException se o pacote não existir
     */
    @Transactional // Garante consistência do banco em caso de erro
    public EventResponseDTO createEvent(String trackingCode, CreateEventDTO dto) {
        // Log para debug
        System.out.println("[EventService] Criando evento para pacote: " + trackingCode);
        System.out.println("[EventService] Dados recebidos: " + dto);

        // Busca o pacote no banco de dados
        // Se não existir, lança exceção ResourceNotFoundException
        Package pkg = packageRepository.findByTrackingCode(trackingCode)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Pacote com código '" + trackingCode + "' não encontrado"));

        // Cria nova entidade Event
        Event event = new Event();
        event.setStatus(dto.getStatus());
        event.setDescription(dto.getDescription());
        event.setEventTimestamp(dto.getEventTimestampAsLocalDateTime());
        event.setPackageEntity(pkg); // Estabelece relacionamento ManyToOne

        // Salva evento no banco de dados
        Event savedEvent = eventRepository.save(event);

        System.out.println("[EventService] ✅ Evento salvo com ID: " + savedEvent.getId());

        // ✅ CRÍTICO: Converte entidade JPA para DTO ANTES de retornar
        // Isso evita o StackOverflowError ao serializar a resposta JSON
        return convertToDTO(savedEvent);
    }

    /**
     * Busca todos os eventos de um pacote específico, ordenados por data decrescente.
     * 
     * @param trackingCode Código de rastreio do pacote
     * @return Lista de EventResponseDTO
     * @throws ResourceNotFoundException se o pacote não existir
     */
    public List<EventResponseDTO> getEventsByTrackingCode(String trackingCode) {
        // Valida se o pacote existe antes de buscar eventos
        if (!packageRepository.existsByTrackingCode(trackingCode)) {
            throw new ResourceNotFoundException(
                    "Pacote com código '" + trackingCode + "' não encontrado");
        }

        // Busca eventos do banco ordenados por timestamp descendente (mais recentes primeiro)
        List<Event> events = eventRepository
                .findByPackageEntity_TrackingCodeOrderByEventTimestampDesc(trackingCode);

        // ✅ Converte lista de entidades para DTOs usando Stream API
        return events.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Lista todos os eventos do sistema.
     * 
     * @return Lista de EventResponseDTO
     */
    public List<EventResponseDTO> getAllEvents() {
        // Busca todos os eventos e converte para DTOs
        return eventRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Deleta um evento específico por ID.
     * 
     * @param eventId ID do evento a ser deletado
     * @throws ResourceNotFoundException se o evento não existir
     */
    @Transactional
    public void deleteEvent(Long eventId) {
        // Busca evento para garantir que existe
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Evento com ID '" + eventId + "' não encontrado"));

        // Deleta evento do banco de dados
        eventRepository.delete(event);
    }

    /**
     * ✅ MÉTODO CRÍTICO: Converte entidade Event para EventResponseDTO.
     * 
     * Este método é a chave para resolver o StackOverflowError:
     * - NÃO inclui o objeto Package completo na resposta
     * - Inclui apenas o trackingCode (String) do pacote
     * - Quebra a referência circular: Event → Package → Event → ...
     * 
     * @param event Entidade JPA Event
     * @return EventResponseDTO pronto para serialização JSON
     */
    private EventResponseDTO convertToDTO(Event event) {
        EventResponseDTO dto = new EventResponseDTO();
        dto.setId(event.getId());
        dto.setEventTimestamp(event.getEventTimestamp());
        dto.setStatus(event.getStatus());
        dto.setDescription(event.getDescription());
        
        // ✅ Apenas o trackingCode, NÃO o objeto Package inteiro
        dto.setTrackingCode(event.getPackageEntity().getTrackingCode());
        
        return dto;
    }
}