package io.davida.utgl_admin.rapport_hopitaux.repos

import io.davida.utgl_admin.rapport_hopitaux.domain.RapportHopitaux
import java.util.UUID
import org.springframework.data.jpa.repository.JpaRepository


interface RapportHopitauxRepository : JpaRepository<RapportHopitaux, UUID> {

    fun findFirstByHopitalId(id: String): RapportHopitaux?

    fun findFirstByDrspId(id: String): RapportHopitaux?

}
