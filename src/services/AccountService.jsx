import axios from "./axiosInstance";

export const GetAccountss = (page)=>axios.get(`/FinanceAccounts/Accounts?page=${page}`);
export const GetjournalEntryDetails = (params) =>
  axios.get(`/FinanceAccounts/JournalEntry`,{ params });
  export const GetInvoices = (params) =>
  axios.get(`/FinanceAccounts/Invoices`,{ params });


  export const GetAllJournalEntryDetails = (page) =>
  axios.get(`/FinanceAccounts/JournalEntryDetails?page=${page}`);


