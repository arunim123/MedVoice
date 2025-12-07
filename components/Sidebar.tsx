
import React, { useState } from 'react';
import { Calendar, Clock, Settings, User, X, LogOut, Video, MapPin, Activity, Pill, ShieldCheck, Volume2, Save, Ruler, Weight, Droplet, AlertCircle } from 'lucide-react';
import { UserProfile, Appointment } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  appointments: Appointment[];
  onLogout: () => void;
  currentVoice: string;
  onVoiceChange: (voice: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, user, appointments, onLogout, currentVoice, onVoiceChange }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'settings'>('overview');
  const [meds, setMeds] = useState(user.medications || []);
  
  // Local state for profile form
  const [profileData, setProfileData] = useState({
      age: user.age,
      weight: 75,
      height: 180,
      bloodGroup: 'O+',
      allergies: 'Penicillin, Peanuts'
  });

  const toggleMed = (id: string) => {
    setMeds(prev => prev.map(m => m.id === id ? { ...m, taken: !m.taken } : m));
  };

  const handleProfileChange = (field: string, value: string | number) => {
      setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const VitalsChart = ({ data }: { data: number[] }) => {
    const max = Math.max(...data, 100);
    const min = Math.min(...data, 60);
    const range = max - min;
    const height = 40;
    const width = 200;
    
    const points = data.map((val, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * height;
      return `${x},${y}`;
    }).join(' ');

    return (
      <div className="w-full mt-2">
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
          <polyline
            points={points}
            fill="none"
            stroke="#6366f1"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {data.map((val, i) => (
             <circle key={i} cx={(i / (data.length - 1)) * width} cy={height - ((val - min) / range) * height} r="3" className="fill-indigo-600" />
          ))}
        </svg>
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
             {user.vitals.labels.map((l, i) => <span key={i}>{l}</span>)}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar Panel */}
      <div className={`fixed inset-y-0 left-0 z-40 w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-xl font-bold border border-white/30">
                {user.name.charAt(0)}
              </div>
              {/* REMOVED md:hidden to allow closing on desktop */}
              <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-indigo-200 text-sm">{user.email}</p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-gray-100">
             <button onClick={() => setActiveTab('overview')} className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'overview' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}>Overview</button>
             <button onClick={() => setActiveTab('appointments')} className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'appointments' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}>Visits</button>
             <button onClick={() => setActiveTab('settings')} className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'settings' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}>Settings</button>
          </div>

          <div className="flex-grow overflow-y-auto p-6">
            
            {activeTab === 'overview' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                     {/* Vitals Widget */}
                    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                             <h3 className="font-bold text-gray-700 flex items-center"><Activity className="w-4 h-4 mr-2 text-red-500" /> Heart Rate</h3>
                             <span className="text-xs font-bold bg-red-50 text-red-600 px-2 py-0.5 rounded-full">{user.vitals.bpm[user.vitals.bpm.length-1]} bpm</span>
                        </div>
                        <VitalsChart data={user.vitals.bpm} />
                    </div>

                    {/* Medications Widget */}
                    <div>
                         <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Active Medications</h3>
                         <div className="space-y-3">
                             {meds.map(med => (
                                 <div key={med.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100">
                                     <div className="flex items-center">
                                         <div className={`p-2 rounded-full mr-3 ${med.taken ? 'bg-green-100 text-green-600' : 'bg-indigo-100 text-indigo-600'}`}>
                                             <Pill className="w-4 h-4" />
                                         </div>
                                         <div>
                                             <p className={`text-sm font-bold ${med.taken ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{med.name}</p>
                                             <p className="text-xs text-gray-500">{med.dosage} • {med.frequency}</p>
                                         </div>
                                     </div>
                                     <input 
                                        type="checkbox" 
                                        checked={med.taken} 
                                        onChange={() => toggleMed(med.id)}
                                        className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300"
                                     />
                                 </div>
                             ))}
                         </div>
                    </div>

                    {/* Insurance Card */}
                    <div className="bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl p-4 text-white shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10"><ShieldCheck size={80} /></div>
                        <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">Insurance Card</p>
                        <h3 className="text-lg font-bold mb-1">{user.insurance.provider}</h3>
                        <p className="font-mono text-sm opacity-80 mb-4">{user.insurance.policyNumber}</p>
                        <div className="flex justify-between items-end">
                             <div>
                                 <p className="text-[10px] text-gray-400">Valid Thru</p>
                                 <p className="text-xs font-bold">{user.insurance.validTill}</p>
                             </div>
                             <div className="text-right">
                                 <p className="text-[10px] text-gray-400">Coverage</p>
                                 <p className="text-lg font-bold">{(user.insurance.coverage * 100).toFixed(0)}%</p>
                             </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'appointments' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                {appointments.map((apt) => (
                    <div key={apt.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-indigo-200 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        apt.status === 'upcoming' ? 'bg-indigo-100 text-indigo-700' :
                        apt.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                        {apt.status}
                        </span>
                        <span className="text-xs text-gray-500 font-medium">
                        {new Date(apt.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                    </div>
                    <h4 className="font-bold text-gray-900">{apt.doctorName}</h4>
                    <p className="text-xs text-indigo-600 font-medium mb-2">{apt.specialty}</p>
                    
                    <div className="flex items-center text-xs text-gray-500 space-x-3 pt-2 border-t border-gray-200">
                        <span className="flex items-center">
                        <Clock size={12} className="mr-1" />
                        {new Date(apt.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="flex items-center">
                        {apt.type === 'Video' ? <Video size={12} className="mr-1" /> : <MapPin size={12} className="mr-1" />}
                        {apt.type}
                        </span>
                    </div>
                    </div>
                ))}
                
                {appointments.length === 0 && (
                    <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-100 rounded-xl">
                    No appointment history
                    </div>
                )}
                </div>
            )}

            {activeTab === 'settings' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">AI Personality Voice</h3>
                        <div className="space-y-2">
                            {['Zephyr', 'Puck', 'Charon', 'Kore', 'Fenrir'].map(voice => (
                                <button
                                    key={voice}
                                    onClick={() => onVoiceChange(voice)}
                                    className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                                        currentVoice === voice 
                                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700 ring-1 ring-indigo-200' 
                                        : 'bg-white border-gray-100 text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <div className="flex items-center">
                                        <div className={`p-2 rounded-full mr-3 ${currentVoice === voice ? 'bg-indigo-100' : 'bg-gray-100'}`}>
                                            <Volume2 size={16} />
                                        </div>
                                        <span className="font-medium">{voice}</span>
                                    </div>
                                    {currentVoice === voice && <div className="w-2 h-2 rounded-full bg-indigo-500"></div>}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Health Profile</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-medium text-gray-500 mb-1 flex items-center"><User size={10} className="mr-1"/> Age</label>
                                    <input 
                                        type="number" 
                                        value={profileData.age}
                                        onChange={(e) => handleProfileChange('age', e.target.value)}
                                        className="w-full text-sm border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none" 
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-500 mb-1 flex items-center"><Droplet size={10} className="mr-1"/> Blood Type</label>
                                    <select 
                                        value={profileData.bloodGroup}
                                        onChange={(e) => handleProfileChange('bloodGroup', e.target.value)}
                                        className="w-full text-sm border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                                    >
                                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                                            <option key={bg} value={bg}>{bg}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                             <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-medium text-gray-500 mb-1 flex items-center"><Ruler size={10} className="mr-1"/> Height (cm)</label>
                                    <input 
                                        type="number" 
                                        value={profileData.height}
                                        onChange={(e) => handleProfileChange('height', e.target.value)}
                                        className="w-full text-sm border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none" 
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-500 mb-1 flex items-center"><Weight size={10} className="mr-1"/> Weight (kg)</label>
                                    <input 
                                        type="number" 
                                        value={profileData.weight}
                                        onChange={(e) => handleProfileChange('weight', e.target.value)}
                                        className="w-full text-sm border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none" 
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500 mb-1 flex items-center"><AlertCircle size={10} className="mr-1"/> Allergies</label>
                                <textarea 
                                    value={profileData.allergies}
                                    onChange={(e) => handleProfileChange('allergies', e.target.value)}
                                    rows={2}
                                    className="w-full text-sm border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                                />
                            </div>

                            <button className="w-full bg-indigo-600 text-white text-sm font-bold py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center">
                                <Save size={14} className="mr-2" /> Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-gray-100 bg-gray-50">
            <button 
              onClick={onLogout}
              className="flex items-center w-full p-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all"
            >
              <LogOut size={18} className="mr-3" /> Sign Out
            </button>
            <div className="mt-2 text-[10px] text-gray-400 text-center">
                 © Arunim, Atharav, Jervin
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
