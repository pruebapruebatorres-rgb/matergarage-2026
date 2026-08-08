# Render despliega servicios Java vía Docker (no tiene runtime nativo de Java).
# Build en dos etapas: compila con Maven y el JRE final solo lleva el jar, sin el JDK completo.

FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Cachear dependencias en su propia capa antes de copiar el código fuente.
COPY pom.xml ./
RUN mvn -q -B dependency:go-offline

COPY src ./src
RUN mvn -q -B clean package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Render inyecta PORT en tiempo de ejecución; application.properties ya lo lee (server.port=${PORT:8080}).
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
