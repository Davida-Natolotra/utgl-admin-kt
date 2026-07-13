package io.davida.utgl_admin.organisation_unit_group.service

import io.davida.utgl_admin.events.BeforeDeleteOrganisationUnit
import io.davida.utgl_admin.events.BeforeDeleteOrganisationUnitGroup
import io.davida.utgl_admin.organisation_unit.repos.OrganisationUnitRepository
import io.davida.utgl_admin.organisation_unit_group.domain.OrganisationUnitGroup
import io.davida.utgl_admin.organisation_unit_group.model.OrganisationUnitGroupDTO
import io.davida.utgl_admin.organisation_unit_group.repos.OrganisationUnitGroupRepository
import io.davida.utgl_admin.util.CustomCollectors
import io.davida.utgl_admin.util.NotFoundException
import java.util.UUID
import org.springframework.context.ApplicationEventPublisher
import org.springframework.context.event.EventListener
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional


@Service
@Transactional(rollbackFor = [Exception::class])
class OrganisationUnitGroupService(
    private val organisationUnitGroupRepository: OrganisationUnitGroupRepository,
    private val organisationUnitRepository: OrganisationUnitRepository,
    private val publisher: ApplicationEventPublisher
) {

    fun findAll(): List<OrganisationUnitGroupDTO> {
        val organisationUnitGroups = organisationUnitGroupRepository.findAll(Sort.by("id"))
        return organisationUnitGroups.map { organisationUnitGroup -> mapToDTO(organisationUnitGroup,
                OrganisationUnitGroupDTO()) }
    }

    fun `get`(id: UUID): OrganisationUnitGroupDTO = organisationUnitGroupRepository.findById(id)
            .map { organisationUnitGroup -> mapToDTO(organisationUnitGroup,
            OrganisationUnitGroupDTO()) }
            .orElseThrow { NotFoundException() }

    fun create(organisationUnitGroupDTO: OrganisationUnitGroupDTO): UUID {
        val organisationUnitGroup = OrganisationUnitGroup()
        mapToEntity(organisationUnitGroupDTO, organisationUnitGroup)
        return organisationUnitGroupRepository.save(organisationUnitGroup).id!!
    }

    fun update(id: UUID, organisationUnitGroupDTO: OrganisationUnitGroupDTO) {
        val organisationUnitGroup = organisationUnitGroupRepository.findById(id)
                .orElseThrow { NotFoundException() }
        mapToEntity(organisationUnitGroupDTO, organisationUnitGroup)
        organisationUnitGroupRepository.save(organisationUnitGroup)
    }

    fun delete(id: UUID) {
        val organisationUnitGroup = organisationUnitGroupRepository.findById(id)
                .orElseThrow { NotFoundException() }
        publisher.publishEvent(BeforeDeleteOrganisationUnitGroup(id))
        organisationUnitGroupRepository.delete(organisationUnitGroup)
    }

    private fun mapToDTO(organisationUnitGroup: OrganisationUnitGroup,
            organisationUnitGroupDTO: OrganisationUnitGroupDTO): OrganisationUnitGroupDTO {
        organisationUnitGroupDTO.id = organisationUnitGroup.id
        organisationUnitGroupDTO.name = organisationUnitGroup.name
        organisationUnitGroupDTO.organisationUnits = organisationUnitGroup.organisationUnits
                .map { organisationUnit -> organisationUnit.id!! }
        return organisationUnitGroupDTO
    }

    private fun mapToEntity(organisationUnitGroupDTO: OrganisationUnitGroupDTO,
            organisationUnitGroup: OrganisationUnitGroup): OrganisationUnitGroup {
        organisationUnitGroup.name = organisationUnitGroupDTO.name
        val organisationUnits =
                organisationUnitRepository.findAllById(organisationUnitGroupDTO.organisationUnits ?:
                emptyList())
        if (organisationUnits.size != (if (organisationUnitGroupDTO.organisationUnits == null) 0
                else organisationUnitGroupDTO.organisationUnits!!.size)) {
            throw NotFoundException("one of organisationUnits not found")
        }
        organisationUnitGroup.organisationUnits = organisationUnits.toMutableSet()
        return organisationUnitGroup
    }

    fun getOrganisationUnitGroupValues(): Map<UUID, UUID> =
            organisationUnitGroupRepository.findAll(Sort.by("id"))
            .stream()
            .collect(CustomCollectors.toSortedMap(OrganisationUnitGroup::id,
            OrganisationUnitGroup::id))

    @EventListener(BeforeDeleteOrganisationUnit::class)
    fun on(event: BeforeDeleteOrganisationUnit) {
        // remove many-to-many relations at owning side
        organisationUnitGroupRepository.findAllByOrganisationUnitsId(event.id).forEach { organisationUnitGroup ->
                organisationUnitGroup.organisationUnits.removeIf { organisationUnit ->
                organisationUnit.id == event.id } }
    }

}
