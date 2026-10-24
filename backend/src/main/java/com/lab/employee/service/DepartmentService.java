package com.lab.employee.service;

import com.lab.employee.model.Department;
import com.lab.employee.repository.DepartmentRepository;
import com.lab.employee.repository.EmployeeRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class DepartmentService {
    private final DepartmentRepository departments;
    private final EmployeeRepository employees;

    public DepartmentService(DepartmentRepository departments, EmployeeRepository employees) {
        this.departments = departments;
        this.employees = employees;
    }

    public List<Department> findAll() { return departments.findAll(); }

    public Department get(Long id) {
        return departments.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Department not found"));
    }

    @Transactional
    public Department create(Department in) {
        if (departments.existsByNameIgnoreCase(in.getName())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "A department with this name already exists");
        }
        in.setId(null);
        return departments.save(in);
    }

    @Transactional
    public Department update(Long id, Department in) {
        Department d = get(id);
        if (departments.existsByNameIgnoreCaseAndIdNot(in.getName(), id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "A department with this name already exists");
        }
        d.setName(in.getName());
        d.setLocation(in.getLocation());
        return departments.save(d);
    }

    @Transactional
    public void delete(Long id) {
        Department d = get(id);
        if (employees.existsByDepartmentId(id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Cannot delete a department that still has employees. Move or delete them first.");
        }
        departments.delete(d);
    }
}
