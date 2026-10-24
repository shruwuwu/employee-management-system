import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { Department } from '../models';

@Injectable({ providedIn: 'root' })
export class DepartmentService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/departments`;

  list() {
    return this.http.get<Department[]>(this.url);
  }
  create(body: { name: string; location: string }) {
    return this.http.post<Department>(this.url, body);
  }
  update(id: number, body: { name: string; location: string }) {
    return this.http.put<Department>(`${this.url}/${id}`, body);
  }
  delete(id: number) {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
