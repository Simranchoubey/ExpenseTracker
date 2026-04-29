package com.college.expense.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

public class BudgetDTO {

    @Getter @Setter
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
    }

    @Getter @Setter @AllArgsConstructor @NoArgsConstructor
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
    }
}
