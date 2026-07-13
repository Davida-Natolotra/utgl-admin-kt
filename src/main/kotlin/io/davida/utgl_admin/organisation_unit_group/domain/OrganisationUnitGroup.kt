package io.davida.utgl_admin.organisation_unit_group.domain

import io.davida.utgl_admin.organisation_unit.domain.OrganisationUnit
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EntityListeners
import jakarta.persistence.GeneratedValue
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.JoinTable
import jakarta.persistence.ManyToMany
import jakarta.persistence.Table
import java.time.OffsetDateTime
import java.util.UUID
import org.hibernate.annotations.UuidGenerator
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.jpa.domain.support.AuditingEntityListener


@Entity
@Table(name = "OrganisationUnitGroups")
@EntityListeners(AuditingEntityListener::class)
class OrganisationUnitGroup {

    @Id
    @Column(
        nullable = false,
        updatable = false
    )
    @GeneratedValue
    @UuidGenerator
    var id: UUID? = null

    @Column
    var name: String? = null

    @ManyToMany
    @JoinTable(
        name = "OrgUnitMappingGroups",
        joinColumns = [
            JoinColumn(name = "organisationUnitGroupId")
        ],
        inverseJoinColumns = [
            JoinColumn(name = "organisationUnitId")
        ]
    )
    var organisationUnits = mutableSetOf<OrganisationUnit>()

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
