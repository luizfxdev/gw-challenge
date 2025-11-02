package com.gwchallenge.model;

/**
 * Enum que representa os possíveis status de uma encomenda durante o seu ciclo de entrega.
 * Cada valor do enum corresponderá a um estado no fluxo de rastreamento da Package.
 * 
 * Os nomes são em inglês para manter o padrão do código,
 * e os comentários servem como guia para entendimento do status.
 */
public enum EventStatus {

    /** A encomenda foi registrada no sistema, mas ainda não saiu do local de origem. */
    CREATED,

    /** A encomenda foi despachada e está a caminho do centro de distribuição. */
    SHIPPED,

    /** A encomenda chegou ao centro de distribuição e está aguardando envio. */
    IN_TRANSIT,

    /** A encomenda saiu para entrega ao destinatário. */
    OUT_FOR_DELIVERY,

    /** A encomenda foi entregue com sucesso ao cliente. */
    DELIVERED,

    /** A tentativa de entrega falhou (ex: destinatário ausente, endereço incorreto etc.). */
    UNDELIVERED,

    /** A encomenda foi devolvida ao remetente. */
    RETURNED
}
