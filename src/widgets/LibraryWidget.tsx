// PDFLibrary.tsx
import React, { useState, useEffect } from 'react';
import { BookOpen, X, Search } from 'lucide-react';
import FullScreenPDFViewer from './FullScreenPDFViewer';

const flaskServer = import.meta.env.VITE_FLASK_SERVER_IP || 'http://localhost';
const flaskPORT = import.meta.env.VITE_FLASK_PORT || 5000;

const PDFLibrary = ({ onLogout }: { onLogout: () => void }) => {
  const [pdfs, setPdfs] = useState<string[]>([]);
  const [selectedPDF, setSelectedPDF] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [thumbnails, setThumbnails] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchPdfs = async () => {
      try {
        const response = await fetch(`${flaskServer}:${flaskPORT}/api/pdfs`);
        const data = await response.json();
        setPdfs(data);
      } catch (error) {
        console.error('Error fetching PDFs:', error);
      }
    };
    fetchPdfs();
  }, []);

  useEffect(() => {
    const fetchThumbnails = async () => {
      const fetchedThumbnails: { [key: string]: string } = {};
      for (const pdf of pdfs) {
        try {
          const response = await fetch(`${flaskServer}:${flaskPORT}/api/pdfs/thumbnails/${pdf}`, {
            method: 'GET',
            credentials: 'include',
          });
          if (response.ok) {
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            fetchedThumbnails[pdf] = url;
          }
        } catch (error) {
          console.error('Error fetching thumbnail:', error);
        }
      }
      setThumbnails(fetchedThumbnails);
    };
    if (pdfs.length > 0) fetchThumbnails();
  }, [pdfs]);

  const filteredPDFs = pdfs.filter((pdf) =>
    pdf.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <div className="flex items-center space-x-3">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Local Library</h1>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:space-x-4">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search PDFs..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                onClick={onLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 sm:w-auto w-full"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPDFs.map((pdf) => (
            <div
              key={pdf}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              onClick={() => setSelectedPDF(pdf)}
            >
              <div className="aspect-[3/4] relative">
                {thumbnails[pdf] ? (
                  <img
                    src={thumbnails[pdf]}
                    alt={pdf}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">Loading...</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white text-lg font-medium">View PDF</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 truncate">{pdf}</h3>
              </div>
            </div>
          ))}
        </div>
      </main>

      {selectedPDF && (
        <FullScreenPDFViewer
          pdfName={selectedPDF}
          onClose={() => setSelectedPDF(null)}
        />
      )}
    </div>
  );
};

export default PDFLibrary;