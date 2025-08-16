export interface College {
  collegeCode: string;
  collegeTitle: string;
  departments: {
    code: string;
    title: string;
  }[];
}

export interface CollegeResponse {
  success: boolean;
  timeStamp: number[];
  data: College[];
}
