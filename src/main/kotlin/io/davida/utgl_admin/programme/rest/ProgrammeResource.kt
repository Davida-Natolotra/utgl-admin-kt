package io.davida.utgl_admin.programme.rest

import io.davida.utgl_admin.programme.model.ProgrammeDTO
import io.davida.utgl_admin.programme.service.ProgrammeService
import io.swagger.v3.oas.annotations.responses.ApiResponse
import jakarta.validation.Valid
import java.lang.Void
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController


@RestController
@RequestMapping(
    value = ["/api/programmes"],
    produces = [MediaType.APPLICATION_JSON_VALUE]
)
class ProgrammeResource(
    private val programmeService: ProgrammeService
) {

    @GetMapping
    fun getAllProgrammes(): ResponseEntity<List<ProgrammeDTO>> =
            ResponseEntity.ok(programmeService.findAll())

    @GetMapping("/{id}")
    fun getProgramme(@PathVariable(name = "id") id: Long): ResponseEntity<ProgrammeDTO> =
            ResponseEntity.ok(programmeService.get(id))

    @PostMapping
    @ApiResponse(responseCode = "201")
    fun createProgramme(@RequestBody @Valid programmeDTO: ProgrammeDTO): ResponseEntity<Long> {
        val createdId = programmeService.create(programmeDTO)
        return ResponseEntity(createdId, HttpStatus.CREATED)
    }

    @PutMapping("/{id}")
    fun updateProgramme(@PathVariable(name = "id") id: Long, @RequestBody @Valid
            programmeDTO: ProgrammeDTO): ResponseEntity<Long> {
        programmeService.update(id, programmeDTO)
        return ResponseEntity.ok(id)
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    fun deleteProgramme(@PathVariable(name = "id") id: Long): ResponseEntity<Void> {
        programmeService.delete(id)
        return ResponseEntity.noContent().build()
    }

}
