package com.lab.employee.service;

import com.lab.employee.dto.EmployeeRequest;
import com.lab.employee.model.Department;
import com.lab.employee.model.Employee;
import com.lab.employee.repository.DepartmentRepository;
import com.lab.employee.repository.EmployeeRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

/** Business rules for employees: unique email and a valid department. */
@Service
public class EmployeeService {
    private final EmployeeRepository employees;
    private final DepartmentRepository departments;

    public EmployeeService(EmployeeRepository employees, DepartmentRepository departments) {
        this.employees = employees;
        this.departments = departments;
    }

    public List<Employee> findAll(String q) {
        if (q == null || q.isBlank()) return employees.findAll();
        return employees.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrEmailContainingIgnoreCase(q, q, q);
    }

    public Employee get(Long id) {
        return employees.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found"));
    }

    @Transactional
    public Employee create(EmployeeRequest req) {
        if (employees.existsByEmailIgnoreCase(req.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An employee with this email already exists");
        }
        return employees.save(apply(new Employee(), req));
    }

    @Transactional
    public Employee update(Long id, EmployeeRequest req) {
        Employee e = get(id);
        if (employees.existsByEmailIgnoreCaseAndIdNot(req.email(), id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An employee with this email already exists");
        }
        return employees.save(apply(e, req));
    }

    @Transactional
    public void delete(Long id) {
        employees.delete(get(id));
    }

    private Employee apply(Employee e, EmployeeRequest req) {
        Department dept = departments.findById(req.departmentId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Department not found"));
        e.setFirstName(req.firstName().trim());
        e.setLastName(req.lastName().trim());
        e.setEmail(req.email().trim());
        e.setPhone(req.phone());
        e.setJobTitle(req.jobTitle().trim());
        e.setSalary(req.salary());
        e.setJoiningDate(req.joiningDate());
        e.setDepartment(dept);
        return e;
    }
}
