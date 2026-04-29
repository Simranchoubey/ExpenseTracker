// package com.college.expense.service;

// import com.college.expense.dto.TransactionDTO;
// import com.college.expense.exception.ResourceNotFoundException;
// import com.college.expense.model.Transaction;
// import com.college.expense.repository.TransactionRepository;
// import org.springframework.stereotype.Service;

// import java.util.List;
// import java.util.stream.Collectors;

// @Service
// public class TransactionService {

//     private final TransactionRepository repo;

//     public TransactionService(TransactionRepository repo) {
//         this.repo = repo;
//     }

//     public TransactionDTO.Response create(TransactionDTO.Request req) {
//         Transaction t = new Transaction();
//         mapFromRequest(req, t);
//         return toResponse(repo.save(t));
//     }

//     public List<TransactionDTO.Response> getAll() {
//         return repo.findAllByOrderByDateDesc().stream().map(this::toResponse).collect(Collectors.toList());
//     }

//     public List<TransactionDTO.Response> getByMonth(int month, int year) {
//         return repo.findByMonthAndYear(month, year).stream().map(this::toResponse).collect(Collectors.toList());
//     }

//     public TransactionDTO.Response getById(Long id) {
//         return toResponse(findOrThrow(id));
//     }

//     public TransactionDTO.Response update(Long id, TransactionDTO.Request req) {
//         Transaction t = findOrThrow(id);
//         mapFromRequest(req, t);
//         return toResponse(repo.save(t));
//     }

//     public void delete(Long id) {
//         if (!repo.existsById(id)) throw new ResourceNotFoundException("Transaction not found: " + id);
//         repo.deleteById(id);
//     }

//     // ── helpers ──────────────────────────────────────────────

//     private Transaction findOrThrow(Long id) {
//         return repo.findById(id)
//                 .orElseThrow(() -> new ResourceNotFoundException("Transaction not found: " + id));
//     }

//     private void mapFromRequest(TransactionDTO.Request req, Transaction t) {
//         t.setTitle(req.getTitle());
//         t.setAmount(req.getAmount());
//         t.setType(req.getType());
//         t.setCategory(req.getCategory());
//         t.setDate(req.getDate());
//         t.setNote(req.getNote());
//     }

//     public TransactionDTO.Response toResponse(Transaction t) {
//         TransactionDTO.Response r = new TransactionDTO.Response();
//         r.setId(t.getId());
//         r.setTitle(t.getTitle());
//         r.setAmount(t.getAmount());
//         r.setType(t.getType());
//         r.setCategory(t.getCategory());
//         r.setDate(t.getDate());
//         r.setNote(t.getNote());
//         return r;
//     }
// }




package com.college.expense.service;

import com.college.expense.dto.TransactionDTO;
import com.college.expense.exception.ResourceNotFoundException;
import com.college.expense.model.Transaction;
import com.college.expense.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransactionService {

    private final TransactionRepository repo;

    public TransactionService(TransactionRepository repo) {
        this.repo = repo;
    }

    public TransactionDTO.Response create(TransactionDTO.Request req) {
        Transaction t = new Transaction();
        mapFromRequest(req, t);
        return toResponse(repo.save(t));
    }

    public List<TransactionDTO.Response> getAll() {
        return repo.findAllByOrderByDateDesc()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<TransactionDTO.Response> getByMonth(int month, int year) {
        return repo.findByMonthAndYear(month, year)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public TransactionDTO.Response getById(Long id) {
        return toResponse(findOrThrow(id));
    }

    public TransactionDTO.Response update(Long id, TransactionDTO.Request req) {
        Transaction t = findOrThrow(id);
        mapFromRequest(req, t);
        return toResponse(repo.save(t));
    }

    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new ResourceNotFoundException("Transaction not found: " + id);
        }
        repo.deleteById(id);
    }

    private Transaction findOrThrow(Long id) {
        return repo.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Transaction not found: " + id));
    }

    private void mapFromRequest(TransactionDTO.Request req, Transaction t) {
        t.setTitle(req.getTitle());
        t.setAmount(req.getAmount());
        t.setType(req.getType());
        t.setCategory(req.getCategory());
        t.setDate(req.getDate());
        t.setNote(req.getNote());
    }

    public TransactionDTO.Response toResponse(Transaction t) {
        TransactionDTO.Response r = new TransactionDTO.Response();
        r.setId(t.getId());
        r.setTitle(t.getTitle());
        r.setAmount(t.getAmount());
        r.setType(t.getType());
        r.setCategory(t.getCategory());
        r.setDate(t.getDate());
        r.setNote(t.getNote());
        return r;
    }
}