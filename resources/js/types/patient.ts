export interface Patient {
    id: number;
    medical_record_number: string;
    nik: string;
    name: string;
    gender: "L" | "P";
    birth_date: string;
    phone?: string;
    address?: string;
    created_at: string;
    updated_at: string;
}