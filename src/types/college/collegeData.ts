export interface College {
  code: string;
  title: string;
}

export interface CollegeResponse {
  success: boolean;
  timeStamp: number[];
  data: College[];
}

export interface Department {
  code: string;
  title: string;
}

export interface DepartmentResponse {
  success: boolean;
  timeStamp: number[];
  data: Department[];
}
