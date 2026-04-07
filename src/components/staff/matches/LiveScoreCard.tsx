import React, { useState } from 'react';
import { Match } from '../../../data/mockData';
import { MapPin, Clock, Trash2, Save, Activity, Plus, Minus, Loader2 } from 'lucide-react';

interface LiveScoreCardProps {
    match: any;
    onUpdateScore: (matchId: string) => void;
    onDelete: (matchId: string) => void;
}

export default function LiveScoreCard({ match, onUpdateScore, onDelete }: LiveScoreCardProps) {
    const matchId = match._id || match.id;
    const [score1, setScore1] = useState(match.score1 || 0);
    const [score2, setScore2] = useState(match.score2 || 0);
    const [isSaving, setIsSaving] = useState(false);
    
    // Check if score changed
    const hasChanges = score1 !== match.score1 || score2 !== match.score2;

    const handleSaveScore = async () => {
        setIsSaving(true);
        try {
            await fetch(`https://box-cricket-qt23.onrender.com/api/matches/${matchId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ score1, score2 })
            });
            onUpdateScore(matchId);
        } catch (error) {
            console.error('Error updating score:', error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider">LIVE MATCH</span>
                </div>
                <button
                    onClick={() => onDelete(matchId)}
                    className="p-1.5 hover:bg-white/20 rounded-lg transition-colors text-white/80 hover:text-white flex shadow-sm"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                   <div className="flex justify-between items-center mb-6 gap-2">
                       <div className="text-center flex-1">
                           <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2 text-xl font-bold text-blue-700 shadow-sm border border-gray-200">
                               {match.team1.charAt(0)}
                           </div>
                           <h3 className="font-bold text-sm truncate">{match.team1}</h3>
                           <div className="flex items-center justify-center gap-2 mt-2">
                               <button onClick={() => setScore1(Math.max(0, score1 - 1))} className="p-1 bg-gray-100 rounded-full hover:bg-gray-200"><Minus className="w-3 h-3"/></button>
                               <span className="text-2xl font-black min-w-[2ch]">{score1}</span>
                               <button onClick={() => setScore1(score1 + 1)} className="p-1 bg-gray-100 rounded-full hover:bg-gray-200"><Plus className="w-3 h-3"/></button>
                           </div>
                       </div>
   
                       <div className="text-center mt-6">
                           <span className="text-gray-300 text-2xl font-black">:</span>
                       </div>
   
                       <div className="text-center flex-1">
                           <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2 text-xl font-bold text-red-700 shadow-sm border border-gray-200">
                               {match.team2.charAt(0)}
                           </div>
                           <h3 className="font-bold text-sm truncate">{match.team2}</h3>
                           <div className="flex items-center justify-center gap-2 mt-2">
                               <button onClick={() => setScore2(Math.max(0, score2 - 1))} className="p-1 bg-gray-100 rounded-full hover:bg-gray-200"><Minus className="w-3 h-3"/></button>
                               <span className="text-2xl font-black min-w-[2ch]">{score2}</span>
                               <button onClick={() => setScore2(score2 + 1)} className="p-1 bg-gray-100 rounded-full hover:bg-gray-200"><Plus className="w-3 h-3"/></button>
                           </div>
                       </div>
                   </div>
   
                   <div className="space-y-2 border-t pt-4 mb-4">
                       <div className="flex items-center gap-2 text-gray-500 text-xs">
                           <MapPin className="w-4 h-4" />
                           <span className="truncate">{match.turfName}</span>
                       </div>
                       <div className="flex items-center gap-2 text-gray-500 text-xs">
                           <Clock className="w-4 h-4" />
                           <span>{match.sport}</span>
                       </div>
                   </div>
                </div>

                <button
                    onClick={handleSaveScore}
                    disabled={!hasChanges || isSaving}
                    className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                        hasChanges 
                            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200' 
                            : 'bg-gray-100 text-gray-400'
                    }`}
                >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4" />}
                    {hasChanges ? 'Save Score' : 'Score Up to Date'}
                </button>
            </div>
        </div>
    );
}

