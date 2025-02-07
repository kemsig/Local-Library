// FullScreenPDFViewer.tsx
import React from 'react';
import { X } from 'lucide-react';

const flaskServer = import.meta.env.VITE_FLASK_SERVER_IP || 'http://localhost';
const flaskPORT = import.meta.env.VITE_FLASK_PORT || 5000;

const FullScreenPDFViewer = ({ pdfName, onClose }: { pdfName: string; onClose: () => void }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col z-50">
      <div className="flex items-center justify-between p-4 bg-gray-800">
        <h2 className="text-xl font-semibold text-white truncate max-w-[80%]">
          {pdfName}
        </h2>
        <button
          onClick={onClose}
          className="p-2 text-gray-300 hover:text-white rounded-full hover:bg-gray-700 transition-colors"
          aria-label="Close PDF viewer"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
      
      <div className="flex-1 bg-gray-900">
        <embed
          src={`${flaskServer}:${flaskPORT}/api/pdfs/${pdfName}`}
          type="application/pdf"
          className="w-full h-full"
        />
      </div>
    </div>
  );
};

export default FullScreenPDFViewer;