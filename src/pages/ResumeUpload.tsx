import React, { useState } from 'react';

const ResumeUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [tips, setTips] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file) return;
  
    setLoading(true);
    setTips(null);
    setError(null);
  
    try {
        const formData = new FormData();
    formData.append('resume', file);
  
      const res = await fetch('http://localhost:3000/uploads/analyze-resume', {
        method: 'POST',
        body: formData,
        // No custom headers needed - let browser set them
        credentials: 'include' // Only if using cookies/sessions
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to analyze resume');
      }
  
      const data = await res.json();
      setTips(data.tips);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Something went wrong while analyzing your resume.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-bold mb-4 text-center">Upload Your Resume</h2>

      <input
        type="file"
        accept=".pdf,.docx"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="block w-full mb-4 text-sm"
      />

      <button
        onClick={handleUpload}
        className={`w-full py-2 px-4 rounded text-white ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
        disabled={loading}
      >
        {loading ? 'Analyzing...' : 'Analyze Resume'}
      </button>

      {error && <p className="mt-4 text-red-600 text-sm">{error}</p>}

      {tips && (
        <div className="mt-6 bg-gray-100 p-4 rounded">
          <h3 className="font-semibold mb-2 text-lg">Tips to Improve:</h3>
          <p className="whitespace-pre-line text-sm">{tips}</p>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;
