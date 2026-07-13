package io.davida.utgl_admin.rapportfs.domain

import io.davida.utgl_admin.organisation_unit.domain.OrganisationUnit
import io.davida.utgl_admin.rapport_district.domain.RapportDistrict
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EntityListeners
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.OneToOne
import jakarta.persistence.Table
import java.time.LocalDate
import java.time.LocalTime
import java.time.OffsetDateTime
import java.util.UUID
import org.hibernate.annotations.UuidGenerator
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.jpa.domain.support.AuditingEntityListener


@Entity
@Table(name = "Rapportfses")
@EntityListeners(AuditingEntityListener::class)
class Rapportfs {

    @Id
    @Column(
        nullable = false,
        updatable = false
    )
    @GeneratedValue
    @UuidGenerator
    var id: UUID? = null

    @Column(nullable = false)
    var name: String? = null

    @Column
    var created: LocalTime? = null

    @Column
    var exportedDate: LocalDate? = null

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "fs_id",
        unique = true
    )
    var fs: OrganisationUnit? = null

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rapport_district_id")
    var rapportDistrict: RapportDistrict? = null

    @CreatedDate
    @Column(
        nullable = false,
        updatable = false
    )
    var dateCreated: OffsetDateTime? = null

    @LastModifiedDate
    @Column(nullable = false)
    var lastUpdated: OffsetDateTime? = null

}
