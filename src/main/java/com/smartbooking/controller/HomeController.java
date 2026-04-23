package com.smartbooking.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
@Tag(name = "Status", description = "Public application status endpoints")
public class HomeController {

    @GetMapping("/")
    @Operation(summary = "Application welcome response", description = "Returns quick links for API documentation and H2 console.")
    public String home() {
        return "redirect:/ui/dashboard";
    }

    @GetMapping("/home")
    public String landingPage() {
        return "redirect:/ui/dashboard";
    }
}
