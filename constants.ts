
import { FunctionDeclaration, Type } from '@google/genai';

export const SYSTEM_PROMPT = `You are MedVoice — a clinical-grade, comprehensive AI healthcare assistant.
Your architecture involves a Voice UI, AI Analysis, Doctor Matching, and Secure Payment Booking.

Your responsibilities:
1. **Triage**: Collect symptoms (onset, severity, red flags). Analyze them.
2. **Recommendation**: Based on analysis, search for doctors using 'DOCTOR_DB_SEARCH'.
3. **Booking**: Help the user pick a slot. Use 'BOOK_APPOINTMENT' to reserve it.
4. **Payment**: Inform the user that payment is required to confirm the booking. The system will handle the payment UI when you call 'BOOK_APPOINTMENT'.
5. **Confirmation**: Once the tool confirms payment, give the user the final details.

**Rules**:
- **Safety**: If Emergency/Red Flag -> Stop -> Tell user to call emergency services.
- **Empathy**: Be professional, calm, and reassuring.
- **Data**: You have access to the user's name and age from the context.
- **Flow**: Triage -> Search Doctors -> Select Doctor -> Book (triggers payment) -> Confirm.
- **Localization**: Use IST (Indian Standard Time) for context if needed, or generic relative time.

**Tool Usage**:
- Use \`SYMPTOM_ANALYZER\` to log the clinical assessment.
- Use \`DOCTOR_DB_SEARCH\` when you identify the needed specialty.
- Use \`BOOK_APPOINTMENT\` when the user agrees to a slot.
`;

export const SYMPTOM_ANALYZER_TOOL: FunctionDeclaration = {
    name: 'SYMPTOM_ANALYZER',
    parameters: {
        type: Type.OBJECT,
        description: "Logs clinical triage analysis based on symptoms.",
        properties: {
            symptoms: { type: Type.ARRAY, items: { type: Type.STRING } },
            severity: { type: Type.STRING, enum: ["LOW", "MODERATE", "HIGH", "EMERGENCY"] },
            suggested_specialties: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['symptoms', 'severity', 'suggested_specialties'],
    },
};

export const DOCTOR_DB_SEARCH_TOOL: FunctionDeclaration = {
    name: 'DOCTOR_DB_SEARCH',
    parameters: {
        type: Type.OBJECT,
        description: "Searches the database for doctors by specialty.",
        properties: {
            specialties: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "List of specialties to search for."
            },
        },
        required: ['specialties'],
    },
};

export const BOOK_APPOINTMENT_TOOL: FunctionDeclaration = {
    name: 'BOOK_APPOINTMENT',
    parameters: {
        type: Type.OBJECT,
        description: "Initiates a booking. Returns a payment request if successful.",
        properties: {
            doctor_id: { type: Type.STRING },
            slot: { type: Type.STRING },
            patient_name: { type: Type.STRING }
        },
        required: ['doctor_id', 'slot', 'patient_name'],
    },
};
