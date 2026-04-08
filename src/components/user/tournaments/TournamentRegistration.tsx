import React, { useState } from 'react';
import {
  Trophy,
  Calendar,
  Users,
  IndianRupee,
  MapPin,
  Clock,
  CheckCircle,
  X
} from 'lucide-react';
import { mockTournaments, Tournament } from '../../../data/mockData';

interface TournamentRegistrationProps {
  tournament: Tournament;
  currentUser: any;
  onRegistrationComplete: (registration: any) => void;
  onClose?: () => void;
  isModal?: boolean;
}

export function TournamentRegistration({
  tournament,
  currentUser,
  onRegistrationComplete,
  onClose,
  isModal = true
}: TournamentRegistrationProps) {
  const [teamName, setTeamName] = useState('');
  const [playerCount, setPlayerCount] = useState(11);
  const [captainName, setCaptainName] = useState(currentUser?.name || '');
  const [captainPhone, setCaptainPhone] = useState('');
  const [captainEmail, setCaptainEmail] = useState(currentUser?.email || '');
  const [additionalPlayers, setAdditionalPlayers] = useState([
    { name: '', phone: '', email: '' }
  ]);
  const [registrationStep, setRegistrationStep] = useState<'details' | 'players' | 'confirm' | 'success'>('details');
  const [isLoading, setIsLoading] = useState(false);

  const addPlayer = () => {
    setAdditionalPlayers([
      ...additionalPlayers,
      { name: '', phone: '', email: '' }
    ]);
  };

  const removePlayer = (index: number) => {
    if (additionalPlayers.length > 1) {
      const updatedPlayers = [...additionalPlayers];
      updatedPlayers.splice(index, 1);
      setAdditionalPlayers(updatedPlayers);
    }
  };

  const updatePlayer = (index: number, field: string, value: string) => {
    const updatedPlayers = [...additionalPlayers];
    updatedPlayers[index] = { ...updatedPlayers[index], [field]: value };
    setAdditionalPlayers(updatedPlayers);
  };

  const handleRegister = async () => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const registration = {
        id: `reg-${Date.now()}`,
        tournamentId: tournament.id,
        tournamentName: tournament.name,
        teamName,
        captain: {
          name: captainName,
          phone: captainPhone,
          email: captainEmail
        },
        players: [
          { name: captainName, phone: captainPhone, email: captainEmail },
          ...additionalPlayers
        ],
        registrationDate: new Date().toISOString(),
        status: 'confirmed',
        paymentStatus: 'pending',
        totalAmount: parseFloat(tournament.prize.replace(/[₹$,]/g, ''))
      };

      onRegistrationComplete(registration);
      setRegistrationStep('success');
      setIsLoading(false);
    }, 1500);
  };

  const content = (
      <div className={`bg-white rounded-xl ${isModal ? 'max-w-sm sm:max-w-lg lg:max-w-2xl w-full max-h-[90vh] overflow-y-auto' : 'w-full shadow-lg border border-gray-100 p-2'}`}>
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-semibold">Register for {tournament.name}</h3>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        <div className="p-6">
          {registrationStep === 'details' && (
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">{tournament.name}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <span>{tournament.startDate} to {tournament.endDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-600" />
                    <span>{tournament.participants}/{tournament.maxParticipants} registered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IndianRupee className="w-4 h-4 text-gray-600" />
                    <span>Prize: {tournament.prize}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-600" />
                    <span>{tournament.sport}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2 text-gray-700">Team Name *</label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your team name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-700">Number of Players</label>
                  <select
                    value={playerCount}
                    onChange={(e) => setPlayerCount(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {[5, 7, 11, 15, 22].map(num => (
                      <option key={num} value={num}>{num} Players</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">Captain Name *</label>
                    <input
                      type="text"
                      value={captainName}
                      onChange={(e) => setCaptainName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Captain's full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">Captain Phone *</label>
                    <input
                      type="tel"
                      value={captainPhone}
                      onChange={(e) => setCaptainPhone(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Phone number"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-700">Captain Email *</label>
                  <input
                    type="email"
                    value={captainEmail}
                    onChange={(e) => setCaptainEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Email address"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setRegistrationStep('players')}
                  disabled={!teamName || !captainName || !captainPhone || !captainEmail}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Next: Add Players
                </button>
              </div>
            </div>
          )}

          {registrationStep === 'players' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Add Team Players</h3>
              <p className="text-gray-600">Add details for all team members (including captain)</p>

              <div className="space-y-4">
                {additionalPlayers.map((player, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium">Player {index + 1} {index === 0 && '(Captain)'}</h4>
                      {index > 0 && (
                        <button
                          onClick={() => removePlayer(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm mb-2 text-gray-700">Full Name *</label>
                        <input
                          type="text"
                          value={player.name}
                          onChange={(e) => updatePlayer(index, 'name', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Player's name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-2 text-gray-700">Phone</label>
                        <input
                          type="tel"
                          value={player.phone}
                          onChange={(e) => updatePlayer(index, 'phone', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Phone number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-2 text-gray-700">Email</label>
                        <input
                          type="email"
                          value={player.email}
                          onChange={(e) => updatePlayer(index, 'email', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Email address"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={addPlayer}
                className="flex items-center gap-2 text-green-600 hover:text-green-700"
              >
                + Add Another Player
              </button>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setRegistrationStep('details')}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={() => setRegistrationStep('confirm')}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Review Registration
                </button>
              </div>
            </div>
          )}

          {registrationStep === 'confirm' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Confirm Registration</h3>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Tournament</p>
                    <p className="font-medium">{tournament.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Team Name</p>
                    <p className="font-medium">{teamName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Captain</p>
                    <p className="font-medium">{captainName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Players</p>
                    <p className="font-medium">{playerCount}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span>Registration Fee</span>
                  <span className="font-medium">{tournament.prize}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Amount</span>
                  <span className="text-green-600">{tournament.prize}</span>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setRegistrationStep('players')}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={handleRegister}
                  disabled={isLoading}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Confirm Registration
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {registrationStep === 'success' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Registration Successful!</h3>
              <p className="text-gray-600 mb-6">
                Your team "{teamName}" has been registered for {tournament.name}.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg text-left max-w-md mx-auto">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-5 h-5 text-gray-600" />
                  <span className="font-medium">{tournament.name}</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-gray-600" />
                  <span>Team: {teamName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <IndianRupee className="w-5 h-5 text-gray-600" />
                  <span className="font-bold">Fee: {tournament.prize}</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
  );

  if (!isModal) {
    return content;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      {content}
    </div>
  );
}
