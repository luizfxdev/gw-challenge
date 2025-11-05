# 🔧 Backend - GW Challenge

<div align="center">

![Java](https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-2.7.18-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![Spring Data JPA](https://img.shields.io/badge/Spring_Data_JPA-2.7.18-6DB33F?style=for-the-badge&logo=spring&logoColor=white)
![Maven](https://img.shields.io/badge/Maven-3.8-C71A36?style=for-the-badge&logo=apache-maven&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14-336791?style=for-the-badge&logo=postgresql&logoColor=white)

**API REST completa para rastreamento de encomendas**

[🏠 Voltar ao README Principal](../README.md)

</div>

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Arquitetura](#-arquitetura)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Entidades JPA](#-entidades-jpa)
- [DTOs (Data Transfer Objects)](#-dtos-data-transfer-objects)
- [Services](#-services)
- [Controllers REST](#-controllers-rest)
- [Endpoints da API](#-endpoints-da-api)
- [Validações de Negócio](#-validações-de-negócio)
- [Desafios Enfrentados](#-desafios-enfrentados)
- [Exemplos de Requisições](#-exemplos-de-requisições)
- [Lógica Implementada](#-lógica-implementada)
- [Como Expandir](#-como-expandir)
- [Testes](#-testes)

---

## 🎯 Visão Geral

O backend do **GW Challenge** é uma API REST robusta construída com **Spring Boot 2.7.18** que fornece:

✅ **CRUD Completo de Pacotes** - Criar, consultar, atualizar e deletar pacotes  
✅ **Registro de Eventos** - Adicionar eventos de rastreamento com timestamps  
✅ **Consulta por Código** - Buscar pacotes pelo código de rastreio  
✅ **Histórico Completo** - Visualizar todos os eventos de um pacote ordenados  
✅ **Validações Robustas** - Regras de negócio em todas as camadas  
✅ **Tratamento de Erros** - Respostas HTTP padronizadas  
✅ **Serialização Segura** - DTOs para evitar referências circulares  

---

## 🏗️ Arquitetura

### Padrão em Camadas

```
┌─────────────────────────────────────────────────────────┐
│                   CONTROLLER LAYER                      │
│          (PackageController, EventController)           │
│                  - Recebe requisições HTTP              │
│                  - Valida dados de entrada              │
│                  - Retorna ResponseEntity               │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│                    SERVICE LAYER                        │
│            (PackageService, EventService)               │
│                  - Lógica de negócio                    │
│                  - Validações complexas                 │
│                  - Conversão Entity ↔ DTO               │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│                  REPOSITORY LAYER                       │
│          (PackageRepository, EventRepository)           │
│                  - Acesso ao banco de dados             │
│                  - Queries personalizadas               │
│                  - Spring Data JPA                      │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│                    ENTITY LAYER                         │
│                 (Package, Event)                        │
│                  - Entidades JPA                        │
│                  - Mapeamento OR                       │
│                  - Relacionamentos                      │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│                  PostgreSQL Database                    │
│              (package, event, user tables)              │
└─────────────────────────────────────────────────────────┘
```

### Princípios Aplicados

- **Separação de Responsabilidades** - Cada camada tem uma função específica
- **Inversão de Dependência** - Controllers dependem de interfaces (Services)
- **DTOs para Transferência** - Entidades JPA nunca são expostas diretamente
- **Single Responsibility** - Cada classe tem uma única responsabilidade
- **Open/Closed** - Aberto para extensão, fechado para modificação

---

## 📁 Estrutura do Projeto

```
backend/
├── src/main/java/com/gwchallenge/
│   ├── GwChallengeApplication.java        # Classe principal Spring Boot
│   │
│   ├── controller/                        # Camada de Controllers REST
│   │   ├── EventController.java           # Endpoints de eventos
│   │   └── PackageController.java         # Endpoints de pacotes
│   │
│   ├── dto/                               # Data Transfer Objects
│   │   ├── CreateEventDTO.java            # DTO para criar evento
│   │   ├── CreatePackageDTO.java          # DTO para criar pacote
│   │   ├── EventResponseDTO.java          # DTO resposta de evento
│   │   └── PackageResponseDTO.java        # DTO resposta de pacote
│   │
│   ├── model/                             # Entidades JPA
│   │   ├── Event.java                     # Entidade Event
│   │   ├── EventStatus.java               # Enum de status
│   │   └── Package.java                   # Entidade Package
│   │
│   ├── repository/                        # Repositories Spring Data JPA
│   │   ├── EventRepository.java           # Acesso a dados de Event
│   │   └── PackageRepository.java         # Acesso a dados de Package
│   │
│   ├── service/                           # Lógica de negócio
│   │   ├── EventService.java              # Regras de negócio de eventos
│   │   └── PackageService.java            # Regras de negócio de pacotes
│   │
│   └── exception/                         # Exceções customizadas
│       ├── ResourceNotFoundException.java
│       └── GlobalExceptionHandler.java
│
├── src/main/resources/
│   ├── application.yml                    # Configurações principais
│   └── application-dev.properties         # Configurações de desenvolvimento
│
├── pom.xml                                # Dependências Maven
├── Dockerfile                             # Containerização
└── BACKEND.md                             # Esta documentação
```

---

## 📦 Entidades JPA

### Event.java

```java
@Entity
@Table(name = "event")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "event_timestamp", nullable = false)
    @NotNull(message = "Event timestamp cannot be null")
    private LocalDateTime eventTimestamp;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    @NotNull(message = "Event status cannot be null")
    private EventStatus status;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    // ✅ @JsonBackReference previne serialização infinita
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tracking_code", nullable = false)
    private Package packageEntity;

    // Getters, Setters, Construtores omitidos para brevidade
}
```

**Características:**
- ✅ ID auto-incrementado (BIGSERIAL no PostgreSQL)
- ✅ Relacionamento **ManyToOne** com Package (muitos eventos para um pacote)
- ✅ **FetchType.LAZY** - Não carrega Package automaticamente (performance)
- ✅ **@JsonBackReference** - Quebra referência circular na serialização
- ✅ Enum **EventStatus** armazenado como String
- ✅ **toString()** exclui `packageEntity` para evitar loops

### Package.java

```java
@Entity
@Table(name = "package")
public class Package {

    @Id
    @Column(name = "tracking_code", length = 50, nullable = false)
    @NotBlank(message = "Tracking code cannot be blank")
    @Size(min = 1, max = 50)
    private String trackingCode;

    @Column(name = "client_name", length = 100, nullable = false)
    @NotBlank(message = "Client name cannot be blank")
    private String clientName;

    @Column(name = "delivery_address", length = 255, nullable = false)
    @NotBlank(message = "Delivery address cannot be blank")
    private String deliveryAddress;

    // ✅ @JsonManagedReference permite serialização dos eventos
    @JsonManagedReference
    @OneToMany(
        mappedBy = "packageEntity",
        cascade = CascadeType.ALL,
        orphanRemoval = true,
        fetch = FetchType.LAZY
    )
    private List<Event> events = new ArrayList<>();

    // Métodos auxiliares para manter consistência bidirecional
    public void addEvent(Event event) {
        events.add(event);
        event.setPackageEntity(this);
    }

    public void removeEvent(Event event) {
        events.remove(event);
        event.setPackageEntity(null);
    }
}
```

**Características:**
- ✅ **trackingCode** como chave primária (String)
- ✅ Relacionamento **OneToMany** com Event
- ✅ **CascadeType.ALL** - Operações propagam para eventos
- ✅ **orphanRemoval = true** - Remove eventos órfãos automaticamente
- ✅ **FetchType.LAZY** - Eventos carregados apenas quando acessados
- ✅ Métodos auxiliares para manter consistência bidirecional

### EventStatus.java (Enum)

```java
public enum EventStatus {
    OUT_FOR_DELIVERY,  // Saiu para entrega
    IN_TRANSIT,        // Em trânsito
    UNDELIVERED,       // Não entregue
    DELIVERED          // Entregue
}
```

---

## 📋 DTOs (Data Transfer Objects)

### Por que usar DTOs?

❌ **Sem DTOs (Problema):**
```java
// Controller retorna entidade JPA diretamente
@PostMapping("/events")
public ResponseEntity<Event> create(@RequestBody CreateEventDTO dto) {
    Event event = eventRepository.save(...);
    return ResponseEntity.ok(event); // ❌ LOOP INFINITO na serialização!
}

// JSON resultante (ERRO):
{
  "id": 1,
  "status": "IN_TRANSIT",
  "packageEntity": {
    "trackingCode": "GWTEST0001",
    "events": [
      {
        "id": 1,
        "packageEntity": { ... } // LOOP INFINITO!
      }
    ]
  }
}
```

✅ **Com DTOs (Solução):**
```java
// Controller retorna DTO
@PostMapping("/events")
public ResponseEntity<EventResponseDTO> create(@RequestBody CreateEventDTO dto) {
    EventResponseDTO responseDTO = eventService.createEvent(...);
    return ResponseEntity.ok(responseDTO); // ✅ SEM LOOPS!
}

// JSON resultante (CORRETO):
{
  "id": 1,
  "status": "IN_TRANSIT",
  "description": "Pacote em trânsito",
  "trackingCode": "GWTEST0001" // Apenas String, não objeto Package
}
```

### CreateEventDTO.java

```java
public class CreateEventDTO {
    
    @NotNull(message = "Status cannot be null")
    private EventStatus status;
    
    private String description;
    
    @NotBlank(message = "Event timestamp cannot be blank")
    private String eventTimestamp; // ISO 8601: "2025-11-05T14:33:00.000Z"
    
    // Método auxiliar para converter String → LocalDateTime
    public LocalDateTime getEventTimestampAsLocalDateTime() {
        String cleanTimestamp = eventTimestamp.replace("Z", "");
        if (cleanTimestamp.contains(".")) {
            cleanTimestamp = cleanTimestamp.substring(0, cleanTimestamp.indexOf('.'));
        }
        return LocalDateTime.parse(cleanTimestamp, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
    }
}
```

### EventResponseDTO.java

```java
public class EventResponseDTO {
    
    private Long id;
    private LocalDateTime eventTimestamp;
    private EventStatus status;
    private String description;
    private String trackingCode; // ✅ Apenas String, não Package completo
    
    // Getters, Setters, Construtores
}
```

### CreatePackageDTO.java

```java
public class CreatePackageDTO {
    
    @NotBlank(message = "Tracking code cannot be blank")
    @Size(min = 1, max = 50)
    private String trackingCode;
    
    @NotBlank(message = "Client name cannot be blank")
    @Size(min = 1, max = 100)
    private String clientName;
    
    @NotBlank(message = "Delivery address cannot be blank")
    private String deliveryAddress;
    
    // Getters, Setters, Construtores
}
```

### PackageResponseDTO.java

```java
public class PackageResponseDTO {
    
    private String trackingCode;
    private String clientName;
    private String deliveryAddress;
    private List<EventResponseDTO> events = new ArrayList<>();
    
    // Getters, Setters, Construtores
}
```

---

## 🔧 Services

### EventService.java

```java
@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private PackageRepository packageRepository;

    /**
     * Cria novo evento e retorna DTO (sem referência circular)
     */
    @Transactional
    public EventResponseDTO createEvent(String trackingCode, CreateEventDTO dto) {
        // 1. Buscar pacote (valida se existe)
        Package pkg = packageRepository.findByTrackingCode(trackingCode)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Pacote com código '" + trackingCode + "' não encontrado"));

        // 2. Criar entidade Event
        Event event = new Event();
        event.setStatus(dto.getStatus());
        event.setDescription(dto.getDescription());
        event.setEventTimestamp(dto.getEventTimestampAsLocalDateTime());
        event.setPackageEntity(pkg);

        // 3. Salvar no banco
        Event savedEvent = eventRepository.save(event);

        // 4. ✅ Converter para DTO ANTES de retornar
        return convertToDTO(savedEvent);
    }

    /**
     * ✅ CRÍTICO: Converte Event → EventResponseDTO
     * Quebra referência circular ao incluir apenas trackingCode (String)
     */
    private EventResponseDTO convertToDTO(Event event) {
        EventResponseDTO dto = new EventResponseDTO();
        dto.setId(event.getId());
        dto.setEventTimestamp(event.getEventTimestamp());
        dto.setStatus(event.getStatus());
        dto.setDescription(event.getDescription());
        dto.setTrackingCode(event.getPackageEntity().getTrackingCode()); // Apenas String
        return dto;
    }
}
```

**Responsabilidades:**
- ✅ Validar se pacote existe antes de criar evento
- ✅ Converter DTO de entrada → Entidade JPA
- ✅ Salvar no banco de dados
- ✅ Converter Entidade JPA → DTO de resposta
- ✅ Garantir que DTOs não contenham referências circulares

### PackageService.java

```java
@Service
public class PackageService {

    @Autowired
    private PackageRepository packageRepository;

    @Transactional
    public PackageResponseDTO createPackage(CreatePackageDTO dto) {
        Package pkg = new Package();
        pkg.setTrackingCode(dto.getTrackingCode());
        pkg.setClientName(dto.getClientName());
        pkg.setDeliveryAddress(dto.getDeliveryAddress());

        Package savedPackage = packageRepository.save(pkg);
        return convertToDTO(savedPackage);
    }

    public PackageResponseDTO getPackageByTrackingCode(String trackingCode) {
        Package pkg = packageRepository.findByTrackingCode(trackingCode)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Pacote com código '" + trackingCode + "' não encontrado"));
        return convertToDTO(pkg);
    }

    /**
     * Converte Package → PackageResponseDTO (incluindo eventos)
     */
    private PackageResponseDTO convertToDTO(Package pkg) {
        PackageResponseDTO dto = new PackageResponseDTO();
        dto.setTrackingCode(pkg.getTrackingCode());
        dto.setClientName(pkg.getClientName());
        dto.setDeliveryAddress(pkg.getDeliveryAddress());

        // Converter eventos para DTOs
        List<EventResponseDTO> eventDTOs = pkg.getEvents().stream()
                .map(event -> {
                    EventResponseDTO eventDTO = new EventResponseDTO();
                    eventDTO.setId(event.getId());
                    eventDTO.setStatus(event.getStatus());
                    eventDTO.setDescription(event.getDescription());
                    eventDTO.setEventTimestamp(event.getEventTimestamp());
                    eventDTO.setTrackingCode(pkg.getTrackingCode());
                    return eventDTO;
                })
                .collect(Collectors.toList());

        dto.setEvents(eventDTOs);
        return dto;
    }
}
```

---

## 🌐 Controllers REST

### EventController.java

```java
@RestController
@RequestMapping("/api/events")
public class EventController {

    @Autowired
    private EventService eventService;

    /**
     * GET /api/events
     * Lista todos os eventos cadastrados
     */
    @GetMapping
    public ResponseEntity<List<EventResponseDTO>> getAllEvents() {
        List<EventResponseDTO> events = eventService.getAllEvents();
        return ResponseEntity.ok(events);
    }

    /**
     * GET /api/events/package/{trackingCode}
     * Busca eventos de um pacote específico
     */
    @GetMapping("/package/{trackingCode}")
    public ResponseEntity<List<EventResponseDTO>> getEventsByPackage(
            @PathVariable String trackingCode) {
        List<EventResponseDTO> events = eventService.getEventsByTrackingCode(trackingCode);
        return ResponseEntity.ok(events);
    }

    /**
     * POST /api/events/package/{trackingCode}
     * Cria novo evento para um pacote
     * ✅ Retorna DTO (sem referência circular)
     */
    @PostMapping("/package/{trackingCode}")
    public ResponseEntity<EventResponseDTO> createEvent(
            @PathVariable String trackingCode,
            @Valid @RequestBody CreateEventDTO createEventDTO) {

        EventResponseDTO createdEvent = eventService.createEvent(trackingCode, createEventDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdEvent);
    }

    /**
     * DELETE /api/events/{eventId}
     * Deleta evento por ID
     */
    @DeleteMapping("/{eventId}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long eventId) {
        eventService.deleteEvent(eventId);
        return ResponseEntity.noContent().build();
    }
}
```

### PackageController.java

```java
@RestController
@RequestMapping("/api/packages")
public class PackageController {

    @Autowired
    private PackageService packageService;

    /**
     * GET /api/packages
     * Lista todos os pacotes
     */
    @GetMapping
    public ResponseEntity<List<PackageResponseDTO>> getAllPackages() {
        List<PackageResponseDTO> packages = packageService.getAllPackages();
        return ResponseEntity.ok(packages);
    }

    /**
     * GET /api/packages/{trackingCode}
     * Busca pacote por código de rastreio
     */
    @GetMapping("/{trackingCode}")
    public ResponseEntity<PackageResponseDTO> getPackageByTrackingCode(
            @PathVariable String trackingCode) {
        PackageResponseDTO pkg = packageService.getPackageByTrackingCode(trackingCode);
        return ResponseEntity.ok(pkg);
    }

    /**
     * POST /api/packages
     * Cria novo pacote
     */
    @PostMapping
    public ResponseEntity<PackageResponseDTO> createPackage(
            @Valid @RequestBody CreatePackageDTO createPackageDTO) {
        PackageResponseDTO createdPackage = packageService.createPackage(createPackageDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPackage);
    }

    /**
     * DELETE /api/packages/{trackingCode}
     * Deleta pacote (e seus eventos via CASCADE)
     */
    @DeleteMapping("/{trackingCode}")
    public ResponseEntity<Void> deletePackage(@PathVariable String trackingCode) {
        packageService.deletePackage(trackingCode);
        return ResponseEntity.noContent().build();
    }
}
```

---

## 📡 Endpoints da API

### Pacotes (Packages)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/packages` | Lista todos os pacotes |
| `GET` | `/api/packages/{trackingCode}` | Busca pacote específico |
| `POST` | `/api/packages` | Cria novo pacote |
| `DELETE` | `/api/packages/{trackingCode}` | Deleta pacote |

### Eventos (Events)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/events` | Lista todos os eventos |
| `GET` | `/api/events/package/{trackingCode}` | Lista eventos de um pacote |
| `POST` | `/api/events/package/{trackingCode}` | Cria novo evento |
| `DELETE` | `/api/events/{eventId}` | Deleta evento |

---

## ✅ Validações de Negócio

### 1. Validação de Campos Obrigatórios

```java
// Bean Validation (JSR 380)
@NotBlank(message = "Tracking code cannot be blank")
@Size(min = 1, max = 50, message = "Tracking code must be between 1 and 50 characters")
private String trackingCode;
```

### 2. Validação de Pacote Existente

```java
Package pkg = packageRepository.findByTrackingCode(trackingCode)
        .orElseThrow(() -> new ResourceNotFoundException(
                "Pacote com código '" + trackingCode + "' não encontrado"));
```

### 3. Validação de Formato de Timestamp

```java
public LocalDateTime getEventTimestampAsLocalDateTime() {
    try {
        String cleanTimestamp = eventTimestamp.replace("Z", "");
        if (cleanTimestamp.contains(".")) {
            cleanTimestamp = cleanTimestamp.substring(0, cleanTimestamp.indexOf('.'));
        }
        return LocalDateTime.parse(cleanTimestamp, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
    } catch (DateTimeParseException e) {
        throw new IllegalArgumentException("Formato de data inválido: " + eventTimestamp);
    }
}
```

---

## 🚨 Desafios Enfrentados

### 1. StackOverflowError na Serialização JSON ✅ RESOLVIDO

**Problema:**
```java
// Referência circular infinita:
Package → events (List<Event>) → packageEntity (Package) → events → ...

// Resultado ao tentar serializar:
java.lang.StackOverflowError
    at com.fasterxml.jackson.databind.ser.std.BeanSerializerBase.serializeFields
    at com.fasterxml.jackson.databind.ser.BeanSerializer.serialize
    ... (loop infinito)
```

**Tentativas que NÃO funcionaram:**
- ❌ `@JsonIgnore` em `Package.events` (perdemos os eventos na resposta)
- ❌ `@JsonIgnoreProperties({"events"})` mal posicionado
- ❌ `FetchType.EAGER` (piorou a performance)

**Solução Final:**
1. ✅ Criar DTOs (`EventResponseDTO`, `PackageResponseDTO`)
2. ✅ Service layer converte Entity → DTO
3. ✅ DTOs contêm apenas dados primitivos (sem referências circulares)
4. ✅ `EventResponseDTO.trackingCode` é String, não objeto Package

**Código da Solução:**
```java
// Service converte Event → EventResponseDTO
private EventResponseDTO convertToDTO(Event event) {
    EventResponseDTO dto = new EventResponseDTO();
    dto.setId(event.getId());
    dto.setEventTimestamp(event.getEventTimestamp());
    dto.setStatus(event.getStatus());
    dto.setDescription(event.getDescription());
    dto.setTrackingCode(event.getPackageEntity().getTrackingCode()); // ✅ Apenas String
    return dto;
}

// Controller retorna DTO
@PostMapping("/package/{trackingCode}")
public ResponseEntity<EventResponseDTO> createEvent(...) {
    EventResponseDTO dto = eventService.createEvent(...);
    return ResponseEntity.ok(dto); // ✅ Sem loops!
}
```

### 2. Problema com Lombok e Compilação ✅ RESOLVIDO

**Problema:**
```bash
[ERROR] cannot find symbol: method getId()
[ERROR] cannot find symbol: method getTrackingCode()
[ERROR] cannot find symbol: method setPackageEntity(Package)
```

**Causa:**
- Lombok `@Data` não estava gerando getters/setters corretamente
- Conflito entre Lombok e anotações JPA
- Lombok gerando `toString()` com referências circulares

**Solução:**
1. ✅ Remover Lombok das entidades JPA
2. ✅ Implementar getters/setters manualmente
3. ✅ Criar `toString()` excluindo campos bidirecionais:
```java
@Override
public String toString() {
    return "Event{" +
            "id=" + id +
            ", status=" + status +
            ", description='" + description + '\'' +
            // Sem packageEntity para evitar loop
            '}';
}
```

### 3. N+1 Query Problem ✅ RESOLVIDO

**Problema:**
```java
// Buscar todos os pacotes
List<Package> packages = packageRepository.findAll(); // 1 query

// Ao acessar eventos, gera 1 query para CADA pacote
for (Package p : packages) {
    System.out.println(p.getEvents().size()); // N queries adicionais
}

// Total: 1 + N queries (péssimo para performance!)
```

**Solução:**
```java
// Usar JOIN FETCH para carregar tudo em 1 query
@Query("SELECT DISTINCT p FROM Package p LEFT JOIN FETCH p.events")
List<Package> findAllWithEvents();

// Resultado: 1 query com JOIN
// SELECT p.*, e.* FROM package p LEFT JOIN event e ON p.tracking_code = e.tracking_code
```

### 4. FetchType EAGER vs LAZY ✅ RESOLVIDO

**Antes:**
```java
@OneToMany(fetch = FetchType.EAGER) // ❌ Carrega SEMPRE, mesmo sem usar
private List<Event> events;
```

**Depois:**
```java
@OneToMany(fetch = FetchType.LAZY) // ✅ Carrega apenas quando acessado
private List<Event> events;
```

**Resultado:**
- ✅ Performance melhorada (menos queries)
- ✅ Flexibilidade (carregar apenas quando necessário)
- ✅ Controle fino com `JOIN FETCH` quando precisar

---

## 📨 Exemplos de Requisições

### 1. Criar Pacote

**Request:**
```http
POST /api/packages
Content-Type: application/json

{
  "trackingCode": "GWTEST0001",
  "clientName": "João Silva",
  "deliveryAddress": "Rua das Flores, 123, São Paulo, SP"
}
```

**Response (201 Created):**
```json
{
  "trackingCode": "GWTEST0001",
  "clientName": "João Silva",
  "deliveryAddress": "Rua das Flores, 123, São Paulo, SP",
  "events": []
}
```

### 2. Registrar Evento

**Request:**
```http
POST /api/events/package/GWTEST0001
Content-Type: application/json

{
  "status": "OUT_FOR_DELIVERY",
  "description": "Pacote saiu para entrega ao destinatário",
  "eventTimestamp": "2025-11-05T14:33:00.000Z"
}
```

**Response (201 Created):**
```json
{
  "id": 42,
  "eventTimestamp": "2025-11-05T14:33:00",
  "status": "OUT_FOR_DELIVERY",
  "description": "Pacote saiu para entrega ao destinatário",
  "trackingCode": "GWTEST0001"
}
```

### 3. Buscar Pacote com Eventos

**Request:**
```http
GET /api/packages/GWTEST0001
```

**Response (200 OK):**
```json
{
  "trackingCode": "GWTEST0001",
  "clientName": "João Silva",
  "deliveryAddress": "Rua das Flores, 123, São Paulo, SP",
  "events": [
    {
      "id": 42,
      "eventTimestamp": "2025-11-05T14:33:00",
      "status": "OUT_FOR_DELIVERY",
      "description": "Pacote saiu para entrega ao destinatário",
      "trackingCode": "GWTEST0001"
    },
    {
      "id": 41,
      "eventTimestamp": "2025-11-04T18:09:15",
      "status": "IN_TRANSIT",
      "description": "Pacote saiu do centro de distribuição",
      "trackingCode": "GWTEST0001"
    }
  ]
}
```

### 4. Erro - Pacote Não Encontrado

**Request:**
```http
GET /api/packages/INVALIDO123
```

**Response (404 Not Found):**
```json
{
  "timestamp": "2025-11-05T14:35:00",
  "status": 404,
  "error": "Not Found",
  "message": "Pacote com código 'INVALIDO123' não encontrado",
  "path": "/api/packages/INVALIDO123"
}
```

### 5. Erro - Validação Falhou

**Request:**
```http
POST /api/packages
Content-Type: application/json

{
  "trackingCode": "ABC",
  "clientName": "",
  "deliveryAddress": ""
}
```

**Response (400 Bad Request):**
```json
{
  "timestamp": "2025-11-05T14:36:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "errors": [
    "Client name cannot be blank",
    "Delivery address cannot be blank"
  ],
  "path": "/api/packages"
}
```

---

## 🧠 Lógica Implementada

### Fluxo de Criação de Pacote

```
1. Usuário envia POST /api/packages
          ↓
2. PackageController recebe requisição
          ↓
3. @Valid valida CreatePackageDTO (campos obrigatórios, tamanhos)
          ↓
4. PackageController delega para PackageService
          ↓
5. PackageService cria entidade Package
          ↓
6. PackageRepository.save(package) persiste no banco
          ↓
7. PackageService converte Package → PackageResponseDTO
          ↓
8. PackageController retorna ResponseEntity<PackageResponseDTO>
          ↓
9. Spring serializa DTO para JSON (SEM referências circulares)
          ↓
10. Cliente recebe JSON com status 201 Created
```

### Fluxo de Registro de Evento

```
1. Usuário envia POST /api/events/package/{trackingCode}
          ↓
2. EventController recebe requisição + trackingCode
          ↓
3. @Valid valida CreateEventDTO
          ↓
4. EventController delega para EventService
          ↓
5. EventService busca Package pelo trackingCode
          ↓
6. Se Package não existe → ResourceNotFoundException (404)
          ↓
7. Se existe, cria entidade Event
          ↓
8. Event.setPackageEntity(package) estabelece relacionamento
          ↓
9. EventRepository.save(event) persiste no banco
          ↓
10. EventService converte Event → EventResponseDTO
          ↓
11. EventController retorna ResponseEntity<EventResponseDTO>
          ↓
12. Spring serializa DTO para JSON (trackingCode é String, não Package)
          ↓
13. Cliente recebe JSON com status 201 Created
```

### Fluxo de Busca de Pacote

```
1. Usuário envia GET /api/packages/{trackingCode}
          ↓
2. PackageController recebe requisição
          ↓
3. PackageController delega para PackageService
          ↓
4. PackageService busca Package no banco (PackageRepository)
          ↓
5. Se não encontrar → ResourceNotFoundException (404)
          ↓
6. Se encontrar, carrega eventos (FetchType.LAZY)
          ↓
7. PackageService converte Package → PackageResponseDTO
          ↓
8. PackageService converte cada Event → EventResponseDTO
          ↓
9. PackageResponseDTO.events contém lista de EventResponseDTO
          ↓
10. PackageController retorna ResponseEntity<PackageResponseDTO>
          ↓
11. Spring serializa DTO para JSON
          ↓
12. Cliente recebe JSON com status 200 OK
```

---

## 🚀 Como Expandir

### 1. Adicionar Autenticação JWT

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .authorizeRequests()
            .antMatchers("/api/auth/**").permitAll()
            .anyRequest().authenticated()
            .and()
            .addFilter(new JwtAuthenticationFilter())
            .addFilter(new JwtAuthorizationFilter());
        return http.build();
    }
}
```

### 2. Adicionar Paginação

```java
@GetMapping("/events/package/{trackingCode}")
public ResponseEntity<Page<EventResponseDTO>> getPackageEvents(
        @PathVariable String trackingCode,
        @PageableDefault(size = 20, sort = "eventTimestamp", direction = Sort.Direction.DESC)
        Pageable pageable) {
    Page<EventResponseDTO> events = eventService.getEventsByTrackingCode(trackingCode, pageable);
    return ResponseEntity.ok(events);
}
```

### 3. Adicionar Filtros Avançados

```java
@GetMapping("/packages/search")
public ResponseEntity<List<PackageResponseDTO>> searchPackages(
        @RequestParam(required = false) String clientName,
        @RequestParam(required = false) EventStatus status,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate createdAfter) {
    List<PackageResponseDTO> packages = packageService.search(clientName, status, createdAfter);
    return ResponseEntity.ok(packages);
}
```

### 4. Adicionar Notificações por Email

```java
@Service
public class NotificationService {
    
    @Autowired
    private JavaMailSender mailSender;
    
    public void notifyEventRegistered(Event event) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(event.getPackageEntity().getClientEmail());
        message.setSubject("Atualização de Rastreamento");
        message.setText("Seu pacote foi atualizado para: " + event.getStatus());
        mailSender.send(message);
    }
}
```

### 5. Adicionar Cache

```java
@Service
@CacheConfig(cacheNames = "packages")
public class PackageService {
    
    @Cacheable(key = "#trackingCode")
    public PackageResponseDTO getPackageByTrackingCode(String trackingCode) {
        // ...
    }
    
    @CacheEvict(key = "#trackingCode")
    public void updatePackage(String trackingCode, UpdatePackageDTO dto) {
        // ...
    }
}
```

### 6. Adicionar Auditoria

```java
@Entity
@Table(name = "audit_log")
public class AuditLog {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String entityType;
    private String entityId;
    private String action; // CREATE, UPDATE, DELETE
    
    @Column(columnDefinition = "jsonb")
    private String oldValues;
    
    @Column(columnDefinition = "jsonb")
    private String newValues;
    
    private Long userId;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
}
```

---

## 🧪 Testes

### Teste Unitário - PackageService

```java
@SpringBootTest
public class PackageServiceTest {
    
    @Autowired
    private PackageService packageService;
    
    @MockBean
    private PackageRepository packageRepository;
    
    @Test
    public void testCreatePackage() {
        // Arrange
        CreatePackageDTO dto = new CreatePackageDTO();
        dto.setTrackingCode("GWTEST0001");
        dto.setClientName("João Silva");
        dto.setDeliveryAddress("Rua X, 123");
        
        Package pkg = new Package();
        pkg.setTrackingCode("GWTEST0001");
        
        when(packageRepository.save(any(Package.class))).thenReturn(pkg);
        
        // Act
        PackageResponseDTO result = packageService.createPackage(dto);
        
        // Assert
        assertNotNull(result);
        assertEquals("GWTEST0001", result.getTrackingCode());
        verify(packageRepository, times(1)).save(any(Package.class));
    }
    
    @Test
    public void testGetPackageNotFound() {
        // Arrange
        when(packageRepository.findByTrackingCode("INVALID"))
                .thenReturn(Optional.empty());
        
        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            packageService.getPackageByTrackingCode("INVALID");
        });
    }
}
```

### Teste de Integração - EventController

```java
@SpringBootTest
@AutoConfigureMockMvc
public class EventControllerIntegrationTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @Test
    public void testCreateEvent() throws Exception {
        // Arrange
        CreateEventDTO dto = new CreateEventDTO();
        dto.setStatus(EventStatus.IN_TRANSIT);
        dto.setDescription("Pacote em trânsito");
        dto.setEventTimestamp("2025-11-05T14:33:00.000Z");
        
        String jsonRequest = objectMapper.writeValueAsString(dto);
        
        // Act & Assert
        mockMvc.perform(post("/api/events/package/GWTEST0001")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonRequest))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.status").value("IN_TRANSIT"))
                .andExpect(jsonPath("$.trackingCode").value("GWTEST0001"));
    }
    
    @Test
    public void testCreateEventPackageNotFound() throws Exception {
        // Arrange
        CreateEventDTO dto = new CreateEventDTO();
        dto.setStatus(EventStatus.IN_TRANSIT);
        dto.setDescription("Test");
        dto.setEventTimestamp("2025-11-05T14:33:00.000Z");
        
        String jsonRequest = objectMapper.writeValueAsString(dto);
        
        // Act & Assert
        mockMvc.perform(post("/api/events/package/INVALID")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonRequest))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message")
                        .value("Pacote com código 'INVALID' não encontrado"));
    }
}
```

---

## 📊 Dependências Maven (pom.xml)

```xml
<dependencies>
    <!-- Spring Boot Web -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
        <version>2.7.18</version>
    </dependency>
    
    <!-- Spring Data JPA -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
        <version>2.7.18</version>
    </dependency>
    
    <!-- Validation -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
        <version>2.7.18</version>
    </dependency>
    
    <!-- PostgreSQL Driver -->
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
        <version>42.6.0</version>
        <scope>runtime</scope>
    </dependency>
    
    <!-- Spring Boot DevTools -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-devtools</artifactId>
        <scope>runtime</scope>
        <optional>true</optional>
    </dependency>
    
    <!-- Spring Boot Test -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

---

## 📈 Performance

### Índices Criados no Banco

```sql
CREATE INDEX idx_package_tracking_code ON package(tracking_code);
CREATE INDEX idx_event_tracking_code ON event(tracking_code);
CREATE INDEX idx_event_timestamp ON event(event_timestamp);
```

### Otimizações Implementadas

✅ **Lazy Loading** - Relacionamentos carregados sob demanda  
✅ **JOIN FETCH** - Evita N+1 queries quando necessário  
✅ **Índices** - Busca por trackingCode e timestamp otimizada  
✅ **DTOs** - Serialização mais rápida (sem Hibernate proxies)  
✅ **Connection Pooling** - Reutilização de conexões com HikariCP  

---

## 🔐 Segurança

### Implementações Atuais

✅ **CORS Configurado** - Permite requisições do frontend  
✅ **Validação de Entrada** - Bean Validation em todos os DTOs  
✅ **Tratamento de Exceções** - Respostas HTTP padronizadas  
✅ **Sanitização** - Trimming e uppercase em códigos de rastreio  

### Melhorias Futuras

- [ ] Autenticação JWT
- [ ] Rate Limiting
- [ ] SQL Injection Prevention (já protegido pelo JPA)
- [ ] HTTPS obrigatório em produção
- [ ] Auditoria de ações

---

## 📝 Logs

### Configuração (application-dev.properties)

```properties
# SQL Logging
logging.level.org.hibernate.SQL=DEBUG
logging.level.org.hibernate.type.descriptor.sql.BasicBinder=TRACE

# Application Logging
logging.level.com.gwchallenge=DEBUG

# Spring Web Logging
logging.level.org.springframework.web=DEBUG
```

### Exemplo de Saída

```
2025-11-05 14:33:00.123  INFO [main] GwChallengeApplication : Starting GwChallengeApplication
2025-11-05 14:33:01.456  INFO [main] GwChallengeApplication : Started GwChallengeApplication in 2.5 seconds
2025-11-05 14:33:15.789 DEBUG [http-nio-8080-exec-1] EventController : Criando evento para pacote: GWTEST0001
2025-11-05 14:33:15.790 DEBUG [http-nio-8080-exec-1] EventService : Buscando pacote com código: GWTEST0001
2025-11-05 14:33:15.812 DEBUG [http-nio-8080-exec-1] Hibernate : 
    select
        package0_.tracking_code as tracking1_1_0_,
        package0_.client_name as client_n2_1_0_,
        package0_.delivery_address as delivery3_1_0_
    from
        package package0_
    where
        package0_.tracking_code=?
2025-11-05 14:33:15.850 DEBUG [http-nio-8080-exec-1] EventService : Evento preparado: Event{id=null, status=OUT_FOR_DELIVERY}
2025-11-05 14:33:15.902 DEBUG [http-nio-8080-exec-1] Hibernate : 
    insert 
    into
        event
        (description, event_timestamp, status, tracking_code) 
    values
        (?, ?, ?, ?)
2025-11-05 14:33:15.950  INFO [http-nio-8080-exec-1] EventController : ✅ Evento criado com ID: 42
```

---

## 🎓 Conclusão

O backend do **GW Challenge** demonstra:

✅ **Arquitetura em Camadas** - Controller, Service, Repository bem definidas  
✅ **Uso Correto de JPA** - Relacionamentos, FetchType, Cascade  
✅ **DTOs para Segurança** - Evita exposição de entidades JPA  
✅ **Validações Robustas** - Bean Validation e lógica de negócio  
✅ **Tratamento de Erros** - Exceções customizadas e GlobalExceptionHandler  
✅ **Performance Otimizada** - Índices, LAZY loading, JOIN FETCH  
✅ **Código Limpo** - Seguindo SOLID e boas práticas Java  
✅ **Resolução de Problemas** - StackOverflowError, Lombok, N+1 queries  

---

<div align="center">

**[🏠 Voltar ao README Principal](../README.md)** | **[🗄️ Ver DATABASE.md](../database/DATABASE.md)** | **[🎨 Ver FRONTEND.md](../frontend/FRONTEND.md)**

---

**Desenvolvido com ❤️ por Luiz Felipe de Oliveira**

**Versão:** 1.0.0  
**Última atualização:** 05 de Novembro de 2025

</div>