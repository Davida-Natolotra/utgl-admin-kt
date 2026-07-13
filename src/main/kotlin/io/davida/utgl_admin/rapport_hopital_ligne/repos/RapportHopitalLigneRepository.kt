package io.davida.utgl_admin.rapport_hopital_ligne.repos

import io.davida.utgl_admin.rapport_hopital_ligne.domain.RapportHopitalLigne
import java.util.UUID
import org.springframework.data.jpa.repository.JpaRepository


interface RapportHopitalLigneRepository : JpaRepository<RapportHopitalLigne, UUID> {

    fun findFirstByProduitProgrammeNiveauId(id: UUID): RapportHopitalLigne?

    fun findFirstByRapportHopitauxId(id: UUID): RapportHopitalLigne?

}
