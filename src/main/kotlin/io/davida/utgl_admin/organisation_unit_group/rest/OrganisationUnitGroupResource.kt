package io.davida.utgl_admin.organisation_unit_group.rest

import io.davida.utgl_admin.organisation_unit_group.model.OrganisationUnitGroupDTO
import io.davida.utgl_admin.organisation_unit_group.service.OrganisationUnitGroupService
import io.swagger.v3.oas.annotations.responses.ApiResponse
import jakarta.validation.Valid
import java.lang.Void
import java.util.UUID
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
import org.springframework.web.bind.annotation.RestController


@RestController
@RequestMapping(
    value = ["/api/organisationUnitGroups"],
    produces = [MediaType.APPLICATION_JSON_VALUE]
)
class OrganisationUnitGroupResource(
    private val organisationUnitGroupService: OrganisationUnitGroupService
) {

    @GetMapping
    fun getAllOrganisationUnitGroups(): ResponseEntity<List<OrganisationUnitGroupDTO>> =
            ResponseEntity.ok(organisationUnitGroupService.findAll())

    @GetMapping("/{id}")
    fun getOrganisationUnitGroup(@PathVariable(name = "id") id: UUID):
            ResponseEntity<OrganisationUnitGroupDTO> =
            ResponseEntity.ok(organisationUnitGroupService.get(id))

    @PostMapping
    @ApiResponse(responseCode = "201")
    fun createOrganisationUnitGroup(@RequestBody @Valid
            organisationUnitGroupDTO: OrganisationUnitGroupDTO): ResponseEntity<UUID> {
        val createdId = organisationUnitGroupService.create(organisationUnitGroupDTO)
        return ResponseEntity(createdId, HttpStatus.CREATED)
    }

    @PutMapping("/{id}")
    fun updateOrganisationUnitGroup(@PathVariable(name = "id") id: UUID, @RequestBody @Valid
            organisationUnitGroupDTO: OrganisationUnitGroupDTO): ResponseEntity<UUID> {
        organisationUnitGroupService.update(id, organisationUnitGroupDTO)
        return ResponseEntity.ok(id)
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    fun deleteOrganisationUnitGroup(@PathVariable(name = "id") id: UUID): ResponseEntity<Void> {
        organisationUnitGroupService.delete(id)
        return ResponseEntity.noContent().build()
    }

}
