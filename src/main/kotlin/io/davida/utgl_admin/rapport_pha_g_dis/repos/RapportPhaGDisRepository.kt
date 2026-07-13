package io.davida.utgl_admin.rapport_pha_g_dis.repos

import io.davida.utgl_admin.rapport_pha_g_dis.domain.RapportPhaGDis
import java.util.UUID
import org.springframework.data.jpa.repository.JpaRepository


interface RapportPhaGDisRepository : JpaRepository<RapportPhaGDis, UUID>
