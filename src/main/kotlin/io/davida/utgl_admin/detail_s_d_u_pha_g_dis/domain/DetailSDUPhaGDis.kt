package io.davida.utgl_admin.detail_s_d_u_pha_g_dis.domain

import io.davida.utgl_admin.rapport_pha_g_dis_ligne.domain.RapportPhaGDisLigne
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
@Table(name = "DetailSDUPhaGDises")
@EntityListeners(AuditingEntityListener::class)
class DetailSDUPhaGDis {

    @Id
    @Column(
        nullable = false,
        updatable = false
    )
    @GeneratedValue
    @UuidGenerator
    var id: UUID? = null

    @Column
    var sdu: Int? = null

    @Column
    var datePeremption: LocalDate? = null

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "detailsduid")
    var detailSDU: RapportPhaGDisLigne? = null

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
