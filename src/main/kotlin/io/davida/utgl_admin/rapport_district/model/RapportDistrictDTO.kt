package io.davida.utgl_admin.rapport_district.model

import jakarta.validation.constraints.Size
import java.time.LocalDate
import java.util.UUID


class RapportDistrictDTO {

    var id: UUID? = null

    var moisAnnee: LocalDate? = null

    @Size(max = 255)
    var name: String? = null

    var exportingDate: LocalDate? = null

    var importingDate: LocalDate? = null

    var created: LocalDate? = null

    @Size(max = 255)
    var drsp: String? = null

    @Size(max = 255)
    var sdsp: String? = null

    var rapport: UUID? = null

}
