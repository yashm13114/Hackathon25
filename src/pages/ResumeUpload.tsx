import React, { useState } from 'react';

const ResumeUpload = () => {
  const [file, setFile] = useState<null | File>(null);
  const [improvementTips, setImprovementTips] = useState('');
  const [jobRecommendations, setJobRecommendations] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'tips' | 'jobs'>('tips');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setImprovementTips('');
      setJobRecommendations('');
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please upload a resume file");
  
    const formData = new FormData();
    formData.append("resume", file);
  
    try {
      setLoading(true);
      // Update this URL to match your backend address
      const res = await fetch("http://localhost:3000/resume/upload", {
        method: "POST",
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });
  
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Upload failed");
      }
  
      const data = await res.json();
  
      if (data.success) {
        console.log("Tips:", data.improvementTips);
        console.log("Jobs:", data.jobRecommendations);
        setImprovementTips(data.improvementTips);
        setJobRecommendations(data.jobRecommendations);
      } else {
        throw new Error(data.error || "Failed to get feedback.");
      }
    } catch (err) {
      console.error("Upload failed:", err);
      alert(`Something went wrong: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Upload Your Resume</h2>
      <div className="mb-4">
        <input
          type="file"
          onChange={handleFileChange}
          accept=".pdf,.docx,.txt"
          className="w-full p-2 border rounded-md"
        />
        <p className="text-sm text-gray-500 mt-1">Accepted formats: PDF, DOCX, TXT</p>
      </div>
      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
        disabled={loading || !file}
      >
        {loading ? "Analyzing..." : "Upload & Get Feedback"}
      </button>

      {(improvementTips || jobRecommendations) && (
        <div className="mt-6 bg-white border rounded-lg shadow overflow-hidden">
          <div className="flex border-b">
            <button
              className={`px-4 py-2 font-medium ${activeTab === 'tips' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('tips')}
            >
              Improvement Tips
            </button>
            <button
              className={`px-4 py-2 font-medium ${activeTab === 'jobs' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('jobs')}
            >
              Job Recommendations
            </button>
          </div>
          
          <div className="p-4 max-h-96 overflow-y-auto">
            {activeTab === 'tips' ? (
              <div>
                <h3 className="font-semibold mb-2 text-lg">Resume Improvement Tips</h3>
                <pre className="whitespace-pre-wrap font-sans">{improvementTips}</pre>
              </div>
            ) : (
              <div>
                <h3 className="font-semibold mb-2 text-lg">Recommended Jobs Based on Your Skills</h3>
                <pre className="whitespace-pre-wrap font-sans">{jobRecommendations}</pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;