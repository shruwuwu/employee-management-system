import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { errMsg } from '../../error';
import { Department, Msg } from '../../models';
import { DepartmentService } from '../../services/department.service';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <h2 class="page-title">Departments</h2>

    @if (msg; as m) {
      <div [class]="'alert alert-dismissible alert-' + m.type">
        {{ m.text }}
        <button type="button" class="btn-close" (click)="msg = null"></button>
      </div>
    }

    <form [formGroup]="form" (ngSubmit)="submit()" novalidate class="row g-2 mb-4">
      <div class="col-md-5">
        <input class="form-control" placeholder="Department name" formControlName="name" [class.is-invalid]="invalid('name')" />
        <div class="invalid-feedback">Department name is required</div>
      </div>
      <div class="col-md-4">
        <input class="form-control" placeholder="Location" formControlName="location" [class.is-invalid]="invalid('location')" />
        <div class="invalid-feedback">Location is required</div>
      </div>
      <div class="col-md-3 d-grid gap-1">
        <button class="btn btn-success" type="submit">{{ editId ? 'Update' : 'Add department' }}</button>
        @if (editId) {
          <button class="btn btn-outline-secondary btn-sm" type="button" (click)="cancel()">Cancel</button>
        }
      </div>
    </form>

    <div class="table-wrap table-responsive">
      <table class="table table-hover align-middle mb-0">
        <thead><tr><th>ID</th><th>Name</th><th>Location</th><th></th></tr></thead>
        <tbody>
          @for (d of departments; track d.id) {
            <tr>
              <td>{{ d.id }}</td>
              <td>{{ d.name }}</td>
              <td>{{ d.location }}</td>
              <td class="text-end">
                <button class="btn btn-sm btn-outline-primary me-1" (click)="edit(d)">Edit</button>
                <button class="btn btn-sm btn-outline-danger" (click)="remove(d)">Delete</button>
              </td>
            </tr>
          } @empty {
            <tr><td colspan="4" class="text-center text-muted py-3">No departments yet</td></tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
export class DepartmentsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(DepartmentService);

  departments: Department[] = [];
  editId: number | null = null;
  submitted = false;
  msg: Msg | null = null;

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    location: ['', Validators.required],
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.service.list().subscribe({
      next: (d) => (this.departments = d),
      error: (err) => (this.msg = { type: 'danger', text: errMsg(err) }),
    });
  }

  invalid(name: string): boolean {
    const c = this.form.get(name);
    return !!c && c.invalid && (c.touched || this.submitted);
  }

  submit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      this.msg = { type: 'danger', text: 'Name and location are required' };
      return;
    }
    const body = this.form.getRawValue();
    const request = this.editId ? this.service.update(this.editId, body) : this.service.create(body);
    request.subscribe({
      next: () => {
        this.msg = { type: 'success', text: this.editId ? 'Department updated' : 'Department added' };
        this.cancel();
        this.load();
      },
      error: (err) => (this.msg = { type: 'danger', text: errMsg(err) }),
    });
  }

  edit(d: Department): void {
    this.editId = d.id;
    this.form.setValue({ name: d.name, location: d.location });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancel(): void {
    this.editId = null;
    this.submitted = false;
    this.form.reset({ name: '', location: '' });
  }

  remove(d: Department): void {
    if (!confirm(`Delete department "${d.name}"?`)) return;
    this.service.delete(d.id).subscribe({
      next: () => {
        this.msg = { type: 'success', text: 'Department deleted' };
        this.load();
      },
      error: (err) => (this.msg = { type: 'danger', text: errMsg(err) }),
    });
  }
}
