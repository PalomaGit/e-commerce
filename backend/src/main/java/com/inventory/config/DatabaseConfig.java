package com.inventory.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;
import java.net.URISyntaxException;

@Configuration
public class DatabaseConfig {

    @Value("${DATABASE_URL:}")
    private String databaseUrl;

    @Bean
    @Primary
    @ConfigurationProperties("spring.datasource")
    public DataSourceProperties dataSourceProperties() {
        DataSourceProperties properties = new DataSourceProperties();
        
        if (databaseUrl != null && !databaseUrl.isEmpty()) {
            try {
                String dbUrl = databaseUrl;
                if (dbUrl.startsWith("postgresql://")) {
                    dbUrl = dbUrl.replace("postgresql://", "postgres://");
                }
                
                URI dbUri = new URI(dbUrl);
                String[] userInfo = dbUri.getUserInfo().split(":");
                String username = userInfo[0];
                String password = userInfo.length > 1 ? userInfo[1] : "";
                
                int port = dbUri.getPort() == -1 ? 5432 : dbUri.getPort();
                String jdbcUrl = "jdbc:postgresql://" + dbUri.getHost() + ":" + port + dbUri.getPath();
                
                if (dbUri.getQuery() != null && !dbUri.getQuery().isEmpty()) {
                    jdbcUrl += "?" + dbUri.getQuery();
                }
                
                properties.setUrl(jdbcUrl);
                properties.setUsername(username);
                properties.setPassword(password);
            } catch (URISyntaxException e) {
                throw new RuntimeException("Error parsing DATABASE_URL: " + e.getMessage(), e);
            }
        }
        
        return properties;
    }

    @Bean
    @Primary
    public DataSource dataSource(DataSourceProperties properties) {
        return properties.initializeDataSourceBuilder().build();
    }
}

