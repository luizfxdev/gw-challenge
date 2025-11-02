package com.gwchallenge.repository;

import com.gwchallenge.model.Package;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repositório Spring Data JPA para a entidade Package.
 * 
 * Esta interface herda de JpaRepository, que fornece automaticamente métodos CRUD
 * (Create, Read, Update, Delete) sem necessidade de implementação manual.
 * 
 * O Spring Data JPA gera automaticamente a implementação desta interface em tempo de execução.
 * 
 * Métodos herdados automaticamente do JpaRepository:
 * - save(Package entity) - Salva ou atualiza uma encomenda
 * - findById(String id) - Busca uma encomenda pelo tracking code
 * - findAll() - Retorna todas as encomendas
 * - deleteById(String id) - Deleta uma encomenda pelo tracking code
 * - count() - Retorna o total de encomendas
 * - existsById(String id) - Verifica se uma encomenda existe
 * 
 * Parâmetros de tipo:
 * - Package: a entidade gerenciada por este repositório
 * - String: o tipo da chave primária (tracking_code)
 * 
 * @Repository marca esta interface como um componente de repositório do Spring,
 * permitindo que seja injetada automaticamente em outras classes (Services, Controllers)
 */
@Repository
public interface PackageRepository extends JpaRepository<Package, String> {

    /**
     * Busca uma encomenda pelo código de rastreamento, carregando também seus eventos.
     * 
     * Este método usa JPQL (Java Persistence Query Language) para fazer um JOIN FETCH,
     * que carrega a Package e seus Events em uma única consulta SQL (evita N+1 queries).
     * 
     * Sem o JOIN FETCH:
     * - 1 query para buscar a Package
     * - N queries adicionais para buscar os Events (uma para cada Package)
     * 
     * Com o JOIN FETCH:
     * - 1 única query que busca Package + Events de uma vez
     * 
     * @Query define uma consulta JPQL customizada
     * @Param("trackingCode") vincula o parâmetro do método ao placeholder :trackingCode na query
     * 
     * @param trackingCode o código de rastreamento da encomenda
     * @return Optional contendo a Package com seus Events, ou Optional.empty() se não encontrada
     */
    @Query("SELECT p FROM Package p LEFT JOIN FETCH p.events WHERE p.trackingCode = :trackingCode")
    Optional<Package> findByTrackingCodeWithEvents(@Param("trackingCode") String trackingCode);

    /**
     * Busca uma encomenda pelo código de rastreamento (método de query derivada).
     * 
     * Este é um método de "query method" do Spring Data JPA.
     * O Spring gera automaticamente a implementação baseado no nome do método:
     * - "findBy" indica uma consulta de busca
     * - "TrackingCode" indica o campo a ser usado na cláusula WHERE
     * 
     * SQL gerado automaticamente:
     * SELECT * FROM package WHERE tracking_code = ?
     * 
     * IMPORTANTE: Este método NÃO carrega os eventos automaticamente (lazy loading).
     * Use findByTrackingCodeWithEvents() se precisar dos eventos.
     * 
     * @param trackingCode o código de rastreamento da encomenda
     * @return Optional contendo a Package (sem eventos carregados), ou Optional.empty() se não encontrada
     */
    Optional<Package> findByTrackingCode(String trackingCode);

    /**
     * Verifica se existe uma encomenda com o código de rastreamento informado.
     * 
     * Este é outro método de "query method" do Spring Data JPA.
     * O Spring gera automaticamente a implementação:
     * - "existsBy" indica uma consulta de existência (retorna boolean)
     * - "TrackingCode" indica o campo a ser usado na cláusula WHERE
     * 
     * SQL gerado automaticamente:
     * SELECT CASE WHEN COUNT(*) > 0 THEN TRUE ELSE FALSE END FROM package WHERE tracking_code = ?
     * 
     * Este método é mais eficiente que findByTrackingCode().isPresent() porque:
     * - Não carrega a entidade completa da memória
     * - Executa apenas um COUNT no banco de dados
     * 
     * Uso típico: validar se um tracking code já existe antes de criar uma nova encomenda
     * 
     * @param trackingCode o código de rastreamento a ser verificado
     * @return true se existe uma encomenda com este tracking code, false caso contrário
     */
    boolean existsByTrackingCode(String trackingCode);
}
