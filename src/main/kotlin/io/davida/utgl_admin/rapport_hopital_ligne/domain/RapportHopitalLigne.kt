package io.davida.utgl_admin.rapport_hopital_ligne.domain

import io.davida.utgl_admin.produit_programme_org_group.domain.ProduitProgrammeOrgGroup
import io.davida.utgl_admin.rapport_hopitaux.domain.RapportHopitaux
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
@Table(name = "RapportHopitalLignes")
@EntityListeners(AuditingEntityListener::class)
class RapportHopitalLigne {

    @Id
    @Column(
        nullable = false,
        updatable = false
    )
    @GeneratedValue
    @UuidGenerator
    var id: UUID? = null

    @Column
    var qteDispoDebMois: Int? = null

    @Column
    var qteRecMois: Int? = null

    @Column
    var qteDistPatient: Int? = null

    @Column
    var qteDistAC: Int? = null

    @Column
    var qtePerimeAvarieMois: Int? = null

    @Column
    var qteRedeplMois: Int? = null

    @Column
    var nbJourRupture: Int? = null

    @Column
    var stockTheorique: Int? = null

    @Column
    var sDUTotal: Int? = null

    @Column
    var ecart: Int? = null

    @Column
    var cmm: Int? = null

    @Column
    var msd: Double? = null

    @Column
    var situation: String? = null

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "produit_programme_niveau_id")
    var produitProgrammeNiveau: ProduitProgrammeOrgGroup? = null

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rapport_hopitaux_id")
    var rapportHopitaux: RapportHopitaux? = null

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
