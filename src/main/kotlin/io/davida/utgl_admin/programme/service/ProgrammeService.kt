package io.davida.utgl_admin.programme.service

import io.davida.utgl_admin.events.BeforeDeleteProgramme
import io.davida.utgl_admin.programme.domain.Programme
import io.davida.utgl_admin.programme.model.ProgrammeDTO
import io.davida.utgl_admin.programme.repos.ProgrammeRepository
import io.davida.utgl_admin.util.CustomCollectors
import io.davida.utgl_admin.util.NotFoundException
import org.springframework.context.ApplicationEventPublisher
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service


@Service
class ProgrammeService(
    private val programmeRepository: ProgrammeRepository,
    private val publisher: ApplicationEventPublisher
) {

    fun findAll(): List<ProgrammeDTO> {
        val programmes = programmeRepository.findAll(Sort.by("id"))
        return programmes.map { programme -> mapToDTO(programme, ProgrammeDTO()) }
    }

    fun `get`(id: Long): ProgrammeDTO = programmeRepository.findById(id)
            .map { programme -> mapToDTO(programme, ProgrammeDTO()) }
            .orElseThrow { NotFoundException() }

    fun create(programmeDTO: ProgrammeDTO): Long {
        val programme = Programme()
        mapToEntity(programmeDTO, programme)
        return programmeRepository.save(programme).id!!
    }

    fun update(id: Long, programmeDTO: ProgrammeDTO) {
        val programme = programmeRepository.findById(id)
                .orElseThrow { NotFoundException() }
        mapToEntity(programmeDTO, programme)
        programmeRepository.save(programme)
    }

    fun delete(id: Long) {
        val programme = programmeRepository.findById(id)
                .orElseThrow { NotFoundException() }
        publisher.publishEvent(BeforeDeleteProgramme(id))
        programmeRepository.delete(programme)
    }

    private fun mapToDTO(programme: Programme, programmeDTO: ProgrammeDTO): ProgrammeDTO {
        programmeDTO.id = programme.id
        programmeDTO.name = programme.name
        return programmeDTO
    }

    private fun mapToEntity(programmeDTO: ProgrammeDTO, programme: Programme): Programme {
        programme.name = programmeDTO.name
        return programme
    }

    fun nameExists(name: String?): Boolean = programmeRepository.existsByNameIgnoreCase(name)

    fun getProgrammeValues(): Map<Long, String> = programmeRepository.findAll(Sort.by("id"))
            .stream()
            .collect(CustomCollectors.toSortedMap(Programme::id, Programme::name))

}
