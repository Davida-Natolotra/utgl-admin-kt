package io.davida.utgl_admin.detail_s_d_u_hopital.service

import io.davida.utgl_admin.detail_s_d_u_hopital.domain.DetailSDUHopital
import io.davida.utgl_admin.detail_s_d_u_hopital.model.DetailSDUHopitalDTO
import io.davida.utgl_admin.detail_s_d_u_hopital.repos.DetailSDUHopitalRepository
import io.davida.utgl_admin.rapport_hopital_ligne.repos.RapportHopitalLigneRepository
import io.davida.utgl_admin.util.NotFoundException
import java.util.UUID
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service


@Service
class DetailSDUHopitalService(
    private val detailSDUHopitalRepository: DetailSDUHopitalRepository,
    private val rapportHopitalLigneRepository: RapportHopitalLigneRepository
) {

    fun findAll(): List<DetailSDUHopitalDTO> {
        val detailSDUHopitals = detailSDUHopitalRepository.findAll(Sort.by("id"))
        return detailSDUHopitals.map { detailSDUHopital -> mapToDTO(detailSDUHopital,
                DetailSDUHopitalDTO()) }
    }

    fun `get`(id: UUID): DetailSDUHopitalDTO = detailSDUHopitalRepository.findById(id)
            .map { detailSDUHopital -> mapToDTO(detailSDUHopital, DetailSDUHopitalDTO()) }
            .orElseThrow { NotFoundException() }

    fun create(detailSDUHopitalDTO: DetailSDUHopitalDTO): UUID {
        val detailSDUHopital = DetailSDUHopital()
        mapToEntity(detailSDUHopitalDTO, detailSDUHopital)
        return detailSDUHopitalRepository.save(detailSDUHopital).id!!
    }

    fun update(id: UUID, detailSDUHopitalDTO: DetailSDUHopitalDTO) {
        val detailSDUHopital = detailSDUHopitalRepository.findById(id)
                .orElseThrow { NotFoundException() }
        mapToEntity(detailSDUHopitalDTO, detailSDUHopital)
        detailSDUHopitalRepository.save(detailSDUHopital)
    }

    fun delete(id: UUID) {
        val detailSDUHopital = detailSDUHopitalRepository.findById(id)
                .orElseThrow { NotFoundException() }
        detailSDUHopitalRepository.delete(detailSDUHopital)
    }

    private fun mapToDTO(detailSDUHopital: DetailSDUHopital,
            detailSDUHopitalDTO: DetailSDUHopitalDTO): DetailSDUHopitalDTO {
        detailSDUHopitalDTO.id = detailSDUHopital.id
        detailSDUHopitalDTO.sdu = detailSDUHopital.sdu
        detailSDUHopitalDTO.datePeremption = detailSDUHopital.datePeremption
        detailSDUHopitalDTO.detailSDU = detailSDUHopital.detailSDU?.id
        return detailSDUHopitalDTO
    }

    private fun mapToEntity(detailSDUHopitalDTO: DetailSDUHopitalDTO,
            detailSDUHopital: DetailSDUHopital): DetailSDUHopital {
        detailSDUHopital.sdu = detailSDUHopitalDTO.sdu
        detailSDUHopital.datePeremption = detailSDUHopitalDTO.datePeremption
        val detailSDU = if (detailSDUHopitalDTO.detailSDU == null) null else
                rapportHopitalLigneRepository.findById(detailSDUHopitalDTO.detailSDU!!)
                .orElseThrow { NotFoundException("detailSDU not found") }
        detailSDUHopital.detailSDU = detailSDU
        return detailSDUHopital
    }

}
