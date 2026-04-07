import { User } from '../../../App';
import { Navigation } from '../../shared/Navigation';
import { mockTurfs, mockReviews } from '../../../data/mockData';
import { MapPin, Star, IndianRupee, Calendar, Clock, ArrowLeft } from 'lucide-react';
import { BookingCalendar } from '../booking/BookingCalendar';
import { useState } from 'react';

interface TurfDetailsProps {
  turfId: string | null;
  navigateTo: (page: string) => void;
  currentUser: User | null;
  onLogout: () => void;
}

export function TurfDetails({ turfId, navigateTo, currentUser, onLogout }: TurfDetailsProps) {
  const [showBooking, setShowBooking] = useState(false);
  const turf = mockTurfs.find(t => t.id === turfId);
  const turfReviews = mockReviews.filter(r => r.turfId === turfId);

  if (!turf) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation navigateTo={navigateTo} currentUser={currentUser} onLogout={onLogout} />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-center text-gray-500">Turf not found</p>
        </div>
      </div>
    );
  }

  const handleBookingComplete = (booking: any) => {
    // In a real app, this would save the booking to the backend
    console.log('Booking completed:', booking);
    // Show success message and reset booking view
    setTimeout(() => {
      setShowBooking(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation navigateTo={navigateTo} currentUser={currentUser} onLogout={onLogout} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => navigateTo('turfs')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Turfs
        </button>

        <div className="grid grid-cols-1 gap-6 sm:gap-8 mb-8">
          {/* Image */}
          <div>
            <div
              className="h-64 sm:h-80 lg:h-96 rounded-xl bg-cover bg-center shadow-lg w-full"
              style={{ backgroundImage: `url('${turf.image}')` }}
            />
          </div>

          {/* Details */}
          <div className="order-first sm:order-last">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
              <h1 className="text-3xl sm:text-4xl">{turf.name}</h1>
              <span
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-sm ${turf.availability === 'Available'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                  }`}
              >
                {turf.availability}
              </span>
            </div>

            <div className="flex items-center text-gray-600 mb-2">
              <MapPin className="w-5 h-5 mr-2" />
              <span>{turf.location}</span>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="text-lg font-medium">{turf.rating}</span>
              <span className="text-gray-600">({turfReviews.length} reviews)</span>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-gray-600 mb-1 text-sm sm:text-base">Price per hour</p>
                  <div className="flex items-center">
                    <IndianRupee className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                    <span className="text-2xl sm:text-4xl text-green-600">{turf.pricePerHour}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (currentUser) {
                      setShowBooking(!showBooking);
                    } else {
                      navigateTo('login');
                    }
                  }}
                  className="bg-green-600 text-white px-4 py-2 sm:px-8 sm:py-3 rounded-lg hover:bg-green-700 transition-colors self-start sm:self-auto"
                >
                  {showBooking ? 'Back to Details' : 'Book Now'}
                </button>
              </div>
            </div>

            {!showBooking ? (
              <>
                {/* Description Section */}
                <div className="mb-6">
                  <h3 className="text-xl mb-3">Description</h3>
                  <p className="text-gray-700">{turf.description}</p>
                </div>

                <div>
                  <h3 className="text-xl mb-3">Facilities</h3>
                  <div className="flex flex-wrap gap-2">
                    {turf.facilities.map((facility, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm"
                      >
                        {facility}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="mt-8">
                <BookingCalendar
                  turf={turf}
                  onBookingComplete={handleBookingComplete}
                  currentUser={currentUser}
                />
              </div>
            )}

            {/* Reviews Section */}
            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mt-8">
              <h2 className="text-xl sm:text-2xl mb-4 sm:mb-6">Reviews</h2>
              {turfReviews.length > 0 ? (
                <div className="space-y-4">
                  {turfReviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                        <div>
                          <p className="font-medium text-base">{review.userName}</p>
                          <div className="flex items-center gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                  }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-xs sm:text-sm text-gray-500">{review.date}</span>
                      </div>
                      <p className="text-gray-700 text-sm sm:text-base">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm sm:text-base">No reviews yet.</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
