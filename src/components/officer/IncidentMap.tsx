import React, { useState } from 'react';
import { MapPin, Navigation, Maximize2, AlertCircle, ArrowRight, Eye } from 'lucide-react';
import { CivicReport } from '../../types/report';
import { useRouter } from '../../context/RouterContext';

interface IncidentMapProps {
  incidents: CivicReport[];
  selectedIncidentId?: string | null;
  onSelectIncident?: (incident: CivicReport) => void;
}

export const IncidentMap: React.FC<IncidentMapProps> = ({
  incidents,
  selectedIncidentId,
  onSelectIncident,
}) => {
  const { navigate } = useRouter();
  const [activePopupId, setActivePopupId] = useState<string | null>(selectedIncidentId || null);

  // Sync active popup with selectedIncidentId prop if changed
  React.useEffect(() => {
    if (selectedIncidentId) {
      setActivePopupId(selectedIncidentId);
    }
  }, [selectedIncidentId]);

  // Coordinate bounds for Hyderabad sector demo
  // Center roughly at lat: 17.43, lng: 78.43
  const minLat = 17.37;
  const maxLat = 17.48;
  const minLng = 78.36;
  const maxLng = 78.50;

  // Convert lat/lng to percentage X/Y in the 1000x700 coordinate box
  const getCoordinates = (lat?: number, lng?: number) => {
    if (!lat || !lng) return { x: 500, y: 350 };
    const clampedLat = Math.max(minLat, Math.min(maxLat, lat));
    const clampedLng = Math.max(minLng, Math.min(maxLng, lng));

    const x = ((clampedLng - minLng) / (maxLng - minLng)) * 860 + 70;
    // Latitude is inverted in SVG Y axis (higher lat is north/top)
    const y = ((maxLat - clampedLat) / (maxLat - minLat)) * 560 + 70;
    return { x, y };
  };

  const selectedIncident = incidents.find(
    (i) => i.id === (activePopupId || selectedIncidentId)
  );

  return (
    <div className="bg-white rounded-3xl border border-[#E4ECD8] shadow-xs overflow-hidden flex flex-col h-full min-h-[520px]">
      {/* Map Header */}
      <div className="px-6 py-4 border-b border-[#EEF2E6] flex items-center justify-between bg-[#FCFDFB]">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#697A62] block">
            GEOSPATIAL MONITOR
          </span>
          <h3 className="text-base font-bold text-[#182315]">
            Incident Map
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#506135] bg-[#EFF4E7] px-2.5 py-1 rounded-lg border border-[#D5E1CA]">
            {incidents.length} active pins
          </span>
          <button
            type="button"
            onClick={() => setActivePopupId(null)}
            className="p-1.5 text-[#6B7C64] hover:text-[#182315] hover:bg-[#F2F5ED] rounded-lg transition-colors"
            title="Reset Map View"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Map Canvas Area */}
      <div className="relative flex-1 bg-[#FAF8F3] overflow-hidden select-none">
        <svg
          viewBox="0 0 1000 700"
          className="w-full h-full object-cover"
          style={{ minHeight: '440px' }}
        >
          {/* Background Grid Pattern */}
          <defs>
            <pattern id="civic-grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path
                d="M 50 0 L 0 0 0 50"
                fill="none"
                stroke="#EAE6DC"
                strokeWidth="0.75"
              />
            </pattern>
          </defs>
          <rect width="1000" height="700" fill="#FAF8F3" />
          <rect width="1000" height="700" fill="url(#civic-grid)" opacity="0.7" />

          {/* Municipal Zones / Urban Corridors */}
          <path
            d="M 80 180 Q 300 240 520 200 T 920 160"
            fill="none"
            stroke="#DFE7D5"
            strokeWidth="28"
            strokeLinecap="round"
            opacity="0.6"
          />
          <path
            d="M 220 50 Q 280 320 360 650"
            fill="none"
            stroke="#DFE7D5"
            strokeWidth="24"
            strokeLinecap="round"
            opacity="0.6"
          />
          <path
            d="M 120 540 Q 450 480 880 520"
            fill="none"
            stroke="#DFE7D5"
            strokeWidth="22"
            strokeLinecap="round"
            opacity="0.6"
          />
          <path
            d="M 680 80 Q 720 360 760 620"
            fill="none"
            stroke="#DFE7D5"
            strokeWidth="20"
            strokeLinecap="round"
            opacity="0.6"
          />

          {/* Secondary Arteries */}
          <path
            d="M 80 180 Q 300 240 520 200 T 920 160"
            fill="none"
            stroke="#C9D6BE"
            strokeWidth="3"
            strokeDasharray="6,4"
          />
          <path
            d="M 220 50 Q 280 320 360 650"
            fill="none"
            stroke="#C9D6BE"
            strokeWidth="3"
            strokeDasharray="6,4"
          />
          <path
            d="M 120 540 Q 450 480 880 520"
            fill="none"
            stroke="#C9D6BE"
            strokeWidth="3"
            strokeDasharray="6,4"
          />

          {/* District Labels */}
          <text x="160" y="140" fill="#99A692" fontSize="13" fontWeight="600" letterSpacing="1">
            MADHAPUR / HITEC
          </text>
          <text x="390" y="320" fill="#99A692" fontSize="13" fontWeight="600" letterSpacing="1">
            JUBILEE HILLS
          </text>
          <text x="560" y="240" fill="#99A692" fontSize="13" fontWeight="600" letterSpacing="1">
            BANJARA HILLS
          </text>
          <text x="730" y="440" fill="#99A692" fontSize="13" fontWeight="600" letterSpacing="1">
            CENTRAL / SECUNDERABAD
          </text>

          {/* Incident Markers */}
          {incidents.map((incident) => {
            const { x, y } = getCoordinates(
              incident.location?.latitude,
              incident.location?.longitude
            );
            const isSelected =
              incident.id === activePopupId || incident.id === selectedIncidentId;
            const isResolved =
              incident.status === 'Resolved' || incident.incidentState === 'COMPLETED';
            const isCritical = incident.severity === 'High' || incident.severity === 'Critical';

            return (
              <g
                key={incident.id}
                className="cursor-pointer transition-transform duration-200"
                onClick={() => {
                  setActivePopupId(incident.id);
                  if (onSelectIncident) {
                    onSelectIncident(incident);
                  }
                }}
              >
                {/* Outer Pulse for selected or high priority */}
                {isSelected && (
                  <circle
                    cx={x}
                    cy={y}
                    r="26"
                    fill="#4D602B"
                    opacity="0.18"
                    className="animate-ping"
                  />
                )}

                {/* Marker Aura */}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? '19' : '14'}
                  fill={isSelected ? '#435322' : isResolved ? '#788970' : '#4D602B'}
                  opacity={isSelected ? '0.25' : '0.15'}
                />

                {/* Pin Head */}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? '12' : '9'}
                  fill={isResolved ? '#5A6C53' : isCritical ? '#3C4E20' : '#435322'}
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  className="shadow-sm"
                />

                {/* Center dot */}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? '4' : '3'}
                  fill="#FFFFFF"
                />

                {/* Pin label */}
                <text
                  x={x}
                  y={y - (isSelected ? 20 : 15)}
                  textAnchor="middle"
                  fill="#2A3819"
                  fontSize={isSelected ? '11' : '10'}
                  fontWeight="700"
                  className="pointer-events-none drop-shadow-xs"
                >
                  {incident.id.replace('CF-2026-', '#')}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected Incident Popup Card (Overlay inside Map) */}
        {selectedIncident && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-sm bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-[#CAD9BD] shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-150">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-bold text-[#4D602B] bg-[#F1F6EC] px-2 py-0.5 rounded border border-[#D5E1CA]">
                  {selectedIncident.id}
                </span>
                <span className="text-[11px] font-semibold text-[#182315] bg-[#F2F6ED] px-2 py-0.5 rounded">
                  {selectedIncident.category}
                </span>
              </div>

              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  selectedIncident.severity === 'High' || selectedIncident.severity === 'Critical'
                    ? 'bg-[#F2EFE8] text-[#4A3D1E] border-[#D9CEB2]'
                    : 'bg-[#EEF4E6] text-[#34461B] border-[#CFDEBE]'
                }`}
              >
                {selectedIncident.severity || 'Medium'}
              </span>
            </div>

            <h4 className="text-sm font-bold text-[#182315] leading-snug truncate">
              {selectedIncident.title}
            </h4>

            <p className="text-xs text-[#5D6F55] mt-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#7F9276] shrink-0" />
              <span className="truncate">{selectedIncident.location?.address}</span>
            </p>

            <div className="mt-3 pt-2.5 border-t border-[#EDF3E6] flex items-center justify-between">
              <span className="text-[11px] font-medium text-[#4D602B]">
                Status: {selectedIncident.status}
              </span>

              <button
                type="button"
                onClick={() => navigate(`/officer/incidents/${selectedIncident.id}`)}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#435322] hover:text-[#2F3C16] transition-colors"
              >
                <span>View Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Compass / Legend in top corner */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 border border-[#E3EDD6] text-[10px] text-[#63755C] space-y-1 pointer-events-none hidden sm:block">
          <div className="flex items-center gap-1.5 font-semibold text-[#2D3B1B]">
            <Navigation className="w-3 h-3 text-[#4D602B]" />
            <span>Hyderabad Municipal District</span>
          </div>
          <div className="flex items-center gap-2 text-[9px] text-[#788B70]">
            <span className="inline-block w-2 h-2 rounded-full bg-[#435322]" />
            <span>Active Incident</span>
            <span className="inline-block w-2 h-2 rounded-full bg-[#5A6C53]" />
            <span>Resolved</span>
          </div>
        </div>
      </div>
    </div>
  );
};
