package com.college.expense.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public class BudgetDTO {

    public static class Request {
        @NotBlank(message = "Category is required")
        private String category;

        @NotNull
        @DecimalMin("0.01")
        private BigDecimal amount;

        @NotNull @Min(1) @Max(12)
        private Integer month;

        @NotNull
        private Integer year;

        public Request() {}

        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }

        public BigDecimal getAmount() { return amount; }
        public void setAmount(BigDecimal amount) { this.amount = amount; }

        public Integer getMonth() { return month; }
        public void setMonth(Integer month) { this.month = month; }

        public Integer getYear() { return year; }
        public void setYear(Integer year) { this.year = year; }
    }

    public static class Response {
        private Long id;
        private String category;
        private BigDecimal amount;
        private Integer month;
        private Integer year;
        // How much was actually spent in this category this month
        private BigDecimal spent;
        // amount - spent (can be negative = overspent)
        private BigDecimal remaining;

        public Response() {}

        public Response(Long id, String category, BigDecimal amount, Integer month, Integer year, BigDecimal spent, BigDecimal remaining) {
            this.id = id;
            this.category = category;
            this.amount = amount;
            this.month = month;
            this.year = year;
            this.spent = spent;
            this.remaining = remaining;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }

        public BigDecimal getAmount() { return amount; }
        public void setAmount(BigDecimal amount) { this.amount = amount; }

        public Integer getMonth() { return month; }
        public void setMonth(Integer month) { this.month = month; }

        public Integer getYear() { return year; }
        public void setYear(Integer year) { this.year = year; }

        public BigDecimal getSpent() { return spent; }
        public void setSpent(BigDecimal spent) { this.spent = spent; }

        public BigDecimal getRemaining() { return remaining; }
        public void setRemaining(BigDecimal remaining) { this.remaining = remaining; }
    }
}
