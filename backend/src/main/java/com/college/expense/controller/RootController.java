package com.college.expense.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class RootController {

    @GetMapping("/")
    public String root() {
        // Redirect to Swagger UI (or change to a custom landing page)
        return "redirect:/swagger-ui.html";
    }
}
