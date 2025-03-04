import { Component, OnInit } from "@angular/core";
import { ApiService } from "../api.service";
import { LoanApplication } from "../models/loan-application.model";

@Component({
  selector: "app-applications",
  templateUrl: "./applications.component.html",
  styleUrls: ["./applications.component.scss"],
})
export class ApplicationsComponent implements OnInit {
  public displayedColumns: Array<string> = [
    "applicationNumber",
    "amount",
    "dateApplied",
    "status",
    "actions",
  ];
  public applications: LoanApplication[] = [];
  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getAllApplications().subscribe(
      (data) => {
        this.applications = data;
      },
      (error) => {
        console.error("Something went wrong grabbing the applications:", error);
      }
    );
  }
}
