import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Users, 
  Trophy, 
  Clock, 
  MapPin, 
  Plus, 
  Minus, 
  RotateCcw,
  Play,
  Pause,
  Flag
} from 'lucide-react';
import { mockMatches, Match } from '../../../data/mockData';

interface LiveScoreTrackerProps {
  match: Match;
  currentUser: any;
  onUpdateScore?: (matchId: string, newScore1: number, newScore2: number, status: Match['status']) => void;
}

export function LiveScoreTracker({ match, currentUser, onUpdateScore }: LiveScoreTrackerProps) {
  const [score1, setScore1] = useState<number>(match.score1);
  const [score2, setScore2] = useState<number>(match.score2);
  const [currentStatus, setCurrentStatus] = useState<Match['status']>(match.status);
  const [isTracking, setIsTracking] = useState<boolean>(match.status === 'live');
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [showControls, setShowControls] = useState<boolean>(false);
  const [matchEvents, setMatchEvents] = useState<any[]>([]);

  // Check if current user can update scores (admin or staff)
  const canUpdateScores = currentUser && (currentUser.role === 'admin' || currentUser.role === 'staff');

  // Simulate time progression when match is live
  useEffect(() => {
    let interval: any;
    
    if (isTracking && currentStatus === 'live') {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isTracking, currentStatus]);

  // Handle score updates
  const updateScore = (team: 'team1' | 'team2', change: number) => {
    if (!canUpdateScores) return;
    
    if (team === 'team1') {
      const newScore = Math.max(0, score1 + change);
      setScore1(newScore);
    } else {
      const newScore = Math.max(0, score2 + change);
      setScore2(newScore);
    }
    
    // Notify parent component of score update
    if (onUpdateScore) {
      onUpdateScore(match.id, score1 + (team === 'team1' ? change : 0), score2 + (team === 'team2' ? change : 0), currentStatus);
    }
  };

  // Add match event
  const addMatchEvent = (eventType: string, team: string) => {
    const newEvent = {
      id: Date.now(),
      type: eventType,
      team,
      time: timeElapsed,
      timestamp: new Date().toISOString()
    };
    
    setMatchEvents(prev => [newEvent, ...prev]);
  };

  // Change match status
  const changeMatchStatus = (status: Match['status']) => {
    setCurrentStatus(status);
    setIsTracking(status === 'live');
    
    if (status === 'completed') {
      // Add a match completed event
      addMatchEvent('match_completed', 'both');
    }
  };

  // Format time elapsed
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Determine match winner
  const getMatchWinner = () => {
    if (currentStatus !== 'completed') return null;
    if (score1 > score2) return match.team1;
    if (score2 > score1) return match.team2;
    return 'Draw';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-bold">{match.turfName}</h2>
          <p className="text-gray-600">{match.sport}</p>
        </div>
        
        <div className={`px-4 py-2 rounded-full text-sm font-medium ${
          currentStatus === 'live' 
            ? 'bg-red-100 text-red-700 animate-pulse' 
            : currentStatus === 'upcoming'
            ? 'bg-yellow-100 text-yellow-700'
            : 'bg-green-100 text-green-700'
        }`}>
          {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
        </div>
      </div>

      {/* Match Teams */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold">{match.team1}</h3>
          <div className="text-4xl font-bold text-green-600 my-3">{score1}</div>
          {canUpdateScores && (
            <div className="flex justify-center gap-2">
              <button 
                onClick={() => updateScore('team1', -1)}
                disabled={!isTracking}
                className="w-10 h-10 rounded-full bg-red-500 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button 
                onClick={() => updateScore('team1', 1)}
                disabled={!isTracking}
                className="w-10 h-10 rounded-full bg-green-500 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-400">VS</div>
          <div className="mt-4 flex items-center justify-center gap-2">
            <Clock className="w-5 h-5 text-gray-500" />
            <span className="font-mono">{formatTime(timeElapsed)}</span>
          </div>
        </div>
        
        <div className="text-center">
          <h3 className="text-xl font-semibold">{match.team2}</h3>
          <div className="text-4xl font-bold text-green-600 my-3">{score2}</div>
          {canUpdateScores && (
            <div className="flex justify-center gap-2">
              <button 
                onClick={() => updateScore('team2', -1)}
                disabled={!isTracking}
                className="w-10 h-10 rounded-full bg-red-500 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button 
                onClick={() => updateScore('team2', 1)}
                disabled={!isTracking}
                className="w-10 h-10 rounded-full bg-green-500 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Match Controls */}
      {canUpdateScores && (
        <div className="mb-6">
          <div className="flex justify-center gap-2 mb-4">
            <button
              onClick={() => setIsTracking(!isTracking)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                isTracking 
                  ? 'bg-yellow-500 text-white' 
                  : 'bg-green-500 text-white'
              }`}
            >
              {isTracking ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isTracking ? 'Pause' : 'Start'} Match
            </button>
            
            <button
              onClick={() => changeMatchStatus('completed')}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg"
            >
              <Flag className="w-4 h-4" />
              End Match
            </button>
            
            <button
              onClick={() => setShowControls(!showControls)}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg"
            >
              Events
            </button>
          </div>
          
          {showControls && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Match Events</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <button 
                  onClick={() => addMatchEvent('goal', match.team1)}
                  className="px-3 py-2 bg-blue-500 text-white rounded text-sm"
                >
                  Goal - {match.team1}
                </button>
                <button 
                  onClick={() => addMatchEvent('goal', match.team2)}
                  className="px-3 py-2 bg-blue-500 text-white rounded text-sm"
                >
                  Goal - {match.team2}
                </button>
                <button 
                  onClick={() => addMatchEvent('wicket', match.team1)}
                  className="px-3 py-2 bg-purple-500 text-white rounded text-sm"
                >
                  Wicket - {match.team1}
                </button>
                <button 
                  onClick={() => addMatchEvent('wicket', match.team2)}
                  className="px-3 py-2 bg-purple-500 text-white rounded text-sm"
                >
                  Wicket - {match.team2}
                </button>
                <button 
                  onClick={() => addMatchEvent('yellow_card', match.team1)}
                  className="px-3 py-2 bg-yellow-500 text-white rounded text-sm"
                >
                  Yellow - {match.team1}
                </button>
                <button 
                  onClick={() => addMatchEvent('yellow_card', match.team2)}
                  className="px-3 py-2 bg-yellow-500 text-white rounded text-sm"
                >
                  Yellow - {match.team2}
                </button>
                <button 
                  onClick={() => addMatchEvent('red_card', match.team1)}
                  className="px-3 py-2 bg-red-500 text-white rounded text-sm"
                >
                  Red - {match.team1}
                </button>
                <button 
                  onClick={() => addMatchEvent('red_card', match.team2)}
                  className="px-3 py-2 bg-red-500 text-white rounded text-sm"
                >
                  Red - {match.team2}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Match Status Info */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-600">Location</span>
          </div>
          <p className="font-medium">{match.turfName}</p>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-600">Started At</span>
          </div>
          <p className="font-medium">{new Date(match.startTime).toLocaleTimeString()}</p>
        </div>
      </div>

      {/* Match Winner */}
      {currentStatus === 'completed' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-5 h-5 text-green-600" />
            <h3 className="font-bold">Match Result</h3>
          </div>
          <p className="text-lg">
            {getMatchWinner() === 'Draw' 
              ? `Match ended in a draw: ${score1}-${score2}` 
              : `${getMatchWinner()} wins by ${Math.abs(score1 - score2)} points!`
            }
          </p>
        </div>
      )}

      {/* Match Events Timeline */}
      {matchEvents.length > 0 && (
        <div>
          <h3 className="font-bold mb-3">Match Events</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {matchEvents.map(event => (
              <div key={event.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                <span className="text-xs text-gray-500 w-12">{formatTime(event.time)}</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  event.type.includes('goal') ? 'bg-blue-100 text-blue-700' :
                  event.type.includes('wicket') ? 'bg-purple-100 text-purple-700' :
                  event.type.includes('yellow') ? 'bg-yellow-100 text-yellow-700' :
                  event.type.includes('red') ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {event.type}
                </span>
                <span className="text-sm">{event.team}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}