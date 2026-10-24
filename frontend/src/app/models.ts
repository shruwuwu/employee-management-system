export interface Department {
  id: number;
  name: string;
  location: string;
}

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  jobTitle: string;
  salary: number;
  joiningDate: string;
  department: Department;
}

/** Shape sent to the backend when creating or updating an employee. */
export interface EmployeeRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  jobTitle: string;
  salary: number;
  joiningDate: string;
  departmentId: number;
}

export interface Msg {
  type: 'success' | 'danger';
  text: string;
}
