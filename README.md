# Employee Management System (Angular + Spring Boot + MySQL)

Manage **employees** and **departments**: add, list/search, edit and delete, with validation and a one-to-many relationship (one department has many employees).

## Technologies
- Frontend: Angular 18 (standalone components, reactive forms, HttpClient), Bootstrap 5 + custom CSS
- Backend: Spring Boot 3.3 (Java 17), Spring Web, Spring Data JPA, Bean Validation
- Database: MySQL 8
- IDE: IntelliJ IDEA

## Prerequisites
JDK 17+, Maven (bundled with IntelliJ), Node.js 18.19+ (or 20+), MySQL 8 on localhost:3306

## Run the backend (IntelliJ)
1. File > Open > select the `backend` folder (IntelliJ imports it as a Maven project).
2. Open `EmployeeApplication.java`, click the green Run arrow.
3. Run > Edit Configurations > select EmployeeApplication > Environment variables:
   `DB_USER=root;DB_PASSWORD=your_mysql_password` (never commit your password).
The database `employee_db` and its tables are created automatically. API: http://localhost:8080/api

## Run the frontend
Open a terminal in the `frontend` folder (IntelliJ: Alt+F12):
```
npm install
npm start
```
Open http://localhost:4200. To change the API address, edit `src/environments/environment.ts`.

## REST endpoints
| Resource | Endpoints |
|---|---|
| Employees | GET /api/employees?q=, GET /api/employees/{id}, POST /api/employees, PUT /api/employees/{id}, DELETE /api/employees/{id} |
| Departments | GET /api/departments, GET /api/departments/{id}, POST /api/departments, PUT /api/departments/{id}, DELETE /api/departments/{id} |

## Known limitations
No login/authentication, no pagination, no automated tests.
