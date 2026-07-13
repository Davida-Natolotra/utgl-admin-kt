package io.davida.utgl_admin.rapport_hopitaux.service

import io.davida.utgl_admin.events.BeforeDeleteOrganisationUnit
import io.davida.utgl_admin.events.BeforeDeleteRapportHopitaux
import io.davida.utgl_admin.organisation_unit.repos.OrganisationUnitRepository
import io.davida.utgl_admin.rapport_hopitaux.domain.RapportHopitaux
import io.davida.utgl_admin.rapport_hopitaux.model.RapportHopitauxDTO
import io.davida.utgl_admin.rapport_hopitaux.repos.RapportHopitauxRepository
import io.davida.utgl_admin.util.NotFoundException
import io.davida.utgl_admin.util.ReferencedException
import java.util.UUID
import org.springframework.context.ApplicationEventPublisher
import org.springframework.context.event.EventListener
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service


@Service
class RapportHopitauxService(
    private val rapportHopitauxRepository: RapportHopitauxRepository,
    private val organisationUnitRepository: OrganisationUnitRepository,
    private val publisher: ApplicationEventPublisher
) {

    fun findAll(): List<RapportHopitauxDTO> {
        val rapportHopitauxes = rapportHopitauxRepository.findAll(Sort.by("id"))
        return rapportHopitauxes.map { rapportHopitaux -> mapToDTO(rapportHopitaux,
                RapportHopitauxDTO()) }
    }

    fun `get`(id: UUID): RapportHopitauxDTO = rapportHopitauxRepository.findById(id)
            .map { rapportHopitaux -> mapToDTO(rapportHopitaux, RapportHopitauxDTO()) }
            .orElseThrow { NotFoundException() }

    fun create(rapportHopitauxDTO: RapportHopitauxDTO): UUID {
        val rapportHopitaux = RapportHopitaux()
        mapToEntity(rapportHopitauxDTO, rapportHopitaux)
        return rapportHopitauxRepository.save(rapportHopitaux).id!!
    }

    fun update(id: UUID, rapportHopitauxDTO: RapportHopitauxDTO) {
        val rapportHopitaux = rapportHopitauxRepository.findById(id)
                .orElseThrow { NotFoundException() }
        mapToEntity(rapportHopitauxDTO, rapportHopitaux)
        rapportHopitauxRepository.save(rapportHopitaux)
    }

    fun delete(id: UUID) {
        val rapportHopitaux = rapportHopitauxRepository.findById(id)
                .orElseThrow { NotFoundException() }
        publisher.publishEvent(BeforeDeleteRapportHopitaux(id))
        rapportHopitauxRepository.delete(rapportHopitaux)
    }

    private fun mapToDTO(rapportHopitaux: RapportHopitaux, rapportHopitauxDTO: RapportHopitauxDTO):
            RapportHopitauxDTO {
        rapportHopitauxDTO.id = rapportHopitaux.id
        rapportHopitauxDTO.moisAnnee = rapportHopitaux.moisAnnee
        rapportHopitauxDTO.name = rapportHopitaux.name
        rapportHopitauxDTO.created = rapportHopitaux.created
        rapportHopitauxDTO.exportingDate = rapportHopitaux.exportingDate
        rapportHopitauxDTO.importingDate = rapportHopitaux.importingDate
        rapportHopitauxDTO.hopital = rapportHopitaux.hopital?.id
        rapportHopitauxDTO.drsp = rapportHopitaux.drsp?.id
        return rapportHopitauxDTO
    }

    private fun mapToEntity(rapportHopitauxDTO: RapportHopitauxDTO,
            rapportHopitaux: RapportHopitaux): RapportHopitaux {
        rapportHopitaux.moisAnnee = rapportHopitauxDTO.moisAnnee
        rapportHopitaux.name = rapportHopitauxDTO.name
        rapportHopitaux.created = rapportHopitauxDTO.created
        rapportHopitaux.exportingDate = rapportHopitauxDTO.exportingDate
        rapportHopitaux.importingDate = rapportHopitauxDTO.importingDate
        val hopital = if (rapportHopitauxDTO.hopital == null) null else
                organisationUnitRepository.findById(rapportHopitauxDTO.hopital!!)
                .orElseThrow { NotFoundException("hopital not found") }
        rapportHopitaux.hopital = hopital
        val drsp = if (rapportHopitauxDTO.drsp == null) null else
                organisationUnitRepository.findById(rapportHopitauxDTO.drsp!!)
                .orElseThrow { NotFoundException("drsp not found") }
        rapportHopitaux.drsp = drsp
        return rapportHopitaux
    }

    @EventListener(BeforeDeleteOrganisationUnit::class)
    fun on(event: BeforeDeleteOrganisationUnit) {
        val referencedException = ReferencedException()
        val hopitalRapportHopitaux = rapportHopitauxRepository.findFirstByHopitalId(event.id)
        if (hopitalRapportHopitaux != null) {
            referencedException.key = "organisationUnit.rapportHopitaux.hopital.referenced"
            referencedException.addParam(hopitalRapportHopitaux.id)
            throw referencedException
        }
        val drspRapportHopitaux = rapportHopitauxRepository.findFirstByDrspId(event.id)
        if (drspRapportHopitaux != null) {
            referencedException.key = "organisationUnit.rapportHopitaux.drsp.referenced"
            referencedException.addParam(drspRapportHopitaux.id)
            throw referencedException
        }
    }

}
