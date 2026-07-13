package io.davida.utgl_admin.rapport_hopitaux.domain

import io.davida.utgl_admin.organisation_unit.domain.OrganisationUnit
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EntityListeners
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import java.time.LocalDate
import java.time.OffsetDateTime
import java.util.UUID
import org.hibernate.annotations.UuidGenerator
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.jpa.domain.support.AuditingEntityListener


@Entity
@Table(name = "RapportHopitauxes")
@EntityListeners(AuditingEntityListener::class)
class RapportHopitaux {

    @Id
    @Column(
        nullable = false,
        updatable = false
    )
    @GeneratedValue
    @UuidGenerator
    var id: UUID? = null

    @Column
    var moisAnnee: LocalDate? = null

    @Column
    var name: String? = null

    @Column
    var created: LocalDate? = null

    @Column
    var exportingDate: LocalDate? = null

    @Column
    var importingDate: LocalDate? = null

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hopital_id")
    var hopital: OrganisationUnit? = null

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "drsp_id")
    var drsp: OrganisationUnit? = null

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
