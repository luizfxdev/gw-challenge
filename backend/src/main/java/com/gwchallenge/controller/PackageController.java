package com.gwchallenge.controller;

import com.gwchallenge.exception.BusinessException;
import com.gwchallenge.exception.ResourceNotFoundException;
import com.gwchallenge.model.Package;
import com.gwchallenge.repository.EventRepository;
import com.gwchallenge.repository.PackageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

/**
 * PackageController
 *
 * Controlador REST responsável por lidar com as operações relacionadas aos pacotes.
 * Permite criar, listar, buscar pacotes pelo tracking code e deletar pacotes.
 */
@RestController
@RequestMapping("/api/packages")
public class PackageController {

    // Injeta o repositório de pacotes (acesso direto ao banco via JPA)
    @Autowired
    private PackageRepository packageRepository;

    // Injeta o repositório de eventos para permitir remoção de eventos associados
    @Autowired
    private EventRepository eventRepository;

    /**
     * Retorna todos os pacotes cadastrados no sistema.
     */
    @GetMapping
    public ResponseEntity<List<Package>> getAllPackages() {
        List<Package> packages = packageRepository.findAll();
        return ResponseEntity.ok(packages);
    }

    /**
     * Busca um pacote específico através do tracking code.
     *
     * @param trackingCode código de rastreio do pacote
     */
    @GetMapping("/{trackingCode}")
    public ResponseEntity<Package> getPackageByTrackingCode(@PathVariable String trackingCode) {
        Package pkg = packageRepository.findByTrackingCode(trackingCode)
                .orElseThrow(() -> new ResourceNotFoundException("Package with tracking code '" + trackingCode + "' not found"));
        return ResponseEntity.ok(pkg);
    }

    /**
     * Cria um novo pacote no sistema.
     */
    @PostMapping
    public ResponseEntity<Package> createPackage(@Valid @RequestBody Package pkg) {

        // Verifica se já existe um pacote com o mesmo código (regra de negócio)
        if (packageRepository.existsByTrackingCode(pkg.getTrackingCode())) {
            throw new BusinessException("A package with tracking code '" + pkg.getTrackingCode() + "' already exists");
        }

        // Salva o pacote no banco
        Package created = packageRepository.save(pkg);

        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * Deleta um pacote e seus eventos associados (transacional).
     *
     * Executa numa única transação: primeiro elimina eventos relacionados ao trackingCode,
     * depois remove o package. Se o package não existir, retorna 404.
     *
     * @param trackingCode código de rastreamento do pacote a ser removido
     * @return 204 No Content em caso de sucesso
     */
    @DeleteMapping("/{trackingCode}")
    @Transactional
    public ResponseEntity<Void> deletePackage(@PathVariable String trackingCode) {
        // Busca o pacote para verificar se existe
        Package pkg = packageRepository.findByTrackingCode(trackingCode)
                .orElseThrow(() -> new ResourceNotFoundException("Package with tracking code '" + trackingCode + "' not found"));

        // Deleta eventos relacionados (caso existam)
        eventRepository.deleteAll(eventRepository.findByPackageEntity_TrackingCode(trackingCode));

        // Deleta o pacote
        packageRepository.delete(pkg);

        return ResponseEntity.noContent().build();
    }
}
