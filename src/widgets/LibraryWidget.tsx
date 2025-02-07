import React, { useState, useEffect } from 'react';
import { BookOpen, X } from 'lucide-react';

const PDFLibrary = ({ onLogout }: { onLogout: () => void }) => {
  const [pdfs, setPdfs] = useState<string[]>([]);
  const [selectedPDF, setSelectedPDF] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [thumbnails, setThumbnails] = useState<{ [key: string]: string }>({});

  // Fetch the list of PDFs from the Flask API
  useEffect(() => {
    const fetchPdfs = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/pdfs');
        const data = await response.json();
        setPdfs(data);
      } catch (error) {
        console.error('Error fetching PDFs:', error);
      }
    };

    fetchPdfs();
  }, []);

  // Fetch thumbnails for each PDF
  useEffect(() => {
    const fetchThumbnails = async () => {
      const fetchedThumbnails: { [key: string]: string } = {};
      for (const pdf of pdfs) {
        try {
          const response = await fetch(`http://localhost:5000/api/pdfs/thumbnails/${pdf}`, {
            method: 'GET',
            credentials: 'include', // Include cookies for authentication
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

    if (pdfs.length > 0) {
      fetchThumbnails();
    }
  }, [pdfs]);

  // Filter PDFs based on search term
  const filteredPDFs = pdfs.filter((pdf) =>
    pdf.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Local Library</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-96">
                <input
                  type="text"
                  placeholder="Search PDFs..."
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                onClick={onLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPDFs.map((pdf) => (
            <div
              key={pdf}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              onClick={() => setSelectedPDF(pdf)}
            >
              <div className="aspect-[3/4] relative">
                {/* Use the thumbnail URL if available */}
                {thumbnails[pdf] ? (
                  <img
                    src={thumbnails[pdf]}
                    alt={pdf}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">Loading...</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white text-lg font-medium">Click to view</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">{pdf}</h3>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* PDF Viewer Modal */}
      {selectedPDF && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-4xl rounded-lg shadow-2xl">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">{selectedPDF}</h2>
              <button
                onClick={() => setSelectedPDF(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-4">
              <embed
                src={`http://localhost:5000/api/pdfs/${selectedPDF}`}
                width="100%"
                height="600px"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFLibrary;
