import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class ApiService {
  private apiUrl = "https://localhost:5001/ApplicationManager/CreateApplication";
  constructor(private http: HttpClient) {}

  createNewLoanApplication(loanApplication: any): Observable<any> {
    return this.http.post(this.apiUrl, loanApplication);
  }
}
