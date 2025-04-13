import React, { useState, useEffect } from "react";
import Navbar2 from "@/components/Navbar2";
import LiveRoom from "./LivRoom";
import ResumeUpload from "./ResumeUpload";
import { NavLink } from "react-router-dom";

interface Discussion {
  id: string;
  title: string;
  type: "gd" | "pi";
  date: string;
  time: string;
  meetLink?: string;
  topic?: string;
  student?: string;
}

export const StudentHome = () => {
  const [selectedDiscussionType, setSelectedDiscussionType] = useState<"gd" | "pi" | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [duration, setDuration] = useState<string>("1 hour");
  const [maxParticipants, setMaxParticipants] = useState<string>("10 students");
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [interviewNotes, setInterviewNotes] = useState<string>("");
  const [interviewType, setInterviewType] = useState<string>("Technical");
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [upcomingDiscussions, setUpcomingDiscussions] = useState<Discussion[]>([
    {
      id: "1",
      title: "AI Ethics in Education",
      type: "gd",
      date: "April 15, 2025",
      time: "14:00",
      topic: "AI Ethics in Education"
    },
    {
      id: "2",
      title: "Student Assessment Techniques",
      type: "pi",
      date: "April 18, 2025",
      time: "15:30",
      student: "Student 1",
      meetLink: "https://meet.google.com/abc-xyz-123"
    }
  ]);
  const [isLiveRoomActive, setIsLiveRoomActive] = useState(false);
  const [currentDiscussion, setCurrentDiscussion] = useState<Discussion | null>(null);

  const gdTopics = [
    "Importance of Communication",
    "Impact of Social Media on Youth",
    "AI: Icon or fame?",
    "Work-life features",
    "Climate Change and Sustainability",
  ];

  const students = ["Student 1", "Student 2", "Student 3", "Student 4"];

  const generateMeetLink = () => {
    const randomId = Math.random().toString(36).substring(2, 15);
    return `https://meet.google.com/${randomId}`;
  };

  const handleCreateDiscussion = () => {
    if (selectedDiscussionType === "gd") {
      const newDiscussion: Discussion = {
        id: Date.now().toString(),
        title: selectedTopic,
        type: "gd",
        date: new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        time: time,
        topic: selectedTopic
      };
      
      setUpcomingDiscussions([...upcomingDiscussions, newDiscussion]);
      
      console.log("Created GD session:", newDiscussion);
      alert("Group Discussion scheduled successfully!");
      
      // Reset form
      setSelectedTopic("");
      setDate("");
      setTime("");
    } else if (selectedDiscussionType === "pi") {
      const meetLink = generateMeetLink();
      const newDiscussion: Discussion = {
        id: Date.now().toString(),
        title: `Interview with ${selectedStudent}`,
        type: "pi",
        date: new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        time: time,
        student: selectedStudent,
        meetLink: meetLink
      };
      
      setUpcomingDiscussions([...upcomingDiscussions, newDiscussion]);
      
      console.log("Created PI session:", newDiscussion);
      alert(`Personal Interview scheduled successfully! Meet Link: ${meetLink}`);
      
      // Reset form
      setSelectedStudent("");
      setDate("");
      setTime("");
      setInterviewNotes("");
    }
  };

  const startLiveSession = (discussion: Discussion) => {
    setCurrentDiscussion(discussion);
    setIsLiveRoomActive(true);
  };

  return (
    <>
      <Navbar2 />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8 flex flex-col items-center">
        {isLiveRoomActive && currentDiscussion ? (
          <LiveRoom 
            discussion={currentDiscussion}
            onClose={() => setIsLiveRoomActive(false)}
          />
        ) : (
          <div className="w-full max-w-6xl">
            {/* Header Section */}
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold text-gray-800 mb-3">SpeakSpace</h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Engage in meaningful discussions and interviews to enhance your learning experience.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center mb-10">
              <button
                onClick={() => setIsResumeModalOpen(true)}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Upload Resume & Get Tips
              </button>
            </div>

            {/* Main Content */}
            <div className="flex flex-col lg:flex-row gap-8 justify-center">
              {/* Upcoming Discussions */}
              <div className="lg:w-1/2 bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
                  <h2 className="text-xl font-semibold text-white">
                    Upcoming Discussions
                  </h2>
                </div>
                <div className="p-6">
                  {upcomingDiscussions.length === 0 ? (
                    <div className="text-center py-8">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="mt-2 text-gray-500">No upcoming discussions scheduled</p>
                    </div>
                  ) : (
                    <ul className="space-y-4">
                      {upcomingDiscussions.map((discussion) => (
                        <li key={discussion.id} className="p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-gray-800">{discussion.title}</h3>
                              <div className="flex items-center mt-1 text-sm text-gray-500">
                                <span className={`px-2 py-1 rounded-full text-xs mr-2 ${
                                  discussion.type === "gd" 
                                    ? "bg-blue-100 text-blue-800" 
                                    : "bg-purple-100 text-purple-800"
                                }`}>
                                  {discussion.type === "gd" ? "Group Discussion" : "Personal Interview"}
                                </span>
                                <span>{discussion.date} • {discussion.time}</span>
                              </div>
                            </div>
                            {discussion.type === "pi" && discussion.meetLink && (
                              <a 
                                href={discussion.meetLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-full text-sm flex items-center"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                Join
                              </a>
                            )}
                          </div>
                          {discussion.type === "gd" && (
                            <button
                              onClick={() => startLiveSession(discussion)}
                              className="mt-3 w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors flex items-center justify-center"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              Start Live Session
                            </button>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Create New Discussion */}
              {selectedDiscussionType && (
                <div className="lg:w-1/2 bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
                    <h2 className="text-xl font-semibold text-white">
                      Create New Discussion
                    </h2>
                  </div>
                  <div className="p-6">
                    {selectedDiscussionType === "gd" ? (
                      <>
                        <p className="text-gray-600 mb-6">
                          Schedule a group discussion session for students.
                        </p>

                        <div className="space-y-6">
                          <div>
                            <h3 className="font-medium text-gray-700 mb-3">
                              Select Discussion Topic
                            </h3>
                            <div className="grid grid-cols-1 gap-2">
                              {gdTopics.map((topic) => (
                                <label key={topic} className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-blue-50 cursor-pointer">
                                  <input
                                    type="radio"
                                    name="gdTopic"
                                    checked={selectedTopic === topic}
                                    onChange={() => setSelectedTopic(topic)}
                                    className="form-radio h-5 w-5 text-blue-600"
                                  />
                                  <span className="ml-3 text-gray-700">{topic}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h3 className="font-medium text-gray-700 mb-3">
                              Schedule Discussion
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Date
                                </label>
                                <input
                                  type="date"
                                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  value={date}
                                  onChange={(e) => setDate(e.target.value)}
                                  min={new Date().toISOString().split('T')[0]}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Time
                                </label>
                                <input
                                  type="time"
                                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  value={time}
                                  onChange={(e) => setTime(e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Duration
                                </label>
                                <select
                                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  value={duration}
                                  onChange={(e) => setDuration(e.target.value)}
                                >
                                  <option>30 minutes</option>
                                  <option>1 hour</option>
                                  <option>1.5 hours</option>
                                  <option>2 hours</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Maximum Participants
                                </label>
                                <select
                                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  value={maxParticipants}
                                  onChange={(e) => setMaxParticipants(e.target.value)}
                                >
                                  <option>5 students</option>
                                  <option>10 students</option>
                                  <option>15 students</option>
                                  <option>20 students</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          <button
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handleCreateDiscussion}
                            disabled={!selectedTopic || !date || !time}
                          >
                            Schedule Group Discussion
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-gray-600 mb-6">
                          Schedule a personal interview session with a student.
                        </p>

                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Student
                              </label>
                              <select
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={selectedStudent}
                                onChange={(e) => setSelectedStudent(e.target.value)}
                              >
                                <option value="">Select a student</option>
                                {students.map((student) => (
                                  <option key={student} value={student}>
                                    {student}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Date
                              </label>
                              <input
                                type="date"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Duration
                              </label>
                              <select
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                              >
                                <option>30 minutes</option>
                                <option>1 hour</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Time
                              </label>
                              <input
                                type="time"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Interview Type
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                              {["Technical", "Behavioral", "Case Study", "General"].map((type) => (
                                <label key={type} className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-blue-50 cursor-pointer">
                                  <input
                                    type="radio"
                                    name="interviewType"
                                    value={type}
                                    checked={interviewType === type}
                                    onChange={() => setInterviewType(type)}
                                    className="form-radio h-5 w-5 text-blue-600"
                                  />
                                  <span className="ml-3 text-gray-700">{type}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Interview Notes
                            </label>
                            <textarea
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              rows={3}
                              placeholder="Add any specific notes or instructions for this interview"
                              value={interviewNotes}
                              onChange={(e) => setInterviewNotes(e.target.value)}
                            />
                          </div>

                          <button
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handleCreateDiscussion}
                            disabled={!selectedStudent || !date || !time}
                          >
                            Schedule Interview
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Resume Upload Modal */}
        {isResumeModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-teal-500 p-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-white">Upload Resume</h3>
                  <button
                    onClick={() => setIsResumeModalOpen(false)}
                    className="text-white hover:text-gray-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-6">
                <ResumeUpload />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};