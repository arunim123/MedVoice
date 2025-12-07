
// Fix: Removed non-exported type 'LiveSession'.
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { SYSTEM_PROMPT, SYMPTOM_ANALYZER_TOOL, DOCTOR_DB_SEARCH_TOOL, BOOK_APPOINTMENT_TOOL } from '../constants';
import { searchDoctors, getDoctorById } from './mockData';
import { Doctor } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface SessionCallbacks {
    onmessage: (message: LiveServerMessage) => void;
    onerror: (e: ErrorEvent) => void;
    onclose: (e: CloseEvent) => void;
    onopen: () => void;
}

// Fix: Replaced 'LiveSession' with 'any' since it's not an exported type.
export function connectToLiveSession(callbacks: SessionCallbacks, voiceName: string = 'Zephyr'): Promise<any> {
    return ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: callbacks,
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: voiceName } },
            },
            systemInstruction: SYSTEM_PROMPT,
            inputAudioTranscription: {},
            outputAudioTranscription: {},
            tools: [{ functionDeclarations: [SYMPTOM_ANALYZER_TOOL, DOCTOR_DB_SEARCH_TOOL, BOOK_APPOINTMENT_TOOL] }],
        },
    });
}

// UI Action Types
export type UIAction = 
    | { type: 'SHOW_DOCTORS', doctors: Doctor[] }
    | { type: 'REQUEST_PAYMENT', bookingId: string, amount: number, doctorName: string }
    | { type: 'CONFIRM_BOOKING', bookingId: string, doctorName: string, slot: string };

// Fix: Replaced 'LiveSession' with 'any' since it's not an exported type.
export async function handleToolCall(
    session: any, 
    functionCall: any, 
    addTranscript: (author: any, text: string, isFinal?: boolean) => string,
    onUIAction: (action: UIAction) => void
) {
    const { name, args, id } = functionCall;
    
    // Simulate API call delay for realism
    await new Promise(resolve => setTimeout(resolve, 800));

    let result;
    switch (name) {
        case 'SYMPTOM_ANALYZER':
            addTranscript('system', `Analysing symptoms: ${args.symptoms.join(', ')} (Severity: ${args.severity})`, true);
            result = { status: "logged", advice: "Proceeding to doctor search based on analysis." };
            break;

        case 'DOCTOR_DB_SEARCH':
            const doctors = searchDoctors(args.specialties);
            if (doctors.length > 0) {
                onUIAction({ type: 'SHOW_DOCTORS', doctors });
                result = { 
                    found: true, 
                    count: doctors.length, 
                    doctors: doctors.map(d => ({ id: d.id, name: d.name, specialty: d.specialty, fee: d.fee, next_slot: d.available_slots[0] })) 
                };
            } else {
                result = { found: false, message: "No doctors found for this specialty." };
            }
            break;

        case 'BOOK_APPOINTMENT':
            const doctor = getDoctorById(args.doctor_id);
            if (doctor) {
                const bookingId = `BK-${Math.floor(Math.random() * 100000)}`;
                // Trigger Payment UI
                onUIAction({ 
                    type: 'REQUEST_PAYMENT', 
                    bookingId, 
                    amount: doctor.fee, 
                    doctorName: doctor.name 
                });
                
                result = { 
                    status: "PENDING_PAYMENT", 
                    booking_id: bookingId, 
                    message: "Slot reserved. Waiting for payment confirmation from user." 
                };
            } else {
                result = { error: "Doctor not found" };
            }
            break;

        default:
            result = { error: 'Unknown function' };
    }

    session.sendToolResponse({
        functionResponses: {
            id,
            name,
            response: { result },
        }
    });
}
