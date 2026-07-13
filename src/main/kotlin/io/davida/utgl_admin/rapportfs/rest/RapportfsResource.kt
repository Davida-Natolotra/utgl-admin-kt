package io.davida.utgl_admin.rapportfs.rest

import io.davida.utgl_admin.organisation_unit.service.OrganisationUnitService
import io.davida.utgl_admin.rapport_district.service.RapportDistrictService
import io.davida.utgl_admin.rapportfs.model.RapportfsDTO
import io.davida.utgl_admin.rapportfs.service.RapportfsService
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
    value = ["/api/rapportfss"],
    produces = [MediaType.APPLICATION_JSON_VALUE]
)
class RapportfsResource(
    private val rapportfsService: RapportfsService,
    private val organisationUnitService: OrganisationUnitService,
    private val rapportDistrictService: RapportDistrictService
) {

    @GetMapping
    fun getAllRapportfss(): ResponseEntity<List<RapportfsDTO>> =
            ResponseEntity.ok(rapportfsService.findAll())

    @GetMapping("/{id}")
    fun getRapportfs(@PathVariable(name = "id") id: UUID): ResponseEntity<RapportfsDTO> =
            ResponseEntity.ok(rapportfsService.get(id))

    @PostMapping
    @ApiResponse(responseCode = "201")
    fun createRapportfs(@RequestBody @Valid rapportfsDTO: RapportfsDTO): ResponseEntity<UUID> {
        val createdId = rapportfsService.create(rapportfsDTO)
        return ResponseEntity(createdId, HttpStatus.CREATED)
    }

    @PutMapping("/{id}")
    fun updateRapportfs(@PathVariable(name = "id") id: UUID, @RequestBody @Valid
            rapportfsDTO: RapportfsDTO): ResponseEntity<UUID> {
        rapportfsService.update(id, rapportfsDTO)
        return ResponseEntity.ok(id)
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    fun deleteRapportfs(@PathVariable(name = "id") id: UUID): ResponseEntity<Void> {
        rapportfsService.delete(id)
        return ResponseEntity.noContent().build()
    }

    @GetMapping("/fsValues")
    fun getFsValues(): ResponseEntity<Map<String, String>> =
            ResponseEntity.ok(organisationUnitService.getOrganisationUnitValues())

    @GetMapping("/rapportDistrictValues")
    fun getRapportDistrictValues(): ResponseEntity<Map<UUID, UUID>> =
            ResponseEntity.ok(rapportDistrictService.getRapportDistrictValues())

}
