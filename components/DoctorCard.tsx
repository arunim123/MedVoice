
import React from 'react';
import { Star, Clock, MapPin, ChevronRight, Hourglass } from 'lucide-react';
import { Doctor } from '../types';

interface DoctorCardProps {
    doctor: Doctor;
    onSelect?: (doctor: Doctor) => void;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onSelect }) => {
    // Determine wait time color
    const getWaitColor = (minutes: number) => {
        if (minutes < 15) return 'text-green-600 bg-green-50 border-green-100';
        if (minutes < 45) return 'text-orange-600 bg-orange-50 border-orange-100';
        return 'text-red-600 bg-red-50 border-red-100';
    };

    return (
        <div 
            className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden flex flex-col w-64 flex-shrink-0 transition-all hover:scale-105 hover:shadow-xl cursor-pointer group"
            onClick={() => onSelect && onSelect(doctor)}
        >
            <div className="h-32 overflow-hidden relative">
                <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-full flex items-center text-xs font-bold text-yellow-600 shadow-sm">
                    <Star className="w-3 h-3 fill-current mr-1" />
                    {doctor.rating}
                </div>
            </div>
            <div className="p-4 flex-grow flex flex-col">
                <div className="flex justify-between items-start">
                    <h3 className="font-bold text-gray-900 truncate max-w-[140px]">{doctor.name}</h3>
                    <div className={`text-[10px] px-2 py-0.5 rounded-full border flex items-center font-bold whitespace-nowrap ${getWaitColor(doctor.waitTime)}`}>
                        <Hourglass className="w-3 h-3 mr-1" />
                        {doctor.waitTime}m wait
                    </div>
                </div>
                
                <p className="text-indigo-600 text-sm font-medium mb-1">{doctor.specialty}</p>
                <div className="flex items-center text-gray-500 text-xs mb-2">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span className="truncate">{doctor.hospital}</span>
                </div>
                <div className="flex items-center text-gray-500 text-xs mb-3">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>{doctor.experience} exp</span>
                </div>
                <div className="mt-auto flex items-center justify-between">
                    <span className="font-bold text-gray-900">₹{doctor.fee}</span>
                    <button className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full hover:bg-indigo-100 font-medium flex items-center transition-colors">
                        View Profile <ChevronRight className="w-3 h-3 ml-1" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DoctorCard;
