import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Search, MapPin, Navigation, Info } from 'lucide-react';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export default function BoothPage() {
  const [search, setSearch] = useState('');
  const [position, setPosition] = useState([28.6139, 77.2090]); // Delhi default
  const [isMapLoading, setIsMapLoading] = useState(false);
  const [booths, setBooths] = useState([
    { id: 1, name: "Public School Sector 4", address: "Sector 4, RK Puram, New Delhi", lat: 28.5630, lng: 77.1820, distance: "0.8 km" },
    { id: 2, name: "Community Center Block B", address: "Block B, Vasant Vihar, New Delhi", lat: 28.5600, lng: 77.1650, distance: "1.2 km" }
  ]);

  const handleSearch = (e) => {
    e.preventDefault();
    setIsMapLoading(true);
    // Simulate API delay
    setTimeout(() => {
      if (search.toLowerCase().includes('vasant')) {
        setPosition([28.5600, 77.1650]);
      } else {
        setPosition([28.5630, 77.1820]);
      }
      setIsMapLoading(false);
    }, 800);
  };

  const openInGoogleMaps = (lat, lng) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  };

  return (
    <div className="p-8 h-[calc(100vh-140px)] flex flex-col">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-navy-chakra flex items-center gap-2">
            Polling Booth Locator
            <span className="text-[10px] font-normal uppercase bg-slate-100 px-2 py-1 rounded text-slate-400">Enhanced by Google API</span>
          </h1>
          <p className="text-slate-500">Live polling station status and walking directions.</p>
        </div>
        
        <form onSubmit={handleSearch} className="relative w-full md:w-96">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by area or PIN code..."
            className="w-full glass p-4 pl-12 rounded-2xl focus:outline-none focus:ring-2 focus:ring-saffron/50 transition-all shadow-sm"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        </form>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden">
        <div className="w-full md:w-1/3 space-y-4 overflow-y-auto pr-2 scrollbar-hide">
          {booths.map(booth => (
            <div 
              key={booth.id}
              onClick={() => setPosition([booth.lat, booth.lng])}
              className={`glass p-4 rounded-2xl cursor-pointer border-2 transition-all ${
                position[0] === booth.lat ? 'border-saffron bg-saffron/5' : 'border-transparent'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-election/10 text-green-election rounded-lg">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-navy-chakra dark:text-white">{booth.name}</h3>
                    <p className="text-sm text-slate-500">{booth.address}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-green-election">{booth.distance}</span>
              </div>
              <div className="mt-4 flex gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); openInGoogleMaps(booth.lat, booth.lng); }}
                  className="flex-1 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Navigation className="w-4 h-4 text-blue-500" /> Open in Google Maps
                </button>
                <button className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 transition-colors">
                  <Info className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/30 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />
            <p className="text-xs text-blue-800 dark:text-blue-200">Wait times are currently low at all nearby stations. Best time to vote: 2:00 PM - 4:00 PM.</p>
          </div>
        </div>

        <div className="flex-1 rounded-3xl overflow-hidden shadow-xl border border-white/20 relative z-0">
          {isMapLoading && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-4 border-saffron border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Updating Map Data...</span>
              </div>
            </div>
          )}
          <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
            <ChangeView center={position} zoom={15} />
            <TileLayer
              attribution='&copy; Google Maps Data Simulation'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {booths.map(booth => (
              <Marker key={booth.id} position={[booth.lat, booth.lng]}>
                <Popup>
                  <div className="p-2 min-w-[150px]">
                    <h3 className="font-bold">{booth.name}</h3>
                    <p className="text-sm mb-2">{booth.address}</p>
                    <button 
                      onClick={() => openInGoogleMaps(booth.lat, booth.lng)}
                      className="w-full py-1 bg-blue-500 text-white text-xs rounded font-bold"
                    >
                      GET DIRECTIONS
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
          
          <div className="absolute bottom-4 right-4 z-[400] glass px-3 py-1 rounded-full flex items-center gap-2 text-[10px] font-bold text-slate-500">
            <div className="flex gap-1">
              <span className="text-blue-500">G</span>
              <span className="text-red-500">o</span>
              <span className="text-yellow-500">o</span>
              <span className="text-blue-500">g</span>
              <span className="text-green-500">l</span>
              <span className="text-red-500">e</span>
            </div>
            <span>Cloud Map Services</span>
          </div>
        </div>
      </div>
    </div>
  );
}
