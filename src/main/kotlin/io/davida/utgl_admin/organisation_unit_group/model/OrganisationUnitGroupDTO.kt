package io.davida.utgl_admin.organisation_unit_group.model

import jakarta.validation.constraints.Size
import java.util.UUID


class OrganisationUnitGroupDTO {

    var id: UUID? = null

    @Size(max = 255)
    var name: String? = null

    var organisationUnits: List<String>? = null

}
