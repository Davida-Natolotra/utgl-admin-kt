package io.davida.utgl_admin.produit_programme_org_group.rest

import io.davida.utgl_admin.organisation_unit_group.service.OrganisationUnitGroupService
import io.davida.utgl_admin.produit.service.ProduitService
import io.davida.utgl_admin.produit_programme_org_group.model.ProduitProgrammeOrgGroupDTO
import io.davida.utgl_admin.produit_programme_org_group.service.ProduitProgrammeOrgGroupService
import io.davida.utgl_admin.programme.service.ProgrammeService
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
    value = ["/api/produitProgrammeOrgGroups"],
    produces = [MediaType.APPLICATION_JSON_VALUE]
)
class ProduitProgrammeOrgGroupResource(
    private val produitProgrammeOrgGroupService: ProduitProgrammeOrgGroupService,
    private val produitService: ProduitService,
    private val programmeService: ProgrammeService,
    private val organisationUnitGroupService: OrganisationUnitGroupService,
    private val rapportFSLigneService: RapportFSLigneService
) {

    @GetMapping
    fun getAllProduitProgrammeOrgGroups(): ResponseEntity<List<ProduitProgrammeOrgGroupDTO>> =
            ResponseEntity.ok(produitProgrammeOrgGroupService.findAll())

    @GetMapping("/{id}")
    fun getProduitProgrammeOrgGroup(@PathVariable(name = "id") id: UUID):
            ResponseEntity<ProduitProgrammeOrgGroupDTO> =
            ResponseEntity.ok(produitProgrammeOrgGroupService.get(id))

    @PostMapping
    @ApiResponse(responseCode = "201")
    fun createProduitProgrammeOrgGroup(@RequestBody @Valid
            produitProgrammeOrgGroupDTO: ProduitProgrammeOrgGroupDTO): ResponseEntity<UUID> {
        val createdId = produitProgrammeOrgGroupService.create(produitProgrammeOrgGroupDTO)
        return ResponseEntity(createdId, HttpStatus.CREATED)
    }

    @PutMapping("/{id}")
    fun updateProduitProgrammeOrgGroup(@PathVariable(name = "id") id: UUID, @RequestBody @Valid
            produitProgrammeOrgGroupDTO: ProduitProgrammeOrgGroupDTO): ResponseEntity<UUID> {
        produitProgrammeOrgGroupService.update(id, produitProgrammeOrgGroupDTO)
        return ResponseEntity.ok(id)
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    fun deleteProduitProgrammeOrgGroup(@PathVariable(name = "id") id: UUID): ResponseEntity<Void> {
        produitProgrammeOrgGroupService.delete(id)
        return ResponseEntity.noContent().build()
    }

    @GetMapping("/produitValues")
    fun getProduitValues(): ResponseEntity<Map<Int, Int>> =
            ResponseEntity.ok(produitService.getProduitValues())

    @GetMapping("/programmeValues")
    fun getProgrammeValues(): ResponseEntity<Map<Long, String>> =
            ResponseEntity.ok(programmeService.getProgrammeValues())

    @GetMapping("/orgGroupValues")
    fun getOrgGroupValues(): ResponseEntity<Map<UUID, UUID>> =
            ResponseEntity.ok(organisationUnitGroupService.getOrganisationUnitGroupValues())

    @GetMapping("/produitProgrammeNiveauValues")
    fun getProduitProgrammeNiveauValues(): ResponseEntity<Map<UUID, UUID>> =
            ResponseEntity.ok(rapportFSLigneService.getRapportFSLigneValues())

}
