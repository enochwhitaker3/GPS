import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { LoanApplication } from "./models/loan-application.model";

@Injectable({ providedIn: "root" })
export class ApiService {
  private apiUrl = "https://localhost:5001/ApplicationManager";
  constructor(private http: HttpClient) {}

  getAllApplications(): Observable<LoanApplication[]> {
    return this.http.get<LoanApplication[]>(
      `${this.apiUrl}/GetAllApplications`
    );
  }

  createNewLoanApplication(
    loanApplication: LoanApplication
  ): Observable<LoanApplication> {
    return this.http.post<LoanApplication>(
      `${this.apiUrl}/CreateApplication`,
      loanApplication
    );
  }

  updateLoanApplication(
    loanApplication: LoanApplication
  ): Observable<LoanApplication> {
    return this.http.put<LoanApplication>(
      `${this.apiUrl}/UpdateApplication`,
      loanApplication
    );
  }
  
}
