package com.tallerpro.api.repository;

import com.tallerpro.api.entity.ConfigEntry;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConfigEntryRepository extends JpaRepository<ConfigEntry, String> {}
