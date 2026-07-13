package io.davida.utgl_admin.organisation_unit.importer

import io.davida.utgl_admin.organisation_unit.domain.OrganisationUnit
import io.davida.utgl_admin.organisation_unit.repos.OrganisationUnitRepository
import jakarta.persistence.EntityManager
import java.io.InputStream
import java.time.LocalDateTime
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.PlatformTransactionManager
import org.springframework.transaction.support.TransactionTemplate
import tools.jackson.databind.JsonNode
import tools.jackson.databind.ObjectMapper

data class OrganisationUnitImportResult(val imported: Int, val skipped: Int)

/**
 * Bulk import of DHIS2-exported organisation units (the `{ "organisationUnits": [...] }`
 * export format). Units are imported in ascending `level` order (each transaction per level,
 * flushed in batches) so that a unit's parent is always already committed before the child is
 * inserted, satisfying the self-referencing parent_id foreign key. Already-imported ids are
 * skipped, so an import can be re-run safely to pick up remaining rows.
 */
@Service
class OrganisationUnitImportService(
    private val organisationUnitRepository: OrganisationUnitRepository,
    private val entityManager: EntityManager,
    private val objectMapper: ObjectMapper,
    transactionManager: PlatformTransactionManager
) {

    private val log = LoggerFactory.getLogger(javaClass)
    private val transactionTemplate = TransactionTemplate(transactionManager)
    private val flushBatchSize = 500

    fun import(inputStream: InputStream): OrganisationUnitImportResult {
        val root = objectMapper.readTree(inputStream)
        val units = root["organisationUnits"]
            ?: error("No 'organisationUnits' array found in the provided file")

        val byLevel = units.groupBy { it["level"].asInt() }.toSortedMap()
        var imported = 0
        var skipped = 0

        for ((level, nodes) in byLevel) {
            transactionTemplate.execute {
                nodes.forEachIndexed { index, node ->
                    val id = node["id"].asText()
                    if (organisationUnitRepository.existsByIdIgnoreCase(id)) {
                        skipped++
                    } else {
                        organisationUnitRepository.save(toEntity(node))
                        imported++
                    }
                    if ((index + 1) % flushBatchSize == 0) {
                        entityManager.flush()
                        entityManager.clear()
                    }
                }
            }
            log.info("Level {} done ({} imported, {} skipped so far)", level, imported, skipped)
        }
        log.info("Organisation unit import complete: {} imported, {} skipped (already existed)",
                imported, skipped)
        return OrganisationUnitImportResult(imported, skipped)
    }

    private fun toEntity(node: JsonNode): OrganisationUnit {
        val entity = OrganisationUnit()
        entity.id = node["id"].asText()
        entity.code = node["code"]?.asText()
        entity.name = node["name"].asText()
        entity.shortName = node["shortName"]?.asText()
        entity.displayName = node["displayName"]?.asText()
        entity.level = node["level"].asInt()
        entity.path = node["path"]?.asText()
        entity.openingDate = node["openingDate"]?.asText()?.let { LocalDateTime.parse(it) }
        val geometryNode = node["geometry"]
        entity.geometry = if (geometryNode != null && !geometryNode.isNull)
                @Suppress("UNCHECKED_CAST")
                (objectMapper.treeToValue(geometryNode, Map::class.java) as Map<String, Any>)
                else null
        val parentId = node["parent"]?.get("id")?.asText()
        entity.parent = parentId?.let { entityManager.getReference(OrganisationUnit::class.java, it) }
        return entity
    }

}
