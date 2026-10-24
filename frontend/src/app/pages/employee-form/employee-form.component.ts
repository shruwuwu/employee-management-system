import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { errMsg } from '../../error';
import { Department, EmployeeRequest, Msg } from '../../models';
import { DepartmentService } from '../../services/department.service';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <h2 class="page-title">{{ editId ? 'Edit employee' : 'Add employee' }}</h2>

    @if (msg; as m) {
      <div [class]="'alert alert-dismissible alert-' + m.type">
        {{ m.text }}
        <button type="button" class="btn-close" (click)="msg = null"></button>
      </div>
    }

    <form [formGroup]="form" (ngSubmit)="submit()" novalidate class="row g-3 table-wrap p-3 m-0">
      <div class="col-md-6">
        <label class="form-label">First name</label>
        <input class="form-control" formControlName="firstName" [class.is-invalid]="invalid('firstName')" />
        <div class="invalid-feedback">First name is required</div>
      </div>
      <div class="col-md-6">
        <label class="form-label">Last name</label>
        <input class="form-control" formControlName="lastName" [class.is-invalid]="invalid('lastName')" />
        <div class="invalid-feedback">Last name is required</div>
      </div>
      <div class="col-md-6">
        <label class="form-label">Email</label>
        <input class="form-control" formControlName="email" [class.is-invalid]="invalid('email')" />
        <div class="invalid-feedback">Enter a valid email address</div>
      </div>
      <div class="col-md-6">
        <label class="form-label">Phone (optional)</label>
        <input class="form-control" formControlName="phone" [class.is-invalid]="invalid('phone')" />
        <div class="invalid-feedback">Phone must be 10 digits</div>
      </div>
      <div class="col-md-6">
        <label class="form-label">Job title</label>
        <input class="form-control" formControlName="jobTitle" [class.is-invalid]="invalid('jobTitle')" />
        <div class="invalid-feedback">Job title is required</div>
      </div>
      <div class="col-md-6">
        <label class="form-label">Department</label>
        <select class="form-select" formControlName="departmentId" [class.is-invalid]="invalid('departmentId')">
          <option [ngValue]="null">Select department</option>
          @for (d of departments; track d.id) {
            <option [ngValue]="d.id">{{ d.name }}</option>
          }
        </select>
        <div class="invalid-feedback">Select a department (add one on the Departments page first)</div>
      </div>
      <div class="col-md-6">
        <label class="form-label">Salary (INR)</label>
        <input class="form-control" type="number" min="0" formControlName="salary" [class.is-invalid]="invalid('salary')" />
        <div class="invalid-feedback">Salary is required and cannot be negative</div>
      </div>
      <div class="col-md-6">
        <label class="form-label">Joining date</label>
        <input class="form-control" type="date" formControlName="joiningDate" [class.is-invalid]="invalid('joiningDate')" />
        <div class="invalid-feedback">Joining date is required</div>
      </div>
      <div class="col-12">
        <button class="btn btn-success me-2" type="submit">{{ editId ? 'Update' : 'Save' }}</button>
        <a class="btn btn-outline-secondary" routerLink="/employees">Cancel</a>
      </div>
    </form>
  `,
})
export class EmployeeFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private employees = inject(EmployeeService);
  private departmentService = inject(DepartmentService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  departments: Department[] = [];
  editId: number | null = null;
  submitted = false;
  msg: Msg | null = null;

  form = this.fb.group({
    firstName: this.fb.nonNullable.control('', Validators.required),
    lastName: this.fb.nonNullable.control('', Validators.required),
    email: this.fb.nonNullable.control('', [Validators.required, Validators.email]),
    phone: this.fb.nonNullable.control('', Validators.pattern(/^\d{10}$/)),
    jobTitle: this.fb.nonNullable.control('', Validators.required),
    salary: this.fb.control<number | null>(null, [Validators.required, Validators.min(0)]),
    joiningDate: this.fb.nonNullable.control('', Validators.required),
    departmentId: this.fb.control<number | null>(null, Validators.required),
  });

  ngOnInit(): void {
    this.departmentService.list().subscribe({
      next: (d) => (this.departments = d),
      error: (err) => (this.msg = { type: 'danger', text: errMsg(err) }),
    });
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editId = Number(id);
      this.employees.get(this.editId).subscribe({
        next: (e) =>
          this.form.patchValue({
            firstName: e.firstName,
            lastName: e.lastName,
            email: e.email,
            phone: e.phone ?? '',
            jobTitle: e.jobTitle,
            salary: e.salary,
            joiningDate: e.joiningDate,
            departmentId: e.department.id,
          }),
        error: (err) => (this.msg = { type: 'danger', text: errMsg(err) }),
      });
    }
  }

  invalid(name: string): boolean {
    const c = this.form.get(name);
    return !!c && c.invalid && (c.touched || this.submitted);
  }

  submit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      this.msg = { type: 'danger', text: 'Please correct the highlighted fields' };
      return;
    }
    const v = this.form.getRawValue();
    const body: EmployeeRequest = {
      firstName: v.firstName.trim(),
      lastName: v.lastName.trim(),
      email: v.email.trim(),
      phone: v.phone.trim() ? v.phone.trim() : null,
      jobTitle: v.jobTitle.trim(),
      salary: Number(v.salary),
      joiningDate: v.joiningDate,
      departmentId: Number(v.departmentId),
    };
    const request = this.editId ? this.employees.update(this.editId, body) : this.employees.create(body);
    request.subscribe({
      next: () =>
        this.router.navigate(['/employees'], {
          state: { msg: this.editId ? 'Employee updated' : 'Employee added' },
        }),
      error: (err) => (this.msg = { type: 'danger', text: errMsg(err) }),
    });
  }
}
