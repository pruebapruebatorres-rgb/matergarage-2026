package com.tallerpro.api.repository;

import com.tallerpro.api.entity.Credencial;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CredencialRepository extends JpaRepository<Credencial, String> {}
