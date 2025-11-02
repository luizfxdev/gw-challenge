package com.gwchallenge.repository;

import com.gwchallenge.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * EventRepository
 *
 * Repositório JPA responsável por operações com a entidade Event.
 * Fornece métodos prontos (findAll, save, findById, etc.) e
 * consultas personalizadas utilizando nomenclatura derivada.
 */
@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    /**
     * Busca eventos associados a um determinado pacote,
     * ordenando pelo timestamp (data/hora) mais recente primeiro.
     *
     * @param trackingCode código de rastreamento do pacote
     * @return lista de eventos ordenada descendentemente por data/hora
     */
    List<Event> findByPackageEntity_TrackingCodeOrderByEventTimestampDesc(String trackingCode);

    /**
     * Busca eventos de um pacote sem ordenação específica.
     *
     * @param trackingCode código de rastreamento do pacote
     * @return lista de eventos
     */
    List<Event> findByPackageEntity_TrackingCode(String trackingCode);
}
