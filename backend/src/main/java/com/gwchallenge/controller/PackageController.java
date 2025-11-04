package com.gwchallenge.controller;

import com.gwchallenge.dto.CreatePackageDTO;
import com.gwchallenge.dto.PackageResponseDTO;
import com.gwchallenge.service.PackageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

/**
 * Controlador REST para gerenciar pacotes.
 * 
 * REFATORADO: Agora delega toda lógica para PackageService.
 * ✅ Todos os endpoints retornam DTOs ao invés de entidades JPA.
 */
@RestController
@RequestMapping("/api/packages")
public class PackageController {

    @Autowired
    private PackageService packageService;

    /**
     * GET /api/packages
     * Lista todos os pacotes cadastrados.
     * 
     * @return Lista de PackageResponseDTO
     */
    @GetMapping
    public ResponseEntity<List<PackageResponseDTO>> getAllPackages() {
        List<PackageResponseDTO> packages = packageService.getAllPackages();
        return ResponseEntity.ok(packages);
    }

    /**
     * GET /api/packages/{trackingCode}
     * Busca um pacote específico por código de rastreio.
     * Inclui todos os eventos do pacote.
     * 
     * @param trackingCode Código de rastreio do pacote
     * @return PackageResponseDTO com dados completos do pacote
     */
    @GetMapping("/{trackingCode}")
    public ResponseEntity<PackageResponseDTO> getPackageByTrackingCode(
            @PathVariable String trackingCode) {
        
        PackageResponseDTO pkg = packageService.getPackageByTrackingCode(trackingCode);
        return ResponseEntity.ok(pkg);
    }

    /**
     * POST /api/packages
     * Cria um novo pacote no sistema.
     * 
     * @param createPackageDTO Dados do pacote (validados com @Valid)
     * @return PackageResponseDTO com status 201 Created
     */
    @PostMapping
    public ResponseEntity<PackageResponseDTO> createPackage(
            @Valid @RequestBody CreatePackageDTO createPackageDTO) {
        
        PackageResponseDTO createdPackage = packageService.createPackage(createPackageDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPackage);
    }

    /**
     * DELETE /api/packages/{trackingCode}
     * Deleta um pacote por código de rastreio.
     * Eventos associados são deletados automaticamente (CascadeType.ALL).
     * 
     * @param trackingCode Código de rastreio do pacote
     * @return Status 204 No Content se deletado com sucesso
     */
    @DeleteMapping("/{trackingCode}")
    public ResponseEntity<Void> deletePackage(@PathVariable String trackingCode) {
        packageService.deletePackage(trackingCode);
        return ResponseEntity.noContent().build();
    }
}