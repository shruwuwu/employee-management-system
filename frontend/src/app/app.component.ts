import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar navbar-expand-md navbar-dark bg-success">
      <div class="container">
        <span class="navbar-brand">Employee Management</span>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="nav">
          <div class="navbar-nav">
            <a class="nav-link" routerLink="/" routerLinkActive="active fw-bold" [routerLinkActiveOptions]="{ exact: true }">Dashboard</a>
            <a class="nav-link" routerLink="/employees" routerLinkActive="active fw-bold">Employees</a>
            <a class="nav-link" routerLink="/departments" routerLinkActive="active fw-bold">Departments</a>
          </div>
        </div>
      </div>
    </nav>
    <main class="container pb-5">
      <router-outlet></router-outlet>
    </main>
  `,
})
export class AppComponent {}
