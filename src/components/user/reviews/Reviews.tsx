import React, { useState } from 'react';
import { User } from '../../../App';
import { Navigation } from '../../shared/Navigation';
import { mockReviews } from '../../../data/mockData';
import { Star, MessageSquare } from 'lucide-react';
import { ReviewSystem } from './ReviewSystem';

interface ReviewsProps {
  navigateTo: (page: string) => void;
  currentUser: User | null;
  onLogout: () => void;
}

export function Reviews({ navigateTo, currentUser, onLogout }: ReviewsProps) {
  const [showReviewSystem, setShowReviewSystem] = useState(false);
  
  const handleReviewSubmit = (review: any) => {
    console.log('Review submitted:', review);
    // In a real app, you would save this to your backend
  };
  
  const closeReviewSystem = () => {
    setShowReviewSystem(false);
  };
  
  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Navigation navigateTo={navigateTo} currentUser={currentUser} onLogout={onLogout} />
        
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-green-600" />
              <h1 className="text-4xl">Reviews & Ratings</h1>
            </div>
            {currentUser && (
              <button
                onClick={() => setShowReviewSystem(true)}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Write Review
              </button>
            )}
          </div>

          <div className="space-y-4 sm:space-y-6">
            {mockReviews.map((review) => (
              <div key={review.id} className="bg-white rounded-xl shadow-md p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-4">
                  <div>
                    <h3 className="text-lg sm:text-xl mb-1">{review.turfName}</h3>
                    <p className="text-gray-600 text-sm">by {review.userName}</p>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-500">{review.date}</span>
                </div>

                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${
                        i < review.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 font-medium text-sm sm:text-base">{review.rating}.0</span>
                </div>

                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>

          {!currentUser && (
            <div className="mt-8 text-center bg-blue-50 border border-blue-200 rounded-xl p-6">
              <p className="text-blue-900 mb-3">
                Want to share your experience?
              </p>
              <button
                onClick={() => navigateTo('login')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Login to Write Review
              </button>
            </div>
          )}
        </div>
      </div>
      
      {showReviewSystem && (
        <ReviewSystem
          currentUser={currentUser}
          onReviewSubmit={handleReviewSubmit}
          onClose={closeReviewSystem}
          showAllReviews={false}
        />
      )}
    </>
  );
}
