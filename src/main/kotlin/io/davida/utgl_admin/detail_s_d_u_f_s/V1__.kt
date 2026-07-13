package io.davida.utgl_admin.detail_s_d_u_f_s

import org.flywaydb.core.api.migration.BaseJavaMigration
import org.flywaydb.core.api.migration.Context
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.datasource.SingleConnectionDataSource


class V1__ : BaseJavaMigration() {

    @Override
    override fun migrate(context: Context) {
        JdbcTemplate(SingleConnectionDataSource(context.connection, true))
            .execute("")

    }
}
