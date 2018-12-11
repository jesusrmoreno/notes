import { observableCrossfilter } from "./useCrossfilter";

const initialState = {
  results: []
};

export const [TransactionProvider, createReducer] = observableCrossfilter();

export const [TransactionReducer, useTransactions] = createReducer(
  (cs, props) => {
    return cs.intersection();
  }
);
