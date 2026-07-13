package io.davida.utgl_admin.rapport_pha_g_dis_ligne.service

import io.davida.utgl_admin.events.BeforeDeleteProduitProgrammeOrgGroup
import io.davida.utgl_admin.events.BeforeDeleteRapportPhaGDis
import io.davida.utgl_admin.rapport_pha_g_dis_ligne.domain.RapportPhaGDisLigne
import io.davida.utgl_admin.rapport_pha_g_dis_ligne.repos.RapportPhaGDisLigneRepository
import io.davida.utgl_admin.util.CustomCollectors
import io.davida.utgl_admin.util.ReferencedException
import org.springframework.context.event.EventListener
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service


@Service
class RapportPhaGDisLigneService(
    private val rapportPhaGDisLigneRepository: RapportPhaGDisLigneRepository
) {

    fun getRapportPhaGDisLigneValues(): Map<Long, Long> =
            rapportPhaGDisLigneRepository.findAll(Sort.by("id"))
            .stream()
            .collect(CustomCollectors.toSortedMap(RapportPhaGDisLigne::id, RapportPhaGDisLigne::id))

    @EventListener(BeforeDeleteRapportPhaGDis::class)
    fun on(event: BeforeDeleteRapportPhaGDis) {
        val referencedException = ReferencedException()
        val rapportPhaGDisRapportPhaGDisLigne =
                rapportPhaGDisLigneRepository.findFirstByRapportPhaGDisId(event.id)
        if (rapportPhaGDisRapportPhaGDisLigne != null) {
            referencedException.key = "rapportPhaGDis.rapportPhaGDisLigne.rapportPhaGDis.referenced"
            referencedException.addParam(rapportPhaGDisRapportPhaGDisLigne.id)
            throw referencedException
        }
    }

    @EventListener(BeforeDeleteProduitProgrammeOrgGroup::class)
    fun on(event: BeforeDeleteProduitProgrammeOrgGroup) {
        val referencedException = ReferencedException()
        val produitProgrammeNiveauRapportPhaGDisLigne =
                rapportPhaGDisLigneRepository.findFirstByProduitProgrammeNiveauId(event.id)
        if (produitProgrammeNiveauRapportPhaGDisLigne != null) {
            referencedException.key =
                    "produitProgrammeOrgGroup.rapportPhaGDisLigne.produitProgrammeNiveau.referenced"
            referencedException.addParam(produitProgrammeNiveauRapportPhaGDisLigne.id)
            throw referencedException
        }
    }

}
