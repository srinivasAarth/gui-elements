export interface IActivityStatus {
    // Optional project ID
    project?: string;
    // Optional task ID
    task?: string;
    // The activity name
    activity: string;
    // If the activity is currently running
    isRunning: boolean;
    // If the activity has failed
    failed: boolean;
    // The name of the status class
    statusName: "Waiting" | "Finished" | "Idle" | "Running" | "Canceling";
    // A number between 0 and 100
    progress: number;
    // More information corresponding to the status
    message: string;
    // If the activity has been cancelled
    cancelled: boolean;
    // The concrete status ID
    concreteStatus: ConcreteActivityStatus;
    // If there was an error, this contains the exception message
    exceptionMessage?: string | null;
    // The runtime in ms
    runtime?: number;
    // The start time as date time, e.g. "2021-09-07T09:34:53.153Z"
    startTime?: string;
}

export type ConcreteActivityStatus = "Cancelled" | "Failed" | "Successful" | "Not executed" | "Running" | "Waiting" | "Canceling"
