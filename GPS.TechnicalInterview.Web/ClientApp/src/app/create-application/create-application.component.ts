import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../api.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { LoanApplication } from "../models/loan-application.model";

@Component({
  selector: "app-create-application",
  templateUrl: "./create-application.component.html",
  styleUrls: ["./create-application.component.scss"],
})
export class CreateApplicationComponent {
  public applicationForm: FormGroup;
  public statuses: Array<string> = ["New", "Approved", "Funded"];

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.applicationForm = this.formBuilder.group({
      firstName: ["", [Validators.required]],
      lastName: ["", [Validators.required]],
      phoneNumber: [
        "",
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
          Validators.pattern("^[0-9]*$"),
        ],
      ],
      email: ["", [Validators.required, Validators.email]],
      applicationNumber: ["", [Validators.required]],
      status: ["New"],
      amount: ["", [Validators.required, Validators.min(1)]],
      monthlyPayAmount: [{ value: "", disabled: true }],
      terms: [
        "",
        [
          Validators.required,
          Validators.pattern("^[0-9]*$"),
          Validators.min(1),
        ],
      ],
    });

    this.applicationForm
      .get("amount")
      ?.valueChanges.subscribe(() => this.updateMonthlyPayment());
    this.applicationForm
      .get("terms")
      ?.valueChanges.subscribe(() => this.updateMonthlyPayment());
  }
  get firstName() {
    return this.applicationForm.get("firstName");
  }
  get lastName() {
    return this.applicationForm.get("lastName");
  }
  get phoneNumber() {
    return this.applicationForm.get("phoneNumber");
  }
  get email() {
    return this.applicationForm.get("email");
  }
  get applicationNumber() {
    return this.applicationForm.get("applicationNumber");
  }
  get amount() {
    return this.applicationForm.get("amount");
  }
  get terms() {
    return this.applicationForm.get("terms");
  }
  get status() {
    return this.applicationForm.get("status");
  }
  get monthlyPayAmount() {
    return this.applicationForm.get("monthlyPayAmount");
  }

  updateMonthlyPayment(): void {
    const amount = this.applicationForm.get("amount")?.value;
    const terms = this.applicationForm.get("terms")?.value;

    if (amount != null && terms != null && terms !== "" && amount !== "") {
      const calcPayment = (amount / terms).toFixed(2);
      this.applicationForm.get("monthlyPayAmount")?.setValue(calcPayment);
    } else {
      this.applicationForm.get("monthlyPayAmount")?.setValue("TBA");
    }
  }

  onSubmit() {
    if (this.applicationForm.valid) {
        const newApplication: LoanApplication = {
            personalInformation: {
                name: {
                    first: this.applicationForm.get("firstName")?.value,
                    last: this.applicationForm.get("lastName")?.value,
                },
                phoneNumber: this.applicationForm.get("phoneNumber")?.value,
                email: this.applicationForm.get("email")?.value,
            },
            applicationNumber: this.applicationForm.get("applicationNumber")?.value,
            status: this.applicationForm.get("status")?.value,
            loanTerms: {
                amount: Number(this.applicationForm.get("amount")?.value),
                terms: Number(this.applicationForm.get("terms")?.value),
                monthlyPayment: Number(this.applicationForm.get("monthlyPayAmount")?.value),
            },
        };
      this.apiService.createNewLoanApplication(newApplication).subscribe(
        (response) => {
          this.snackBar.open("Created successfully", "Close", {
            duration: 3000,
          });
          this.router.navigate(["/applications"]);
        },
        (error) => {
          this.snackBar.open("Hmm..Something went wrong", "Close", {
            duration: 300,
          });
        }
      );
    }
  }


}
