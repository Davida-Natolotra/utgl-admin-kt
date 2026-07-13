package io.davida.utgl_admin.rapport_district.rest

import io.davida.utgl_admin.organisation_unit.service.OrganisationUnitService
import io.davida.utgl_admin.rapport_district.model.RapportDistrictDTO
import io.davida.utgl_admin.rapport_district.service.RapportDistrictService
import io.davida.utgl_admin.rapport_pha_g_dis.service.RapportPhaGDisService
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
    value = ["/api/rapportDistricts"],
    produces = [MediaType.APPLICATION_JSON_VALUE]
)
class RapportDistrictResource(
    private val rapportDistrictService: RapportDistrictService,
    private val organisationUnitService: OrganisationUnitService,
    private val rapportPhaGDisService: RapportPhaGDisService
) {

    @GetMapping
    fun getAllRapportDistricts(): ResponseEntity<List<RapportDistrictDTO>> =
            ResponseEntity.ok(rapportDistrictService.findAll())

    @GetMapping("/{id}")
    fun getRapportDistrict(@PathVariable(name = "id") id: UUID): ResponseEntity<RapportDistrictDTO>
            = ResponseEntity.ok(rapportDistrictService.get(id))

    @PostMapping
    @ApiResponse(responseCode = "201")
    fun createRapportDistrict(@RequestBody @Valid rapportDistrictDTO: RapportDistrictDTO):
            ResponseEntity<UUID> {
        val createdId = rapportDistrictService.create(rapportDistrictDTO)
        return ResponseEntity(createdId, HttpStatus.CREATED)
    }

    @PutMapping("/{id}")
    fun updateRapportDistrict(@PathVariable(name = "id") id: UUID, @RequestBody @Valid
            rapportDistrictDTO: RapportDistrictDTO): ResponseEntity<UUID> {
        rapportDistrictService.update(id, rapportDistrictDTO)
        return ResponseEntity.ok(id)
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    fun deleteRapportDistrict(@PathVariable(name = "id") id: UUID): ResponseEntity<Void> {
        rapportDistrictService.delete(id)
        return ResponseEntity.noContent().build()
    }

    @GetMapping("/drspValues")
    fun getDrspValues(): ResponseEntity<Map<String, String>> =
            ResponseEntity.ok(organisationUnitService.getOrganisationUnitValues())

    @GetMapping("/sdspValues")
    fun getSdspValues(): ResponseEntity<Map<String, String>> =
            ResponseEntity.ok(organisationUnitService.getOrganisationUnitValues())

    @GetMapping("/rapportValues")
    fun getRapportValues(): ResponseEntity<Map<UUID, UUID>> =
            ResponseEntity.ok(rapportPhaGDisService.getRapportPhaGDisValues())

}
