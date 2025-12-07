
import { Doctor, Appointment, UserProfile } from '../types';

export const MOCK_APPOINTMENTS: Appointment[] = [
    {
        id: "apt_01",
        doctorName: "Dr. Sarah Chen",
        specialty: "Cardiologist",
        date: "2024-11-25T10:00:00",
        status: 'upcoming',
        type: 'In-Person'
    },
    {
        id: "apt_02",
        doctorName: "Dr. James Wilson",
        specialty: "General Physician",
        date: "2024-10-15T14:30:00",
        status: 'completed',
        type: 'Video'
    },
    {
        id: "apt_03",
        doctorName: "Dr. Emily Wong",
        specialty: "Dermatologist",
        date: "2024-09-01T09:00:00",
        status: 'completed',
        type: 'In-Person'
    }
];

export const MOCK_USER_PROFILE: Omit<UserProfile, 'name' | 'email'> = {
    id: 'u_123',
    age: 34,
    gender: 'Male',
    vitals: {
        bpm: [72, 75, 71, 68, 74, 73, 70],
        labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S']
    },
    medications: [
        { id: 'm1', name: 'Amoxicillin', dosage: '500mg', frequency: 'Twice daily', taken: true },
        { id: 'm2', name: 'Vitamin D', dosage: '1000IU', frequency: 'Once daily', taken: false }
    ],
    insurance: {
        provider: 'HealthGuard Plus',
        policyNumber: 'HG-99887766',
        coverage: 0.8, // 80% coverage
        validTill: '12/2025'
    }
};

