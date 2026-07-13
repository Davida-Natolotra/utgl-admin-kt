package io.davida.utgl_admin.rapport_f_s_ligne.model

import com.fasterxml.jackson.annotation.JsonProperty
import jakarta.validation.constraints.Size
import java.util.UUID


class RapportFSLigneDTO {

    var id: UUID? = null

    var qteDispoDebMois: Int? = null

    var qteRecMois: Int? = null

    var qteDistPatient: Int? = null

    var qteDistAC: Int? = null

    var qtePerimeAvarieMois: Int? = null

    var qteRedeplMois: Int? = null

    var nbJourRupture: Int? = null

    var stockTheorique: Int? = null

    @JsonProperty("sDUTotal")
    var sDUTotal: Int? = null

    var ecart: Int? = null

    var cmm: Int? = null

    var msd: Double? = null

    @Size(max = 255)
    var situation: String? = null

    var produitProgrammeNiveau: UUID? = null

}
