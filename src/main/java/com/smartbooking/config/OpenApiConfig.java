package com.smartbooking.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI smartServeOpenAPI() {
        String schemeName = "bearerAuth";
        return new OpenAPI()
            .info(new Info()
                .title("SmartServe AI – Intelligent Local Service Booking Platform")
                .description("Production-ready REST APIs for authentication, local service discovery, booking, ratings, recommendations, and admin analytics.")
                .version("0.0.1-SNAPSHOT"))
            .addSecurityItem(new SecurityRequirement().addList(schemeName))
            .components(new Components().addSecuritySchemes(schemeName,
                new SecurityScheme()
                    .name(schemeName)
                    .type(SecurityScheme.Type.HTTP)
                    .scheme("bearer")
                    .bearerFormat("JWT")));
    }
}
