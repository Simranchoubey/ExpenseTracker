package com.college.expense.repository;

import com.college.expense.model.Transaction;
import com.college.expense.model.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    // Get all transactions for a specific month/year, newest first
    @Query("SELECT t FROM Transaction t WHERE MONTH(t.date) = :month AND YEAR(t.date) = :year ORDER BY t.date DESC")
    List<Transaction> findByMonthAndYear(@Param("month") int month, @Param("year") int year);

    // Total income or total expense for a given month/year
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.type = :type AND MONTH(t.date) = :month AND YEAR(t.date) = :year")
    BigDecimal sumByTypeAndMonth(@Param("type") TransactionType type, @Param("month") int month, @Param("year") int year);

    // Spending per category for a given month/year (expenses only)
    @Query("SELECT t.category, SUM(t.amount) FROM Transaction t WHERE t.type = 'EXPENSE' AND MONTH(t.date) = :month AND YEAR(t.date) = :year GROUP BY t.category")
    List<Object[]> findSpendingByCategory(@Param("month") int month, @Param("year") int year);

    // Monthly totals for the last 6 months (for chart)
    @Query("SELECT MONTH(t.date), YEAR(t.date), t.type, SUM(t.amount) FROM Transaction t WHERE t.date >= :fromDate GROUP BY YEAR(t.date), MONTH(t.date), t.type ORDER BY YEAR(t.date), MONTH(t.date)")
    List<Object[]> findMonthlyTotals(@Param("fromDate") java.time.LocalDate fromDate);

    // All transactions ordered by date desc
    List<Transaction> findAllByOrderByDateDesc();
}
