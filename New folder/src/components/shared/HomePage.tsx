import { User } from '../../App';
import { Navigation } from './Navigation';
import Footer from './Footer';
import { Calendar, Trophy, Star, MapPin, Clock, Users } from 'lucide-react';

interface HomePageProps {
  navigateTo: (page: string) => void;
  currentUser: User | null;
  onLogout: () => void;
}

export function HomePage({ navigateTo, currentUser, onLogout }: HomePageProps) {
  const features = [
    {
      icon: <MapPin className="w-8 h-8" />,
      title: 'Find Nearby Turfs',
      description: 'Discover quality sports facilities near you'
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: 'Easy Booking',
      description: 'Book your favorite turf with just a few clicks'
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: 'Join Tournaments',
      description: 'Participate in exciting local tournaments'
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'Live Scores',
      description: 'Track ongoing matches in real-time'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation navigateTo={navigateTo} currentUser={currentUser} onLogout={onLogout} />

      {/* Hero Section */}
      <div
        className="relative h-[500px] bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1546608235-3310a2494cdf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBmaWVsZHxlbnwxfHx8fDE3Njc2MTkxNTF8MA&ixlib=rb-4.1.0&q=80&w=1080')`
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-5xl md:text-6xl mb-6">Welcome to TurfFlow</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
              Intelligent Sports Ground Management System
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigateTo('turfs')}
                className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors text-lg"
              >
                Browse Turfs
              </button>
              {!currentUser && (
                <button
                  onClick={() => navigateTo('login')}
                  className="bg-white text-green-700 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors text-lg"
                >
                  Get Started
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl sm:text-4xl text-center mb-8 sm:mb-12">Why Choose TurfFlow?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center"
            >
              <div className="text-green-600 flex justify-center mb-3 sm:mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg sm:text-xl mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm sm:text-base">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links Section */}
      <div className="bg-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl text-center mb-8 sm:mb-12">Explore</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div
              onClick={() => navigateTo('live-scores')}
              className="relative h-48 sm:h-64 rounded-xl overflow-hidden cursor-pointer group"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1565483276060-e6730c0cc6a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBzdGFkaXVtfGVufDF8fHx8MTc2NzYxNTEzOHww&ixlib=rb-4.1.0&q=80&w=1080')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                <h3 className="text-white text-xl sm:text-2xl">Live Scores</h3>
              </div>
            </div>

            <div
              onClick={() => navigateTo('tournaments')}
              className="relative h-48 sm:h-64 rounded-xl overflow-hidden cursor-pointer group"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1512719994953-eabf50895df7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmlja2V0JTIwZ3JvdW5kfGVufDF8fHx8MTc2NzY5MjUwM3ww&ixlib=rb-4.1.0&q=80&w=1080')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                <h3 className="text-white text-xl sm:text-2xl">Tournaments</h3>
              </div>
            </div>

            <div
              onClick={() => navigateTo('reviews')}
              className="relative h-48 sm:h-64 rounded-xl overflow-hidden cursor-pointer group"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1577416412292-747c6607f055?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNrZXRiYWxsJTIwY291cnR8ZW58MXx8fHwxNzY3NTkzOTc0fDA&ixlib=rb-4.1.0&q=80&w=1080')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                <h3 className="text-white text-xl sm:text-2xl">Reviews</h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
