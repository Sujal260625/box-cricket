import React, { useState } from 'react';
import { User } from '../../../App';
import { Navigation } from '../../shared/Navigation';
import { mockTournaments, Tournament } from '../../../data/mockData';
import { Trophy, Calendar, Users, IndianRupee } from 'lucide-react';
import { TournamentRegistration } from './TournamentRegistration';

interface TournamentsProps {
  navigateTo: (page: string) => void;
  currentUser: User | null;
  onLogout: () => void;
}

export function Tournaments({ navigateTo, currentUser, onLogout }: TournamentsProps) {
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [showRegistration, setShowRegistration] = useState(false);

  const handleRegisterTournament = (tournament: Tournament) => {
    if (currentUser) {
      setSelectedTournament(tournament);
      setShowRegistration(true);
    } else {
      navigateTo('login');
    }
  };

  const handleRegistrationComplete = (registration: any) => {
    console.log('Tournament registration completed:', registration);
    setShowRegistration(false);
    setSelectedTournament(null);
  };

  const closeRegistration = () => {
    setShowRegistration(false);
    setSelectedTournament(null);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Navigation navigateTo={navigateTo} currentUser={currentUser} onLogout={onLogout} />

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-8">
            <Trophy className="w-8 h-8 text-green-600" />
            <h1 className="text-4xl">Tournaments</h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {mockTournaments.map((tournament) => (
              <div
                key={tournament.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow flex flex-col h-full"
              >
                <div
                  className="h-40 sm:h-48 bg-cover bg-center"
                  style={{ backgroundImage: `url('${tournament.image}')` }}
                />

                <div className="p-4 sm:p-6 flex-grow">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                    <h3 className="text-lg sm:text-xl flex-1">{tournament.name}</h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs sm:text-sm ${tournament.status === 'open'
                        ? 'bg-green-100 text-green-700'
                        : tournament.status === 'ongoing'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                        }`}
                    >
                      {tournament.status}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <Trophy className="w-4 h-4 mr-2" />
                      <span className="text-xs sm:text-sm">{tournament.sport}</span>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="text-xs sm:text-sm">
                        {tournament.startDate} to {tournament.endDate}
                      </span>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      <span className="text-xs sm:text-sm">
                        {tournament.participants}/{tournament.maxParticipants} participants
                      </span>
                    </div>

                    <div className="flex items-center text-green-600 font-medium">
                      <IndianRupee className="w-4 h-4 mr-2" />
                      <span className="text-xs sm:text-sm">Prize: {tournament.prize}</span>
                    </div>
                  </div>

                  <div className="pt-3 sm:pt-4 mt-auto border-t border-gray-200">
                    {tournament.status === 'open' ? (
                      <button
                        onClick={() => handleRegisterTournament(tournament)}
                        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        Register Now
                      </button>
                    ) : tournament.status === 'ongoing' ? (
                      <button
                        onClick={() => navigateTo('live-scores')}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        View Matches
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full bg-gray-300 text-gray-600 py-2 rounded-lg cursor-not-allowed text-sm"
                      >
                        Completed
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showRegistration && selectedTournament && (
        <TournamentRegistration
          tournament={selectedTournament}
          currentUser={currentUser}
          onRegistrationComplete={handleRegistrationComplete}
          onClose={closeRegistration}
        />
      )}
    </>
  );
}
