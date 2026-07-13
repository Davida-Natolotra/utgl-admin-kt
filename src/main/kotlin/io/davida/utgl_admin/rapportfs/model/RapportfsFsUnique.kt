package io.davida.utgl_admin.rapportfs.model

import io.davida.utgl_admin.rapportfs.service.RapportfsService
import jakarta.servlet.http.HttpServletRequest
import jakarta.validation.Constraint
import jakarta.validation.ConstraintValidator
import jakarta.validation.ConstraintValidatorContext
import jakarta.validation.Payload
import java.util.UUID
import kotlin.reflect.KClass
import org.springframework.web.servlet.HandlerMapping


/**
 * Validate that the fs value isn't taken yet.
 */
@Target(AnnotationTarget.FIELD, AnnotationTarget.PROPERTY_GETTER, AnnotationTarget.PROPERTY_SETTER,
        AnnotationTarget.ANNOTATION_CLASS)
@Retention(AnnotationRetention.RUNTIME)
@MustBeDocumented
@Constraint(validatedBy = [RapportfsFsUniqueValidator::class])
annotation class RapportfsFsUnique(
    val message: String = "{Exists.rapportfs.FS}",
    val groups: Array<KClass<*>> = [],
    val payload: Array<KClass<out Payload>> = []
)


class RapportfsFsUniqueValidator(
    private val rapportfsService: RapportfsService,
    private val request: HttpServletRequest
) : ConstraintValidator<RapportfsFsUnique, String> {

    override fun isValid(`value`: String?, cvContext: ConstraintValidatorContext): Boolean {
        if (value == null) {
            // no value present
            return true
        }
        @Suppress("unchecked_cast") val pathVariables =
                (request.getAttribute(HandlerMapping.URI_TEMPLATE_VARIABLES_ATTRIBUTE) as
                Map<String, String>)
        val currentId = pathVariables["id"]
        if (currentId != null && value.equals(rapportfsService.get(UUID.fromString(currentId)).fs,
                ignoreCase = true)) {
            // value hasn't changed
            return true
        }
        return !rapportfsService.fsExists(value)
    }

}
