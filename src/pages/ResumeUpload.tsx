import React, { useState } from 'react';

const ResumeUpload = () => {
    const [file, setFile] = useState(null);
    const [tips, setTips] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) return alert("Please upload a resume file");

        const formData = new FormData();
        formData.append("resume", file);

        try {
            setLoading(true);
            const res = await fetch("http://10.200.17.94:3000/resume/upload", {
                method: "POST",
                body: formData
            });

            const data = await res.json();

            if (data.success) {
                console.log("Tips:", data.tips);
                setTips(data.tips); // ✅ Corrected here
            } else {
                alert(data.error || "Failed to get feedback.");
            }

        } catch (err) {
            console.error("Upload failed:", err);
            alert("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Upload Your Resume</h2>
            <input type="file" onChange={handleFileChange} className="mb-4" />
            <button
                onClick={handleUpload}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                disabled={loading}
            >
                {loading ? "Analyzing..." : "Upload & Get Tips"}
            </button>

            {tips && (
                <div className="mt-6 bg-gray-100 p-4 rounded shadow">
                    <h3 className="font-semibold mb-2">Improvement Tips:</h3>
                    <pre className="whitespace-pre-wrap">{tips}</pre>
                </div>
            )}
        </div>
    );
};

export default ResumeUpload;
