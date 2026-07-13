package io.davida.utgl_admin.detail_s_d_u_pha_g_dis.repos

import io.davida.utgl_admin.detail_s_d_u_pha_g_dis.domain.DetailSDUPhaGDis
import java.util.UUID
import org.springframework.data.jpa.repository.JpaRepository


interface DetailSDUPhaGDisRepository : JpaRepository<DetailSDUPhaGDis, UUID>
