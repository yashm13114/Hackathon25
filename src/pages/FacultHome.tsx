import React, { useState } from "react";
import Navbar2 from "@/components/Navbar2";
import LiveRoom from "./LivRoom";
import ResumeUpload from "./ResumeUpload";
import { motion } from "framer-motion";

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

export const FacultHome = () => {
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
      alert("Group Discussion scheduled successfully!");
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
      alert(`Personal Interview scheduled successfully! Meet Link: ${meetLink}`);
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 md:p-8">
        {isLiveRoomActive && currentDiscussion ? (
          <LiveRoom 
            discussion={currentDiscussion}
            onClose={() => setIsLiveRoomActive(false)}
          />
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-6xl mx-auto"
          >
            {/* Header Section */}
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold text-gray-800 mb-3">SpeakSpace</h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Engage in meaningful discussions and interviews with students
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-10">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-xl shadow-md transition-all ${
                  selectedDiscussionType === "gd"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setSelectedDiscussionType("gd")}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 12.094A5.973 5.973 0 004 15v1H1v-1a3 3 0 013.75-2.906z" />
                  </svg>
                  Group Discussion
                </div>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-xl shadow-md transition-all ${
                  selectedDiscussionType === "pi"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setSelectedDiscussionType("pi")}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                  </svg>
                  Personal Interview
                </div>
              </motion.button>
              
              {/* <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl shadow-md hover:shadow-lg transition-all"
                onClick={() => setIsResumeModalOpen(true)}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z" clipRule="evenodd" />
                  </svg>
                  Upload Resume & Get Tips
                </div>
              </motion.button> */}
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Upcoming Discussions */}
              <div className="lg:w-1/2">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
                >
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
                    <h2 className="text-xl font-semibold text-white flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
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
                          <motion.li 
                            key={discussion.id}
                            whileHover={{ scale: 1.02 }}
                            className="p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium text-gray-800">{discussion.title}</h3>
                                <div className="flex items-center mt-2">
                                  <span className={`px-2 py-1 rounded-full text-xs mr-2 ${
                                    discussion.type === "gd" 
                                      ? "bg-blue-100 text-blue-800" 
                                      : "bg-purple-100 text-purple-800"
                                  }`}>
                                    {discussion.type === "gd" ? "Group Discussion" : "Personal Interview"}
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    {discussion.date} • {discussion.time}
                                  </span>
                                </div>
                              </div>
                              {discussion.type === "pi" && discussion.meetLink && (
                                <a 
                                  href={discussion.meetLink} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg text-sm flex items-center"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                  </svg>
                                  Join
                                </a>
                              )}
                            </div>
                            {discussion.type === "gd" && (
                              <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => startLiveSession(discussion)}
                                className="mt-3 w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all flex items-center justify-center"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                Start Live Session
                              </motion.button>
                            )}
                          </motion.li>
                        ))}
                      </ul>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Create New Discussion Form */}
              {selectedDiscussionType && (
                <div className="lg:w-1/2">
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
                  >
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
                      <h2 className="text-xl font-semibold text-white">
                        {selectedDiscussionType === "gd" ? "New Group Discussion" : "New Personal Interview"}
                      </h2>
                    </div>
                    <div className="p-6">
                      {selectedDiscussionType === "gd" ? (
                        <>
                          <div className="mb-6">
                            <h3 className="text-lg font-medium text-gray-800 mb-3">Discussion Topic</h3>
                            <div className="space-y-2">
                              {gdTopics.map((topic) => (
                                <motion.div 
                                  key={topic}
                                  whileHover={{ scale: 1.01 }}
                                  className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-blue-50 cursor-pointer"
                                >
                                  <input
                                    type="radio"
                                    id={topic}
                                    name="gdTopic"
                                    checked={selectedTopic === topic}
                                    onChange={() => setSelectedTopic(topic)}
                                    className="form-radio h-5 w-5 text-blue-600"
                                  />
                                  <label htmlFor={topic} className="ml-3 text-gray-700 cursor-pointer">{topic}</label>
                                </motion.div>
                              ))}
                            </div>
                          </div>

                          <div className="mb-6">
                            <h3 className="text-lg font-medium text-gray-800 mb-3">Schedule Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                <input
                                  type="date"
                                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  value={date}
                                  onChange={(e) => setDate(e.target.value)}
                                  min={new Date().toISOString().split('T')[0]}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                                <input
                                  type="time"
                                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  value={time}
                                  onChange={(e) => setTime(e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Max Participants</label>
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

                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                            onClick={handleCreateDiscussion}
                            disabled={!selectedTopic || !date || !time}
                          >
                            Schedule Group Discussion
                          </motion.button>
                        </>
                      ) : (
                        <>
                          <div className="mb-6">
                            <h3 className="text-lg font-medium text-gray-800 mb-3">Interview Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
                                <select
                                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  value={selectedStudent}
                                  onChange={(e) => setSelectedStudent(e.target.value)}
                                >
                                  <option value="">Select a student</option>
                                  {students.map((student) => (
                                    <option key={student} value={student}>{student}</option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                <input
                                  type="date"
                                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  value={date}
                                  onChange={(e) => setDate(e.target.value)}
                                  min={new Date().toISOString().split('T')[0]}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                                <input
                                  type="time"
                                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  value={time}
                                  onChange={(e) => setTime(e.target.value)}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Interview Type</label>
                            <div className="grid grid-cols-2 gap-3">
                              {["Technical", "Behavioral", "Case Study", "General"].map((type) => (
                                <motion.label 
                                  key={type}
                                  whileHover={{ scale: 1.01 }}
                                  className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-blue-50 cursor-pointer"
                                >
                                  <input
                                    type="radio"
                                    name="interviewType"
                                    value={type}
                                    checked={interviewType === type}
                                    onChange={() => setInterviewType(type)}
                                    className="form-radio h-5 w-5 text-blue-600"
                                  />
                                  <span className="ml-3 text-gray-700">{type}</span>
                                </motion.label>
                              ))}
                            </div>
                          </div>

                          <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Interview Notes</label>
                            <textarea
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              rows={3}
                              placeholder="Add any specific notes or instructions for this interview..."
                              value={interviewNotes}
                              onChange={(e) => setInterviewNotes(e.target.value)}
                            />
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                            onClick={handleCreateDiscussion}
                            disabled={!selectedStudent || !date || !time}
                          >
                            Schedule Interview
                          </motion.button>
                        </>
                      )}
                    </div>
                  </motion.div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Resume Upload Modal */}
        {isResumeModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            >
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
            </motion.div>
          </motion.div>
        )}
      </div>
    </>
  );
};