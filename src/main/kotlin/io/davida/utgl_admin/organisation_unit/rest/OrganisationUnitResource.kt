package io.davida.utgl_admin.organisation_unit.rest

import io.davida.utgl_admin.organisation_unit.importer.OrganisationUnitImportResult
import io.davida.utgl_admin.organisation_unit.importer.OrganisationUnitImportService
import io.davida.utgl_admin.organisation_unit.model.OrganisationUnitDTO
import io.davida.utgl_admin.organisation_unit.model.OrganisationUnitTreeNodeDTO
import io.davida.utgl_admin.organisation_unit.service.OrganisationUnitService
import io.swagger.v3.oas.annotations.responses.ApiResponse
import jakarta.validation.Valid
import java.lang.Void
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.multipart.MultipartFile


@RestController
@RequestMapping(
    value = ["/api/organisationUnits"],
    produces = [MediaType.APPLICATION_JSON_VALUE]
)
class OrganisationUnitResource(
    private val organisationUnitService: OrganisationUnitService,
    private val organisationUnitImportService: OrganisationUnitImportService
) {

    @GetMapping
    fun getAllOrganisationUnits(): ResponseEntity<List<OrganisationUnitDTO>> =
            ResponseEntity.ok(organisationUnitService.findAll())

    @GetMapping("/{id}")
    fun getOrganisationUnit(@PathVariable(name = "id") id: String):
            ResponseEntity<OrganisationUnitDTO> = ResponseEntity.ok(organisationUnitService.get(id))

    @PostMapping
    @ApiResponse(responseCode = "201")
    fun createOrganisationUnit(@RequestBody @Valid organisationUnitDTO: OrganisationUnitDTO):
            ResponseEntity<String> {
        val createdId = organisationUnitService.create(organisationUnitDTO)
        return ResponseEntity('"' + createdId + '"', HttpStatus.CREATED)
    }

    @PutMapping("/{id}")
    fun updateOrganisationUnit(@PathVariable(name = "id") id: String, @RequestBody @Valid
            organisationUnitDTO: OrganisationUnitDTO): ResponseEntity<String> {
        organisationUnitService.update(id, organisationUnitDTO)
        return ResponseEntity.ok('"' + id + '"')
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    fun deleteOrganisationUnit(@PathVariable(name = "id") id: String): ResponseEntity<Void> {
        organisationUnitService.delete(id)
        return ResponseEntity.noContent().build()
    }

    @PostMapping("/import", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun importOrganisationUnits(@RequestParam("file") file: MultipartFile):
            ResponseEntity<OrganisationUnitImportResult> =
            ResponseEntity.ok(file.inputStream.use { organisationUnitImportService.import(it) })

    @GetMapping("/tree")
    fun getTreeNodes(@RequestParam(name = "parentId", required = false) parentId: String?):
            ResponseEntity<List<OrganisationUnitTreeNodeDTO>> =
            ResponseEntity.ok(organisationUnitService.getTreeNodes(parentId))

    @GetMapping("/tree/expand")
    fun getExpandedChildren(@RequestParam(name = "ids") ids: List<String>):
            ResponseEntity<Map<String, List<OrganisationUnitTreeNodeDTO>>> =
            ResponseEntity.ok(organisationUnitService.getExpandedChildren(ids))

    @GetMapping("/names")
    fun getNames(@RequestParam(name = "ids") ids: List<String>): ResponseEntity<Map<String, String>> =
            ResponseEntity.ok(organisationUnitService.getOrganisationUnitNames(ids))

    @GetMapping("/parentValues")
    fun getParentValues(
        @RequestParam(name = "query", required = false) query: String?,
        @RequestParam(name = "level", required = false) level: Int?,
        @RequestParam(name = "limit", required = false) limit: Int?
    ): ResponseEntity<Map<String, String>> =
            ResponseEntity.ok(if (query == null && level == null) organisationUnitService.getOrganisationUnitValues()
                    else organisationUnitService.searchOrganisationUnitValues(query ?: "", level,
                            limit?.let { maxOf(it, 1) }))

    @GetMapping("/levels")
    fun getLevels(): ResponseEntity<List<Int>> =
            ResponseEntity.ok(organisationUnitService.getOrganisationUnitLevels())

}
