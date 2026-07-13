package io.davida.utgl_admin.detail_s_d_u_pha_g_dis.rest

import io.davida.utgl_admin.detail_s_d_u_pha_g_dis.model.DetailSDUPhaGDisDTO
import io.davida.utgl_admin.detail_s_d_u_pha_g_dis.service.DetailSDUPhaGDisService
import io.davida.utgl_admin.rapport_pha_g_dis_ligne.service.RapportPhaGDisLigneService
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
    value = ["/api/detailSDUPhaGDiss"],
    produces = [MediaType.APPLICATION_JSON_VALUE]
)
class DetailSDUPhaGDisResource(
    private val detailSDUPhaGDisService: DetailSDUPhaGDisService,
    private val rapportPhaGDisLigneService: RapportPhaGDisLigneService
) {

    @GetMapping
    fun getAllDetailSDUPhaGDiss(): ResponseEntity<List<DetailSDUPhaGDisDTO>> =
            ResponseEntity.ok(detailSDUPhaGDisService.findAll())

    @GetMapping("/{id}")
    fun getDetailSDUPhaGDis(@PathVariable(name = "id") id: UUID):
            ResponseEntity<DetailSDUPhaGDisDTO> = ResponseEntity.ok(detailSDUPhaGDisService.get(id))

    @PostMapping
    @ApiResponse(responseCode = "201")
    fun createDetailSDUPhaGDis(@RequestBody @Valid detailSDUPhaGDisDTO: DetailSDUPhaGDisDTO):
            ResponseEntity<UUID> {
        val createdId = detailSDUPhaGDisService.create(detailSDUPhaGDisDTO)
        return ResponseEntity(createdId, HttpStatus.CREATED)
    }

    @PutMapping("/{id}")
    fun updateDetailSDUPhaGDis(@PathVariable(name = "id") id: UUID, @RequestBody @Valid
            detailSDUPhaGDisDTO: DetailSDUPhaGDisDTO): ResponseEntity<UUID> {
        detailSDUPhaGDisService.update(id, detailSDUPhaGDisDTO)
        return ResponseEntity.ok(id)
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    fun deleteDetailSDUPhaGDis(@PathVariable(name = "id") id: UUID): ResponseEntity<Void> {
        detailSDUPhaGDisService.delete(id)
        return ResponseEntity.noContent().build()
    }

    @GetMapping("/detailSDUValues")
    fun getDetailSDUValues(): ResponseEntity<Map<Long, Long>> =
            ResponseEntity.ok(rapportPhaGDisLigneService.getRapportPhaGDisLigneValues())

}
