# ======================== DOCKERFILE - BACKEND SPRING BOOT ========================
# Imagem base: OpenJDK 17 (compatível com Spring Boot 2.7+)
FROM openjdk:17-jdk-slim

# Definir diretório de trabalho dentro do container
WORKDIR /app

# Copiar arquivo pom.xml e baixar dependências (cache de camadas)
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn

# Dar permissão de execução ao Maven Wrapper
RUN chmod +x mvnw

# Baixar dependências (essa camada será cacheada)
RUN ./mvnw dependency:go-offline -B

# Copiar código fonte
COPY src ./src

# Compilar aplicação (gerar JAR)
RUN ./mvnw clean package -DskipTests

# Expor porta 8080
EXPOSE 8080

# Comando para executar a aplicação
CMD ["java", "-jar", "target/gw-challenge-backend-1.0.0.jar"]
