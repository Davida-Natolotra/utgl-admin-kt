package io.davida.utgl_admin.produit.service

import io.davida.utgl_admin.events.BeforeDeleteProduit
import io.davida.utgl_admin.produit.domain.Produit
import io.davida.utgl_admin.produit.model.ProduitDTO
import io.davida.utgl_admin.produit.repos.ProduitRepository
import io.davida.utgl_admin.util.CustomCollectors
import io.davida.utgl_admin.util.NotFoundException
import org.springframework.context.ApplicationEventPublisher
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service


@Service
class ProduitService(
    private val produitRepository: ProduitRepository,
    private val publisher: ApplicationEventPublisher
) {

    fun findAll(): List<ProduitDTO> {
        val produits = produitRepository.findAll(Sort.by("id"))
        return produits.map { produit -> mapToDTO(produit, ProduitDTO()) }
    }

    fun `get`(id: Int): ProduitDTO = produitRepository.findById(id)
            .map { produit -> mapToDTO(produit, ProduitDTO()) }
            .orElseThrow { NotFoundException() }

    fun create(produitDTO: ProduitDTO): Int {
        val produit = Produit()
        mapToEntity(produitDTO, produit)
        return produitRepository.save(produit).id!!
    }

    fun update(id: Int, produitDTO: ProduitDTO) {
        val produit = produitRepository.findById(id)
                .orElseThrow { NotFoundException() }
        mapToEntity(produitDTO, produit)
        produitRepository.save(produit)
    }

    fun delete(id: Int) {
        val produit = produitRepository.findById(id)
                .orElseThrow { NotFoundException() }
        publisher.publishEvent(BeforeDeleteProduit(id))
        produitRepository.delete(produit)
    }

    private fun mapToDTO(produit: Produit, produitDTO: ProduitDTO): ProduitDTO {
        produitDTO.id = produit.id
        produitDTO.name = produit.name
        produitDTO.unit = produit.unit
        produitDTO.code = produit.code
        produitDTO.edited = produit.edited
        return produitDTO
    }

    private fun mapToEntity(produitDTO: ProduitDTO, produit: Produit): Produit {
        produit.name = produitDTO.name
        produit.unit = produitDTO.unit
        produit.code = produitDTO.code
        produit.edited = produitDTO.edited
        return produit
    }

    fun getProduitValues(): Map<Int, Int> = produitRepository.findAll(Sort.by("id"))
            .stream()
            .collect(CustomCollectors.toSortedMap(Produit::id, Produit::id))

}
