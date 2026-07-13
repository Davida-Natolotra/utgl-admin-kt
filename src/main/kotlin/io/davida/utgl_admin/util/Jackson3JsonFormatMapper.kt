package io.davida.utgl_admin.util

import java.lang.reflect.Type
import org.hibernate.type.format.AbstractJsonFormatMapper
import tools.jackson.databind.ObjectMapper


class Jackson3JsonFormatMapper(
    private val objectMapper: ObjectMapper
) : AbstractJsonFormatMapper() {

    override fun <T> fromString(charSequence: CharSequence?, type: Type): T? {
        if (charSequence == null) {
            return null
        }
        return objectMapper.readValue(charSequence.toString(), objectMapper.constructType(type))
    }

    override fun <T> toString(`value`: T?, type: Type): String? {
        if (value == null) {
            return null
        }
        return objectMapper.writerFor(objectMapper.constructType(type)).writeValueAsString(value)
    }

}
