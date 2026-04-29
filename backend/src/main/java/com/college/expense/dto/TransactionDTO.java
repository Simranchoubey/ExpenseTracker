package com.college.expense.dto;

import com.college.expense.model.TransactionType;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public class TransactionDTO {

    @Getter @Setter
    public static class Request {
        @NotBlank(message = "Title is required")
        private String title;

        @NotNull(message = "Amount is required")
        @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
        private BigDecimal amount;

        @NotNull(message = "Type is required (INCOME or EXPENSE)")
        private TransactionType type;

        @NotBlank(message = "Category is required")
        private String category;

        @NotNull(message = "Date is required")
        private LocalDate date;

        private String note;
    }

    @Getter @Setter @AllArgsConstructor @NoArgsConstructor
    public static class Response {
        private Long id;
        private String title;
        private BigDecimal amount;
        private TransactionType type;
        private String category;
        private LocalDate date;
        private String note;
    }
}
