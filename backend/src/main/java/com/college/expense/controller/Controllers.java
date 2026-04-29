package com.college.expense.controller;

import com.college.expense.dto.*;
import com.college.expense.service.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

// ── Transaction Controller ────────────────────────────────────────────────────
@RestController
@RequestMapping("/api/transactions")
@Tag(name = "Transactions")
class TransactionController {

    private final TransactionService service;

    TransactionController(TransactionService service) { this.service = service; }

    @PostMapping
    @Operation(summary = "Add income or expense")
    public ResponseEntity<TransactionDTO.Response> create(@Valid @RequestBody TransactionDTO.Request req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(req));
    }

    @GetMapping
    @Operation(summary = "Get all transactions")
    public List<TransactionDTO.Response> getAll() {
        return service.getAll();
    }

    @GetMapping("/monthly")
    @Operation(summary = "Get transactions for a specific month")
    public List<TransactionDTO.Response> getByMonth(
            @RequestParam(defaultValue = "#{T(java.time.LocalDate).now().getMonthValue()}") int month,
            @RequestParam(defaultValue = "#{T(java.time.LocalDate).now().getYear()}") int year) {
        return service.getByMonth(month, year);
    }

    @GetMapping("/{id}")
    public TransactionDTO.Response getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PutMapping("/{id}")
    public TransactionDTO.Response update(@PathVariable Long id, @Valid @RequestBody TransactionDTO.Request req) {
        return service.update(id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}

// ── Budget Controller ─────────────────────────────────────────────────────────
@RestController
@RequestMapping("/api/budgets")
@Tag(name = "Budgets")
class BudgetController {

    private final BudgetService service;

    BudgetController(BudgetService service) { this.service = service; }

    @PostMapping
    @Operation(summary = "Set or update a budget for a category")
    public ResponseEntity<BudgetDTO.Response> save(@Valid @RequestBody BudgetDTO.Request req) {
        return ResponseEntity.ok(service.saveOrUpdate(req));
    }

    @GetMapping
    @Operation(summary = "Get all budgets with actual spending for a month")
    public List<BudgetDTO.Response> getByMonth(
            @RequestParam(defaultValue = "#{T(java.time.LocalDate).now().getMonthValue()}") int month,
            @RequestParam(defaultValue = "#{T(java.time.LocalDate).now().getYear()}") int year) {
        return service.getByMonth(month, year);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}

// ── Dashboard Controller ──────────────────────────────────────────────────────
@RestController
@RequestMapping("/api/dashboard")
@Tag(name = "Dashboard")
class DashboardController {

    private final DashboardService service;

    DashboardController(DashboardService service) { this.service = service; }

    @GetMapping
    @Operation(summary = "Get dashboard summary for a month")
    public DashboardDTO getDashboard(
            @RequestParam(defaultValue = "#{T(java.time.LocalDate).now().getMonthValue()}") int month,
            @RequestParam(defaultValue = "#{T(java.time.LocalDate).now().getYear()}") int year) {
        return service.getDashboard(month, year);
    }
}
