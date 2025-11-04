package com.gwchallenge.service;

import com.gwchallenge.dto.CreatePackageDTO;
import com.gwchallenge.dto.EventResponseDTO;
import com.gwchallenge.dto.PackageResponseDTO;
import com.gwchallenge.exception.ResourceNotFoundException;
import com.gwchallenge.model.Event;
import com.gwchallenge.model.Package;
import com.gwchallenge.repository.PackageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Serviço responsável pela lógica de negócio relacionada a pacotes.
 * 
 * Responsabilidades:
 * - Criar, buscar e deletar pacotes
 * - Converter entidades JPA para DTOs (com eventos incluídos)
 * - Validar regras de negócio
 */
@Service
public class PackageService {

    @Autowired
    private PackageRepository packageRepository;

    /**
     * Cria um novo pacote no sistema.
     * 
     * @param dto Dados do pacote a ser criado
     * @return PackageResponseDTO com dados do pacote criado
     */
    @Transactional
    public PackageResponseDTO createPackage(CreatePackageDTO dto) {
        // Cria nova entidade Package
        Package pkg = new Package();
        pkg.setTrackingCode(dto.getTrackingCode());
        pkg.setClientName(dto.getClientName());
        pkg.setDeliveryAddress(dto.getDeliveryAddress());

        // Salva no banco de dados
        Package savedPackage = packageRepository.save(pkg);

        // Converte para DTO e retorna
        return convertToDTO(savedPackage);
    }

    /**
     * Busca um pacote específico por código de rastreio.
     * Inclui todos os eventos associados ao pacote.
     * 
     * @param trackingCode Código de rastreio do pacote
     * @return PackageResponseDTO com dados completos do pacote
     * @throws ResourceNotFoundException se o pacote não existir
     */
    public PackageResponseDTO getPackageByTrackingCode(String trackingCode) {
        // Busca pacote no banco
        Package pkg = packageRepository.findByTrackingCode(trackingCode)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Pacote com código '" + trackingCode + "' não encontrado"));

        // ✅ Converte para DTO (incluindo eventos)
        return convertToDTO(pkg);
    }

    /**
     * Lista todos os pacotes do sistema.
     * 
     * @return Lista de PackageResponseDTO
     */
    public List<PackageResponseDTO> getAllPackages() {
        return packageRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Deleta um pacote por código de rastreio.
     * CascadeType.ALL garante que eventos associados também são deletados.
     * 
     * @param trackingCode Código de rastreio do pacote
     * @throws ResourceNotFoundException se o pacote não existir
     */
    @Transactional
    public void deletePackage(String trackingCode) {
        Package pkg = packageRepository.findByTrackingCode(trackingCode)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Pacote com código '" + trackingCode + "' não encontrado"));

        packageRepository.delete(pkg);
    }

    /**
     * ✅ MÉTODO CRÍTICO: Converte entidade Package para PackageResponseDTO.
     * 
     * Também converte todos os eventos do pacote para EventResponseDTO,
     * garantindo que não haja referências circulares na resposta JSON.
     * 
     * @param pkg Entidade JPA Package
     * @return PackageResponseDTO pronto para serialização JSON
     */
    private PackageResponseDTO convertToDTO(Package pkg) {
        PackageResponseDTO dto = new PackageResponseDTO();
        dto.setTrackingCode(pkg.getTrackingCode());
        dto.setClientName(pkg.getClientName());
        dto.setDeliveryAddress(pkg.getDeliveryAddress());

        // Converte lista de eventos (entidades) para lista de DTOs
        List<EventResponseDTO> eventDTOs = pkg.getEvents().stream()
                .map(event -> {
                    EventResponseDTO eventDTO = new EventResponseDTO();
                    eventDTO.setId(event.getId());
                    eventDTO.setStatus(event.getStatus());
                    eventDTO.setDescription(event.getDescription());
                    eventDTO.setEventTimestamp(event.getEventTimestamp());
                    // ✅ Apenas o trackingCode, não o objeto Package completo
                    eventDTO.setTrackingCode(pkg.getTrackingCode());
                    return eventDTO;
                })
                .collect(Collectors.toList());

        dto.setEvents(eventDTOs);
        return dto;
    }
}