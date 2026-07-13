package io.davida.utgl_admin.produit_programme_org_group.domain

import io.davida.utgl_admin.organisation_unit_group.domain.OrganisationUnitGroup
import io.davida.utgl_admin.produit.domain.Produit
import io.davida.utgl_admin.programme.domain.Programme
import io.davida.utgl_admin.rapport_f_s_ligne.domain.RapportFSLigne
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EntityListeners
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import java.time.OffsetDateTime
import java.util.UUID
import org.hibernate.annotations.UuidGenerator
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.jpa.domain.support.AuditingEntityListener


@Entity
@Table(name = "ProduitProgrammeOrgGroups")
@EntityListeners(AuditingEntityListener::class)
class ProduitProgrammeOrgGroup {

    @Id
    @Column(
        nullable = false,
        updatable = false
    )
    @GeneratedValue
    @UuidGenerator
    var id: UUID? = null

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "produit_id")
    var produit: Produit? = null

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "programme_id")
    var programme: Programme? = null

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "org_group_id")
    var orgGroup: OrganisationUnitGroup? = null

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "produit_programme_niveau_id")
    var produitProgrammeNiveau: RapportFSLigne? = null

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
