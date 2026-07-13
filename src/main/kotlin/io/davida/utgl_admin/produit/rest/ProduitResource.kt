package io.davida.utgl_admin.produit.rest

import io.davida.utgl_admin.produit.model.ProduitDTO
import io.davida.utgl_admin.produit.service.ProduitService
import io.swagger.v3.oas.annotations.responses.ApiResponse
import jakarta.validation.Valid
import java.lang.Void
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
    value = ["/api/produits"],
    produces = [MediaType.APPLICATION_JSON_VALUE]
)
class ProduitResource(
    private val produitService: ProduitService
) {

    @GetMapping
    fun getAllProduits(): ResponseEntity<List<ProduitDTO>> =
            ResponseEntity.ok(produitService.findAll())

    @GetMapping("/{id}")
    fun getProduit(@PathVariable(name = "id") id: Int): ResponseEntity<ProduitDTO> =
            ResponseEntity.ok(produitService.get(id))

    @PostMapping
    @ApiResponse(responseCode = "201")
    fun createProduit(@RequestBody @Valid produitDTO: ProduitDTO): ResponseEntity<Int> {
        val createdId = produitService.create(produitDTO)
        return ResponseEntity(createdId, HttpStatus.CREATED)
    }

    @PutMapping("/{id}")
    fun updateProduit(@PathVariable(name = "id") id: Int, @RequestBody @Valid
            produitDTO: ProduitDTO): ResponseEntity<Int> {
        produitService.update(id, produitDTO)
        return ResponseEntity.ok(id)
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    fun deleteProduit(@PathVariable(name = "id") id: Int): ResponseEntity<Void> {
        produitService.delete(id)
        return ResponseEntity.noContent().build()
    }

}
