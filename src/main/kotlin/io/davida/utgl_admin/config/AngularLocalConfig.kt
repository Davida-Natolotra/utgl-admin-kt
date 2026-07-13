package io.davida.utgl_admin.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Profile
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer


@Configuration
@Profile("local")
class AngularLocalConfig {

    @Bean
    fun corsConfigurer(): WebMvcConfigurer = 
    object : WebMvcConfigurer {
        override fun addCorsMappings(registry: CorsRegistry) {
            registry.addMapping("/**").allowedMethods("*").allowedOrigins("http://localhost:4200")
        }

    }

}
