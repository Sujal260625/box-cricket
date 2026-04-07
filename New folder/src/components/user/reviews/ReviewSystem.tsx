import React, { useState } from 'react';
import { 
  Star, 
  MapPin, 
  Calendar, 
  Clock, 
  User as UserIcon, 
  CheckCircle, 
  X,
  Trophy,
  MessageSquare
} from 'lucide-react';
import { mockTurfs, Turf, Review } from '../../../data/mockData';

interface ReviewSystemProps {
  currentUser: any;
  turf?: Turf;
  onReviewSubmit?: (review: Review) => void;
  onClose?: () => void;
  showAllReviews?: boolean;
}

export function ReviewSystem({ 
  currentUser, 
  turf, 
  onReviewSubmit, 
  onClose, 
  showAllReviews = false 
}: ReviewSystemProps) {
  const [selectedTurf, setSelectedTurf] = useState<Turf | null>(turf || null);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [reviewStep, setReviewStep] = useState<'select' | 'write' | 'confirm' | 'success'>('select');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      turfId: '1',
      turfName: 'Elite Football Arena',
      userName: 'John Doe',
      rating: 5,
      comment: 'Excellent facilities and well-maintained turf. The booking process was smooth and staff was very helpful.',
      date: '2026-01-05'
    },
    {
      id: '2',
      turfId: '2',
      turfName: 'Grand Cricket Ground',
      userName: 'Sarah Smith',
      rating: 5,
      comment: 'Best cricket ground in the area! Perfect pitch conditions and great amenities.',
      date: '2026-01-04'
    },
    {
      id: '3',
      turfId: '3',
      turfName: 'Premium Basketball Court',
      userName: 'Mike Johnson',
      rating: 4,
      comment: 'Good indoor court with proper flooring. Could use better lighting but overall great experience.',
      date: '2026-01-03'
    }
  ]);

  // Get all reviews or just for a specific turf
  const filteredReviews = selectedTurf 
    ? reviews.filter(review => review.turfId === selectedTurf.id) 
    : selectedCategory === 'all' 
      ? reviews 
      : reviews.filter(review => {
          const turf = mockTurfs.find(t => t.id === review.turfId);
          return turf?.type.toLowerCase().includes(selectedCategory.toLowerCase());
        });

  // Handle turf selection
  const handleTurfSelect = (turf: Turf) => {
    setSelectedTurf(turf);
    setReviewStep('write');
  };

  // Handle rating change
  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  // Handle review submission
  const handleSubmitReview = () => {
    if (!selectedTurf || !currentUser) return;
    
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      turfId: selectedTurf.id,
      turfName: selectedTurf.name,
      userName: currentUser.name,
      rating,
      comment,
      date: new Date().toISOString().split('T')[0]
    };
    
    // Update local state
    setReviews([...reviews, newReview]);
    
    // Call parent callback if provided
    if (onReviewSubmit) {
      onReviewSubmit(newReview);
    }
    
    setReviewStep('success');
  };

  // Render stars for rating
  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
            className={`${interactive ? 'cursor-pointer' : 'cursor-default'} ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            disabled={!interactive}
          >
            <Star className="w-6 h-6 fill-current" />
          </button>
        ))}
      </div>
    );
  };

  // Calculate average rating
  const calculateAverageRating = (turfId: string) => {
    const turfReviews = reviews.filter(review => review.turfId === turfId);
    if (turfReviews.length === 0) return 0;
    
    const total = turfReviews.reduce((sum, review) => sum + review.rating, 0);
    return total / turfReviews.length;
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 ${showAllReviews ? '' : 'h-screen'}`}>
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            {reviewStep === 'select' && <Trophy className="w-6 h-6 text-green-600" />}
            {reviewStep === 'write' && <MessageSquare className="w-6 h-6 text-green-600" />}
            {reviewStep === 'confirm' && <CheckCircle className="w-6 h-6 text-green-600" />}
            {reviewStep === 'success' && <CheckCircle className="w-6 h-6 text-green-600" />}
            {showAllReviews ? 'All Reviews' : 
             reviewStep === 'select' ? 'Select Turf' : 
             reviewStep === 'write' ? 'Write Review' : 
             reviewStep === 'confirm' ? 'Confirm Review' : 'Review Submitted'}
          </h3>
          {!showAllReviews && (
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        <div className="p-6">
          {reviewStep === 'select' && !showAllReviews && (
            <div>
              <h4 className="font-medium mb-4">Select a turf to review</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockTurfs.map(turf => (
                  <div 
                    key={turf.id}
                    onClick={() => handleTurfSelect(turf)}
                    className="border border-gray-200 rounded-lg p-4 hover:border-green-500 hover:bg-green-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium">{turf.name}</h5>
                        <div className="flex items-center gap-2 mt-1">
                          {renderStars(calculateAverageRating(turf.id))}
                          <span className="text-sm text-gray-600">
                            {calculateAverageRating(turf.id).toFixed(1)} ({reviews.filter(r => r.turfId === turf.id).length})
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{turf.type}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {reviewStep === 'write' && !showAllReviews && (
            <div>
              <div className="flex items-center gap-3 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium">{selectedTurf?.name}</h4>
                  <p className="text-sm text-gray-600">{selectedTurf?.type}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm mb-2 text-gray-700">Your Rating</label>
                  <div className="flex items-center gap-2">
                    {renderStars(rating, true, handleRatingChange)}
                    <span className="ml-2 font-medium">{rating} out of 5</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-700">Your Review</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience with this turf..."
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows={5}
                  />
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setReviewStep('select')}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setReviewStep('confirm')}
                    disabled={!comment.trim()}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Preview Review
                  </button>
                </div>
              </div>
            </div>
          )}

          {reviewStep === 'confirm' && !showAllReviews && (
            <div>
              <h4 className="font-medium mb-4">Confirm Your Review</h4>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h5 className="font-medium">{currentUser?.name}</h5>
                    <p className="text-sm text-gray-600">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    {renderStars(rating)}
                    <span className="font-medium">{rating} out of 5</span>
                  </div>
                </div>
                
                <p className="text-gray-700">{comment}</p>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setReviewStep('write')}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Edit Review
                </button>
                <button
                  onClick={handleSubmitReview}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Submit Review
                </button>
              </div>
            </div>
          )}

          {reviewStep === 'success' && !showAllReviews && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Thank You for Your Review!</h3>
              <p className="text-gray-600 mb-6">
                Your review for {selectedTurf?.name} has been submitted successfully.
              </p>
              <button
                onClick={() => {
                  setReviewStep('select');
                  setRating(5);
                  setComment('');
                }}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Write Another Review
              </button>
            </div>
          )}

          {(showAllReviews || reviewStep === 'select') && (
            <div>
              {/* Category Filter */}
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {(['all', 'football', 'cricket', 'basketball', 'multi-sport'] as const).map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full capitalize whitespace-nowrap transition-colors ${
                      selectedCategory === category
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Reviews List */}
              <div className="space-y-6">
                {filteredReviews.length > 0 ? (
                  filteredReviews.map(review => {
                    const turf = mockTurfs.find(t => t.id === review.turfId);
                    return (
                      <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <UserIcon className="w-6 h-6 text-green-600" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                              <div>
                                <h4 className="font-medium">{review.userName}</h4>
                                {turf && (
                                  <div className="flex items-center gap-2 mt-1">
                                    <MapPin className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm text-gray-600">{turf.name}</span>
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(review.date).toLocaleDateString()}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 mb-2">
                              {renderStars(review.rating)}
                              <span className="text-sm font-medium">{review.rating}/5</span>
                            </div>
                            
                            <p className="text-gray-700">{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12">
                    <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-2">No Reviews Found</h3>
                    <p className="text-gray-600">Be the first to review a turf!</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}