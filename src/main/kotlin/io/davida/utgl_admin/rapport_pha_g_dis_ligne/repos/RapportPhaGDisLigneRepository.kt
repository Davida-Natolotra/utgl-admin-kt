package io.davida.utgl_admin.rapport_pha_g_dis_ligne.repos

import io.davida.utgl_admin.rapport_pha_g_dis_ligne.domain.RapportPhaGDisLigne
import java.util.UUID
import org.springframework.data.jpa.repository.JpaRepository


interface RapportPhaGDisLigneRepository : JpaRepository<RapportPhaGDisLigne, Long> {

    fun findFirstByRapportPhaGDisId(id: UUID): RapportPhaGDisLigne?

    fun findFirstByProduitProgrammeNiveauId(id: UUID): RapportPhaGDisLigne?

}
