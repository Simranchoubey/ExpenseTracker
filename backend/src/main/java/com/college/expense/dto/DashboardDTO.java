package com.college.expense.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

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

    public DashboardDTO() {}

    public BigDecimal getTotalIncome() { return totalIncome; }
    public void setTotalIncome(BigDecimal totalIncome) { this.totalIncome = totalIncome; }

    public BigDecimal getTotalExpense() { return totalExpense; }
    public void setTotalExpense(BigDecimal totalExpense) { this.totalExpense = totalExpense; }

    public BigDecimal getBalance() { return balance; }
    public void setBalance(BigDecimal balance) { this.balance = balance; }

    public int getMonth() { return month; }
    public void setMonth(int month) { this.month = month; }

    public int getYear() { return year; }
    public void setYear(int year) { this.year = year; }

    public Map<String, BigDecimal> getCategoryBreakdown() { return categoryBreakdown; }
    public void setCategoryBreakdown(Map<String, BigDecimal> categoryBreakdown) { this.categoryBreakdown = categoryBreakdown; }

    public List<MonthlyChartPoint> getMonthlyChart() { return monthlyChart; }
    public void setMonthlyChart(List<MonthlyChartPoint> monthlyChart) { this.monthlyChart = monthlyChart; }

    public List<TransactionDTO.Response> getRecentTransactions() { return recentTransactions; }
    public void setRecentTransactions(List<TransactionDTO.Response> recentTransactions) { this.recentTransactions = recentTransactions; }

    public static class MonthlyChartPoint {
        private String label;   // e.g. "Apr 2025"
        private BigDecimal income;
        private BigDecimal expense;

        public MonthlyChartPoint() {}

        public MonthlyChartPoint(String label, BigDecimal income, BigDecimal expense) {
            this.label = label;
            this.income = income;
            this.expense = expense;
        }

        public String getLabel() { return label; }
        public void setLabel(String label) { this.label = label; }

        public BigDecimal getIncome() { return income; }
        public void setIncome(BigDecimal income) { this.income = income; }

        public BigDecimal getExpense() { return expense; }
        public void setExpense(BigDecimal expense) { this.expense = expense; }
    }
}
