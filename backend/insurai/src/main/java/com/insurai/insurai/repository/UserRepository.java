package com.insurai.insurai.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.insurai.insurai.model.User;
import com.insurai.insurai.model.UserCategory;

public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmailAndCategory(String email, UserCategory category);
}
