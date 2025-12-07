
export enum Author {
    USER = 'user',
    MEDVOICE = 'medvoice',
    SYSTEM = 'system',
}

export interface Review {
    id: string;
    author: string;
    rating: number;
    text: string;
    date: string;
}

export interface Doctor {
    id: string;
    name: string;
    specialty: string;
    hospital: string;
    rating: number;
    experience: string;
    fee: number;
    image: string;
    available_slots: string[];
    // New detailed fields
    bio: string;
    education: string[];
    languages: string[];
    reviews: Review[];
    // New feature: Wait time
    waitTime: number; 
}

export interface Appointment {
    id: string;
    doctorName: string;
    specialty: string;
    date: string;
    status: 'upcoming' | 'completed' | 'cancelled';
    type: 'Video' | 'In-Person';
}

export interface TranscriptEntry {
    author: Author;
    text: string;
    isFinal: boolean;
    id: string;
    isEmergency?: boolean;
    // UI payloads
    doctors?: Doctor[];
    paymentRequest?: {
        bookingId: string;
        amount: number;
        doctorName: string;
    };
    bookingConfirmation?: {
        bookingId: string;
        doctorName: string;
        slot: string;
    };
    isReportAnalysis?: boolean;
}

export interface VitalsData {
    bpm: number[];
    labels: string[];
}

export interface Medication {
    id: string;
    name: string;
    dosage: string;
    frequency: string;
    taken: boolean;
}

export interface Insurance {
    provider: string;
    policyNumber: string;
    coverage: number; // 0.0 to 1.0
    validTill: string;
}

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    age: number;
    gender: string;
    // New features
    vitals: VitalsData;
    medications: Medication[];
    insurance: Insurance;
}
