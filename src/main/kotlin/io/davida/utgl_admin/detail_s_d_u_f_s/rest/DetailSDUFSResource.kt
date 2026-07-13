package io.davida.utgl_admin.detail_s_d_u_f_s.rest

import io.davida.utgl_admin.detail_s_d_u_f_s.model.DetailSDUFSDTO
import io.davida.utgl_admin.detail_s_d_u_f_s.service.DetailSDUFSService
import io.davida.utgl_admin.rapport_f_s_ligne.service.RapportFSLigneService
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
    value = ["/api/detailSDUFSs"],
    produces = [MediaType.APPLICATION_JSON_VALUE]
)
class DetailSDUFSResource(
    private val detailSDUFSService: DetailSDUFSService,
    private val rapportFSLigneService: RapportFSLigneService
) {

    @GetMapping
    fun getAllDetailSDUFSs(): ResponseEntity<List<DetailSDUFSDTO>> =
            ResponseEntity.ok(detailSDUFSService.findAll())

    @GetMapping("/{id}")
    fun getDetailSDUFS(@PathVariable(name = "id") id: UUID): ResponseEntity<DetailSDUFSDTO> =
            ResponseEntity.ok(detailSDUFSService.get(id))

    @PostMapping
    @ApiResponse(responseCode = "201")
    fun createDetailSDUFS(@RequestBody @Valid detailSDUFSDTO: DetailSDUFSDTO):
            ResponseEntity<UUID> {
        val createdId = detailSDUFSService.create(detailSDUFSDTO)
        return ResponseEntity(createdId, HttpStatus.CREATED)
    }

    @PutMapping("/{id}")
    fun updateDetailSDUFS(@PathVariable(name = "id") id: UUID, @RequestBody @Valid
            detailSDUFSDTO: DetailSDUFSDTO): ResponseEntity<UUID> {
        detailSDUFSService.update(id, detailSDUFSDTO)
        return ResponseEntity.ok(id)
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    fun deleteDetailSDUFS(@PathVariable(name = "id") id: UUID): ResponseEntity<Void> {
        detailSDUFSService.delete(id)
        return ResponseEntity.noContent().build()
    }

    @GetMapping("/detailSDUValues")
    fun getDetailSDUValues(): ResponseEntity<Map<UUID, UUID>> =
            ResponseEntity.ok(rapportFSLigneService.getRapportFSLigneValues())

}
