import { User } from '../../../App';
import { Navigation } from '../../shared/Navigation';
import { mockTurfs } from '../../../data/mockData';
import { MapPin, Star, IndianRupee, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface TurfListingsProps {
  navigateTo: (page: string, turfId?: string) => void;
  currentUser: User | null;
  onLogout: () => void;
}

export function TurfListings({ navigateTo, currentUser, onLogout }: TurfListingsProps) {
  const [selectedType, setSelectedType] = useState<string>('All');

  const turfTypes = ['All', 'Football', 'Cricket', 'Basketball', 'Multi-Sport'];

  const filteredTurfs = selectedType === 'All'
    ? mockTurfs
    : mockTurfs.filter(turf => turf.type === selectedType);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation navigateTo={navigateTo} currentUser={currentUser} onLogout={onLogout} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl mb-8">Browse Turfs</h1>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {turfTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-6 py-2 rounded-full whitespace-nowrap transition-colors ${selectedType === type
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Turf Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredTurfs.map((turf) => (
            <div
              key={turf.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer flex flex-col h-full"
              onClick={() => navigateTo('turf-details', turf.id)}
            >
              <div
                className="h-40 sm:h-48 bg-cover bg-center"
                style={{ backgroundImage: `url('${turf.image}')` }}
              />

              <div className="p-4 sm:p-5 flex-grow">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                  <h3 className="text-lg sm:text-xl flex-1">{turf.name}</h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs sm:text-sm ${turf.availability === 'Available'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                      }`}
                  >
                    {turf.availability}
                  </span>
                </div>

                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{turf.location}</span>
                </div>

                <div className="flex items-center gap-1 mb-3">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{turf.rating}</span>
                </div>

                <div className="flex flex-wrap gap-1 sm:gap-2 mb-4">
                  {turf.facilities.slice(0, 3).map((facility, index) => (
                    <span
                      key={index}
                      className="px-1.5 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                    >
                      {facility}
                    </span>
                  ))}
                  {turf.facilities.length > 3 && (
                    <span className="px-1.5 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      +{turf.facilities.length - 3} more
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-3 border-t border-gray-200">
                  <div className="flex items-center mb-2 sm:mb-0">
                    <IndianRupee className="w-5 h-5 text-green-600" />
                    <span className="text-lg sm:text-xl text-green-600">{turf.pricePerHour}</span>
                    <span className="text-gray-600 text-sm ml-1">/hour</span>
                  </div>
                  <button className="text-green-600 flex items-center hover:text-green-700 text-sm">
                    View Details
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTurfs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No turfs found for this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
