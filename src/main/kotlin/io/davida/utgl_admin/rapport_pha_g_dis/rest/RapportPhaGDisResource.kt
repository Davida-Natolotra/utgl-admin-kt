package io.davida.utgl_admin.rapport_pha_g_dis.rest

import io.davida.utgl_admin.rapport_pha_g_dis.model.RapportPhaGDisDTO
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
    value = ["/api/rapportPhaGDiss"],
    produces = [MediaType.APPLICATION_JSON_VALUE]
)
class RapportPhaGDisResource(
    private val rapportPhaGDisService: RapportPhaGDisService
) {

    @GetMapping
    fun getAllRapportPhaGDiss(): ResponseEntity<List<RapportPhaGDisDTO>> =
            ResponseEntity.ok(rapportPhaGDisService.findAll())

    @GetMapping("/{id}")
    fun getRapportPhaGDis(@PathVariable(name = "id") id: UUID): ResponseEntity<RapportPhaGDisDTO> =
            ResponseEntity.ok(rapportPhaGDisService.get(id))

    @PostMapping
    @ApiResponse(responseCode = "201")
    fun createRapportPhaGDis(@RequestBody @Valid rapportPhaGDisDTO: RapportPhaGDisDTO):
            ResponseEntity<UUID> {
        val createdId = rapportPhaGDisService.create(rapportPhaGDisDTO)
        return ResponseEntity(createdId, HttpStatus.CREATED)
    }

    @PutMapping("/{id}")
    fun updateRapportPhaGDis(@PathVariable(name = "id") id: UUID, @RequestBody @Valid
            rapportPhaGDisDTO: RapportPhaGDisDTO): ResponseEntity<UUID> {
        rapportPhaGDisService.update(id, rapportPhaGDisDTO)
        return ResponseEntity.ok(id)
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    fun deleteRapportPhaGDis(@PathVariable(name = "id") id: UUID): ResponseEntity<Void> {
        rapportPhaGDisService.delete(id)
        return ResponseEntity.noContent().build()
    }

}
