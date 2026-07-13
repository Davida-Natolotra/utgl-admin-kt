package io.davida.utgl_admin.organisation_unit.model

import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size
import java.time.LocalDateTime


class OrganisationUnitDTO {

    @Size(max = 255)
    @OrganisationUnitIdValid
    var id: String? = null

    @Size(max = 255)
    var code: String? = null

    @NotNull
    @Size(max = 255)
    var name: String? = null

    @Size(max = 255)
    var shortName: String? = null

    @Size(max = 255)
    var displayName: String? = null

    @NotNull
    var level: Int? = null

    @Size(max = 255)
    var path: String? = null

    var openingDate: LocalDateTime? = null

    var closeDate: LocalDateTime? = null

    var geometry: Map<String, Any>? = null

    @Size(max = 255)
    var address: String? = null

    var description: String? = null

    @Size(max = 255)
    var email: String? = null

    @Size(max = 255)
    var phoneNumber: String? = null

    @Size(max = 255)
    var contactPerson: String? = null

    var comment: String? = null

    var translations: Map<String, String>? = null

    var attributeValues: Map<String, String>? = null

    var createdBy: Map<String, String>? = null

    var lastUpdatedBy: Map<String, String>? = null

    var created: LocalDateTime? = null

    @Size(max = 255)
    var parent: String? = null

}
