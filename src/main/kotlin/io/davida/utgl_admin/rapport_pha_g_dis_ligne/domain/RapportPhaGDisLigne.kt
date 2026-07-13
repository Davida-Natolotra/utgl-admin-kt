package io.davida.utgl_admin.rapport_pha_g_dis_ligne.domain

import io.davida.utgl_admin.produit_programme_org_group.domain.ProduitProgrammeOrgGroup
import io.davida.utgl_admin.rapport_pha_g_dis.domain.RapportPhaGDis
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EntityListeners
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.SequenceGenerator
import jakarta.persistence.Table
import java.time.OffsetDateTime
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.jpa.domain.support.AuditingEntityListener


@Entity
@Table(name = "RapportPhaGDisLignes")
@EntityListeners(AuditingEntityListener::class)
class RapportPhaGDisLigne {

    @Id
    @Column(
        nullable = false,
        updatable = false
    )
    @SequenceGenerator(
        name = "primary_sequence",
        sequenceName = "primary_sequence",
        allocationSize = 1,
        initialValue = 10000
    )
    @GeneratedValue(
        strategy = GenerationType.SEQUENCE,
        generator = "primary_sequence"
    )
    var id: Long? = null

    @Column
    var qteDispoDebMois: Int? = null

    @Column
    var qteRecMois: Int? = null

    @Column
    var qteDistCSB: Int? = null

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
    var dmm: Int? = null

    @Column
    var cmm: Int? = null

    @Column
    var msd: Double? = null

    @Column
    var situation: Int? = null

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rapport_phagdis_id")
    var rapportPhaGDis: RapportPhaGDis? = null

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "produit_programme_niveau_id")
    var produitProgrammeNiveau: ProduitProgrammeOrgGroup? = null

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
