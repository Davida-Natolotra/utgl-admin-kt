package io.davida.utgl_admin.produit_programme_org_group.repos

import io.davida.utgl_admin.produit_programme_org_group.domain.ProduitProgrammeOrgGroup
import java.util.UUID
import org.springframework.data.jpa.repository.JpaRepository


interface ProduitProgrammeOrgGroupRepository : JpaRepository<ProduitProgrammeOrgGroup, UUID> {

    fun findFirstByProduitId(id: Int): ProduitProgrammeOrgGroup?

    fun findFirstByProgrammeId(id: Long): ProduitProgrammeOrgGroup?

    fun findFirstByOrgGroupId(id: UUID): ProduitProgrammeOrgGroup?

    fun findFirstByProduitProgrammeNiveauId(id: UUID): ProduitProgrammeOrgGroup?

}
