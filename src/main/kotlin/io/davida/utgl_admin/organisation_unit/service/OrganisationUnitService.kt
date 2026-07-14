package io.davida.utgl_admin.organisation_unit.service

import io.davida.utgl_admin.events.BeforeDeleteOrganisationUnit
import io.davida.utgl_admin.organisation_unit.domain.OrganisationUnit
import io.davida.utgl_admin.organisation_unit.model.OrganisationUnitDTO
import io.davida.utgl_admin.organisation_unit.model.OrganisationUnitTreeNodeDTO
import io.davida.utgl_admin.organisation_unit.repos.OrganisationUnitRepository
import io.davida.utgl_admin.util.CustomCollectors
import io.davida.utgl_admin.util.NotFoundException
import io.davida.utgl_admin.util.ReferencedException
import org.springframework.context.ApplicationEventPublisher
import org.springframework.context.event.EventListener
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional


@Service
@Transactional(rollbackFor = [Exception::class])
class OrganisationUnitService(
    private val organisationUnitRepository: OrganisationUnitRepository,
    private val publisher: ApplicationEventPublisher
) {

    fun findAll(): List<OrganisationUnitDTO> {
        val organisationUnits = organisationUnitRepository.findAll(Sort.by("id"))
        return organisationUnits.map { organisationUnit -> mapToDTO(organisationUnit,
                OrganisationUnitDTO()) }
    }

    fun `get`(id: String): OrganisationUnitDTO = organisationUnitRepository.findById(id)
            .map { organisationUnit -> mapToDTO(organisationUnit, OrganisationUnitDTO()) }
            .orElseThrow { NotFoundException() }

    fun create(organisationUnitDTO: OrganisationUnitDTO): String {
        val organisationUnit = OrganisationUnit()
        mapToEntity(organisationUnitDTO, organisationUnit)
        organisationUnit.id = organisationUnitDTO.id
        return organisationUnitRepository.save(organisationUnit).id!!
    }

    fun update(id: String, organisationUnitDTO: OrganisationUnitDTO) {
        val organisationUnit = organisationUnitRepository.findById(id)
                .orElseThrow { NotFoundException() }
        mapToEntity(organisationUnitDTO, organisationUnit)
        organisationUnitRepository.save(organisationUnit)
    }

    fun delete(id: String) {
        val organisationUnit = organisationUnitRepository.findById(id)
                .orElseThrow { NotFoundException() }
        publisher.publishEvent(BeforeDeleteOrganisationUnit(id))
        organisationUnitRepository.delete(organisationUnit)
    }

    private fun mapToDTO(organisationUnit: OrganisationUnit,
            organisationUnitDTO: OrganisationUnitDTO): OrganisationUnitDTO {
        organisationUnitDTO.id = organisationUnit.id
        organisationUnitDTO.code = organisationUnit.code
        organisationUnitDTO.name = organisationUnit.name
        organisationUnitDTO.shortName = organisationUnit.shortName
        organisationUnitDTO.displayName = organisationUnit.displayName
        organisationUnitDTO.level = organisationUnit.level
        organisationUnitDTO.path = organisationUnit.path
        organisationUnitDTO.openingDate = organisationUnit.openingDate
        organisationUnitDTO.closeDate = organisationUnit.closeDate
        organisationUnitDTO.geometry = organisationUnit.geometry
        organisationUnitDTO.address = organisationUnit.address
        organisationUnitDTO.description = organisationUnit.description
        organisationUnitDTO.email = organisationUnit.email
        organisationUnitDTO.phoneNumber = organisationUnit.phoneNumber
        organisationUnitDTO.contactPerson = organisationUnit.contactPerson
        organisationUnitDTO.comment = organisationUnit.comment
        organisationUnitDTO.translations = organisationUnit.translations
        organisationUnitDTO.attributeValues = organisationUnit.attributeValues
        organisationUnitDTO.createdBy = organisationUnit.createdBy
        organisationUnitDTO.lastUpdatedBy = organisationUnit.lastUpdatedBy
        organisationUnitDTO.created = organisationUnit.created
        organisationUnitDTO.parent = organisationUnit.parent?.id
        return organisationUnitDTO
    }

    private fun mapToEntity(organisationUnitDTO: OrganisationUnitDTO,
            organisationUnit: OrganisationUnit): OrganisationUnit {
        organisationUnit.code = organisationUnitDTO.code
        organisationUnit.name = organisationUnitDTO.name
        organisationUnit.shortName = organisationUnitDTO.shortName
        organisationUnit.displayName = organisationUnitDTO.displayName
        organisationUnit.level = organisationUnitDTO.level
        organisationUnit.path = organisationUnitDTO.path
        organisationUnit.openingDate = organisationUnitDTO.openingDate
        organisationUnit.closeDate = organisationUnitDTO.closeDate
        organisationUnit.geometry = organisationUnitDTO.geometry
        organisationUnit.address = organisationUnitDTO.address
        organisationUnit.description = organisationUnitDTO.description
        organisationUnit.email = organisationUnitDTO.email
        organisationUnit.phoneNumber = organisationUnitDTO.phoneNumber
        organisationUnit.contactPerson = organisationUnitDTO.contactPerson
        organisationUnit.comment = organisationUnitDTO.comment
        organisationUnit.translations = organisationUnitDTO.translations
        organisationUnit.attributeValues = organisationUnitDTO.attributeValues
        organisationUnit.createdBy = organisationUnitDTO.createdBy
        organisationUnit.lastUpdatedBy = organisationUnitDTO.lastUpdatedBy
        organisationUnit.created = organisationUnitDTO.created
        val parent = if (organisationUnitDTO.parent == null) null else
                organisationUnitRepository.findById(organisationUnitDTO.parent!!)
                .orElseThrow { NotFoundException("parent not found") }
        organisationUnit.parent = parent
        return organisationUnit
    }

    fun idExists(id: String?): Boolean = organisationUnitRepository.existsByIdIgnoreCase(id)

    fun getTreeNodes(parentId: String?): List<OrganisationUnitTreeNodeDTO> =
            if (parentId == null) organisationUnitRepository.findRootTreeNodes()
            else organisationUnitRepository.findChildTreeNodes(parentId)

    /**
     * For each given id, resolve every ancestor lying on its path (using the materialized
     * `path` field) and return, for each such ancestor, its full list of children. This lets
     * the client reveal a whole set of pre-selected units in one round trip by expanding each
     * returned ancestor with its complete (not partial) child list.
     */
    fun getExpandedChildren(ids: List<String>): Map<String, List<OrganisationUnitTreeNodeDTO>> {
        if (ids.isEmpty()) {
            return emptyMap()
        }
        val parentIds = organisationUnitRepository.findPathsByIdIn(ids)
                .flatMap { path -> path.split("/").filter { it.isNotBlank() }.dropLast(1) }
                .toSet()
        if (parentIds.isEmpty()) {
            return emptyMap()
        }
        return organisationUnitRepository.findChildTreeNodesForParents(parentIds)
                .groupBy { it.parentId!! }
    }

    fun getOrganisationUnitValues(): Map<String, String> =
            organisationUnitRepository.findAll(Sort.by("id"))
            .stream()
            .collect(CustomCollectors.toSortedMap(OrganisationUnit::id, OrganisationUnit::name))

    fun searchOrganisationUnitValues(query: String, level: Int?, limit: Int?): Map<String, String> {
        val pageable: Pageable = if (limit == null) Pageable.unpaged(Sort.by("name"))
                else PageRequest.of(0, limit, Sort.by("name"))
        val results = if (level == null) organisationUnitRepository.findByNameContainingIgnoreCase(query, pageable)
                else organisationUnitRepository.findByNameContainingIgnoreCaseAndLevel(query, level, pageable)
        return results.stream()
                .collect(CustomCollectors.toSortedMap(OrganisationUnit::id, OrganisationUnit::name))
    }

    fun getOrganisationUnitLevels(): List<Int> = organisationUnitRepository.findDistinctLevels()

    fun getOrganisationUnitNames(ids: List<String>): Map<String, String> =
            organisationUnitRepository.findAllById(ids).stream()
            .collect(CustomCollectors.toSortedMap(OrganisationUnit::id, OrganisationUnit::name))

    @EventListener(BeforeDeleteOrganisationUnit::class)
    fun on(event: BeforeDeleteOrganisationUnit) {
        val referencedException = ReferencedException()
        val parentOrganisationUnit =
                organisationUnitRepository.findFirstByParentIdAndIdNot(event.id, event.id)
        if (parentOrganisationUnit != null) {
            referencedException.key = "organisationUnit.organisationUnit.parent.referenced"
            referencedException.addParam(parentOrganisationUnit.id)
            throw referencedException
        }
    }

}
