package io.davida.utgl_admin.rapport_pha_g_dis.domain

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EntityListeners
import jakarta.persistence.GeneratedValue
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.LocalDate
import java.time.OffsetDateTime
import java.util.UUID
import org.hibernate.annotations.UuidGenerator
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.jpa.domain.support.AuditingEntityListener


@Entity
@Table(name = "RapportPhaGDises")
@EntityListeners(AuditingEntityListener::class)
class RapportPhaGDis {

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

    @Column
    var created: LocalDate? = null

    @Column
    var exportedDate: LocalDate? = null

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
