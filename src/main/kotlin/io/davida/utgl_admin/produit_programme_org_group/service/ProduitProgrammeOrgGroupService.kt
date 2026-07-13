package io.davida.utgl_admin.produit_programme_org_group.service

import io.davida.utgl_admin.events.BeforeDeleteOrganisationUnitGroup
import io.davida.utgl_admin.events.BeforeDeleteProduit
import io.davida.utgl_admin.events.BeforeDeleteProduitProgrammeOrgGroup
import io.davida.utgl_admin.events.BeforeDeleteProgramme
import io.davida.utgl_admin.events.BeforeDeleteRapportFSLigne
import io.davida.utgl_admin.organisation_unit_group.repos.OrganisationUnitGroupRepository
import io.davida.utgl_admin.produit.repos.ProduitRepository
import io.davida.utgl_admin.produit_programme_org_group.domain.ProduitProgrammeOrgGroup
import io.davida.utgl_admin.produit_programme_org_group.model.ProduitProgrammeOrgGroupDTO
import io.davida.utgl_admin.produit_programme_org_group.repos.ProduitProgrammeOrgGroupRepository
import io.davida.utgl_admin.programme.repos.ProgrammeRepository
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
class ProduitProgrammeOrgGroupService(
    private val produitProgrammeOrgGroupRepository: ProduitProgrammeOrgGroupRepository,
    private val produitRepository: ProduitRepository,
    private val programmeRepository: ProgrammeRepository,
    private val organisationUnitGroupRepository: OrganisationUnitGroupRepository,
    private val rapportFSLigneRepository: RapportFSLigneRepository,
    private val publisher: ApplicationEventPublisher
) {

    fun findAll(): List<ProduitProgrammeOrgGroupDTO> {
        val produitProgrammeOrgGroups = produitProgrammeOrgGroupRepository.findAll(Sort.by("id"))
        return produitProgrammeOrgGroups.map { produitProgrammeOrgGroup ->
                mapToDTO(produitProgrammeOrgGroup, ProduitProgrammeOrgGroupDTO()) }
    }

    fun `get`(id: UUID): ProduitProgrammeOrgGroupDTO =
            produitProgrammeOrgGroupRepository.findById(id)
            .map { produitProgrammeOrgGroup -> mapToDTO(produitProgrammeOrgGroup,
            ProduitProgrammeOrgGroupDTO()) }
            .orElseThrow { NotFoundException() }

    fun create(produitProgrammeOrgGroupDTO: ProduitProgrammeOrgGroupDTO): UUID {
        val produitProgrammeOrgGroup = ProduitProgrammeOrgGroup()
        mapToEntity(produitProgrammeOrgGroupDTO, produitProgrammeOrgGroup)
        return produitProgrammeOrgGroupRepository.save(produitProgrammeOrgGroup).id!!
    }

    fun update(id: UUID, produitProgrammeOrgGroupDTO: ProduitProgrammeOrgGroupDTO) {
        val produitProgrammeOrgGroup = produitProgrammeOrgGroupRepository.findById(id)
                .orElseThrow { NotFoundException() }
        mapToEntity(produitProgrammeOrgGroupDTO, produitProgrammeOrgGroup)
        produitProgrammeOrgGroupRepository.save(produitProgrammeOrgGroup)
    }

    fun delete(id: UUID) {
        val produitProgrammeOrgGroup = produitProgrammeOrgGroupRepository.findById(id)
                .orElseThrow { NotFoundException() }
        publisher.publishEvent(BeforeDeleteProduitProgrammeOrgGroup(id))
        produitProgrammeOrgGroupRepository.delete(produitProgrammeOrgGroup)
    }

    private fun mapToDTO(produitProgrammeOrgGroup: ProduitProgrammeOrgGroup,
            produitProgrammeOrgGroupDTO: ProduitProgrammeOrgGroupDTO): ProduitProgrammeOrgGroupDTO {
        produitProgrammeOrgGroupDTO.id = produitProgrammeOrgGroup.id
        produitProgrammeOrgGroupDTO.produit = produitProgrammeOrgGroup.produit?.id
        produitProgrammeOrgGroupDTO.programme = produitProgrammeOrgGroup.programme?.id
        produitProgrammeOrgGroupDTO.orgGroup = produitProgrammeOrgGroup.orgGroup?.id
        produitProgrammeOrgGroupDTO.produitProgrammeNiveau =
                produitProgrammeOrgGroup.produitProgrammeNiveau?.id
        return produitProgrammeOrgGroupDTO
    }

    private fun mapToEntity(produitProgrammeOrgGroupDTO: ProduitProgrammeOrgGroupDTO,
            produitProgrammeOrgGroup: ProduitProgrammeOrgGroup): ProduitProgrammeOrgGroup {
        val produit = if (produitProgrammeOrgGroupDTO.produit == null) null else
                produitRepository.findById(produitProgrammeOrgGroupDTO.produit!!)
                .orElseThrow { NotFoundException("produit not found") }
        produitProgrammeOrgGroup.produit = produit
        val programme = if (produitProgrammeOrgGroupDTO.programme == null) null else
                programmeRepository.findById(produitProgrammeOrgGroupDTO.programme!!)
                .orElseThrow { NotFoundException("programme not found") }
        produitProgrammeOrgGroup.programme = programme
        val orgGroup = if (produitProgrammeOrgGroupDTO.orgGroup == null) null else
                organisationUnitGroupRepository.findById(produitProgrammeOrgGroupDTO.orgGroup!!)
                .orElseThrow { NotFoundException("orgGroup not found") }
        produitProgrammeOrgGroup.orgGroup = orgGroup
        val produitProgrammeNiveau = if (produitProgrammeOrgGroupDTO.produitProgrammeNiveau == null)
                null else
                rapportFSLigneRepository.findById(produitProgrammeOrgGroupDTO.produitProgrammeNiveau!!)
                .orElseThrow { NotFoundException("produitProgrammeNiveau not found") }
        produitProgrammeOrgGroup.produitProgrammeNiveau = produitProgrammeNiveau
        return produitProgrammeOrgGroup
    }

    fun getProduitProgrammeOrgGroupValues(): Map<UUID, UUID> =
            produitProgrammeOrgGroupRepository.findAll(Sort.by("id"))
            .stream()
            .collect(CustomCollectors.toSortedMap(ProduitProgrammeOrgGroup::id,
            ProduitProgrammeOrgGroup::id))

    @EventListener(BeforeDeleteProduit::class)
    fun on(event: BeforeDeleteProduit) {
        val referencedException = ReferencedException()
        val produitProduitProgrammeOrgGroup =
                produitProgrammeOrgGroupRepository.findFirstByProduitId(event.id)
        if (produitProduitProgrammeOrgGroup != null) {
            referencedException.key = "produit.produitProgrammeOrgGroup.produit.referenced"
            referencedException.addParam(produitProduitProgrammeOrgGroup.id)
            throw referencedException
        }
    }

    @EventListener(BeforeDeleteProgramme::class)
    fun on(event: BeforeDeleteProgramme) {
        val referencedException = ReferencedException()
        val programmeProduitProgrammeOrgGroup =
                produitProgrammeOrgGroupRepository.findFirstByProgrammeId(event.id)
        if (programmeProduitProgrammeOrgGroup != null) {
            referencedException.key = "programme.produitProgrammeOrgGroup.programme.referenced"
            referencedException.addParam(programmeProduitProgrammeOrgGroup.id)
            throw referencedException
        }
    }

    @EventListener(BeforeDeleteOrganisationUnitGroup::class)
    fun on(event: BeforeDeleteOrganisationUnitGroup) {
        val referencedException = ReferencedException()
        val orgGroupProduitProgrammeOrgGroup =
                produitProgrammeOrgGroupRepository.findFirstByOrgGroupId(event.id)
        if (orgGroupProduitProgrammeOrgGroup != null) {
            referencedException.key =
                    "organisationUnitGroup.produitProgrammeOrgGroup.orgGroup.referenced"
            referencedException.addParam(orgGroupProduitProgrammeOrgGroup.id)
            throw referencedException
        }
    }

    @EventListener(BeforeDeleteRapportFSLigne::class)
    fun on(event: BeforeDeleteRapportFSLigne) {
        val referencedException = ReferencedException()
        val produitProgrammeNiveauProduitProgrammeOrgGroup =
                produitProgrammeOrgGroupRepository.findFirstByProduitProgrammeNiveauId(event.id)
        if (produitProgrammeNiveauProduitProgrammeOrgGroup != null) {
            referencedException.key =
                    "rapportFSLigne.produitProgrammeOrgGroup.produitProgrammeNiveau.referenced"
            referencedException.addParam(produitProgrammeNiveauProduitProgrammeOrgGroup.id)
            throw referencedException
        }
    }

}
