package com.college.expense.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Getter @Setter @AllArgsConstructor @NoArgsConstructor
public class DashboardDTO {
    private BigDecimal totalIncome;
    private BigDecimal totalExpense;
    private BigDecimal balance;           // income - expense
    private int month;
    private int year;
    // category -> amount spent
    private Map<String, BigDecimal> categoryBreakdown;
    // Last 6 months chart data
    private List<MonthlyChartPoint> monthlyChart;
    // Recent 5 transactions
    private List<TransactionDTO.Response> recentTransactions;

    @Getter @Setter @AllArgsConstructor @NoArgsConstructor
    public static class MonthlyChartPoint {
        private String label;   // e.g. "Apr 2025"
        private BigDecimal income;
        private BigDecimal expense;
    }
}
