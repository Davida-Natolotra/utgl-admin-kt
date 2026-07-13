package io.davida.utgl_admin.rapport_pha_g_dis.service

import io.davida.utgl_admin.events.BeforeDeleteRapportPhaGDis
import io.davida.utgl_admin.rapport_pha_g_dis.domain.RapportPhaGDis
import io.davida.utgl_admin.rapport_pha_g_dis.model.RapportPhaGDisDTO
import io.davida.utgl_admin.rapport_pha_g_dis.repos.RapportPhaGDisRepository
import io.davida.utgl_admin.util.CustomCollectors
import io.davida.utgl_admin.util.NotFoundException
import java.util.UUID
import org.springframework.context.ApplicationEventPublisher
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service


@Service
class RapportPhaGDisService(
    private val rapportPhaGDisRepository: RapportPhaGDisRepository,
    private val publisher: ApplicationEventPublisher
) {

    fun findAll(): List<RapportPhaGDisDTO> {
        val rapportPhaGDises = rapportPhaGDisRepository.findAll(Sort.by("id"))
        return rapportPhaGDises.map { rapportPhaGDis -> mapToDTO(rapportPhaGDis,
                RapportPhaGDisDTO()) }
    }

    fun `get`(id: UUID): RapportPhaGDisDTO = rapportPhaGDisRepository.findById(id)
            .map { rapportPhaGDis -> mapToDTO(rapportPhaGDis, RapportPhaGDisDTO()) }
            .orElseThrow { NotFoundException() }

    fun create(rapportPhaGDisDTO: RapportPhaGDisDTO): UUID {
        val rapportPhaGDis = RapportPhaGDis()
        mapToEntity(rapportPhaGDisDTO, rapportPhaGDis)
        return rapportPhaGDisRepository.save(rapportPhaGDis).id!!
    }

    fun update(id: UUID, rapportPhaGDisDTO: RapportPhaGDisDTO) {
        val rapportPhaGDis = rapportPhaGDisRepository.findById(id)
                .orElseThrow { NotFoundException() }
        mapToEntity(rapportPhaGDisDTO, rapportPhaGDis)
        rapportPhaGDisRepository.save(rapportPhaGDis)
    }

    fun delete(id: UUID) {
        val rapportPhaGDis = rapportPhaGDisRepository.findById(id)
                .orElseThrow { NotFoundException() }
        publisher.publishEvent(BeforeDeleteRapportPhaGDis(id))
        rapportPhaGDisRepository.delete(rapportPhaGDis)
    }

    private fun mapToDTO(rapportPhaGDis: RapportPhaGDis, rapportPhaGDisDTO: RapportPhaGDisDTO):
            RapportPhaGDisDTO {
        rapportPhaGDisDTO.id = rapportPhaGDis.id
        rapportPhaGDisDTO.name = rapportPhaGDis.name
        rapportPhaGDisDTO.created = rapportPhaGDis.created
        rapportPhaGDisDTO.exportedDate = rapportPhaGDis.exportedDate
        return rapportPhaGDisDTO
    }

    private fun mapToEntity(rapportPhaGDisDTO: RapportPhaGDisDTO, rapportPhaGDis: RapportPhaGDis):
            RapportPhaGDis {
        rapportPhaGDis.name = rapportPhaGDisDTO.name
        rapportPhaGDis.created = rapportPhaGDisDTO.created
        rapportPhaGDis.exportedDate = rapportPhaGDisDTO.exportedDate
        return rapportPhaGDis
    }

    fun getRapportPhaGDisValues(): Map<UUID, UUID> = rapportPhaGDisRepository.findAll(Sort.by("id"))
            .stream()
            .collect(CustomCollectors.toSortedMap(RapportPhaGDis::id, RapportPhaGDis::id))

}
