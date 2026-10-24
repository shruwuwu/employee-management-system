import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { errMsg } from '../../error';
import { Employee, Msg } from '../../models';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [FormsModule, RouterLink, CurrencyPipe],
  template: `
    <div class="d-flex justify-content-between align-items-center page-title">
      <h2 class="m-0">Employees</h2>
      <a class="btn btn-success" routerLink="/employees/new">Add employee</a>
    </div>

    @if (msg; as m) {
      <div [class]="'alert alert-dismissible alert-' + m.type">
        {{ m.text }}
        <button type="button" class="btn-close" (click)="msg = null"></button>
      </div>
    }

    <input class="form-control mb-3" placeholder="Search by name or email" [(ngModel)]="q" (ngModelChange)="load()" />

    <div class="table-wrap table-responsive">
      <table class="table table-hover align-middle mb-0">
        <thead>
          <tr><th>ID</th><th>Name</th><th>Email</th><th>Job title</th><th>Department</th><th>Salary</th><th>Joined</th><th></th></tr>
        </thead>
        <tbody>
          @for (e of employees; track e.id) {
            <tr>
              <td>{{ e.id }}</td>
              <td>{{ e.firstName }} {{ e.lastName }}</td>
              <td>{{ e.email }}</td>
              <td>{{ e.jobTitle }}</td>
              <td>{{ e.department.name }}</td>
              <td>{{ e.salary | currency: 'INR' : 'symbol' : '1.0-0' }}</td>
              <td>{{ e.joiningDate }}</td>
              <td class="text-end text-nowrap">
                <a class="btn btn-sm btn-outline-primary me-1" [routerLink]="['/employees', e.id, 'edit']">Edit</a>
                <button class="btn btn-sm btn-outline-danger" (click)="remove(e)">Delete</button>
              </td>
            </tr>
          } @empty {
            <tr><td colspan="8" class="text-center text-muted py-3">No employees found</td></tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
export class EmployeeListComponent implements OnInit {
  private service = inject(EmployeeService);

  employees: Employee[] = [];
  q = '';
  msg: Msg | null = null;

  ngOnInit(): void {
    const text = history.state?.msg;
    if (text) this.msg = { type: 'success', text };
    this.load();
  }

  load(): void {
    this.service.list(this.q).subscribe({
      next: (data) => (this.employees = data),
      error: (err) => (this.msg = { type: 'danger', text: errMsg(err) }),
    });
  }

  remove(e: Employee): void {
    if (!confirm(`Delete ${e.firstName} ${e.lastName}?`)) return;
    this.service.delete(e.id).subscribe({
      next: () => {
        this.msg = { type: 'success', text: 'Employee deleted' };
        this.load();
      },
      error: (err) => (this.msg = { type: 'danger', text: errMsg(err) }),
    });
  }
}
