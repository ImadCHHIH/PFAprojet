package com.beautycloud.initializer;

import com.beautycloud.company.entity.Company;
import com.beautycloud.company.entity.CompanyStatus;
import com.beautycloud.company.repository.CompanyRepository;
import com.beautycloud.role.entity.Role;
import com.beautycloud.role.entity.RoleType;
import com.beautycloud.role.repository.RoleRepository;
import com.beautycloud.user.entity.User;
import com.beautycloud.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        if (roleRepository.count() == 0) {

            roleRepository.save(Role.builder().name(RoleType.SUPER_ADMIN).build());
            roleRepository.save(Role.builder().name(RoleType.SALON_ADMIN).build());
            roleRepository.save(Role.builder().name(RoleType.RECEPTIONIST).build());
            roleRepository.save(Role.builder().name(RoleType.STYLIST).build());

        }

        if (companyRepository.count() == 0) {

            Company company = Company.builder()
                    .name("BeautyCloud Demo")
                    .email("contact@beautycloud.com")
                    .phone("0600000000")
                    .address("Casablanca")
                    .city("Casablanca")
                    .country("Morocco")
                    .status(CompanyStatus.ACTIVE)
                    .logo("")
                    .build();

            companyRepository.save(company);

        }

        if (userRepository.count() == 0) {

        	Role superAdminRole = roleRepository.findByName(RoleType.SUPER_ADMIN)
        	        .orElseThrow(() -> new RuntimeException("SUPER_ADMIN role not found"));

        	User admin = User.builder()
        	        .firstName("Super")
        	        .lastName("Admin")
        	        .email("admin@beautycloud.com")
        	        .password(passwordEncoder.encode("admin123"))
        	        .phone("0600000000")
        	        .active(true)
        	        .role(superAdminRole)
        	        .mustChangePassword(false)
        	        .build();

            userRepository.save(admin);

        }

    }

}