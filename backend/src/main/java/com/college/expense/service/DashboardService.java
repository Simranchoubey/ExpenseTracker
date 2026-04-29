package com.college.expense.service;

import com.college.expense.dto.DashboardDTO;
import com.college.expense.dto.TransactionDTO;
import com.college.expense.model.TransactionType;
import com.college.expense.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final TransactionRepository txRepo;
    private final TransactionService txService;

    public DashboardService(TransactionRepository txRepo, TransactionService txService) {
        this.txRepo = txRepo;
        this.txService = txService;
    }

    public DashboardDTO getDashboard(int month, int year) {
        DashboardDTO dto = new DashboardDTO();
        dto.setMonth(month);
        dto.setYear(year);

        // Total income and expense this month
        BigDecimal income = txRepo.sumByTypeAndMonth(TransactionType.INCOME, month, year);
        BigDecimal expense = txRepo.sumByTypeAndMonth(TransactionType.EXPENSE, month, year);
        dto.setTotalIncome(income);
        dto.setTotalExpense(expense);
        dto.setBalance(income.subtract(expense));

        // Category breakdown (expenses only)
        Map<String, BigDecimal> breakdown = new LinkedHashMap<>();
        for (Object[] row : txRepo.findSpendingByCategory(month, year)) {
            breakdown.put((String) row[0], (BigDecimal) row[1]);
        }
        dto.setCategoryBreakdown(breakdown);

        // Monthly chart - last 6 months
        LocalDate sixMonthsAgo = LocalDate.now().minusMonths(5).withDayOfMonth(1);
        List<Object[]> rawChart = txRepo.findMonthlyTotals(sixMonthsAgo);

        // Build a map: "YYYY-MM" -> {INCOME, EXPENSE}
        Map<String, BigDecimal[]> chartMap = new LinkedHashMap<>();
        for (Object[] row : rawChart) {
            int m = ((Number) row[0]).intValue();
            int y = ((Number) row[1]).intValue();
            String key = y + "-" + String.format("%02d", m);
            TransactionType type = (TransactionType) row[2];
            BigDecimal sum = (BigDecimal) row[3];

            chartMap.putIfAbsent(key, new BigDecimal[]{BigDecimal.ZERO, BigDecimal.ZERO});
            if (type == TransactionType.INCOME) chartMap.get(key)[0] = sum;
            else chartMap.get(key)[1] = sum;
        }

        List<DashboardDTO.MonthlyChartPoint> chart = new ArrayList<>();
        for (Map.Entry<String, BigDecimal[]> e : chartMap.entrySet()) {
            String[] parts = e.getKey().split("-");
            int y = Integer.parseInt(parts[0]);
            int m = Integer.parseInt(parts[1]);
            String label = Month.of(m).getDisplayName(TextStyle.SHORT, Locale.ENGLISH) + " " + y;
            chart.add(new DashboardDTO.MonthlyChartPoint(label, e.getValue()[0], e.getValue()[1]));
        }
        dto.setMonthlyChart(chart);

        // 5 most recent transactions
        List<TransactionDTO.Response> recent = txRepo.findByMonthAndYear(month, year)
                .stream().limit(5).map(txService::toResponse).collect(Collectors.toList());
        dto.setRecentTransactions(recent);

        return dto;
    }
}
