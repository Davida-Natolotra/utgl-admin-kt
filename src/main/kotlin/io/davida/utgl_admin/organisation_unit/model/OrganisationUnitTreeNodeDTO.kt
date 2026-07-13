package io.davida.utgl_admin.organisation_unit.model


/**
 * Lightweight node for the lazily loaded organisation unit tree. The child
 * count lets the client decide whether a node is expandable without loading
 * its children.
 */
data class OrganisationUnitTreeNodeDTO(
    val id: String,
    val name: String,
    val level: Int,
    val childCount: Long
)
