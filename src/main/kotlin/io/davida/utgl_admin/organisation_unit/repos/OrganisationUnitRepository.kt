package io.davida.utgl_admin.organisation_unit.repos

import io.davida.utgl_admin.organisation_unit.domain.OrganisationUnit
import io.davida.utgl_admin.organisation_unit.model.OrganisationUnitTreeNodeDTO
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param


interface OrganisationUnitRepository : JpaRepository<OrganisationUnit, String> {

    fun findFirstByParentIdAndIdNot(id: String, currentId: String?): OrganisationUnit?

    fun existsByIdIgnoreCase(id: String?): Boolean

    fun findByNameContainingIgnoreCase(name: String, pageable: Pageable): List<OrganisationUnit>

    fun findByNameContainingIgnoreCaseAndLevel(name: String, level: Int, pageable: Pageable):
            List<OrganisationUnit>

    @Query("select distinct ou.level from OrganisationUnit ou order by ou.level")
    fun findDistinctLevels(): List<Int>

    @Query("""
            select new io.davida.utgl_admin.organisation_unit.model.OrganisationUnitTreeNodeDTO(
                ou.id, ou.name, ou.level,
                (select count(c) from OrganisationUnit c where c.parent = ou),
                ou.parent.id)
            from OrganisationUnit ou
            where ou.parent is null
            order by ou.name
            """)
    fun findRootTreeNodes(): List<OrganisationUnitTreeNodeDTO>

    @Query("""
            select new io.davida.utgl_admin.organisation_unit.model.OrganisationUnitTreeNodeDTO(
                ou.id, ou.name, ou.level,
                (select count(c) from OrganisationUnit c where c.parent = ou),
                ou.parent.id)
            from OrganisationUnit ou
            where ou.parent.id = :parentId
            order by ou.name
            """)
    fun findChildTreeNodes(@Param("parentId") parentId: String): List<OrganisationUnitTreeNodeDTO>

    @Query("""
            select new io.davida.utgl_admin.organisation_unit.model.OrganisationUnitTreeNodeDTO(
                ou.id, ou.name, ou.level,
                (select count(c) from OrganisationUnit c where c.parent = ou),
                ou.parent.id)
            from OrganisationUnit ou
            where ou.parent.id in :parentIds
            order by ou.name
            """)
    fun findChildTreeNodesForParents(@Param("parentIds") parentIds: Collection<String>):
            List<OrganisationUnitTreeNodeDTO>

    @Query("select ou.path from OrganisationUnit ou where ou.id in :ids and ou.path is not null")
    fun findPathsByIdIn(@Param("ids") ids: Collection<String>): List<String>

}
