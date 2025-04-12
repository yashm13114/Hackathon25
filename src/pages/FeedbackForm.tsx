import React, { useState } from 'react';

const FeedbackForm = () => {
  const [feedback, setFeedback] = useState({
    communication: 0,
    confidence: 0,
    logic: 0,
    engagement: 0,
    comments: ''
  });

  const handleStarClick = (name, value) => {
    setFeedback((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleCommentsChange = (e) => {
    setFeedback((prevState) => ({
      ...prevState,
      comments: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can send the feedback to a server or handle it accordingly
    console.log('Feedback Submitted:', feedback);
  };

  // Function to render the stars
  const renderStars = (name) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        onClick={() => handleStarClick(name, index + 1)}
        xmlns="http://www.w3.org/2000/svg"
        fill={feedback[name] >= index + 1 ? '#FFD700' : 'none'}
        stroke="#FFD700"
        strokeWidth="2"
        className="w-6 h-6 cursor-pointer"
        viewBox="0 0 24 24"
      >
        <path d="M12 2l3 7h7l-5 5 2 7-6-4-6 4 2-7-5-5h7z" />
      </svg>
    ));
  };

  return (
    <div className="max-w-lg mx-auto p-6 border border-gray-300 rounded-lg bg-gray-50">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Post-Session Feedback</h2>
      <form onSubmit={handleSubmit}>
        
        {/* Communication Rating */}
        <div className="mb-4">
          <label className="block font-medium text-gray-700 mb-2">Communication:</label>
          <div className="flex space-x-2">{renderStars('communication')}</div>
        </div>

        {/* Confidence Rating */}
        <div className="mb-4">
          <label className="block font-medium text-gray-700 mb-2">Confidence:</label>
          <div className="flex space-x-2">{renderStars('confidence')}</div>
        </div>

        {/* Logic Rating */}
        <div className="mb-4">
          <label className="block font-medium text-gray-700 mb-2">Logic:</label>
          <div className="flex space-x-2">{renderStars('logic')}</div>
        </div>

        {/* Engagement Rating */}
        <div className="mb-4">
          <label className="block font-medium text-gray-700 mb-2">Engagement:</label>
          <div className="flex space-x-2">{renderStars('engagement')}</div>
        </div>

        {/* Additional Comments */}
        <div className="mb-4">
          <label className="block font-medium text-gray-700 mb-2">Additional Comments:</label>
          <textarea
            name="comments"
            value={feedback.comments}
            onChange={handleCommentsChange}
            placeholder="Enter your comments here..."
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            rows="4"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-500 text-white p-3 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Submit Feedback
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
