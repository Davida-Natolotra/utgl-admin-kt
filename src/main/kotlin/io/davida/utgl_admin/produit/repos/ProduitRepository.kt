package io.davida.utgl_admin.produit.repos

import io.davida.utgl_admin.produit.domain.Produit
import org.springframework.data.jpa.repository.JpaRepository


interface ProduitRepository : JpaRepository<Produit, Int>
