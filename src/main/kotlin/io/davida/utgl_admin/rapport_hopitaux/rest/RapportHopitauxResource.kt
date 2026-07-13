package io.davida.utgl_admin.rapport_hopitaux.rest

import io.davida.utgl_admin.organisation_unit.service.OrganisationUnitService
import io.davida.utgl_admin.rapport_hopitaux.model.RapportHopitauxDTO
import io.davida.utgl_admin.rapport_hopitaux.service.RapportHopitauxService
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
    value = ["/api/rapportHopitauxes"],
    produces = [MediaType.APPLICATION_JSON_VALUE]
)
class RapportHopitauxResource(
    private val rapportHopitauxService: RapportHopitauxService,
    private val organisationUnitService: OrganisationUnitService
) {

    @GetMapping
    fun getAllRapportHopitauxes(): ResponseEntity<List<RapportHopitauxDTO>> =
            ResponseEntity.ok(rapportHopitauxService.findAll())

    @GetMapping("/{id}")
    fun getRapportHopitaux(@PathVariable(name = "id") id: UUID): ResponseEntity<RapportHopitauxDTO>
            = ResponseEntity.ok(rapportHopitauxService.get(id))

    @PostMapping
    @ApiResponse(responseCode = "201")
    fun createRapportHopitaux(@RequestBody @Valid rapportHopitauxDTO: RapportHopitauxDTO):
            ResponseEntity<UUID> {
        val createdId = rapportHopitauxService.create(rapportHopitauxDTO)
        return ResponseEntity(createdId, HttpStatus.CREATED)
    }

    @PutMapping("/{id}")
    fun updateRapportHopitaux(@PathVariable(name = "id") id: UUID, @RequestBody @Valid
            rapportHopitauxDTO: RapportHopitauxDTO): ResponseEntity<UUID> {
        rapportHopitauxService.update(id, rapportHopitauxDTO)
        return ResponseEntity.ok(id)
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    fun deleteRapportHopitaux(@PathVariable(name = "id") id: UUID): ResponseEntity<Void> {
        rapportHopitauxService.delete(id)
        return ResponseEntity.noContent().build()
    }

    @GetMapping("/hopitalValues")
    fun getHopitalValues(): ResponseEntity<Map<String, String>> =
            ResponseEntity.ok(organisationUnitService.getOrganisationUnitValues())

    @GetMapping("/drspValues")
    fun getDrspValues(): ResponseEntity<Map<String, String>> =
            ResponseEntity.ok(organisationUnitService.getOrganisationUnitValues())

}
