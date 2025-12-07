
import React, { useRef, useState } from 'react';
import { Paperclip, Loader2, FileText, CheckCircle } from 'lucide-react';

interface ReportUploaderProps {
  onUpload: (fileName: string) => void;
}

const ReportUploader: React.FC<ReportUploaderProps> = ({ onUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    // Simulate upload delay and analysis
    setTimeout(() => {
      setIsUploading(false);
      onUpload(file.name);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }, 1500);
  };

  return (
    <>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept=".pdf,.jpg,.png" 
      />
      <button 
        onClick={handleClick}
        disabled={isUploading}
        className="p-3 bg-white border border-gray-200 rounded-full text-gray-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 shadow-sm transition-all relative group"
        title="Upload Medical Report"
      >
        {isUploading ? (
          <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
        ) : (
          <Paperclip className="w-5 h-5" />
        )}
        
        {/* Tooltip */}
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          Attach Report
        </div>
      </button>
    </>
  );
};

export default ReportUploader;
