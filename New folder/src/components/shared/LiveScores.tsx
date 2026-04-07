import React, { useState, useEffect } from 'react';
import { User } from '../../App';
import { Navigation } from './Navigation';
import { mockMatches, Match } from '../../data/mockData';
import { Activity, Clock, MapPin } from 'lucide-react';
import { LiveScoreTracker } from '../user/scores/LiveScoreTracker';

interface LiveScoresProps {
  navigateTo: (page: string) => void;
  currentUser: User | null;
  onLogout: () => void;
}

export function LiveScores({ navigateTo, currentUser, onLogout }: LiveScoresProps) {
  const [matches, setMatches] = useState(mockMatches);
  const [filter, setFilter] = useState<'all' | 'live' | 'upcoming' | 'completed'>('all');

  // Simulate live score updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMatches(prevMatches =>
        prevMatches.map(match => {
          if (match.status === 'live' && Math.random() > 0.7) {
            return {
              ...match,
              score1: match.score1 + (Math.random() > 0.5 ? 1 : 0),
              score2: match.score2 + (Math.random() > 0.5 ? 1 : 0)
            };
          }
          return match;
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const filteredMatches = filter === 'all' 
    ? matches 
    : matches.filter(m => m.status === filter);

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation navigateTo={navigateTo} currentUser={currentUser} onLogout={onLogout} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Activity className="w-8 h-8 text-green-600" />
          <h1 className="text-4xl">Live Scores</h1>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {(['all', 'live', 'upcoming', 'completed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-6 py-2 rounded-full capitalize whitespace-nowrap transition-colors ${
                filter === status
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Matches List */}
        <div className="space-y-4">
          {filteredMatches.map((match) => {
            // Show detailed tracker for live matches when user has admin/staff role
            const canTrackLive = currentUser && (currentUser.role === 'admin' || currentUser.role === 'staff');
            
            if (match.status === 'live' && canTrackLive) {
              return (
                <div key={match.id}>
                  <LiveScoreTracker
                    match={match}
                    currentUser={currentUser}
                    onUpdateScore={(matchId, newScore1, newScore2, status) => {
                      setMatches(prev => 
                        prev.map(m => 
                          m.id === matchId 
                            ? { ...m, score1: newScore1, score2: newScore2, status } 
                            : m
                        )
                      );
                    }}
                  />
                </div>
              );
            } else {
              return (
                <div
                  key={match.id}
                  className={`bg-white rounded-xl shadow-md p-6 ${
                    match.status === 'live' ? 'border-2 border-green-500' : ''
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            match.status === 'live'
                              ? 'bg-red-100 text-red-700 animate-pulse'
                              : match.status === 'upcoming'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {match.status === 'live' ? '● LIVE' : match.status.toUpperCase()}
                        </span>
                        <span className="text-sm text-gray-500">{match.sport}</span>
                      </div>

                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="text-sm">{match.turfName}</span>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-1" />
                        <span className="text-sm">{formatTime(match.startTime)}</span>
                      </div>
                    </div>

                    <div className="flex-1 max-w-md">
                      {/* Team 1 */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-medium">{match.team1}</span>
                        <span className="text-2xl font-bold text-green-600">{match.score1}</span>
                      </div>

                      {/* VS Divider */}
                      <div className="text-center text-gray-400 text-sm mb-3">VS</div>

                      {/* Team 2 */}
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-medium">{match.team2}</span>
                        <span className="text-2xl font-bold text-green-600">{match.score2}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
          })}
        </div>

        {filteredMatches.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No {filter !== 'all' ? filter : ''} matches found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
