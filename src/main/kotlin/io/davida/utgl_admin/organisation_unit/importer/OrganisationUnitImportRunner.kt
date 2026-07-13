package io.davida.utgl_admin.organisation_unit.importer

import java.io.File
import org.slf4j.LoggerFactory
import org.springframework.boot.ApplicationArguments
import org.springframework.boot.ApplicationRunner
import org.springframework.stereotype.Component

/**
 * One-off bulk import of DHIS2-exported organisation units from a local file, opted into via
 * the `--import-organisation-units=<path-to-json>` program argument. No-op otherwise.
 */
@Component
class OrganisationUnitImportRunner(
    private val organisationUnitImportService: OrganisationUnitImportService
) : ApplicationRunner {

    private val log = LoggerFactory.getLogger(javaClass)

    override fun run(args: ApplicationArguments) {
        if (!args.containsOption("import-organisation-units")) {
            return
        }
        val filePath = args.getOptionValues("import-organisation-units")!!.first()
        log.info("Importing organisation units from {}", filePath)
        File(filePath).inputStream().use { organisationUnitImportService.import(it) }
    }

}
