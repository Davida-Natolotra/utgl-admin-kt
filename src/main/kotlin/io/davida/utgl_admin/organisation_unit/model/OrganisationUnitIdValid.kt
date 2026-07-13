package io.davida.utgl_admin.organisation_unit.model

import io.davida.utgl_admin.organisation_unit.service.OrganisationUnitService
import jakarta.servlet.http.HttpServletRequest
import jakarta.validation.Constraint
import jakarta.validation.ConstraintValidator
import jakarta.validation.ConstraintValidatorContext
import jakarta.validation.Payload
import kotlin.reflect.KClass
import org.springframework.web.servlet.HandlerMapping


/**
 * Check that id is present and available when a new OrganisationUnit is created.
 */
@Target(AnnotationTarget.FIELD, AnnotationTarget.PROPERTY_GETTER, AnnotationTarget.PROPERTY_SETTER,
        AnnotationTarget.ANNOTATION_CLASS)
@Retention(AnnotationRetention.RUNTIME)
@MustBeDocumented
@Constraint(validatedBy = [OrganisationUnitIdValidValidator::class])
annotation class OrganisationUnitIdValid(
    val message: String = "",
    val groups: Array<KClass<*>> = [],
    val payload: Array<KClass<out Payload>> = []
)


class OrganisationUnitIdValidValidator(
    private val organisationUnitService: OrganisationUnitService,
    private val request: HttpServletRequest
) : ConstraintValidator<OrganisationUnitIdValid, String> {

    override fun isValid(`value`: String?, cvContext: ConstraintValidatorContext): Boolean {
        @Suppress("unchecked_cast") val pathVariables =
                (request.getAttribute(HandlerMapping.URI_TEMPLATE_VARIABLES_ATTRIBUTE) as
                Map<String, String>)
        val currentId = pathVariables["id"]
        if (currentId != null) {
            // only relevant for new objects
            return true
        }
        var error: String? = null
        if (value == null) {
            // missing input
            error = "NotNull"
        } else if (organisationUnitService.idExists(value)) {
            error = "Exists.organisationUnit.id"
        }
        if (error != null) {
            cvContext.disableDefaultConstraintViolation()
            cvContext.buildConstraintViolationWithTemplate("{${error}}")
                    .addConstraintViolation()
            return false
        }
        return true
    }

}
