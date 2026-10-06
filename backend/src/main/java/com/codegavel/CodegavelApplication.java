package com.codegavel;

import org.springframework.scheduling.annotation.EnableScheduling;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@EnableScheduling
public class CodegavelApplication {

	public static void main(String[] args) {
		SpringApplication.run(CodegavelApplication.class, args);
	}

}
