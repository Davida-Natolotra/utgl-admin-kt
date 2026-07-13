package io.davida.utgl_admin.rapport_district.service

import io.davida.utgl_admin.events.BeforeDeleteOrganisationUnit
import io.davida.utgl_admin.events.BeforeDeleteRapportDistrict
import io.davida.utgl_admin.events.BeforeDeleteRapportPhaGDis
import io.davida.utgl_admin.organisation_unit.repos.OrganisationUnitRepository
import io.davida.utgl_admin.rapport_district.domain.RapportDistrict
import io.davida.utgl_admin.rapport_district.model.RapportDistrictDTO
import io.davida.utgl_admin.rapport_district.repos.RapportDistrictRepository
import io.davida.utgl_admin.rapport_pha_g_dis.repos.RapportPhaGDisRepository
import io.davida.utgl_admin.util.CustomCollectors
import io.davida.utgl_admin.util.NotFoundException
import io.davida.utgl_admin.util.ReferencedException
import java.util.UUID
import org.springframework.context.ApplicationEventPublisher
import org.springframework.context.event.EventListener
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service


@Service
class RapportDistrictService(
    private val rapportDistrictRepository: RapportDistrictRepository,
    private val organisationUnitRepository: OrganisationUnitRepository,
    private val rapportPhaGDisRepository: RapportPhaGDisRepository,
    private val publisher: ApplicationEventPublisher
) {

    fun findAll(): List<RapportDistrictDTO> {
        val rapportDistricts = rapportDistrictRepository.findAll(Sort.by("id"))
        return rapportDistricts.map { rapportDistrict -> mapToDTO(rapportDistrict,
                RapportDistrictDTO()) }
    }

    fun `get`(id: UUID): RapportDistrictDTO = rapportDistrictRepository.findById(id)
            .map { rapportDistrict -> mapToDTO(rapportDistrict, RapportDistrictDTO()) }
            .orElseThrow { NotFoundException() }

    fun create(rapportDistrictDTO: RapportDistrictDTO): UUID {
        val rapportDistrict = RapportDistrict()
        mapToEntity(rapportDistrictDTO, rapportDistrict)
        return rapportDistrictRepository.save(rapportDistrict).id!!
    }

    fun update(id: UUID, rapportDistrictDTO: RapportDistrictDTO) {
        val rapportDistrict = rapportDistrictRepository.findById(id)
                .orElseThrow { NotFoundException() }
        mapToEntity(rapportDistrictDTO, rapportDistrict)
        rapportDistrictRepository.save(rapportDistrict)
    }

    fun delete(id: UUID) {
        val rapportDistrict = rapportDistrictRepository.findById(id)
                .orElseThrow { NotFoundException() }
        publisher.publishEvent(BeforeDeleteRapportDistrict(id))
        rapportDistrictRepository.delete(rapportDistrict)
    }

    private fun mapToDTO(rapportDistrict: RapportDistrict, rapportDistrictDTO: RapportDistrictDTO):
            RapportDistrictDTO {
        rapportDistrictDTO.id = rapportDistrict.id
        rapportDistrictDTO.moisAnnee = rapportDistrict.moisAnnee
        rapportDistrictDTO.name = rapportDistrict.name
        rapportDistrictDTO.exportingDate = rapportDistrict.exportingDate
        rapportDistrictDTO.importingDate = rapportDistrict.importingDate
        rapportDistrictDTO.created = rapportDistrict.created
        rapportDistrictDTO.drsp = rapportDistrict.drsp?.id
        rapportDistrictDTO.sdsp = rapportDistrict.sdsp?.id
        rapportDistrictDTO.rapport = rapportDistrict.rapport?.id
        return rapportDistrictDTO
    }

    private fun mapToEntity(rapportDistrictDTO: RapportDistrictDTO,
            rapportDistrict: RapportDistrict): RapportDistrict {
        rapportDistrict.moisAnnee = rapportDistrictDTO.moisAnnee
        rapportDistrict.name = rapportDistrictDTO.name
        rapportDistrict.exportingDate = rapportDistrictDTO.exportingDate
        rapportDistrict.importingDate = rapportDistrictDTO.importingDate
        rapportDistrict.created = rapportDistrictDTO.created
        val drsp = if (rapportDistrictDTO.drsp == null) null else
                organisationUnitRepository.findById(rapportDistrictDTO.drsp!!)
                .orElseThrow { NotFoundException("drsp not found") }
        rapportDistrict.drsp = drsp
        val sdsp = if (rapportDistrictDTO.sdsp == null) null else
                organisationUnitRepository.findById(rapportDistrictDTO.sdsp!!)
                .orElseThrow { NotFoundException("sdsp not found") }
        rapportDistrict.sdsp = sdsp
        val rapport = if (rapportDistrictDTO.rapport == null) null else
                rapportPhaGDisRepository.findById(rapportDistrictDTO.rapport!!)
                .orElseThrow { NotFoundException("rapport not found") }
        rapportDistrict.rapport = rapport
        return rapportDistrict
    }

    fun getRapportDistrictValues(): Map<UUID, UUID> =
            rapportDistrictRepository.findAll(Sort.by("id"))
            .stream()
            .collect(CustomCollectors.toSortedMap(RapportDistrict::id, RapportDistrict::id))

    @EventListener(BeforeDeleteOrganisationUnit::class)
    fun on(event: BeforeDeleteOrganisationUnit) {
        val referencedException = ReferencedException()
        val drspRapportDistrict = rapportDistrictRepository.findFirstByDrspId(event.id)
        if (drspRapportDistrict != null) {
            referencedException.key = "organisationUnit.rapportDistrict.drsp.referenced"
            referencedException.addParam(drspRapportDistrict.id)
            throw referencedException
        }
        val sdspRapportDistrict = rapportDistrictRepository.findFirstBySdspId(event.id)
        if (sdspRapportDistrict != null) {
            referencedException.key = "organisationUnit.rapportDistrict.sdsp.referenced"
            referencedException.addParam(sdspRapportDistrict.id)
            throw referencedException
        }
    }

    @EventListener(BeforeDeleteRapportPhaGDis::class)
    fun on(event: BeforeDeleteRapportPhaGDis) {
        val referencedException = ReferencedException()
        val rapportRapportDistrict = rapportDistrictRepository.findFirstByRapportId(event.id)
        if (rapportRapportDistrict != null) {
            referencedException.key = "rapportPhaGDis.rapportDistrict.rapport.referenced"
            referencedException.addParam(rapportRapportDistrict.id)
            throw referencedException
        }
    }

}
