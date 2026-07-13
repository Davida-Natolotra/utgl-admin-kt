package io.davida.utgl_admin.rapportfs.model

import io.swagger.v3.oas.annotations.media.Schema
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size
import java.time.LocalDate
import java.time.LocalTime
import java.util.UUID


class RapportfsDTO {

    var id: UUID? = null

    @NotNull
    @Size(max = 255)
    var name: String? = null

    @Schema(
        type = "string",
        example = "18:30"
    )
    var created: LocalTime? = null

    var exportedDate: LocalDate? = null

    @Size(max = 255)
    @RapportfsFsUnique
    var fs: String? = null

    var rapportDistrict: UUID? = null

}
