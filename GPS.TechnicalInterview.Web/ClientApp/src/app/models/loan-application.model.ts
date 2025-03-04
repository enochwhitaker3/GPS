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
    term: number;
    monthlyPaymentAmount: number;
  };
  dateApplied?: string;
}
