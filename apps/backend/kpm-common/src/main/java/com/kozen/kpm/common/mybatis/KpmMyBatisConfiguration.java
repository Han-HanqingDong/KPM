package com.kozen.kpm.common.mybatis;

import org.mybatis.spring.boot.autoconfigure.ConfigurationCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/** Shared MyBatis configuration for KPM microservices. */
@Configuration
public class KpmMyBatisConfiguration {
    @Bean
    public ConfigurationCustomizer kpmMyBatisConfigurationCustomizer() {
        return configuration -> {
            configuration.setMapUnderscoreToCamelCase(true);
            configuration.setObjectWrapperFactory(new CamelCaseMapWrapperFactory());
        };
    }
}
