package io.davida.utgl_admin.rapport_hopital_ligne.service

import io.davida.utgl_admin.events.BeforeDeleteProduitProgrammeOrgGroup
import io.davida.utgl_admin.events.BeforeDeleteRapportHopitaux
import io.davida.utgl_admin.rapport_hopital_ligne.domain.RapportHopitalLigne
import io.davida.utgl_admin.rapport_hopital_ligne.repos.RapportHopitalLigneRepository
import io.davida.utgl_admin.util.CustomCollectors
import io.davida.utgl_admin.util.ReferencedException
import java.util.UUID
import org.springframework.context.event.EventListener
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service


@Service
class RapportHopitalLigneService(
    private val rapportHopitalLigneRepository: RapportHopitalLigneRepository
) {

    fun getRapportHopitalLigneValues(): Map<UUID, UUID> =
            rapportHopitalLigneRepository.findAll(Sort.by("id"))
            .stream()
            .collect(CustomCollectors.toSortedMap(RapportHopitalLigne::id, RapportHopitalLigne::id))

    @EventListener(BeforeDeleteProduitProgrammeOrgGroup::class)
    fun on(event: BeforeDeleteProduitProgrammeOrgGroup) {
        val referencedException = ReferencedException()
        val produitProgrammeNiveauRapportHopitalLigne =
                rapportHopitalLigneRepository.findFirstByProduitProgrammeNiveauId(event.id)
        if (produitProgrammeNiveauRapportHopitalLigne != null) {
            referencedException.key =
                    "produitProgrammeOrgGroup.rapportHopitalLigne.produitProgrammeNiveau.referenced"
            referencedException.addParam(produitProgrammeNiveauRapportHopitalLigne.id)
            throw referencedException
        }
    }

    @EventListener(BeforeDeleteRapportHopitaux::class)
    fun on(event: BeforeDeleteRapportHopitaux) {
        val referencedException = ReferencedException()
        val rapportHopitauxRapportHopitalLigne =
                rapportHopitalLigneRepository.findFirstByRapportHopitauxId(event.id)
        if (rapportHopitauxRapportHopitalLigne != null) {
            referencedException.key =
                    "rapportHopitaux.rapportHopitalLigne.rapportHopitaux.referenced"
            referencedException.addParam(rapportHopitauxRapportHopitalLigne.id)
            throw referencedException
        }
    }

}
