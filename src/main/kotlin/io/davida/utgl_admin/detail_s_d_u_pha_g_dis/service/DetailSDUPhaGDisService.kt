package io.davida.utgl_admin.detail_s_d_u_pha_g_dis.service

import io.davida.utgl_admin.detail_s_d_u_pha_g_dis.domain.DetailSDUPhaGDis
import io.davida.utgl_admin.detail_s_d_u_pha_g_dis.model.DetailSDUPhaGDisDTO
import io.davida.utgl_admin.detail_s_d_u_pha_g_dis.repos.DetailSDUPhaGDisRepository
import io.davida.utgl_admin.rapport_pha_g_dis_ligne.repos.RapportPhaGDisLigneRepository
import io.davida.utgl_admin.util.NotFoundException
import java.util.UUID
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service


@Service
class DetailSDUPhaGDisService(
    private val detailSDUPhaGDisRepository: DetailSDUPhaGDisRepository,
    private val rapportPhaGDisLigneRepository: RapportPhaGDisLigneRepository
) {

    fun findAll(): List<DetailSDUPhaGDisDTO> {
        val detailSDUPhaGDises = detailSDUPhaGDisRepository.findAll(Sort.by("id"))
        return detailSDUPhaGDises.map { detailSDUPhaGDis -> mapToDTO(detailSDUPhaGDis,
                DetailSDUPhaGDisDTO()) }
    }

    fun `get`(id: UUID): DetailSDUPhaGDisDTO = detailSDUPhaGDisRepository.findById(id)
            .map { detailSDUPhaGDis -> mapToDTO(detailSDUPhaGDis, DetailSDUPhaGDisDTO()) }
            .orElseThrow { NotFoundException() }

    fun create(detailSDUPhaGDisDTO: DetailSDUPhaGDisDTO): UUID {
        val detailSDUPhaGDis = DetailSDUPhaGDis()
        mapToEntity(detailSDUPhaGDisDTO, detailSDUPhaGDis)
        return detailSDUPhaGDisRepository.save(detailSDUPhaGDis).id!!
    }

    fun update(id: UUID, detailSDUPhaGDisDTO: DetailSDUPhaGDisDTO) {
        val detailSDUPhaGDis = detailSDUPhaGDisRepository.findById(id)
                .orElseThrow { NotFoundException() }
        mapToEntity(detailSDUPhaGDisDTO, detailSDUPhaGDis)
        detailSDUPhaGDisRepository.save(detailSDUPhaGDis)
    }

    fun delete(id: UUID) {
        val detailSDUPhaGDis = detailSDUPhaGDisRepository.findById(id)
                .orElseThrow { NotFoundException() }
        detailSDUPhaGDisRepository.delete(detailSDUPhaGDis)
    }

    private fun mapToDTO(detailSDUPhaGDis: DetailSDUPhaGDis,
            detailSDUPhaGDisDTO: DetailSDUPhaGDisDTO): DetailSDUPhaGDisDTO {
        detailSDUPhaGDisDTO.id = detailSDUPhaGDis.id
        detailSDUPhaGDisDTO.sdu = detailSDUPhaGDis.sdu
        detailSDUPhaGDisDTO.datePeremption = detailSDUPhaGDis.datePeremption
        detailSDUPhaGDisDTO.detailSDU = detailSDUPhaGDis.detailSDU?.id
        return detailSDUPhaGDisDTO
    }

    private fun mapToEntity(detailSDUPhaGDisDTO: DetailSDUPhaGDisDTO,
            detailSDUPhaGDis: DetailSDUPhaGDis): DetailSDUPhaGDis {
        detailSDUPhaGDis.sdu = detailSDUPhaGDisDTO.sdu
        detailSDUPhaGDis.datePeremption = detailSDUPhaGDisDTO.datePeremption
        val detailSDU = if (detailSDUPhaGDisDTO.detailSDU == null) null else
                rapportPhaGDisLigneRepository.findById(detailSDUPhaGDisDTO.detailSDU!!)
                .orElseThrow { NotFoundException("detailSDU not found") }
        detailSDUPhaGDis.detailSDU = detailSDU
        return detailSDUPhaGDis
    }

}
