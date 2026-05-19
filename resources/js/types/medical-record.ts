import { Patient } from "./patient";
import { Doctor } from "./doctor";

export interface MedicalRecord {
    id: number;

    patient_id: number;
    doctor_id: number;

    complaint: string;

    physical_examination: string;

    diagnosis: string;

    medical_treatment: string;

    record_date: string;

    notes?: string;

    patient?: Patient;

    doctor?: Doctor;

    created_at: string;

    updated_at: string;
}