package io.davida.utgl_admin.rapport_hopitaux.model

import jakarta.validation.constraints.Size
import java.time.LocalDate
import java.util.UUID


class RapportHopitauxDTO {

    var id: UUID? = null

    var moisAnnee: LocalDate? = null

    @Size(max = 255)
    var name: String? = null

    var created: LocalDate? = null

    var exportingDate: LocalDate? = null

    var importingDate: LocalDate? = null

    @Size(max = 255)
    var hopital: String? = null

    @Size(max = 255)
    var drsp: String? = null

}
