
import React, { useState } from 'react';
import ConsentScreen from './components/ConsentScreen';
import ChatScreen from './components/ChatScreen';
import LoginScreen from './components/LoginScreen';
import Sidebar from './components/Sidebar';
import { Bot, LogOut, User as UserIcon, Menu, Phone } from 'lucide-react';
import { UserProfile } from './types';
import { MOCK_APPOINTMENTS } from './services/mockData';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [hasConsented, setHasConsented] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [voiceName, setVoiceName] = useState<string>('Zephyr');

  const handleConsent = () => {
    setHasConsented(true);
  };

  const handleLogin = (loggedInUser: UserProfile) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
    setHasConsented(false);
    setIsSidebarOpen(false);
    setIsEmergencyMode(false);
  };

  const triggerEmergency = () => {
    setIsEmergencyMode(true);
  };

  const clearEmergency = () => {
    setIsEmergencyMode(false);
  };

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className={`h-screen font-sans flex flex-col overflow-hidden transition-colors duration-500 ${isEmergencyMode ? 'bg-red-50' : 'bg-gray-50'}`}>
      
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        user={user}
        appointments={MOCK_APPOINTMENTS}
        onLogout={handleLogout}
        currentVoice={voiceName}
        onVoiceChange={setVoiceName}
      />

      <header className={`shadow-sm sticky top-0 z-20 border-b transition-colors duration-500 ${isEmergencyMode ? 'bg-red-600 border-red-700' : 'bg-white border-gray-100'}`}>
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
             <button onClick={() => setIsSidebarOpen(true)} className={`p-2 rounded-lg transition-colors ${isEmergencyMode ? 'text-white hover:bg-red-700' : 'text-gray-600 hover:bg-gray-100'}`}>
                <Menu size={24} />
             </button>
            <div className={`p-2 rounded-xl text-white shadow-md ${isEmergencyMode ? 'bg-white text-red-600' : 'bg-gradient-to-br from-indigo-600 to-violet-600'}`}>
               <Bot size={24} className={isEmergencyMode ? 'text-red-600' : 'text-white'} />
            </div>
            <div>
                <h1 className={`text-xl font-bold tracking-tight ${isEmergencyMode ? 'text-white' : 'text-gray-900'}`}>
                  {isEmergencyMode ? 'EMERGENCY MODE' : 'MedVoice'}
                </h1>
                {!isEmergencyMode && <p className="text-xs text-indigo-600 font-medium">AI Healthcare Assistant</p>}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {!isEmergencyMode && (
              <button 
                onClick={triggerEmergency}
                className="hidden md:flex bg-red-100 text-red-600 border border-red-200 px-4 py-1.5 rounded-full text-sm font-bold items-center hover:bg-red-600 hover:text-white transition-all animate-pulse"
              >
                <Phone size={16} className="mr-2" /> SOS
              </button>
            )}
            
            <div className={`hidden md:flex items-center text-sm font-medium px-3 py-1.5 rounded-full border ${isEmergencyMode ? 'bg-red-700 border-red-600 text-white' : 'text-gray-600 bg-gray-50 border-gray-200'}`}>
                <UserIcon size={16} className={`mr-2 ${isEmergencyMode ? 'text-white' : 'text-indigo-500'}`} />
                {user.name}
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-grow flex flex-col h-[calc(100vh-64px)] relative">
        {isEmergencyMode ? (
           <div className="flex-grow flex flex-col items-center justify-center p-8 text-center bg-red-50 animate-in fade-in zoom-in duration-300">
              <div className="bg-white p-8 rounded-3xl shadow-2xl border-2 border-red-100 max-w-lg w-full">
                 <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <Phone className="w-12 h-12 text-red-600" />
                 </div>
                 <h2 className="text-3xl font-bold text-gray-900 mb-2">Emergency Detected</h2>
                 <p className="text-gray-600 mb-8">Medical AI has been paused. Please contact emergency services immediately.</p>
                 
                 <div className="space-y-4">
                    <a href="tel:112" className="block w-full bg-red-600 text-white font-bold text-xl py-4 rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-200">
                       Call 112 (General)
                    </a>
                    <a href="tel:102" className="block w-full bg-white text-red-600 border-2 border-red-100 font-bold text-xl py-4 rounded-xl hover:bg-red-50 transition-colors">
                       Call 102 (Ambulance)
                    </a>
                 </div>

                 <button onClick={clearEmergency} className="mt-8 text-sm text-gray-400 hover:text-gray-600 underline">
                    False Alarm? Return to Chat
                 </button>
              </div>
           </div>
        ) : (
          hasConsented ? (
            <ChatScreen 
              onEmergency={triggerEmergency} 
              user={user} 
              voiceName={voiceName}
            />
          ) : (
            <ConsentScreen onConsent={handleConsent} />
          )
        )}
      </main>
    </div>
  );
};

export default App;
