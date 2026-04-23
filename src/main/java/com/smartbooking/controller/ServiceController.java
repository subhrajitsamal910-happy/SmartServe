package com.smartbooking.controller;

import com.smartbooking.dto.ServiceResponseDto;
import com.smartbooking.model.ServiceCategory;
import com.smartbooking.service.ServiceCatalogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/services")
@Tag(name = "Services", description = "Public local service discovery APIs")
public class ServiceController {
    private final ServiceCatalogService serviceCatalogService;

    public ServiceController(ServiceCatalogService serviceCatalogService) {
        this.serviceCatalogService = serviceCatalogService;
    }

    @GetMapping
    @Operation(summary = "List services", description = "Returns all seeded local services. Optionally filter by category.")
    public ResponseEntity<List<ServiceResponseDto>> getServices(@RequestParam(required = false) @Parameter(example = "HOME_CLEANING") ServiceCategory category) {
        return ResponseEntity.ok(serviceCatalogService.getServices(category));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get service by id", description = "Returns one local service with provider, rating, and booking stats.")
    public ResponseEntity<ServiceResponseDto> getService(@PathVariable Long id) {
        return ResponseEntity.ok(serviceCatalogService.getService(id));
    }

    @GetMapping("/search")
    @Operation(summary = "Semantic service search", description = "Returns services ranked by semantic relevance to natural language query.")
    public ResponseEntity<List<ServiceResponseDto>> semanticSearch(@RequestParam String q) {
        return ResponseEntity.ok(serviceCatalogService.semanticSearch(q));
    }
}
