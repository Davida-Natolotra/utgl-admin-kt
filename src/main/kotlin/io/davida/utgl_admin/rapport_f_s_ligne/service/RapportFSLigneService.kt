package io.davida.utgl_admin.rapport_f_s_ligne.service

import io.davida.utgl_admin.events.BeforeDeleteProduitProgrammeOrgGroup
import io.davida.utgl_admin.events.BeforeDeleteRapportFSLigne
import io.davida.utgl_admin.produit_programme_org_group.repos.ProduitProgrammeOrgGroupRepository
import io.davida.utgl_admin.rapport_f_s_ligne.domain.RapportFSLigne
import io.davida.utgl_admin.rapport_f_s_ligne.model.RapportFSLigneDTO
import io.davida.utgl_admin.rapport_f_s_ligne.repos.RapportFSLigneRepository
import io.davida.utgl_admin.util.CustomCollectors
import io.davida.utgl_admin.util.NotFoundException
import io.davida.utgl_admin.util.ReferencedException
import java.util.UUID
import org.springframework.context.ApplicationEventPublisher
import org.springframework.context.event.EventListener
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service


@Service
class RapportFSLigneService(
    private val rapportFSLigneRepository: RapportFSLigneRepository,
    private val produitProgrammeOrgGroupRepository: ProduitProgrammeOrgGroupRepository,
    private val publisher: ApplicationEventPublisher
) {

    fun findAll(): List<RapportFSLigneDTO> {
        val rapportFSLignes = rapportFSLigneRepository.findAll(Sort.by("id"))
        return rapportFSLignes.map { rapportFSLigne -> mapToDTO(rapportFSLigne,
                RapportFSLigneDTO()) }
    }

    fun `get`(id: UUID): RapportFSLigneDTO = rapportFSLigneRepository.findById(id)
            .map { rapportFSLigne -> mapToDTO(rapportFSLigne, RapportFSLigneDTO()) }
            .orElseThrow { NotFoundException() }

    fun create(rapportFSLigneDTO: RapportFSLigneDTO): UUID {
        val rapportFSLigne = RapportFSLigne()
        mapToEntity(rapportFSLigneDTO, rapportFSLigne)
        return rapportFSLigneRepository.save(rapportFSLigne).id!!
    }

    fun update(id: UUID, rapportFSLigneDTO: RapportFSLigneDTO) {
        val rapportFSLigne = rapportFSLigneRepository.findById(id)
                .orElseThrow { NotFoundException() }
        mapToEntity(rapportFSLigneDTO, rapportFSLigne)
        rapportFSLigneRepository.save(rapportFSLigne)
    }

    fun delete(id: UUID) {
        val rapportFSLigne = rapportFSLigneRepository.findById(id)
                .orElseThrow { NotFoundException() }
        publisher.publishEvent(BeforeDeleteRapportFSLigne(id))
        rapportFSLigneRepository.delete(rapportFSLigne)
    }

    private fun mapToDTO(rapportFSLigne: RapportFSLigne, rapportFSLigneDTO: RapportFSLigneDTO):
            RapportFSLigneDTO {
        rapportFSLigneDTO.id = rapportFSLigne.id
        rapportFSLigneDTO.qteDispoDebMois = rapportFSLigne.qteDispoDebMois
        rapportFSLigneDTO.qteRecMois = rapportFSLigne.qteRecMois
        rapportFSLigneDTO.qteDistPatient = rapportFSLigne.qteDistPatient
        rapportFSLigneDTO.qteDistAC = rapportFSLigne.qteDistAC
        rapportFSLigneDTO.qtePerimeAvarieMois = rapportFSLigne.qtePerimeAvarieMois
        rapportFSLigneDTO.qteRedeplMois = rapportFSLigne.qteRedeplMois
        rapportFSLigneDTO.nbJourRupture = rapportFSLigne.nbJourRupture
        rapportFSLigneDTO.stockTheorique = rapportFSLigne.stockTheorique
        rapportFSLigneDTO.sDUTotal = rapportFSLigne.sDUTotal
        rapportFSLigneDTO.ecart = rapportFSLigne.ecart
        rapportFSLigneDTO.cmm = rapportFSLigne.cmm
        rapportFSLigneDTO.msd = rapportFSLigne.msd
        rapportFSLigneDTO.situation = rapportFSLigne.situation
        rapportFSLigneDTO.produitProgrammeNiveau = rapportFSLigne.produitProgrammeNiveau?.id
        return rapportFSLigneDTO
    }

    private fun mapToEntity(rapportFSLigneDTO: RapportFSLigneDTO, rapportFSLigne: RapportFSLigne):
            RapportFSLigne {
        rapportFSLigne.qteDispoDebMois = rapportFSLigneDTO.qteDispoDebMois
        rapportFSLigne.qteRecMois = rapportFSLigneDTO.qteRecMois
        rapportFSLigne.qteDistPatient = rapportFSLigneDTO.qteDistPatient
        rapportFSLigne.qteDistAC = rapportFSLigneDTO.qteDistAC
        rapportFSLigne.qtePerimeAvarieMois = rapportFSLigneDTO.qtePerimeAvarieMois
        rapportFSLigne.qteRedeplMois = rapportFSLigneDTO.qteRedeplMois
        rapportFSLigne.nbJourRupture = rapportFSLigneDTO.nbJourRupture
        rapportFSLigne.stockTheorique = rapportFSLigneDTO.stockTheorique
        rapportFSLigne.sDUTotal = rapportFSLigneDTO.sDUTotal
        rapportFSLigne.ecart = rapportFSLigneDTO.ecart
        rapportFSLigne.cmm = rapportFSLigneDTO.cmm
        rapportFSLigne.msd = rapportFSLigneDTO.msd
        rapportFSLigne.situation = rapportFSLigneDTO.situation
        val produitProgrammeNiveau = if (rapportFSLigneDTO.produitProgrammeNiveau == null) null else
                produitProgrammeOrgGroupRepository.findById(rapportFSLigneDTO.produitProgrammeNiveau!!)
                .orElseThrow { NotFoundException("produitProgrammeNiveau not found") }
        rapportFSLigne.produitProgrammeNiveau = produitProgrammeNiveau
        return rapportFSLigne
    }

    fun getRapportFSLigneValues(): Map<UUID, UUID> = rapportFSLigneRepository.findAll(Sort.by("id"))
            .stream()
            .collect(CustomCollectors.toSortedMap(RapportFSLigne::id, RapportFSLigne::id))

    @EventListener(BeforeDeleteProduitProgrammeOrgGroup::class)
    fun on(event: BeforeDeleteProduitProgrammeOrgGroup) {
        val referencedException = ReferencedException()
        val produitProgrammeNiveauRapportFSLigne =
                rapportFSLigneRepository.findFirstByProduitProgrammeNiveauId(event.id)
        if (produitProgrammeNiveauRapportFSLigne != null) {
            referencedException.key =
                    "produitProgrammeOrgGroup.rapportFSLigne.produitProgrammeNiveau.referenced"
            referencedException.addParam(produitProgrammeNiveauRapportFSLigne.id)
            throw referencedException
        }
    }

}
