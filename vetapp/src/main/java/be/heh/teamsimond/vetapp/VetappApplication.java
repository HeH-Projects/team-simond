package be.heh.teamsimond.vetapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableOAuth2Client;

@SpringBootApplication
@EnableOAuth2Client
public class VetappApplication {

	public static void main(String[] args) {
		SpringApplication.run(VetappApplication.class, args);
	}
}
