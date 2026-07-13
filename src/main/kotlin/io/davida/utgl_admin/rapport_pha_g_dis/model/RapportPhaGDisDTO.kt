package io.davida.utgl_admin.rapport_pha_g_dis.model

import jakarta.validation.constraints.Size
import java.time.LocalDate
import java.util.UUID


class RapportPhaGDisDTO {

    var id: UUID? = null

    @Size(max = 255)
    var name: String? = null

    var created: LocalDate? = null

    var exportedDate: LocalDate? = null

}
