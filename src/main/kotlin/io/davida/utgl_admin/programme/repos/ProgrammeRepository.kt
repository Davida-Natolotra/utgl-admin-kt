package io.davida.utgl_admin.programme.repos

import io.davida.utgl_admin.programme.domain.Programme
import org.springframework.data.jpa.repository.JpaRepository


interface ProgrammeRepository : JpaRepository<Programme, Long> {

    fun existsByNameIgnoreCase(name: String?): Boolean

}
