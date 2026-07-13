package io.davida.utgl_admin.organisation_unit_group.repos

import io.davida.utgl_admin.organisation_unit_group.domain.OrganisationUnitGroup
import java.util.UUID
import org.springframework.data.jpa.repository.JpaRepository


interface OrganisationUnitGroupRepository : JpaRepository<OrganisationUnitGroup, UUID> {

    fun findAllByOrganisationUnitsId(id: String): List<OrganisationUnitGroup>

}
