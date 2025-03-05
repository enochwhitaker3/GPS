import { Component, OnInit } from "@angular/core";
import { ApiService } from "../api.service";
import { LoanApplication } from "../models/loan-application.model";
import { MatDialog } from "@angular/material/dialog";
import { DeleteConfirmationComponent } from "../delete-confirmation/delete-confirmation.component";

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
  constructor(private apiService: ApiService, private dialog: MatDialog) {}

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
  openDeleteConfirmation(applicationNumber: string): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '350px',
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.apiService.deleteLoanApplication(applicationNumber).subscribe(() => {
          this.applications = this.applications.filter(
            (app) => app.applicationNumber !== applicationNumber
          );
        });
      }
    });
  }
}
