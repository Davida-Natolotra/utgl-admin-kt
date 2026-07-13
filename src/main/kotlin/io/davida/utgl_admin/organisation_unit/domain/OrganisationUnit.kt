package io.davida.utgl_admin.organisation_unit.domain

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EntityListeners
import jakarta.persistence.FetchType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import java.time.LocalDateTime
import java.time.OffsetDateTime
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.jpa.domain.support.AuditingEntityListener


@Entity
@Table(name = "OrganisationUnits")
@EntityListeners(AuditingEntityListener::class)
class OrganisationUnit {

    @Id
    @Column(
        nullable = false,
        updatable = false
    )
    var id: String? = null

    @Column
    var code: String? = null

    @Column(nullable = false)
    var name: String? = null

    @Column
    var shortName: String? = null

    @Column
    var displayName: String? = null

    @Column(nullable = false)
    var level: Int? = null

    @Column
    var path: String? = null

    @Column
    var openingDate: LocalDateTime? = null

    @Column
    var closeDate: LocalDateTime? = null

    @Column(columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    var geometry: Map<String, Any>? = null

    @Column
    var address: String? = null

    @Column(columnDefinition = "text")
    var description: String? = null

    @Column
    var email: String? = null

    @Column
    var phoneNumber: String? = null

    @Column
    var contactPerson: String? = null

    @Column(columnDefinition = "text")
    var comment: String? = null

    @Column(columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    var translations: Map<String, String>? = null

    @Column(columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    var attributeValues: Map<String, String>? = null

    @Column(columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    var createdBy: Map<String, String>? = null

    @Column(columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    var lastUpdatedBy: Map<String, String>? = null

    @Column
    var created: LocalDateTime? = null

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    var parent: OrganisationUnit? = null

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
