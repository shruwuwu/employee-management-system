import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { Employee, EmployeeRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/employees`;

  list(q = '') {
    return this.http.get<Employee[]>(this.url, { params: q ? { q } : {} });
  }
  get(id: number) {
    return this.http.get<Employee>(`${this.url}/${id}`);
  }
  create(body: EmployeeRequest) {
    return this.http.post<Employee>(this.url, body);
  }
  update(id: number, body: EmployeeRequest) {
    return this.http.put<Employee>(`${this.url}/${id}`, body);
  }
  delete(id: number) {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
