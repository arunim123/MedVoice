
import React from 'react';
import { ShieldCheck, Mic, FileText } from 'lucide-react';

interface ConsentScreenProps {
  onConsent: () => void;
}

const ConsentScreen: React.FC<ConsentScreenProps> = ({ onConsent }) => {
  return (
    <div className="flex-grow flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-lg w-full text-center border border-gray-200">
        <ShieldCheck className="mx-auto h-16 w-16 text-indigo-500" />
        <h2 className="mt-6 text-2xl font-bold text-gray-900">Welcome to MedVoice</h2>
        <p className="mt-2 text-sm text-gray-600">
          Your AI-powered virtual health assistant.
        </p>
        <div className="mt-6 text-left space-y-4">
          <p className="text-gray-700 font-medium">Before we start, please review and consent:</p>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Mic className="h-5 w-5 text-indigo-500 mt-1 flex-shrink-0" />
              <p className="text-sm text-gray-600">
                This session requires microphone access to capture your voice for our conversation.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <FileText className="h-5 w-5 text-indigo-500 mt-1 flex-shrink-0" />
              <p className="text-sm text-gray-600">
                Your conversation will be processed by Google's Gemini API to provide assistance. Your privacy is important to us.
              </p>
            </div>
             <div className="flex items-start space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <ShieldCheck className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
              <p className="text-sm text-red-700">
                <strong>This is not a replacement for professional medical advice.</strong> In an emergency, please call your local emergency services immediately.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <button
            onClick={onConsent}
            className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300"
          >
            Agree and Start Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsentScreen;
