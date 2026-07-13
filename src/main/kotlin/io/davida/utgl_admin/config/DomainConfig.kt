package io.davida.utgl_admin.config

import io.davida.utgl_admin.util.Jackson3JsonFormatMapper
import java.time.OffsetDateTime
import java.util.Optional
import org.hibernate.cfg.AvailableSettings
import org.springframework.boot.hibernate.autoconfigure.HibernatePropertiesCustomizer
import org.springframework.boot.persistence.autoconfigure.EntityScan
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.data.auditing.DateTimeProvider
import org.springframework.data.jpa.repository.config.EnableJpaAuditing
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.transaction.annotation.EnableTransactionManagement
import tools.jackson.databind.ObjectMapper


@Configuration
@EntityScan("io.davida.utgl_admin")
@EnableJpaRepositories("io.davida.utgl_admin")
@EnableTransactionManagement
@EnableJpaAuditing(dateTimeProviderRef = "auditingDateTimeProvider")
class DomainConfig {

    @Bean(name = ["auditingDateTimeProvider"])
    fun dateTimeProvider(): DateTimeProvider =
            DateTimeProvider { Optional.of(OffsetDateTime.now()) }

    @Bean
    fun jsonFormatMapper(objectMapper: ObjectMapper): HibernatePropertiesCustomizer =
            HibernatePropertiesCustomizer { properties ->
            properties[AvailableSettings.JSON_FORMAT_MAPPER] =
            Jackson3JsonFormatMapper(objectMapper) }

}
