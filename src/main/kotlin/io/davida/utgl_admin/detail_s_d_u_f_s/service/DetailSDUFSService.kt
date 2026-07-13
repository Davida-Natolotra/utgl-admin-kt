package io.davida.utgl_admin.detail_s_d_u_f_s.service

import io.davida.utgl_admin.detail_s_d_u_f_s.domain.DetailSDUFS
import io.davida.utgl_admin.detail_s_d_u_f_s.model.DetailSDUFSDTO
import io.davida.utgl_admin.detail_s_d_u_f_s.repos.DetailSDUFSRepository
import io.davida.utgl_admin.events.BeforeDeleteRapportFSLigne
import io.davida.utgl_admin.rapport_f_s_ligne.repos.RapportFSLigneRepository
import io.davida.utgl_admin.util.NotFoundException
import io.davida.utgl_admin.util.ReferencedException
import java.util.UUID
import org.springframework.context.event.EventListener
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service


@Service
class DetailSDUFSService(
    private val detailSDUFSRepository: DetailSDUFSRepository,
    private val rapportFSLigneRepository: RapportFSLigneRepository
) {

    fun findAll(): List<DetailSDUFSDTO> {
        val detailSDUFSs = detailSDUFSRepository.findAll(Sort.by("id"))
        return detailSDUFSs.map { detailSDUFS -> mapToDTO(detailSDUFS, DetailSDUFSDTO()) }
    }

    fun `get`(id: UUID): DetailSDUFSDTO = detailSDUFSRepository.findById(id)
            .map { detailSDUFS -> mapToDTO(detailSDUFS, DetailSDUFSDTO()) }
            .orElseThrow { NotFoundException() }

    fun create(detailSDUFSDTO: DetailSDUFSDTO): UUID {
        val detailSDUFS = DetailSDUFS()
        mapToEntity(detailSDUFSDTO, detailSDUFS)
        return detailSDUFSRepository.save(detailSDUFS).id!!
    }

    fun update(id: UUID, detailSDUFSDTO: DetailSDUFSDTO) {
        val detailSDUFS = detailSDUFSRepository.findById(id)
                .orElseThrow { NotFoundException() }
        mapToEntity(detailSDUFSDTO, detailSDUFS)
        detailSDUFSRepository.save(detailSDUFS)
    }

    fun delete(id: UUID) {
        val detailSDUFS = detailSDUFSRepository.findById(id)
                .orElseThrow { NotFoundException() }
        detailSDUFSRepository.delete(detailSDUFS)
    }

    private fun mapToDTO(detailSDUFS: DetailSDUFS, detailSDUFSDTO: DetailSDUFSDTO): DetailSDUFSDTO {
        detailSDUFSDTO.id = detailSDUFS.id
        detailSDUFSDTO.sdu = detailSDUFS.sdu
        detailSDUFSDTO.datePeremption = detailSDUFS.datePeremption
        detailSDUFSDTO.detailSDU = detailSDUFS.detailSDU?.id
        return detailSDUFSDTO
    }

    private fun mapToEntity(detailSDUFSDTO: DetailSDUFSDTO, detailSDUFS: DetailSDUFS): DetailSDUFS {
        detailSDUFS.sdu = detailSDUFSDTO.sdu
        detailSDUFS.datePeremption = detailSDUFSDTO.datePeremption
        val detailSDU = if (detailSDUFSDTO.detailSDU == null) null else
                rapportFSLigneRepository.findById(detailSDUFSDTO.detailSDU!!)
                .orElseThrow { NotFoundException("detailSDU not found") }
        detailSDUFS.detailSDU = detailSDU
        return detailSDUFS
    }

    @EventListener(BeforeDeleteRapportFSLigne::class)
    fun on(event: BeforeDeleteRapportFSLigne) {
        val referencedException = ReferencedException()
        val detailSDUDetailSDUFS = detailSDUFSRepository.findFirstByDetailSDUId(event.id)
        if (detailSDUDetailSDUFS != null) {
            referencedException.key = "rapportFSLigne.detailSDUFS.detailSDU.referenced"
            referencedException.addParam(detailSDUDetailSDUFS.id)
            throw referencedException
        }
    }

}
