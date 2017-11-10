package be.heh.teamsimond.vetapp.oauth2;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;

@Configuration
public class ResourceServerConfig extends ResourceServerConfigurerAdapter {

    @Override
    public void configure(HttpSecurity http) throws Exception {
        // only secure channel, https, is allowed
        http.requiresChannel().anyRequest().requiresSecure();

        // static resources
        http.authorizeRequests().antMatchers("/index.html", "/", "/*.js", "/*.css", "/assets/**").permitAll();

        http.authorizeRequests().anyRequest().authenticated();

    }
}
