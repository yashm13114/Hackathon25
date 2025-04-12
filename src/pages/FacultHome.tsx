import Navbar2 from '@/components/Navbar2';
import React, { useState } from 'react';
import ChatRoom from './ChatRoom'; 
import ResumeUpload from './ResumeUpload';
import LivRoom from './LivRoom';
// import ChatRoom from './ChatRoom';

export const FacultHome = () => {
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedGdTopic, setSelectedGdTopic] = useState('');
  const [meetLink, setMeetLink] = useState('');

  const gdData = [
    { id: 1, topic: 'Importance of Communication' },
    { id: 2, topic: 'Impact of Social Media on Youth' },
    { id: 3, topic: 'AI: Boon or Bane?' },
  ];

  const generateMeetLink = () => {
    // Placeholder logic – simulate creating a Google Meet link
    const randomId = Math.random().toString(36).substring(7);
    const url = `https://meet.google.com/${randomId}`;
    setMeetLink(url);
  };

  return (
    <>
      <Navbar2 />
      <div className="flex items-center justify-center gap-4 mt-10">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setSelectedSection('gd')}
        >
          GD
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={() => setSelectedSection('pi')}
        >
          PI
        </button>
      </div>
      {/* <FeedbackForm /> */}
      <ResumeUpload />
      <LivRoom />

      {/* GD Section */}
      {selectedSection === 'gd' && (
        <div className="mt-6 max-w-md mx-auto bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Select a GD Topic</h2>
          <form className="space-y-3">
            {gdData.map((item) => (
              <div key={item.id} className="flex items-center">
                <input
                  type="radio"
                  id={`gd-${item.id}`}
                  name="gdTopic"
                  value={item.topic}
                  checked={selectedGdTopic === item.topic}
                  onChange={(e) => setSelectedGdTopic(e.target.value)}
                  className="mr-2"
                />
                <label htmlFor={`gd-${item.id}`}>{item.topic}</label>
              </div>
            ))}
          </form>
          {selectedGdTopic && (
            <div className="mt-4 text-green-600 font-medium">
              Selected Topic: {selectedGdTopic}
            </div>
          )}
          {/* Display the ChatBox when GD is selected */}
          {selectedGdTopic && <ChatRoom selectedGdTopic={selectedGdTopic} />}
        </div>
      )}

      {/* PI Section */}
      {selectedSection === 'pi' && (
        <div className="mt-6 max-w-md mx-auto bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Create Interview Link</h2>
          <button
            onClick={generateMeetLink}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Generate Google Meet Link
          </button>

          {meetLink && (
            <div className="mt-4">
              <p className="font-medium text-gray-700">Interview Link:</p>
              <a
                href={meetLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline break-words"
              >
                {meetLink}
              </a>
            </div>
          )}
        </div>
      )}
    </>
  );
};
