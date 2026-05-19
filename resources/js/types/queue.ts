import { Patient } from "./patient";

export interface Queue {
    id: number;
    patient_id: number;
    queue_number: string;
    queue_date: string;
    status: "waiting" | "checking" | "done";

    patient?: Patient;
}