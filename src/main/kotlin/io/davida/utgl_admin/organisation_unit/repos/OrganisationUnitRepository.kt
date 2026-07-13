package io.davida.utgl_admin.organisation_unit.repos

import io.davida.utgl_admin.organisation_unit.domain.OrganisationUnit
import io.davida.utgl_admin.organisation_unit.model.OrganisationUnitTreeNodeDTO
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param


interface OrganisationUnitRepository : JpaRepository<OrganisationUnit, String> {

    fun findFirstByParentIdAndIdNot(id: String, currentId: String?): OrganisationUnit?

    fun existsByIdIgnoreCase(id: String?): Boolean

    @Query("""
            select new io.davida.utgl_admin.organisation_unit.model.OrganisationUnitTreeNodeDTO(
                ou.id, ou.name, ou.level,
                (select count(c) from OrganisationUnit c where c.parent = ou))
            from OrganisationUnit ou
            where ou.parent is null
            order by ou.name
            """)
    fun findRootTreeNodes(): List<OrganisationUnitTreeNodeDTO>

    @Query("""
            select new io.davida.utgl_admin.organisation_unit.model.OrganisationUnitTreeNodeDTO(
                ou.id, ou.name, ou.level,
                (select count(c) from OrganisationUnit c where c.parent = ou))
            from OrganisationUnit ou
            where ou.parent.id = :parentId
            order by ou.name
            """)
    fun findChildTreeNodes(@Param("parentId") parentId: String): List<OrganisationUnitTreeNodeDTO>

}
