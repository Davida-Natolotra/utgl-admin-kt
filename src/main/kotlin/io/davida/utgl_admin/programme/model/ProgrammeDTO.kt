package io.davida.utgl_admin.programme.model

import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size


class ProgrammeDTO {

    var id: Long? = null

    @NotNull
    @Size(max = 255)
    @ProgrammeNameUnique
    var name: String? = null

}
