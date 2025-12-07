
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, MicOff, AlertTriangle, Bot, User, Phone, BrainCircuit, CreditCard, CalendarCheck, Activity, Download, FileText } from 'lucide-react';
import { LiveServerMessage } from '@google/genai';
import { connectToLiveSession, handleToolCall, UIAction } from '../services/geminiService';
import { decode, decodeAudioData, createPcmBlob } from '../utils/audioUtils';
import { TranscriptEntry, Author, Doctor, UserProfile } from '../types';
import DoctorCard from './DoctorCard';
import PaymentModal from './PaymentModal';
import AudioVisualizer from './AudioVisualizer';
import DoctorDetailsModal from './DoctorDetailsModal';
import SuggestionChips from './SuggestionChips';
import ReportUploader from './ReportUploader';

enum Status {
    IDLE = 'idle',
    LISTENING = 'listening',
    THINKING = 'thinking',
    SPEAKING = 'speaking',
    ERROR = 'error',
}

interface ChatScreenProps {
    onEmergency: () => void;
    user: UserProfile;
    voiceName: string;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ onEmergency, user, voiceName }) => {
    const [status, setStatus] = useState<Status>(Status.IDLE);
    const [transcripts, setTranscripts] = useState<TranscriptEntry[]>([]);
    const [isRecording, setIsRecording] = useState(false);
    const [pendingPayment, setPendingPayment] = useState<{ bookingId: string, amount: number, doctorName: string } | null>(null);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

    const sessionPromiseRef = useRef<Promise<any> | null>(null);
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const transcriptContainerRef = useRef<HTMLDivElement>(null);

    const currentInputTranscriptionRef = useRef<{ id: string | null, text: string }>({ id: null, text: '' });
    const currentOutputTranscriptionRef = useRef<{ id:string | null, text: string }>({ id: null, text: '' });
    const nextAudioStartTimeRef = useRef<number>(0);
    const audioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

    const updateTranscript = (id: string, newText: string, isFinal: boolean) => {
        setTranscripts(prev => {
            const existingIndex = prev.findIndex(t => t.id === id);
            if (existingIndex !== -1) {
                const updated = [...prev];
                updated[existingIndex] = { ...updated[existingIndex], text: newText, isFinal };
                return updated;
            }
            return prev;
        });
    };
    
    const addTranscript = useCallback((author: Author, text: string, isFinal = false, isEmergency = false, doctors?: Doctor[], paymentRequest?: any, bookingConfirmation?: any, isReportAnalysis?: boolean): string => {
        const id = Date.now().toString() + Math.random();
        setTranscripts(prev => [...prev, { author, text, isFinal, id, isEmergency, doctors, paymentRequest, bookingConfirmation, isReportAnalysis }]);
        return id;
    }, []);

    // Handles UI updates triggered by Tool Calls
    const handleUIAction = useCallback((action: UIAction) => {
        switch (action.type) {
            case 'SHOW_DOCTORS':
                addTranscript(Author.SYSTEM, "Here are the top recommended specialists for you:", true, false, action.doctors);
                break;
            case 'REQUEST_PAYMENT':
                setPendingPayment({
                    bookingId: action.bookingId,
                    amount: action.amount,
                    doctorName: action.doctorName
                });
                break;
            case 'CONFIRM_BOOKING':
                 addTranscript(Author.MEDVOICE, `Appointment confirmed! Booking ID: ${action.bookingId}`, true, false, undefined, undefined, {
                     bookingId: action.bookingId,
                     doctorName: action.doctorName,
                     slot: action.slot
                 });
                break;
        }
    }, [addTranscript]);

    const processMessage = useCallback(async (message: LiveServerMessage) => {
        if (message.serverContent?.outputTranscription) {
            const text = message.serverContent.outputTranscription.text;
             if (!currentOutputTranscriptionRef.current.id) {
                currentOutputTranscriptionRef.current.id = addTranscript(Author.MEDVOICE, '');
            }
            currentOutputTranscriptionRef.current.text += text;
            updateTranscript(currentOutputTranscriptionRef.current.id, currentOutputTranscriptionRef.current.text, false);
        }

        if (message.serverContent?.inputTranscription) {
            const text = message.serverContent.inputTranscription.text;
            if (!currentInputTranscriptionRef.current.id) {
                currentInputTranscriptionRef.current.id = addTranscript(Author.USER, '');
            }
            currentInputTranscriptionRef.current.text += text;
            updateTranscript(currentInputTranscriptionRef.current.id, currentInputTranscriptionRef.current.text, false);
        }
        
        const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
        if (base64Audio) {
            setStatus(Status.SPEAKING);
            const audioContext = outputAudioContextRef.current;
            if (audioContext) {
                nextAudioStartTimeRef.current = Math.max(nextAudioStartTimeRef.current, audioContext.currentTime);
                const audioBuffer = await decodeAudioData(decode(base64Audio), audioContext, 24000, 1);
                const source = audioContext.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(audioContext.destination);
                source.addEventListener('ended', () => {
                    audioSourcesRef.current.delete(source);
                    if (audioSourcesRef.current.size === 0) {
                        setStatus(Status.LISTENING);
                    }
                });
                source.start(nextAudioStartTimeRef.current);
                nextAudioStartTimeRef.current += audioBuffer.duration;
                audioSourcesRef.current.add(source);
            }
        }

        if (message.toolCall && sessionPromiseRef.current) {
            setStatus(Status.THINKING);
            const session = await sessionPromiseRef.current;
            for (const fc of message.toolCall.functionCalls) {
                await handleToolCall(session, fc, addTranscript, handleUIAction);
            }
        }
        
        if (message.serverContent?.turnComplete) {
            setTranscripts(prev => prev.map(t => {
                if (t.id === currentInputTranscriptionRef.current.id) {
                    return { ...t, text: currentInputTranscriptionRef.current.text, isFinal: true };
                }
                if (t.id === currentOutputTranscriptionRef.current.id) {
                    const isEmergency = currentOutputTranscriptionRef.current.text.toLowerCase().includes("emergency");
                    // Trigger emergency mode callback if detected
                    if (isEmergency) {
                         setTimeout(onEmergency, 1000); 
                    }
                    return { ...t, text: currentOutputTranscriptionRef.current.text, isFinal: true, isEmergency: t.isEmergency || isEmergency };
                }
                return t;
            }));

            currentInputTranscriptionRef.current = { id: null, text: '' };
            currentOutputTranscriptionRef.current = { id: null, text: '' };
        }

    }, [addTranscript, handleUIAction, onEmergency]);
    
    const stopConversation = useCallback(() => {
        setIsRecording(false);
        setStatus(Status.IDLE);
        sessionPromiseRef.current?.then(session => session.close());
        sessionPromiseRef.current = null;
        
        if(scriptProcessorRef.current && mediaStreamSourceRef.current) {
            mediaStreamSourceRef.current.disconnect(scriptProcessorRef.current);
            scriptProcessorRef.current.disconnect(inputAudioContextRef.current?.destination);
        }
        scriptProcessorRef.current = null;
        mediaStreamSourceRef.current = null;

        mediaStreamRef.current?.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;

        inputAudioContextRef.current?.close();
        outputAudioContextRef.current?.close();
        inputAudioContextRef.current = null;
        outputAudioContextRef.current = null;

        audioSourcesRef.current.forEach(source => source.stop());
        audioSourcesRef.current.clear();
        nextAudioStartTimeRef.current = 0;
    }, []);

    const startConversation = useCallback(async () => {
        if (isRecording) {
            stopConversation();
            return;
        }

        try {
            setIsRecording(true);
            setTranscripts([]);
            addTranscript(Author.SYSTEM, `Connecting to MedVoice (${voiceName} Model)...`);

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;

            inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            
            sessionPromiseRef.current = connectToLiveSession({
                onopen: () => {
                    setStatus(Status.LISTENING);
                    setTranscripts(prev => prev.filter(t => t.author !== Author.SYSTEM));
                    addTranscript(Author.MEDVOICE, `Hello ${user.name.split(' ')[0]}. I'm MedVoice, your medical assistant. How are you feeling today?`, true);
                    const source = inputAudioContextRef.current.createMediaStreamSource(stream);
                    mediaStreamSourceRef.current = source;
                    const scriptProcessor = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
                    scriptProcessorRef.current = scriptProcessor;

                    scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                        const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                        const pcmBlob = createPcmBlob(inputData);
                        if(sessionPromiseRef.current) {
                            sessionPromiseRef.current.then((session) => {
                                session.sendRealtimeInput({ media: pcmBlob });
                            });
                        }
                    };
                    source.connect(scriptProcessor);
                    scriptProcessor.connect(inputAudioContextRef.current.destination);
                },
                onmessage: processMessage,
                onerror: (e: ErrorEvent) => {
                    console.error('Session error:', e);
                    let message = e.message || 'A network error occurred.';
                    if (message.toLowerCase().startsWith('error: ')) {
                        message = message.substring(7);
                    }
                    addTranscript(Author.SYSTEM, `Connection error: ${message}`, true);
                    setStatus(Status.ERROR);
                    stopConversation();
                },
                onclose: () => {
                   console.log('Session closed');
                   stopConversation();
                },
            }, voiceName);
            await sessionPromiseRef.current;
        } catch (error) {
            console.error('Failed to start conversation:', error);
            addTranscript(Author.SYSTEM, `Error: Could not start session. Please check microphone permissions.`, true);
            setStatus(Status.ERROR);
            setIsRecording(false);
        }
    }, [isRecording, addTranscript, processMessage, stopConversation, voiceName, user.name]);

    const handlePaymentSuccess = () => {
        setPendingPayment(null);
        addTranscript(Author.SYSTEM, "Payment processed successfully. Finalizing booking...", true);
        
        if (sessionPromiseRef.current) {
            sessionPromiseRef.current.then(session => {
                session.sendClientContent({
                    turns: [{
                        role: "user",
                        parts: [{ text: "System Notification: Payment processed successfully for the booking. Please confirm the booking details to the user." }]
                    }],
                    turnComplete: true
                });
            });
        }
    };

    const handleChipSelect = (text: string) => {
        // Mocking user input without voice for the chip selection
        addTranscript(Author.USER, text, true);
        if (sessionPromiseRef.current) {
             sessionPromiseRef.current.then(session => {
                session.sendClientContent({
                    turns: [{
                        role: "user",
                        parts: [{ text: text }]
                    }],
                    turnComplete: true
                });
            });
        }
    };

    const handleReportUpload = (fileName: string) => {
        const analysisText = `System: The user uploaded a file named "${fileName}". It contains a blood test report showing slightly elevated cholesterol (240 mg/dL) and Vitamin D deficiency (15 ng/mL). Please analyze this and advise.`;
        
        addTranscript(Author.USER, `Uploaded: ${fileName}`, true);
        addTranscript(Author.SYSTEM, `Analyzing ${fileName}...`, true, false, undefined, undefined, undefined, true);
        
        // Short delay to simulate reading
        setTimeout(() => {
             if (sessionPromiseRef.current) {
                sessionPromiseRef.current.then(session => {
                    session.sendClientContent({
                        turns: [{
                            role: "user",
                            parts: [{ text: analysisText }]
                        }],
                        turnComplete: true
                    });
                });
            }
        }, 1000);
    };

    const handleDownloadSummary = () => {
        const content = transcripts.map(t => `${t.author.toUpperCase()}: ${t.text}`).join('\n\n');
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `MedVoice-Consultation-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    useEffect(() => {
        transcriptContainerRef.current?.scrollTo(0, transcriptContainerRef.current.scrollHeight);
    }, [transcripts]);

    useEffect(() => {
        return () => {
            stopConversation();
        };
    }, []);

    const handleDoctorSelect = (doctor: Doctor) => {
        setSelectedDoctor(doctor);
    };

    const handleCloseDoctorModal = () => {
        setSelectedDoctor(null);
    };

    const renderTranscriptEntry = (entry: TranscriptEntry) => {
        const icon = entry.author === Author.USER ? <User className="h-6 w-6 text-white bg-indigo-500 rounded-full p-1"/> : <Bot className="h-6 w-6 text-white bg-green-500 rounded-full p-1"/>;
        const alignment = entry.author === Author.USER ? 'justify-end' : 'justify-start';
        const bubbleColor = entry.author === Author.USER ? 'bg-indigo-500 text-white' : 'bg-white border border-gray-200 text-gray-800 shadow-sm';

        if(entry.author === Author.SYSTEM){
            return (
                <div key={entry.id} className="flex flex-col items-center my-4 space-y-2">
                    <p className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{entry.text}</p>
                    {entry.isReportAnalysis && (
                         <div className="w-full max-w-sm bg-blue-50 border border-blue-100 p-3 rounded-lg flex items-center gap-3">
                             <FileText className="text-blue-500 h-8 w-8" />
                             <div className="flex-1">
                                 <p className="text-sm font-bold text-blue-900">Analysis Complete</p>
                                 <p className="text-xs text-blue-700">Findings shared with AI assistant.</p>
                             </div>
                         </div>
                    )}
                    {entry.doctors && (
                        <div className="flex gap-4 overflow-x-auto w-full p-2 pb-4 scrollbar-hide">
                            {entry.doctors.map(doc => (
                                <DoctorCard key={doc.id} doctor={doc} onSelect={handleDoctorSelect} />
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        if(entry.isEmergency) {
             return (
                <div key={entry.id} className="my-4 mx-auto max-w-lg bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm animate-pulse">
                  <div className="flex items-start">
                    <div className="p-2 bg-red-100 rounded-full mr-3"><AlertTriangle className="h-6 w-6 text-red-600" /></div>
                    <div>
                      <h4 className="font-bold text-red-700">Medical Warning Detected</h4>
                      <p className="text-sm text-red-600 mt-1">{entry.text}</p>
                      <button 
                        onClick={onEmergency}
                        className="mt-3 bg-red-600 text-white text-sm font-bold py-2 px-4 rounded-lg flex items-center hover:bg-red-700 shadow-sm"
                      >
                        <Phone className="w-4 h-4 mr-2" /> Activate Emergency Mode
                      </button>
                    </div>
                  </div>
                </div>
             );
        }

        return (
            <div key={entry.id} className={`flex items-start gap-3 my-4 ${alignment}`}>
                {entry.author === Author.MEDVOICE && icon}
                <div className={`max-w-[85%] md:max-w-md`}>
                    <div className={`p-4 rounded-2xl ${bubbleColor} ${entry.author === Author.MEDVOICE ? 'rounded-tl-none' : 'rounded-tr-none'}`}>
                        <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{entry.text}</p>
                    </div>
                    {/* Booking Confirmation Ticket */}
                    {entry.bookingConfirmation && (
                        <div className="mt-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-xl p-4 flex items-center justify-between shadow-sm">
                            <div className="flex items-center space-x-3">
                                <div className="bg-green-100 p-2 rounded-full">
                                    <CalendarCheck className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-green-600 font-bold uppercase tracking-wider">Confirmed</p>
                                    <p className="font-bold text-gray-900">{entry.bookingConfirmation.doctorName}</p>
                                    <p className="text-xs text-gray-500">{new Date(entry.bookingConfirmation.slot).toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-400">ID</p>
                                <p className="font-mono font-bold text-gray-600">{entry.bookingConfirmation.bookingId}</p>
                            </div>
                        </div>
                    )}
                </div>
                {entry.author === Author.USER && icon}
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col h-full bg-gray-50/50">
                 {/* Top utility bar */}
                <div className="bg-white px-4 py-2 border-b flex justify-between items-center text-xs text-gray-500">
                     <span className="flex items-center"><BrainCircuit className="w-3 h-3 mr-1 text-indigo-400" /> Model: Gemini 2.5 Flash</span>
                     {transcripts.length > 0 && (
                         <button onClick={handleDownloadSummary} className="flex items-center hover:text-indigo-600 transition-colors">
                             <Download className="w-3 h-3 mr-1" /> Save Summary
                         </button>
                     )}
                </div>

                <div ref={transcriptContainerRef} className="flex-grow p-4 md:p-6 overflow-y-auto space-y-2">
                    {transcripts.map(renderTranscriptEntry)}
                </div>
                
                <div className="bg-white border-t p-4 shadow-lg z-10 relative">
                    <div className="max-w-3xl mx-auto w-full">
                        
                        {!isRecording && transcripts.length === 0 && (
                            <SuggestionChips onSelect={handleChipSelect} />
                        )}

                        <div className="flex items-center gap-4">
                            {/* Visualizer / Status Indicator */}
                            <div className="flex-grow bg-gray-50 rounded-2xl border border-gray-200 h-20 flex items-center px-4 relative overflow-hidden">
                                {isRecording ? (
                                    <AudioVisualizer mediaStream={mediaStreamRef.current} isListening={status === Status.LISTENING || status === Status.SPEAKING} />
                                ) : (
                                    <div className="w-full flex items-center justify-center text-gray-400 text-sm">
                                        <Activity className="w-4 h-4 mr-2" /> Ready to start...
                                    </div>
                                )}

                                {/* Status Overlay */}
                                <div className="absolute top-2 right-2 flex items-center gap-2">
                                     <ReportUploader onUpload={handleReportUpload} />
                                    {status !== Status.IDLE && (
                                        <div className={`px-2 py-0.5 text-[10px] font-bold rounded-full flex items-center uppercase tracking-wide shadow-sm ${
                                            status === Status.LISTENING ? 'bg-indigo-100 text-indigo-700' :
                                            status === Status.SPEAKING ? 'bg-green-100 text-green-700' :
                                            'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {status === Status.LISTENING && "Listening"}
                                            {status === Status.SPEAKING && "Speaking"}
                                            {status === Status.THINKING && "Thinking"}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Main Interaction Button */}
                            <button
                                onClick={startConversation}
                                className={`h-20 w-20 flex-shrink-0 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 transform hover:scale-105 ${
                                    isRecording 
                                    ? 'bg-gradient-to-br from-red-500 to-pink-600 shadow-red-200 animate-pulse' 
                                    : 'bg-gradient-to-br from-indigo-600 to-violet-600 shadow-indigo-200'
                                }`}
                            >
                                {isRecording ? (
                                    <MicOff className="w-8 h-8 text-white" />
                                ) : (
                                    <Mic className="w-8 h-8 text-white" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            {pendingPayment && (
                <PaymentModal 
                    bookingId={pendingPayment.bookingId} 
                    amount={pendingPayment.amount} 
                    doctorName={pendingPayment.doctorName}
                    onSuccess={handlePaymentSuccess}
                    onCancel={() => setPendingPayment(null)}
                    insurance={user.insurance}
                />
            )}

            {selectedDoctor && (
                <DoctorDetailsModal 
                    doctor={selectedDoctor} 
                    onClose={handleCloseDoctorModal} 
                    onBook={() => {
                        handleCloseDoctorModal();
                        handleChipSelect(`Book an appointment with ${selectedDoctor.name}`);
                    }}
                />
            )}
        </>
    );
};

export default ChatScreen;
