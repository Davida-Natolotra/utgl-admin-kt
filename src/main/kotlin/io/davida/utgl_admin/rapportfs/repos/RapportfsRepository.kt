package io.davida.utgl_admin.rapportfs.repos

import io.davida.utgl_admin.rapportfs.domain.Rapportfs
import java.util.UUID
import org.springframework.data.jpa.repository.JpaRepository


interface RapportfsRepository : JpaRepository<Rapportfs, UUID> {

    fun findFirstByFsId(id: String): Rapportfs?

    fun findFirstByRapportDistrictId(id: UUID): Rapportfs?

    fun existsByFsIdAllIgnoreCase(id: String?): Boolean

}
