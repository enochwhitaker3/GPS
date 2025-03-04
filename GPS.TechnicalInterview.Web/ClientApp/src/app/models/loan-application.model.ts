export interface LoanApplication {
  personalInformation: {
    name: {
      first: string;
      last: string;
    };
    phoneNumber: string;
    email: string;
  };
  applicationNumber: string;
  status: string;
  loanTerms: {
    amount: number;
    terms: number;
    monthlyPayment: number;
  };
  dateApplied?: string;
}
