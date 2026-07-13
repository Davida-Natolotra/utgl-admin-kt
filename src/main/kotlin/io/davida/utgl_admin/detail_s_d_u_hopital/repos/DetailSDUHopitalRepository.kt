package io.davida.utgl_admin.detail_s_d_u_hopital.repos

import io.davida.utgl_admin.detail_s_d_u_hopital.domain.DetailSDUHopital
import java.util.UUID
import org.springframework.data.jpa.repository.JpaRepository


interface DetailSDUHopitalRepository : JpaRepository<DetailSDUHopital, UUID>
