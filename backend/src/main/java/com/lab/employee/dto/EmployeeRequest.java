package com.lab.employee.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public record EmployeeRequest(
        @NotBlank(message = "First name is required") String firstName,
        @NotBlank(message = "Last name is required") String lastName,
        @NotBlank(message = "Email is required") @Email(message = "Email format is invalid") String email,
        @Pattern(regexp = "\\d{10}", message = "Phone must be 10 digits") String phone,
        @NotBlank(message = "Job title is required") String jobTitle,
        @NotNull(message = "Salary is required") @DecimalMin(value = "0.0", message = "Salary cannot be negative") BigDecimal salary,
        @NotNull(message = "Joining date is required") @PastOrPresent(message = "Joining date cannot be in the future") LocalDate joiningDate,
        @NotNull(message = "Department is required") Long departmentId) {
}
