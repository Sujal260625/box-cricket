import { useState, useEffect } from 'react';
import { User } from '../../App';
import {
  Calendar,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Users,
  Edit,
  Search
} from 'lucide-react';

interface Booking {
  id: string;
  turfId: string;
  turfName: string;
  userId: string;
  userName: string;
  date: string;
  timeSlot: string; // Format: "HH:MM - HH:MM"
  duration: number;
  totalPrice: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  paymentStatus: 'paid' | 'pending' | 'refunded';
}

interface Conflict {
  id: string;
  booking1: Booking;
  booking2: Booking;
  conflictType: 'time' | 'resource' | 'capacity';
  status: 'detected' | 'resolved' | 'overridden';
  resolutionNote?: string;
}

interface BookingConflictDetectorProps {
  currentUser: User;
  onConflictResolved?: (conflict: Conflict) => void;
  onClose?: () => void;
  isModal?: boolean;
}

export function BookingConflictDetector({ currentUser, onConflictResolved, onClose, isModal = true }: BookingConflictDetectorProps) {
  const [conflicts, setConflicts] = useState<Conflict[]>([
    {
      id: '1',
      booking1: {
        id: '101',
        turfId: '1',
        turfName: 'Elite Football Arena',
        userId: '3',
        userName: 'John Player',
        date: '2026-01-10',
        timeSlot: '14:00 - 16:00',
        duration: 2,
        totalPrice: 1000,
        status: 'confirmed',
        paymentStatus: 'paid'
      },
      booking2: {
        id: '102',
        turfId: '1',
        turfName: 'Elite Football Arena',
        userId: '4',
        userName: 'Sarah Player',
        date: '2026-01-10',
        timeSlot: '15:00 - 17:00',
        duration: 2,
        totalPrice: 1000,
        status: 'pending',
        paymentStatus: 'pending'
      },
      conflictType: 'time',
      status: 'detected'
    },
    {
      id: '2',
      booking1: {
        id: '103',
        turfId: '2',
        turfName: 'Grand Cricket Ground',
        userId: '5',
        userName: 'Mike Johnson',
        date: '2026-01-11',
        timeSlot: '10:00 - 12:00',
        duration: 2,
        totalPrice: 2000,
        status: 'confirmed',
        paymentStatus: 'paid'
      },
      booking2: {
        id: '104',
        turfId: '2',
        turfName: 'Grand Cricket Ground',
        userId: '6',
        userName: 'Emma Wilson',
        date: '2026-01-11',
        timeSlot: '10:30 - 12:30',
        duration: 2,
        totalPrice: 2000,
        status: 'pending',
        paymentStatus: 'pending'
      },
      conflictType: 'time',
      status: 'detected'
    }
  ]);

  const [selectedConflict, setSelectedConflict] = useState<Conflict | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'detected' | 'resolved' | 'overridden'>('all');

  // Filter conflicts based on search term and status
  const filteredConflicts = conflicts.filter(conflict => {
    const matchesSearch =
      conflict.booking1.turfName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conflict.booking1.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conflict.booking2.userName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || conflict.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const detectConflicts = () => {
    // In a real implementation, this would scan all bookings for conflicts
    // For now, we'll just simulate conflict detection
    console.log('Detecting conflicts...');
  };

  const resolveConflict = (conflictId: string, action: 'cancel-first' | 'cancel-second' | 'override') => {
    setConflicts(prev =>
      prev.map(conflict => {
        if (conflict.id === conflictId) {
          const status: 'resolved' | 'overridden' = action === 'override' ? 'overridden' : 'resolved';
          const updatedConflict: Conflict = {
            ...conflict,
            status,
            resolutionNote: resolutionNote || `Resolved by ${currentUser.name}: ${action.replace('-', ' ')}`
          };

          if (onConflictResolved) {
            onConflictResolved(updatedConflict);
          }

          return updatedConflict;
        }
        return conflict;
      })
    );

    setSelectedConflict(null);
    setResolutionNote('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTimeRange = (timeSlot: string) => {
    const [start, end] = timeSlot.split(' - ');
    return { start, end };
  };

  const content = (
    <div className={`bg-white rounded-xl w-full ${isModal ? 'shadow-2xl max-w-6xl max-h-[90vh] overflow-auto' : ''}`}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Booking Conflict Detection & Resolution</h2>
          {isModal && onClose && (
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <XCircle className="w-6 h-6" />
            </button>
          )}
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search conflicts by turf or user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Conflicts</option>
            <option value="detected">Detected</option>
            <option value="resolved">Resolved</option>
            <option value="overridden">Overridden</option>
          </select>
          <button
            onClick={detectConflicts}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Detect Conflicts
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conflicts List */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Detected Conflicts ({filteredConflicts.length})</h3>
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {filteredConflicts.length > 0 ? (
                filteredConflicts.map((conflict) => (
                  <div
                    key={conflict.id}
                    onClick={() => setSelectedConflict(conflict)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedConflict?.id === conflict.id
                        ? 'border-purple-500 bg-purple-50 shadow-sm'
                        : 'border-gray-200 hover:bg-gray-50'
                      } ${conflict.status === 'resolved' ? 'opacity-70 bg-gray-50' : ''
                      }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className={`w-5 h-5 ${conflict.status === 'detected' ? 'text-yellow-500' :
                              conflict.status === 'resolved' ? 'text-green-500' :
                                'text-purple-500'
                            }`} />
                          <span className={`font-medium text-sm ${conflict.status === 'detected' ? 'text-yellow-700' :
                              conflict.status === 'resolved' ? 'text-green-700' :
                                'text-purple-700'
                            }`}>
                            {conflict.conflictType.toUpperCase()}
                          </span>
                        </div>
                        <p className="font-semibold text-gray-800 mt-1 line-clamp-1">{conflict.booking1.turfName}</p>
                        <p className="text-xs text-gray-500">{formatDate(conflict.booking1.date)}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${conflict.status === 'detected' ? 'bg-yellow-100 text-yellow-700' :
                          conflict.status === 'resolved' ? 'bg-green-100 text-green-700' :
                            'bg-purple-100 text-purple-700'
                        }`}>
                        {conflict.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                  <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No conflicts found</p>
                </div>
              )}
            </div>
          </div>

          {/* Conflict Details and Resolution */}
          <div className="lg:col-span-2">
            {selectedConflict ? (
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Conflict Details</h3>
                    <p className="text-sm text-gray-500">Analyze and resolve the overlapping bookings</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold uppercase ${selectedConflict.status === 'detected' ? 'bg-yellow-100 text-yellow-700' :
                      selectedConflict.status === 'resolved' ? 'bg-green-100 text-green-700' :
                        'bg-purple-100 text-purple-700'
                    }`}>
                    {selectedConflict.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Booking 1 */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none">
                      <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 rotate-45 bg-red-500 w-full h-4"></div>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-red-600" />
                      </div>
                      <h4 className="font-bold text-gray-700">Booking #1</h4>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4 opacity-70" />
                        <span>{formatDate(selectedConflict.booking1.date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4 opacity-70" />
                        <span className="font-medium">{selectedConflict.booking1.timeSlot}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4 opacity-70" />
                        <span>{selectedConflict.booking1.turfName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 border-t pt-2">
                        <Users className="w-4 h-4 opacity-70" />
                        <span className="font-medium">{selectedConflict.booking1.userName}</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                         <span className="text-green-600 font-bold">₹{selectedConflict.booking1.totalPrice}</span>
                         <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${selectedConflict.booking1.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                           {selectedConflict.booking1.paymentStatus}
                         </span>
                      </div>
                    </div>
                  </div>

                  {/* Booking 2 */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none">
                      <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 rotate-45 bg-red-500 w-full h-4"></div>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-red-600" />
                      </div>
                      <h4 className="font-bold text-gray-700">Booking #2</h4>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4 opacity-70" />
                        <span>{formatDate(selectedConflict.booking2.date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4 opacity-70" />
                        <span className="font-medium">{selectedConflict.booking2.timeSlot}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4 opacity-70" />
                        <span>{selectedConflict.booking2.turfName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 border-t pt-2">
                        <Users className="w-4 h-4 opacity-70" />
                        <span className="font-medium">{selectedConflict.booking2.userName}</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                         <span className="text-green-600 font-bold">₹{selectedConflict.booking2.totalPrice}</span>
                         <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${selectedConflict.booking2.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                           {selectedConflict.booking2.paymentStatus}
                         </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    Conflict Analysis
                  </h4>
                  <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                    <p className="text-sm text-yellow-800 leading-relaxed">
                      The time slots overlap between these bookings. Booking #1 reserves the turf until{' '}
                      <span className="font-bold">{getTimeRange(selectedConflict.booking1.timeSlot).end}</span>, 
                      while Booking #2 starts at <span className="font-bold">{getTimeRange(selectedConflict.booking2.timeSlot).start}</span>. 
                      Please resolve by cancelling one booking or overriding if simultaneous use is permitted.
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Resolution Note
                  </label>
                  <textarea
                    value={resolutionNote}
                    onChange={(e) => setResolutionNote(e.target.value)}
                    placeholder="Describe why this resolution was chosen..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none"
                    rows={3}
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => resolveConflict(selectedConflict.id, 'cancel-first')}
                    className="flex-1 min-w-[150px] px-4 py-3 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-colors font-bold flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Cancel #1
                  </button>
                  <button
                    onClick={() => resolveConflict(selectedConflict.id, 'cancel-second')}
                    className="flex-1 min-w-[150px] px-4 py-3 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-colors font-bold flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Cancel #2
                  </button>
                  <button
                    onClick={() => resolveConflict(selectedConflict.id, 'override')}
                    className="flex-1 min-w-[150px] px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all font-bold shadow-lg flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Edit className="w-4 h-4" />
                    Override
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl p-12 text-center border-2 border-dashed border-gray-200 h-full flex flex-col items-center justify-center">
                <AlertTriangle className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">No Conflict Selected</h3>
                <p className="text-gray-500 max-w-sm">
                  Select a detected conflict from the left panel to review details and take resolution actions.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (!isModal) {
    return content;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      {content}
    </div>
  );
}