package com.college.expense.dto;

import com.college.expense.model.TransactionType;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public class TransactionDTO {

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

        public Request() {}

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public BigDecimal getAmount() { return amount; }
        public void setAmount(BigDecimal amount) { this.amount = amount; }

        public TransactionType getType() { return type; }
        public void setType(TransactionType type) { this.type = type; }

        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }

        public LocalDate getDate() { return date; }
        public void setDate(LocalDate date) { this.date = date; }

        public String getNote() { return note; }
        public void setNote(String note) { this.note = note; }
    }

    public static class Response {
        private Long id;
        private String title;
        private BigDecimal amount;
        private TransactionType type;
        private String category;
        private LocalDate date;
        private String note;

        public Response() {}

        public Response(Long id, String title, BigDecimal amount, TransactionType type, String category, LocalDate date, String note) {
            this.id = id;
            this.title = title;
            this.amount = amount;
            this.type = type;
            this.category = category;
            this.date = date;
            this.note = note;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public BigDecimal getAmount() { return amount; }
        public void setAmount(BigDecimal amount) { this.amount = amount; }

        public TransactionType getType() { return type; }
        public void setType(TransactionType type) { this.type = type; }

        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }

        public LocalDate getDate() { return date; }
        public void setDate(LocalDate date) { this.date = date; }

        public String getNote() { return note; }
        public void setNote(String note) { this.note = note; }
    }
}
