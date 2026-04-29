package com.college.expense.service;

import com.college.expense.dto.BudgetDTO;
import com.college.expense.exception.ResourceNotFoundException;
import com.college.expense.model.Budget;
import com.college.expense.model.TransactionType;
import com.college.expense.repository.BudgetRepository;
import com.college.expense.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepo;
    private final TransactionRepository txRepo;

    public BudgetService(BudgetRepository budgetRepo, TransactionRepository txRepo) {
        this.budgetRepo = budgetRepo;
        this.txRepo = txRepo;
    }

    // Save or update budget for a category+month+year
    public BudgetDTO.Response saveOrUpdate(BudgetDTO.Request req) {
        Budget budget = budgetRepo
                .findByCategoryAndMonthAndYear(req.getCategory(), req.getMonth(), req.getYear())
                .orElse(new Budget());

        budget.setCategory(req.getCategory());
        budget.setAmount(req.getAmount());
        budget.setMonth(req.getMonth());
        budget.setYear(req.getYear());

        Budget saved = budgetRepo.save(budget);
        return enrichWithSpending(saved);
    }

    // Get all budgets for a month with actual spending filled in
    public List<BudgetDTO.Response> getByMonth(int month, int year) {
        // Get spending per category for this month
        Map<String, BigDecimal> spending = getSpendingMap(month, year);

        return budgetRepo.findByMonthAndYear(month, year).stream()
                .map(b -> {
                    BudgetDTO.Response r = toResponse(b);
                    BigDecimal spent = spending.getOrDefault(b.getCategory(), BigDecimal.ZERO);
                    r.setSpent(spent);
                    r.setRemaining(b.getAmount().subtract(spent));
                    return r;
                })
                .collect(Collectors.toList());
    }

    public void delete(Long id) {
        if (!budgetRepo.existsById(id)) throw new ResourceNotFoundException("Budget not found: " + id);
        budgetRepo.deleteById(id);
    }

    // ── helpers ──────────────────────────────────────────────

    private Map<String, BigDecimal> getSpendingMap(int month, int year) {
        return txRepo.findSpendingByCategory(month, year).stream()
                .collect(Collectors.toMap(
                        row -> (String) row[0],
                        row -> (BigDecimal) row[1]
                ));
    }

    private BudgetDTO.Response enrichWithSpending(Budget b) {
        Map<String, BigDecimal> spending = getSpendingMap(b.getMonth(), b.getYear());
        BudgetDTO.Response r = toResponse(b);
        BigDecimal spent = spending.getOrDefault(b.getCategory(), BigDecimal.ZERO);
        r.setSpent(spent);
        r.setRemaining(b.getAmount().subtract(spent));
        return r;
    }

    private BudgetDTO.Response toResponse(Budget b) {
        BudgetDTO.Response r = new BudgetDTO.Response();
        r.setId(b.getId());
        r.setCategory(b.getCategory());
        r.setAmount(b.getAmount());
        r.setMonth(b.getMonth());
        r.setYear(b.getYear());
        return r;
    }
}
