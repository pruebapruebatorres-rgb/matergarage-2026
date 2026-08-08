package com.tallerpro.api.repository;

import com.tallerpro.api.entity.EntityRecord;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface EntityRecordRepository extends JpaRepository<EntityRecord, String> {

  List<EntityRecord> findByEntityTypeOrderBySortOrderAsc(String entityType);

  Optional<EntityRecord> findByIdAndEntityType(String id, String entityType);

  @Query("select min(e.sortOrder) from EntityRecord e where e.entityType = :entityType")
  Long findMinSortOrder(@Param("entityType") String entityType);

  @Query("select distinct e.entityType from EntityRecord e")
  List<String> findDistinctEntityTypes();
}
