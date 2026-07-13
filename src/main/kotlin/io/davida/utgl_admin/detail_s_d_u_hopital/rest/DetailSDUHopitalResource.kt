package io.davida.utgl_admin.detail_s_d_u_hopital.rest

import io.davida.utgl_admin.detail_s_d_u_hopital.model.DetailSDUHopitalDTO
import io.davida.utgl_admin.detail_s_d_u_hopital.service.DetailSDUHopitalService
import io.davida.utgl_admin.rapport_hopital_ligne.service.RapportHopitalLigneService
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
    value = ["/api/detailSDUHopitals"],
    produces = [MediaType.APPLICATION_JSON_VALUE]
)
class DetailSDUHopitalResource(
    private val detailSDUHopitalService: DetailSDUHopitalService,
    private val rapportHopitalLigneService: RapportHopitalLigneService
) {

    @GetMapping
    fun getAllDetailSDUHopitals(): ResponseEntity<List<DetailSDUHopitalDTO>> =
            ResponseEntity.ok(detailSDUHopitalService.findAll())

    @GetMapping("/{id}")
    fun getDetailSDUHopital(@PathVariable(name = "id") id: UUID):
            ResponseEntity<DetailSDUHopitalDTO> = ResponseEntity.ok(detailSDUHopitalService.get(id))

    @PostMapping
    @ApiResponse(responseCode = "201")
    fun createDetailSDUHopital(@RequestBody @Valid detailSDUHopitalDTO: DetailSDUHopitalDTO):
            ResponseEntity<UUID> {
        val createdId = detailSDUHopitalService.create(detailSDUHopitalDTO)
        return ResponseEntity(createdId, HttpStatus.CREATED)
    }

    @PutMapping("/{id}")
    fun updateDetailSDUHopital(@PathVariable(name = "id") id: UUID, @RequestBody @Valid
            detailSDUHopitalDTO: DetailSDUHopitalDTO): ResponseEntity<UUID> {
        detailSDUHopitalService.update(id, detailSDUHopitalDTO)
        return ResponseEntity.ok(id)
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    fun deleteDetailSDUHopital(@PathVariable(name = "id") id: UUID): ResponseEntity<Void> {
        detailSDUHopitalService.delete(id)
        return ResponseEntity.noContent().build()
    }

    @GetMapping("/detailSDUValues")
    fun getDetailSDUValues(): ResponseEntity<Map<UUID, UUID>> =
            ResponseEntity.ok(rapportHopitalLigneService.getRapportHopitalLigneValues())

}
