package com.insurai.insurai.model;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "claims")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Claim {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "claim_id", nullable = false, unique = true)
    private String claimId;

    @Column(name = "policy_id", nullable = false)
    private String policyId;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private Double amount;

    @Column(name = "date_filed", nullable = false)
    private LocalDate dateFiled;

    @Column(name = "claim_type")
    private String claimType;

    @Column(name = "date_of_incident", nullable = false)
    private LocalDate dateOfIncident;

    @ElementCollection
    @Column(name = "document")
    @Builder.Default
    private List<String> documents = new ArrayList<>();
}
