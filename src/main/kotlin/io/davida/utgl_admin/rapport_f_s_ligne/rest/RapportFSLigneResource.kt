package io.davida.utgl_admin.rapport_f_s_ligne.rest

import io.davida.utgl_admin.produit_programme_org_group.service.ProduitProgrammeOrgGroupService
import io.davida.utgl_admin.rapport_f_s_ligne.model.RapportFSLigneDTO
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
    value = ["/api/rapportFSLignes"],
    produces = [MediaType.APPLICATION_JSON_VALUE]
)
class RapportFSLigneResource(
    private val rapportFSLigneService: RapportFSLigneService,
    private val produitProgrammeOrgGroupService: ProduitProgrammeOrgGroupService
) {

    @GetMapping
    fun getAllRapportFSLignes(): ResponseEntity<List<RapportFSLigneDTO>> =
            ResponseEntity.ok(rapportFSLigneService.findAll())

    @GetMapping("/{id}")
    fun getRapportFSLigne(@PathVariable(name = "id") id: UUID): ResponseEntity<RapportFSLigneDTO> =
            ResponseEntity.ok(rapportFSLigneService.get(id))

    @PostMapping
    @ApiResponse(responseCode = "201")
    fun createRapportFSLigne(@RequestBody @Valid rapportFSLigneDTO: RapportFSLigneDTO):
            ResponseEntity<UUID> {
        val createdId = rapportFSLigneService.create(rapportFSLigneDTO)
        return ResponseEntity(createdId, HttpStatus.CREATED)
    }

    @PutMapping("/{id}")
    fun updateRapportFSLigne(@PathVariable(name = "id") id: UUID, @RequestBody @Valid
            rapportFSLigneDTO: RapportFSLigneDTO): ResponseEntity<UUID> {
        rapportFSLigneService.update(id, rapportFSLigneDTO)
        return ResponseEntity.ok(id)
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    fun deleteRapportFSLigne(@PathVariable(name = "id") id: UUID): ResponseEntity<Void> {
        rapportFSLigneService.delete(id)
        return ResponseEntity.noContent().build()
    }

    @GetMapping("/produitProgrammeNiveauValues")
    fun getProduitProgrammeNiveauValues(): ResponseEntity<Map<UUID, UUID>> =
            ResponseEntity.ok(produitProgrammeOrgGroupService.getProduitProgrammeOrgGroupValues())

}