export const DOCTORS_DB: Doctor[] = [
    {
        id: "D101",
        name: "Dr. Sarah Chen",
        specialty: "Cardiologist",
        hospital: "Heart Care Institute",
        rating: 4.9,
        experience: "15 years",
        fee: 1500,
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300",
        available_slots: ["2024-11-20T10:00:00", "2024-11-20T14:30:00"],
        bio: "Dr. Chen is a leading cardiologist specializing in interventional cardiology and preventative heart care. She focuses on a holistic approach to cardiovascular health.",
        education: ["MD - Harvard Medical School", "Residency - Johns Hopkins Hospital", "Fellowship - Mayo Clinic"],
        languages: ["English", "Mandarin", "Spanish"],
        reviews: [
            { id: "r1", author: "Mark T.", rating: 5, text: "Saved my life. Extremely thorough and kind.", date: "2023-10-12" },
            { id: "r2", author: "Lisa K.", rating: 5, text: "Very patient explaining procedures.", date: "2023-09-05" }
        ],
        waitTime: 45
    },
    {
        id: "D102",
        name: "Dr. James Wilson",
        specialty: "General Physician",
        hospital: "City Health Clinic",
        rating: 4.7,
        experience: "8 years",
        fee: 500,
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300",
        available_slots: ["2024-11-20T09:00:00", "2024-11-20T11:00:00"],
        bio: "Dr. Wilson provides comprehensive primary care services. He is passionate about community health and preventative medicine.",
        education: ["MD - University of Washington", "Residency - Seattle General"],
        languages: ["English"],
        reviews: [
            { id: "r3", author: "John D.", rating: 4, text: "Great doctor, but wait times can be long.", date: "2023-11-01" }
        ],
        waitTime: 10
    },
    {
        id: "D103",
        name: "Dr. Anita Patel",
        specialty: "Pulmonologist",
        hospital: "Breath Well Center",
        rating: 4.8,
        experience: "12 years",
        fee: 1200,
        image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300&h=300",
        available_slots: ["2024-11-21T16:00:00"],
        bio: "Dr. Patel specializes in asthma, COPD, and sleep disorders. She uses the latest technology to diagnose and treat respiratory issues.",
        education: ["MD - Stanford University", "Fellowship - UCSF"],
        languages: ["English", "Hindi", "Gujarati"],
        reviews: [
            { id: "r4", author: "Sarah M.", rating: 5, text: "Finally found a doctor who listened to my breathing issues.", date: "2023-08-15" }
        ],
        waitTime: 25
    },
    {
        id: "D104",
        name: "Dr. Robert Fox",
        specialty: "Neurologist",
        hospital: "Neuro Advanced Care",
        rating: 4.9,
        experience: "20 years",
        fee: 2000,
        image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300&h=300",
        available_slots: ["2024-11-22T10:00:00"],
        bio: "Dr. Fox is a renowned neurologist with expertise in migraines, epilepsy, and neurodegenerative disorders. He has published over 50 research papers.",
        education: ["MD/PhD - Yale University", "Residency - Mass General"],
        languages: ["English", "French"],
        reviews: [
            { id: "r5", author: "Emily R.", rating: 5, text: "Brilliant diagnostician.", date: "2023-07-20" }
        ],
        waitTime: 60
    },
    {
        id: "D105",
        name: "Dr. Emily Wong",
        specialty: "Dermatologist",
        hospital: "Skin & Glow Clinic",
        rating: 4.9,
        experience: "10 years",
        fee: 1000,
        image: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&q=80&w=300&h=300",
        available_slots: ["2024-11-23T11:00:00", "2024-11-23T15:00:00"],
        bio: "Dr. Wong focuses on both medical and cosmetic dermatology. She is dedicated to helping patients feel confident in their skin.",
        education: ["MD - UCLA", "Residency - Cedars-Sinai"],
        languages: ["English", "Cantonese"],
        reviews: [
            { id: "r6", author: "Jessica L.", rating: 5, text: "Best dermatologist in the city!", date: "2023-09-30" }
        ],
        waitTime: 5
    },
    {
        id: "D106",
        name: "Dr. Michael Ross",
        specialty: "Orthopedic Surgeon",
        hospital: "Joint Care Center",
        rating: 4.8,
        experience: "18 years",
        fee: 1800,
        image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300&h=300",
        available_slots: ["2024-11-24T09:30:00"],
        bio: "Dr. Ross specializes in sports medicine and knee replacements. He works with professional athletes to ensure top-tier recovery.",
        education: ["MD - Columbia University", "Fellowship - HSS"],
        languages: ["English"],
        reviews: [
            { id: "r7", author: "Tom B.", rating: 4, text: "Fixed my knee after a skiing accident.", date: "2023-06-12" }
        ],
        waitTime: 35
    },
    {
        id: "D107",
        name: "Dr. Lisa Cuddy",
        specialty: "Pediatrician",
        hospital: "Little Stars Hospital",
        rating: 4.9,
        experience: "14 years",
        fee: 900,
        image: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=300&h=300",
        available_slots: ["2024-11-20T10:00:00", "2024-11-21T11:30:00"],
        bio: "Dr. Cuddy loves working with children and providing compassionate care for families. She serves as the Dean of Medicine at a local university.",
        education: ["MD - University of Michigan", "Residency - CHOP"],
        languages: ["English", "Spanish"],
        reviews: [
            { id: "r8", author: "Parent123", rating: 5, text: "She is amazing with my toddler.", date: "2023-10-05" }
        ],
        waitTime: 15
    },
    {
        id: "D108",
        name: "Dr. Gregory House",
        specialty: "Diagnostic Medicine",
        hospital: "Princeton Plainsboro",
        rating: 5.0,
        experience: "25 years",
        fee: 5000,
        image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=300&h=300",
        available_slots: ["2024-11-25T14:00:00"],
        bio: "Specializes in infectious diseases and nephrology. Known for solving medical mysteries that no one else can.",
        education: ["MD - Johns Hopkins"],
        languages: ["English", "Spanish", "Mandarin", "Portuguese"],
        reviews: [
            { id: "r9", author: "Wilson", rating: 5, text: "Unconventional, but a genius.", date: "2023-11-15" }
        ],
        waitTime: 120
    }
];

export const searchDoctors = (specialties: string[]): Doctor[] => {
    // Basic mock search - if specialty matches loosely
    return DOCTORS_DB.filter(d => 
        specialties.some(s => d.specialty.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(d.specialty.toLowerCase()))
    );
};

export const getDoctorById = (id: string): Doctor | undefined => {
    return DOCTORS_DB.find(d => d.id === id);
};
