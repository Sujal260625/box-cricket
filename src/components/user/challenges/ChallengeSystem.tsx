import { useState } from 'react';
import { User } from '../../../App';
import {
  Trophy,
  Calendar,
  Users,
  MapPin,
  Clock,
  IndianRupee,
  Plus,
  X,
  Star
} from 'lucide-react';

interface Challenge {
  id: string;
  name: string;
  sport: string;
  date: string;
  time: string;
  location: string;
  entryFee: number;
  prize: string;
  status: 'open' | 'upcoming' | 'completed' | 'in-progress';
  participants: string[];
  maxParticipants: number;
  description: string;
  creator: string;
  rating: number;
}

interface ChallengeSystemProps {
  currentUser: User;
  onClose: () => void;
  onChallengeCreated?: (challenge: Challenge) => void;
}

export function ChallengeSystem({ currentUser, onClose, onChallengeCreated }: ChallengeSystemProps) {
  const [activeTab, setActiveTab] = useState<'create' | 'join' | 'my-challenges'>('join');
  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: '1',
      name: 'Box Cricket Challenge',
      sport: 'Cricket',
      date: '2026-01-10',
      time: '15:00',
      location: 'Elite Football Arena',
      entryFee: 200,
      prize: '₹5000',
      status: 'open',
      participants: ['John Player', 'Sarah Player'],
      maxParticipants: 12,
      description: 'Compete in a thrilling box cricket challenge with the best players in the city.',
      creator: 'John Player',
      rating: 4.7
    },
    {
      id: '2',
      name: 'Football Frenzy',
      sport: 'Football',
      date: '2026-01-12',
      time: '17:00',
      location: 'Grand Cricket Ground',
      entryFee: 300,
      prize: '₹8000',
      status: 'open',
      participants: ['Mike Johnson'],
      maxParticipants: 10,
      description: 'A high-energy football tournament for all skill levels.',
      creator: 'Alex Manager',
      rating: 4.5
    },
    {
      id: '3',
      name: 'Basketball Showdown',
      sport: 'Basketball',
      date: '2026-01-15',
      time: '18:00',
      location: 'Premium Basketball Court',
      entryFee: 150,
      prize: '₹3000',
      status: 'upcoming',
      participants: ['Emma Wilson'],
      maxParticipants: 8,
      description: 'Show off your basketball skills in this competitive showdown.',
      creator: 'David Chen',
      rating: 4.8
    }
  ]);

  const [newChallenge, setNewChallenge] = useState({
    name: '',
    sport: 'Cricket',
    date: '',
    time: '',
    location: '',
    entryFee: 100,
    prize: '₹1000',
    maxParticipants: 10,
    description: ''
  });

  const myChallenges = challenges.filter(challenge =>
    challenge.participants.includes(currentUser.name) || challenge.creator === currentUser.name
  );

  const openChallenges = challenges.filter(challenge =>
    challenge.status === 'open' &&
    challenge.participants.length < challenge.maxParticipants &&
    challenge.creator !== currentUser.name
  );

  const handleCreateChallenge = () => {
    const challenge: Challenge = {
      id: `challenge-${Date.now()}`,
      name: newChallenge.name,
      sport: newChallenge.sport,
      date: newChallenge.date,
      time: newChallenge.time,
      location: newChallenge.location,
      entryFee: newChallenge.entryFee,
      prize: newChallenge.prize,
      status: 'open',
      participants: [currentUser.name],
      maxParticipants: newChallenge.maxParticipants,
      description: newChallenge.description,
      creator: currentUser.name,
      rating: 0
    };

    setChallenges([...challenges, challenge]);
    if (onChallengeCreated) {
      onChallengeCreated(challenge);
    }

    // Reset form
    setNewChallenge({
      name: '',
      sport: 'Cricket',
      date: '',
      time: '',
      location: '',
      entryFee: 100,
      prize: '₹1000',
      maxParticipants: 10,
      description: ''
    });

    setActiveTab('my-challenges');
  };

  const handleJoinChallenge = (challengeId: string) => {
    setChallenges(challenges.map(challenge => {
      if (challenge.id === challengeId &&
        challenge.participants.length < challenge.maxParticipants &&
        !challenge.participants.includes(currentUser.name)) {
        return {
          ...challenge,
          participants: [...challenge.participants, currentUser.name]
        };
      }
      return challenge;
    }));
  };

  const handleLeaveChallenge = (challengeId: string) => {
    setChallenges(challenges.map(challenge => {
      if (challenge.id === challengeId &&
        challenge.participants.includes(currentUser.name)) {
        return {
          ...challenge,
          participants: challenge.participants.filter(name => name !== currentUser.name)
        };
      }
      return challenge;
    }));
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Challenges & Competitions</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`px-4 py-2 font-medium ${activeTab === 'join'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-500 hover:text-gray-700'
                }`}
              onClick={() => setActiveTab('join')}
            >
              Join Challenges
            </button>
            <button
              className={`px-4 py-2 font-medium ${activeTab === 'create'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-500 hover:text-gray-700'
                }`}
              onClick={() => setActiveTab('create')}
            >
              Create Challenge
            </button>
            <button
              className={`px-4 py-2 font-medium ${activeTab === 'my-challenges'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-500 hover:text-gray-700'
                }`}
              onClick={() => setActiveTab('my-challenges')}
            >
              My Challenges
            </button>
          </div>

          {activeTab === 'join' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Available Challenges</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {openChallenges.map((challenge) => (
                  <div key={challenge.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-lg font-medium">{challenge.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs ${challenge.status === 'open'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                        }`}>
                        {challenge.status}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <Trophy className="w-4 h-4 mr-1" />
                      <span>{challenge.sport}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{challenge.date} at {challenge.time}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{challenge.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <Users className="w-4 h-4 mr-1" />
                      <span>{challenge.participants.length}/{challenge.maxParticipants} participants</span>
                    </div>
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <div className="flex items-center text-sm">
                          <IndianRupee className="w-4 h-4 mr-1 text-green-600" />
                          <span className="font-medium text-green-600">Entry: ₹{challenge.entryFee}</span>
                        </div>
                        <div className="text-sm text-purple-600 font-medium">Prize: {challenge.prize}</div>
                      </div>
                      <div className="flex items-center">
                        {renderStars(challenge.rating)}
                        <span className="ml-1 text-sm text-gray-600">{challenge.rating}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleJoinChallenge(challenge.id)}
                      disabled={challenge.participants.includes(currentUser.name)}
                      className={`w-full py-2 rounded-lg font-medium ${challenge.participants.includes(currentUser.name)
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                        }`}
                    >
                      {challenge.participants.includes(currentUser.name) ? 'Already Joined' : 'Join Challenge'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'create' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Create New Challenge</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Challenge Name</label>
                    <input
                      type="text"
                      value={newChallenge.name}
                      onChange={(e) => setNewChallenge({ ...newChallenge, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Enter challenge name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sport</label>
                    <select
                      value={newChallenge.sport}
                      onChange={(e) => setNewChallenge({ ...newChallenge, sport: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="Cricket">Cricket</option>
                      <option value="Football">Football</option>
                      <option value="Basketball">Basketball</option>
                      <option value="Badminton">Badminton</option>
                      <option value="Tennis">Tennis</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      value={newChallenge.date}
                      onChange={(e) => setNewChallenge({ ...newChallenge, date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <input
                      type="time"
                      value={newChallenge.time}
                      onChange={(e) => setNewChallenge({ ...newChallenge, time: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={newChallenge.location}
                    onChange={(e) => setNewChallenge({ ...newChallenge, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Enter location"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Entry Fee (₹)</label>
                    <input
                      type="number"
                      value={newChallenge.entryFee}
                      onChange={(e) => setNewChallenge({ ...newChallenge, entryFee: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prize</label>
                    <input
                      type="text"
                      value={newChallenge.prize}
                      onChange={(e) => setNewChallenge({ ...newChallenge, prize: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="e.g., ₹5000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Participants</label>
                    <input
                      type="number"
                      value={newChallenge.maxParticipants}
                      onChange={(e) => setNewChallenge({ ...newChallenge, maxParticipants: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newChallenge.description}
                    onChange={(e) => setNewChallenge({ ...newChallenge, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    rows={3}
                    placeholder="Describe your challenge..."
                  />
                </div>
                <button
                  onClick={handleCreateChallenge}
                  disabled={!newChallenge.name || !newChallenge.date || !newChallenge.time || !newChallenge.location}
                  className={`w-full py-3 rounded-lg font-medium ${!newChallenge.name || !newChallenge.date || !newChallenge.time || !newChallenge.location
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                >
                  Create Challenge
                </button>
              </div>
            </div>
          )}

          {activeTab === 'my-challenges' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">My Challenges</h3>
              {myChallenges.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myChallenges.map((challenge) => (
                    <div key={challenge.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-lg font-medium">{challenge.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs ${challenge.status === 'open'
                          ? 'bg-green-100 text-green-700'
                          : challenge.status === 'upcoming'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                          }`}>
                          {challenge.status}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <Trophy className="w-4 h-4 mr-1" />
                        <span>{challenge.sport}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{challenge.date} at {challenge.time}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{challenge.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <Users className="w-4 h-4 mr-1" />
                        <span>{challenge.participants.length}/{challenge.maxParticipants} participants</span>
                      </div>
                      <div className="flex justify-between items-center mb-3">
                        <div>
                          <div className="flex items-center text-sm">
                            <IndianRupee className="w-4 h-4 mr-1 text-green-600" />
                            <span className="font-medium text-green-600">Entry: ₹{challenge.entryFee}</span>
                          </div>
                          <div className="text-sm text-purple-600 font-medium">Prize: {challenge.prize}</div>
                        </div>
                        <div className="flex items-center">
                          {renderStars(challenge.rating)}
                          <span className="ml-1 text-sm text-gray-600">{challenge.rating}</span>
                        </div>
                      </div>
                      {challenge.creator === currentUser.name ? (
                        <div className="text-sm text-purple-600 font-medium">You created this challenge</div>
                      ) : (
                        <button
                          onClick={() => handleLeaveChallenge(challenge.id)}
                          className="w-full py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200"
                        >
                          Leave Challenge
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">You haven't joined any challenges yet.</p>
                  <button
                    onClick={() => setActiveTab('join')}
                    className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Browse Challenges
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
