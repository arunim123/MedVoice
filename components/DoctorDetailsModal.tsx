
import React from 'react';
import { X, Star, MapPin, Clock, GraduationCap, Globe, MessageSquare } from 'lucide-react';
import { Doctor } from '../types';

interface DoctorDetailsModalProps {
    doctor: Doctor;
    onClose: () => void;
    onBook: (doctor: Doctor) => void;
}

const DoctorDetailsModal: React.FC<DoctorDetailsModalProps> = ({ doctor, onClose, onBook }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
                <div className="relative h-48 flex-shrink-0">
                    <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                        <div>
                            <h2 className="text-3xl font-bold text-white shadow-sm">{doctor.name}</h2>
                            <p className="text-indigo-200 font-medium text-lg">{doctor.specialty}</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-md transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
                
                <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                         <div className="flex items-center space-x-4">
                            <div className="flex items-center text-yellow-500 font-bold bg-yellow-50 px-3 py-1 rounded-full">
                                <Star className="w-4 h-4 mr-1 fill-current" />
                                {doctor.rating}
                            </div>
                            <div className="flex items-center text-gray-600 bg-gray-100 px-3 py-1 rounded-full text-sm">
                                <Clock className="w-4 h-4 mr-1" />
                                {doctor.experience} Exp.
                            </div>
                         </div>
                         <div className="text-right">
                             <p className="text-sm text-gray-500">Consultation Fee</p>
                             <p className="text-2xl font-bold text-indigo-600">₹{doctor.fee}</p>
                         </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">About</h3>
                        <p className="text-gray-600 leading-relaxed">{doctor.bio}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-xl">
                            <h4 className="font-semibold text-gray-900 flex items-center mb-3">
                                <GraduationCap className="w-4 h-4 mr-2 text-indigo-500" /> Education
                            </h4>
                            <ul className="space-y-2">
                                {doctor.education.map((edu, idx) => (
                                    <li key={idx} className="text-sm text-gray-600 pl-2 border-l-2 border-indigo-200">{edu}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl">
                            <h4 className="font-semibold text-gray-900 flex items-center mb-3">
                                <Globe className="w-4 h-4 mr-2 text-indigo-500" /> Languages
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {doctor.languages.map((lang, idx) => (
                                    <span key={idx} className="bg-white border border-gray-200 text-gray-600 px-3 py-1 rounded-lg text-sm">
                                        {lang}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div>
                         <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                            <MessageSquare className="w-5 h-5 mr-2 text-indigo-500" /> Patient Reviews
                         </h3>
                         <div className="space-y-3">
                            {doctor.reviews.map((review) => (
                                <div key={review.id} className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-bold text-gray-900">{review.author}</span>
                                        <span className="text-xs text-gray-400">{review.date}</span>
                                    </div>
                                    <div className="flex mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-200'}`} />
                                        ))}
                                    </div>
                                    <p className="text-sm text-gray-600 italic">"{review.text}"</p>
                                </div>
                            ))}
                         </div>
                    </div>

                    <div className="sticky bottom-0 bg-white pt-4 border-t mt-4">
                         <button 
                            onClick={() => onBook(doctor)}
                            className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center"
                        >
                            Select Dr. {doctor.name.split(" ")[1]} for Booking
                         </button>
                         <p className="text-center text-xs text-gray-400 mt-2">
                             Tell MedVoice to "Book an appointment with {doctor.name}"
                         </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorDetailsModal;
