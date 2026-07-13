package io.davida.utgl_admin.rapportfs.service

import io.davida.utgl_admin.events.BeforeDeleteOrganisationUnit
import io.davida.utgl_admin.events.BeforeDeleteRapportDistrict
import io.davida.utgl_admin.organisation_unit.repos.OrganisationUnitRepository
import io.davida.utgl_admin.rapport_district.repos.RapportDistrictRepository
import io.davida.utgl_admin.rapportfs.domain.Rapportfs
import io.davida.utgl_admin.rapportfs.model.RapportfsDTO
import io.davida.utgl_admin.rapportfs.repos.RapportfsRepository
import io.davida.utgl_admin.util.NotFoundException
import io.davida.utgl_admin.util.ReferencedException
import java.util.UUID
import org.springframework.context.event.EventListener
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service


@Service
class RapportfsService(
    private val rapportfsRepository: RapportfsRepository,
    private val organisationUnitRepository: OrganisationUnitRepository,
    private val rapportDistrictRepository: RapportDistrictRepository
) {

    fun findAll(): List<RapportfsDTO> {
        val rapportfses = rapportfsRepository.findAll(Sort.by("id"))
        return rapportfses.map { rapportfs -> mapToDTO(rapportfs, RapportfsDTO()) }
    }

    fun `get`(id: UUID): RapportfsDTO = rapportfsRepository.findById(id)
            .map { rapportfs -> mapToDTO(rapportfs, RapportfsDTO()) }
            .orElseThrow { NotFoundException() }

    fun create(rapportfsDTO: RapportfsDTO): UUID {
        val rapportfs = Rapportfs()
        mapToEntity(rapportfsDTO, rapportfs)
        return rapportfsRepository.save(rapportfs).id!!
    }

    fun update(id: UUID, rapportfsDTO: RapportfsDTO) {
        val rapportfs = rapportfsRepository.findById(id)
                .orElseThrow { NotFoundException() }
        mapToEntity(rapportfsDTO, rapportfs)
        rapportfsRepository.save(rapportfs)
    }

    fun delete(id: UUID) {
        val rapportfs = rapportfsRepository.findById(id)
                .orElseThrow { NotFoundException() }
        rapportfsRepository.delete(rapportfs)
    }

    private fun mapToDTO(rapportfs: Rapportfs, rapportfsDTO: RapportfsDTO): RapportfsDTO {
        rapportfsDTO.id = rapportfs.id
        rapportfsDTO.name = rapportfs.name
        rapportfsDTO.created = rapportfs.created
        rapportfsDTO.exportedDate = rapportfs.exportedDate
        rapportfsDTO.fs = rapportfs.fs?.id
        rapportfsDTO.rapportDistrict = rapportfs.rapportDistrict?.id
        return rapportfsDTO
    }

    private fun mapToEntity(rapportfsDTO: RapportfsDTO, rapportfs: Rapportfs): Rapportfs {
        rapportfs.name = rapportfsDTO.name
        rapportfs.created = rapportfsDTO.created
        rapportfs.exportedDate = rapportfsDTO.exportedDate
        val fs = if (rapportfsDTO.fs == null) null else
                organisationUnitRepository.findById(rapportfsDTO.fs!!)
                .orElseThrow { NotFoundException("fs not found") }
        rapportfs.fs = fs
        val rapportDistrict = if (rapportfsDTO.rapportDistrict == null) null else
                rapportDistrictRepository.findById(rapportfsDTO.rapportDistrict!!)
                .orElseThrow { NotFoundException("rapportDistrict not found") }
        rapportfs.rapportDistrict = rapportDistrict
        return rapportfs
    }

    fun fsExists(id: String?): Boolean = rapportfsRepository.existsByFsIdAllIgnoreCase(id)

    @EventListener(BeforeDeleteOrganisationUnit::class)
    fun on(event: BeforeDeleteOrganisationUnit) {
        val referencedException = ReferencedException()
        val fsRapportfs = rapportfsRepository.findFirstByFsId(event.id)
        if (fsRapportfs != null) {
            referencedException.key = "organisationUnit.rapportfs.fs.referenced"
            referencedException.addParam(fsRapportfs.id)
            throw referencedException
        }
    }

    @EventListener(BeforeDeleteRapportDistrict::class)
    fun on(event: BeforeDeleteRapportDistrict) {
        val referencedException = ReferencedException()
        val rapportDistrictRapportfs = rapportfsRepository.findFirstByRapportDistrictId(event.id)
        if (rapportDistrictRapportfs != null) {
            referencedException.key = "rapportDistrict.rapportfs.rapportDistrict.referenced"
            referencedException.addParam(rapportDistrictRapportfs.id)
            throw referencedException
        }
    }

}
