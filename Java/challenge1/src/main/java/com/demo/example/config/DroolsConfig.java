package meia.challenges.challenge1.config;

import org.kie.api.KieServices;
import org.kie.api.builder.KieBuilder;
import org.kie.api.builder.KieFileSystem;
import org.kie.api.builder.KieModule;
import org.kie.api.builder.Message;
import org.kie.api.io.Resource;
import org.kie.api.runtime.KieContainer;
import org.kie.internal.io.ResourceFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DroolsConfig {

    private static final String RULES_CUSTOMER_RULES_DRL = "rules/customer-discount.drl";
    private static final KieServices kieServices = KieServices.Factory.get();

    @Bean
    public KieContainer kieContainer() {
        try {
            // First check if resource exists
            Resource resource = ResourceFactory.newClassPathResource(RULES_CUSTOMER_RULES_DRL);

            if (resource == null) {
                throw new RuntimeException("Rule file not found: " + RULES_CUSTOMER_RULES_DRL);
            }

            KieFileSystem kieFileSystem = kieServices.newKieFileSystem();
            kieFileSystem.write(resource);

            KieBuilder kb = kieServices.newKieBuilder(kieFileSystem);
            kb.buildAll();

            // Check for compilation errors
            if (kb.getResults().hasMessages(Message.Level.ERROR)) {
                throw new RuntimeException("Rule compilation errors: " + kb.getResults().toString());
            }

            KieModule kieModule = kb.getKieModule();
            return kieServices.newKieContainer(kieModule.getReleaseId());
        } catch (Exception e) {
            // Log the detailed exception
            e.printStackTrace();
            throw new RuntimeException("Failed to create KieContainer: " + e.getMessage(), e);
        }
    }
}