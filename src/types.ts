export enum ThunkStatus {
  IDLE = "idle",
  PENDING = "pending",
  SUCCEEDED = "succeeded",
  FAILED = "failed",
}

export type BaseInitialStateThunk = {
  status: ThunkStatus;
  error: string | null;
};
