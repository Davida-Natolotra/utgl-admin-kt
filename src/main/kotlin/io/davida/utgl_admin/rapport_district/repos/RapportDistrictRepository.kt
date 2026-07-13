package io.davida.utgl_admin.rapport_district.repos

import io.davida.utgl_admin.rapport_district.domain.RapportDistrict
import java.util.UUID
import org.springframework.data.jpa.repository.JpaRepository


interface RapportDistrictRepository : JpaRepository<RapportDistrict, UUID> {

    fun findFirstByDrspId(id: String): RapportDistrict?

    fun findFirstBySdspId(id: String): RapportDistrict?

    fun findFirstByRapportId(id: UUID): RapportDistrict?

}
