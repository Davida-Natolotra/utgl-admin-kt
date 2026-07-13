package io.davida.utgl_admin.rapport_f_s_ligne.repos

import io.davida.utgl_admin.rapport_f_s_ligne.domain.RapportFSLigne
import java.util.UUID
import org.springframework.data.jpa.repository.JpaRepository


interface RapportFSLigneRepository : JpaRepository<RapportFSLigne, UUID> {

    fun findFirstByProduitProgrammeNiveauId(id: UUID): RapportFSLigne?

}
