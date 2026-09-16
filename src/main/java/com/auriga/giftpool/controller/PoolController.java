package com.auriga.giftpool.controller;

import com.auriga.giftpool.model.Models.*;
import com.auriga.giftpool.service.PoolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class PoolController {

    @Autowired
    private PoolService poolService;

    @GetMapping("/pool")
    public PoolResponse getPool() {
        return poolService.getPoolDetails();
    }

    @PostMapping("/members")
    public ResponseEntity<String> addMember(@RequestBody Map<String, String> payload) {
        poolService.addMember(payload.get("name"));
        return ResponseEntity.ok("Member Added");
    }

    @PostMapping("/contributions")
    public ResponseEntity<Contribution> addContribution(@RequestBody Map<String, Object> payload) {
        String member = (String) payload.get("member");
        String email = (String) payload.get("email");
        String phone = (String) payload.get("phone");
        double amount = Double.parseDouble(payload.get("amount").toString());
        String note = (String) payload.get("note");
        Contribution c = poolService.addContribution(member, email, phone, amount, note);
        return ResponseEntity.ok(c);
    }

    @PutMapping("/pool")
    public ResponseEntity<String> updatePool(@RequestBody Map<String, Object> payload) {
        String title = (String) payload.get("title");
        Double target = payload.containsKey("targetAmount") ? Double.parseDouble(payload.get("targetAmount").toString()) : null;
        poolService.updatePool(title, target);
        return ResponseEntity.ok("Pool Updated");
    }
}