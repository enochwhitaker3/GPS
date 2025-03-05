import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../api.service";
import { LoanApplication } from "../models/loan-application.model";

@Component({
  selector: "app-edit-application",
  templateUrl: "./edit-application.component.html",
  styleUrls: ["./edit-application.component.scss"],
})
export class EditApplicationComponent implements OnInit {
  public applicationForm: FormGroup;
  public statuses: Array<string> = ["New", "Approved", "Funded"];
  public applicationId!: string;
  public application!: LoanApplication;

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
      applicationNumber: [{ value: "", disabled: true }, [Validators.required]],
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

  ngOnInit(): void {
    const state = history.state;
    if (state && state.application) {
      this.application = state.application;
      this.setFormValues();
    }
  }

  private setFormValues(): void {
    console.log(this.application, "YEAH!");
    this.applicationForm.patchValue({
      firstName: this.application.personalInformation.name.first,
      lastName: this.application.personalInformation.name.last,
      phoneNumber: this.application.personalInformation.phoneNumber,
      email: this.application.personalInformation.email,
      applicationNumber: this.application.applicationNumber,
      status: this.application.status,
      amount: this.application.loanTerms.amount,
      terms: this.application.loanTerms.term,
    });
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
          term: Number(this.applicationForm.get("terms")?.value),
          monthlyPaymentAmount: Number(
            this.applicationForm.get("monthlyPayAmount")?.value
          ),
        },
      };
      this.apiService.updateLoanApplication(newApplication).subscribe(
        (response) => {
          this.snackBar.open("Saved successfully", "Close", {
            duration: 5000,
          });
          this.router.navigate(["/applications"]);
        },
        (error) => {
          this.snackBar.open("Hmm..Something went wrong", "Close", {
            duration: 5000,
          });
        }
      );
    }
  }
}
