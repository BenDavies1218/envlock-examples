package com.example;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@SpringBootApplication
@RestController
public class App {
    public static void main(String[] args) {
        SpringApplication.run(App.class, args);
    }

    @GetMapping("/")
    public Map<String, String> index() {
        return Map.of(
            "message", "Hello from envlock + Java",
            "secret", System.getenv("API_SECRET") != null ? "[set]" : "[missing]",
            "env", System.getenv("APP_ENV") != null ? System.getenv("APP_ENV") : "unknown"
        );
    }
}
