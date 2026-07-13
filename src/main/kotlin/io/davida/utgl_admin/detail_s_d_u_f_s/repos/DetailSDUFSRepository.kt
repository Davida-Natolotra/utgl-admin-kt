package io.davida.utgl_admin.detail_s_d_u_f_s.repos

import io.davida.utgl_admin.detail_s_d_u_f_s.domain.DetailSDUFS
import java.util.UUID
import org.springframework.data.jpa.repository.JpaRepository


interface DetailSDUFSRepository : JpaRepository<DetailSDUFS, UUID> {

    fun findFirstByDetailSDUId(id: UUID): DetailSDUFS?

}
