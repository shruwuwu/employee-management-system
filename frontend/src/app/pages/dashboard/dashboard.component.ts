import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { forkJoin } from 'rxjs';
import { errMsg } from '../../error';
import { DepartmentService } from '../../services/department.service';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CurrencyPipe],
  template: `
    <h2 class="page-title">Dashboard</h2>
    @if (error) {
      <div class="alert alert-danger">{{ error }}</div>
    }
    <div class="row g-3 mb-4">
      <div class="col-6 col-md-4">
        <div class="card card-stat shadow-sm"><div class="card-body">
          <div class="text-muted small">Employees</div><div class="fs-2 fw-bold">{{ total }}</div>
        </div></div>
      </div>
      <div class="col-6 col-md-4">
        <div class="card card-stat shadow-sm"><div class="card-body">
          <div class="text-muted small">Departments</div><div class="fs-2 fw-bold">{{ deptCount }}</div>
        </div></div>
      </div>
      <div class="col-12 col-md-4">
        <div class="card card-stat shadow-sm"><div class="card-body">
          <div class="text-muted small">Average salary</div>
          <div class="fs-2 fw-bold">{{ avgSalary | currency: 'INR' : 'symbol' : '1.0-0' }}</div>
        </div></div>
      </div>
    </div>
    <h5>Headcount by department</h5>
    <div class="table-wrap table-responsive">
      <table class="table mb-0">
        <thead><tr><th>Department</th><th>Employees</th></tr></thead>
        <tbody>
          @for (r of rows; track r.name) {
            <tr><td>{{ r.name }}</td><td>{{ r.count }}</td></tr>
          } @empty {
            <tr><td colspan="2" class="text-center text-muted py-3">No departments yet</td></tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  private employees = inject(EmployeeService);
  private departments = inject(DepartmentService);

  total = 0;
  deptCount = 0;
  avgSalary = 0;
  rows: { name: string; count: number }[] = [];
  error = '';

  ngOnInit(): void {
    forkJoin({ e: this.employees.list(), d: this.departments.list() }).subscribe({
      next: ({ e, d }) => {
        this.total = e.length;
        this.deptCount = d.length;
        this.avgSalary = e.length ? e.reduce((sum, x) => sum + Number(x.salary), 0) / e.length : 0;
        this.rows = d.map((dep) => ({ name: dep.name, count: e.filter((x) => x.department.id === dep.id).length }));
      },
      error: (err) => (this.error = errMsg(err)),
    });
  }
}
