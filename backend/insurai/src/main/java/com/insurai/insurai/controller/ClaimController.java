package com.insurai.insurai.controller;

import com.insurai.insurai.model.Claim;
import com.insurai.insurai.service.ClaimService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/claims")
@CrossOrigin(origins = "http://localhost:5173")
public class ClaimController {

    private final ClaimService claimService;

    public ClaimController(ClaimService claimService) {
        this.claimService = claimService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Claim>> getClaimsByUserId(@PathVariable String userId) {
        List<Claim> claims = claimService.getClaimsByUserId(userId);
        return ResponseEntity.ok(claims);
    }

    @PostMapping
    public ResponseEntity<Claim> createClaim(@RequestBody Claim claim) {
        Claim savedClaim = claimService.saveClaim(claim);
        return ResponseEntity.ok(savedClaim);
    }

    @DeleteMapping("/{claimId}")
    public ResponseEntity<Void> deleteClaim(@PathVariable String claimId) {
        claimService.deleteClaim(claimId);
        return ResponseEntity.noContent().build();
    }
}
