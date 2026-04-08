import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Clock, 
  User, 
  Phone, 
  Briefcase, 
  Map, 
  Navigation,
  CheckCircle,
  XCircle,
  Wifi,
  WifiOff
} from 'lucide-react';
import { mockStaff, StaffMember } from '../../data/mockData';

interface StaffLocationTrackerProps {
  currentUser: any;
  onClose?: () => void;
  isModal?: boolean;
}

export function StaffLocationTracker({ currentUser, onClose, isModal = true }: StaffLocationTrackerProps) {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(mockStaff);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [trackingMode, setTrackingMode] = useState<'all' | 'available' | 'busy'>('all');
  const [refreshInterval, setRefreshInterval] = useState<any>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Simulate live location updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate slight location changes for demonstration
      setStaffMembers(prev => 
        prev.map(member => {
          if (member.status === 'available' && Math.random() > 0.7) {
            return {
              ...member,
              location: {
                ...member.location,
                lat: member.location.lat + (Math.random() - 0.5) * 0.001,
                lng: member.location.lng + (Math.random() - 0.5) * 0.001
              }
            };
          }
          return member;
        })
      );
      setLastUpdated(new Date());
    }, 10000); // Update every 10 seconds

    setRefreshInterval(interval);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  // Filter staff based on tracking mode
  const filteredStaff = trackingMode === 'all' 
    ? staffMembers 
    : staffMembers.filter(member => member.status === trackingMode);

  // Get turf name by ID
  const getTurfName = (turfId: string | undefined) => {
    if (!turfId) return 'Not assigned';
    
    const turf = mockStaff.find(s => s.assignedTurf === turfId)?.location.address;
    return turf || 'Unknown Location';
  };

  // Handle staff selection
  const handleSelectStaff = (staff: StaffMember) => {
    setSelectedStaff(staff);
  };

  // Handle location sharing
  const handleShareLocation = (staffId: string) => {
    // In a real app, this would use the Geolocation API
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setStaffMembers(prev => 
          prev.map(member => 
            member.id === staffId 
              ? { 
                  ...member, 
                  location: {
                    ...member.location,
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                  }
                } 
              : member
          )
        );
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to get your location. Please enable location services.');
      }
    );
  };

  // Check if geolocation is available
  const isGeolocationSupported = () => {
    return 'geolocation' in navigator;
  };

  const content = (
    <div className={`bg-white rounded-xl w-full ${isModal ? 'max-w-6xl max-h-[90vh] overflow-y-auto' : ''}`}>
      {/* Tracker Header */}
      <div className="flex justify-between items-center p-6 border-b">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <MapPin className="w-6 h-6 text-green-600" />
          Staff Location Tracker
        </h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Wifi className="w-4 h-4 text-green-500" />
            <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
          </div>
          {isModal && onClose && (
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700"
            >
              <XCircle className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>

      <div className="p-6">
          {/* Controls */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex gap-2">
              <button
                onClick={() => setTrackingMode('all')}
                className={`px-4 py-2 rounded-lg ${
                  trackingMode === 'all' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Staff
              </button>
              <button
                onClick={() => setTrackingMode('available')}
                className={`px-4 py-2 rounded-lg ${
                  trackingMode === 'available' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Available
              </button>
              <button
                onClick={() => setTrackingMode('busy')}
                className={`px-4 py-2 rounded-lg ${
                  trackingMode === 'busy' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Busy
              </button>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Available</span>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span>Busy</span>
              <div className="w-3 h-3 rounded-full bg-gray-400"></div>
              <span>Offline</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Staff List */}
            <div className="lg:col-span-1">
              <h4 className="font-medium mb-4">Staff Members ({filteredStaff.length})</h4>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredStaff.map(staff => (
                  <div
                    key={staff.id}
                    onClick={() => handleSelectStaff(staff)}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedStaff?.id === staff.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        staff.status === 'available' 
                          ? 'bg-green-100 text-green-600' 
                          : staff.status === 'busy' 
                          ? 'bg-yellow-100 text-yellow-600' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        <User className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium">{staff.name}</h5>
                        <p className="text-sm text-gray-600">{staff.role}</p>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${
                        staff.status === 'available' 
                          ? 'bg-green-500' 
                          : staff.status === 'busy' 
                          ? 'bg-yellow-500' 
                          : 'bg-gray-400'
                      }`}></div>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{staff.location.address}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map and Staff Details */}
            <div className="lg:col-span-2 space-y-6">
              {selectedStaff ? (
                <>
                  {/* Staff Details */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                        selectedStaff.status === 'available' 
                          ? 'bg-green-100 text-green-600' 
                          : selectedStaff.status === 'busy' 
                          ? 'bg-yellow-100 text-yellow-600' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        <User className="w-8 h-8" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-xl font-bold">{selectedStaff.name}</h4>
                            <p className="text-gray-600">{selectedStaff.role}</p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-sm ${
                            selectedStaff.status === 'available' 
                              ? 'bg-green-100 text-green-700' 
                              : selectedStaff.status === 'busy' 
                              ? 'bg-yellow-100 text-yellow-700' 
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {selectedStaff.status.charAt(0).toUpperCase() + selectedStaff.status.slice(1)}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-500" />
                            <span className="text-sm">+1 (555) 123-4567</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-gray-500" />
                            <span className="text-sm">{getTurfName(selectedStaff.assignedTurf)}</span>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Navigation className="w-4 h-4 text-gray-500" />
                            <span>Lat: {selectedStaff.location.lat.toFixed(6)}, Lng: {selectedStaff.location.lng.toFixed(6)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm mt-1">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span>{selectedStaff.location.address}</span>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex gap-3">
                          <button
                            onClick={() => handleShareLocation(selectedStaff.id)}
                            disabled={!isGeolocationSupported()}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                              isGeolocationSupported()
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            <Wifi className="w-4 h-4" />
                            Share Live Location
                          </button>
                          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            <Phone className="w-4 h-4" />
                            Call Staff
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Map Placeholder */}
                  <div className="bg-gray-200 rounded-lg h-80 flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100 opacity-50"></div>
                    <div className="relative z-10 text-center">
                      <Map className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h4 className="text-lg font-medium mb-2">Live Location Map</h4>
                      <p className="text-gray-600">
                        {selectedStaff.name} is currently at {selectedStaff.location.address}
                      </p>
                      <div className="mt-4 flex items-center justify-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          selectedStaff.status === 'available' 
                            ? 'bg-green-500' 
                            : selectedStaff.status === 'busy' 
                            ? 'bg-yellow-500' 
                            : 'bg-gray-400'
                        }`}></div>
                        <span className="text-sm">
                          {selectedStaff.status === 'available' 
                            ? 'Available for assignments' 
                            : selectedStaff.status === 'busy' 
                            ? 'Currently busy' 
                            : 'Offline'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Mock location marker */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-8 h-8 bg-red-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-gray-50 rounded-lg h-96 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-medium mb-2">Select a staff member</h4>
                    <p className="text-gray-600">Click on a staff member to view their location details</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h5 className="font-medium mb-3">Legend</h5>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm">Available for assignment</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-sm">Currently busy</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                <span className="text-sm">Offline/Unavailable</span>
              </div>
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-blue-500" />
                <span className="text-sm">Live location tracking enabled</span>
              </div>
            </div>
          </div>
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
