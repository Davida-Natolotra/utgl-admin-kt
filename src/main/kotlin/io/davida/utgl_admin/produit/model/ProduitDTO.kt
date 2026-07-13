package io.davida.utgl_admin.produit.model

import jakarta.validation.constraints.Size
import java.time.LocalDateTime


class ProduitDTO {

    var id: Int? = null

    @Size(max = 200)
    var name: String? = null

    @Size(max = 200)
    var unit: String? = null

    @Size(max = 200)
    var code: String? = null

    var edited: LocalDateTime? = null

}
