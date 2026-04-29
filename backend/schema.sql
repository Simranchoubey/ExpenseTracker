-- ============================================================
-- Expense Tracker - Database Schema
-- Run this in MySQL Workbench or CLI if you prefer manual setup
-- (Spring Boot with ddl-auto=update will auto-create tables too)
-- ============================================================

CREATE DATABASE IF NOT EXISTS expense_tracker;
USE expense_tracker;

-- ── Transactions table (covers both income & expenses) ────
CREATE TABLE IF NOT EXISTS transactions (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    title       VARCHAR(255)   NOT NULL,
    amount      DECIMAL(12, 2) NOT NULL,
    type        ENUM('INCOME', 'EXPENSE') NOT NULL,
    category    VARCHAR(50)    NOT NULL,
    date        DATE           NOT NULL,
    note        VARCHAR(500),
    created_at  DATETIME       DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ── Budgets table (one row per category per month/year) ───
CREATE TABLE IF NOT EXISTS budgets (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    category    VARCHAR(50)    NOT NULL,
    amount      DECIMAL(12, 2) NOT NULL,
    month       INT            NOT NULL,   -- 1-12
    year        INT            NOT NULL,
    created_at  DATETIME       DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_budget (category, month, year)
);

-- ── Sample data ───────────────────────────────────────────
INSERT INTO transactions (title, amount, type, category, date, note) VALUES
('Part-time job salary',   8000.00, 'INCOME',  'Other',     '2025-04-01', 'Monthly stipend'),
('Parents allowance',      5000.00, 'INCOME',  'Other',     '2025-04-01', 'Monthly allowance'),
('Hostel rent',            4500.00, 'EXPENSE', 'Rent',      '2025-04-02', 'April rent'),
('Grocery shopping',       1200.00, 'EXPENSE', 'Food',      '2025-04-05', 'Weekly groceries'),
('College canteen',         450.00, 'EXPENSE', 'Food',      '2025-04-08', 'Lunch and snacks'),
('Electricity bill',        800.00, 'EXPENSE', 'Bills',     '2025-04-10', 'April bill'),
('Programming books',       650.00, 'EXPENSE', 'Education', '2025-04-12', 'Spring Boot book'),
('Metro pass',              400.00, 'EXPENSE', 'Travel',    '2025-04-14', 'Monthly metro card'),
('New shoes',               999.00, 'EXPENSE', 'Shopping',  '2025-04-17', 'Sports shoes'),
('Doctor visit',            300.00, 'EXPENSE', 'Health',    '2025-04-20', 'Checkup'),
('Swiggy orders',           750.00, 'EXPENSE', 'Food',      '2025-04-22', 'Weekend food delivery'),
('Cab rides',               380.00, 'EXPENSE', 'Travel',    '2025-04-24', 'Ola/Uber rides');

INSERT INTO budgets (category, amount, month, year) VALUES
('Food',      3000.00, 4, 2025),
('Travel',    1000.00, 4, 2025),
('Shopping',  2000.00, 4, 2025),
('Rent',      5000.00, 4, 2025),
('Bills',     1500.00, 4, 2025),
('Education', 2000.00, 4, 2025),
('Health',     500.00, 4, 2025),
('Other',     1000.00, 4, 2025);
