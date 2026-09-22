import React, { useState } from 'react';
import {
  Camera,
  MapPin,
  Mic,
  MicOff,
  Sparkles,
  Upload,
  X,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Navigation,
  FileText
} from 'lucide-react';
import { useRouter } from '../../context/RouterContext';
import { useAuth } from '../../context/AuthContext';
import { IssueCategory, ReportMediaItem, AISuggestionResult } from '../../types/citizen';
import { createReport, getAISuggestions } from '../../services/reportsService';

const CATEGORIES: IssueCategory[] = [
  'Pothole',
  'Waterlogging',
  'Garbage',
  'Streetlight',
  'Traffic',
  'Other',
];

export const ReportIssuePage: React.FC = () => {
  const { navigate } = useRouter();
  const { session } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<IssueCategory>('Pothole');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState<number | undefined>();
  const [longitude, setLongitude] = useState<number | undefined>();
  const [mediaList, setMediaList] = useState<ReportMediaItem[]>([]);
  const [aiResult, setAiResult] = useState<AISuggestionResult | null>(null);
  const [isAnalyzingAi, setIsAnalyzingAi] = useState(false);

  // Voice state
  const [isListening, setIsListening] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  // Geolocation state
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoNotice, setGeoNotice] = useState<string | null>(null);

  // Form error state
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Voice input handler using browser Web Speech API
  const handleToggleVoice = () => {
    setVoiceNotice(null);
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceNotice('Speech recognition is not supported in this browser. Please type your description.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceNotice('Listening... Speak clearly into your microphone.');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (transcript) {
          setDescription((prev) => (prev ? `${prev} ${transcript}` : transcript));
          setVoiceNotice('Voice captured successfully.');
        }
        setIsListening(false);
      };

      recognition.onerror = (e: any) => {
        setIsListening(false);
        setVoiceNotice(e.error === 'not-allowed' ? 'Microphone permission denied.' : 'Voice recognition unavailable.');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
      setVoiceNotice('Voice input unavailable in this environment.');
    }
  };

  // Geolocation handler
  const handleGetCurrentLocation = () => {
    setGeoNotice(null);
    if (!navigator.geolocation) {
      setGeoNotice('Geolocation is not supported by your browser. Please enter location manually.');
      return;
    }

    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = parseFloat(pos.coords.latitude.toFixed(4));
        const lng = parseFloat(pos.coords.longitude.toFixed(4));
        setLatitude(lat);
        setLongitude(lng);
        const detectedAddress = `Near GPS (${lat}° N, ${lng}° E), Municipal Ward`;
        setAddress(detectedAddress);
        setGeoLoading(false);
        setGeoNotice(`Coordinates detected: ${lat}° N, ${lng}° E`);
      },
      () => {
        setGeoLoading(false);
        setGeoNotice('Location permission denied or unavailable. Please type your address manually.');
      },
      { timeout: 8000 }
    );
  };

  // AI Suggestion handler
  const handleGetAiSuggestions = () => {
    if (!title.trim() && !description.trim()) {
      setError('Please provide an issue title or description to analyze.');
      return;
    }
    setError(null);
    setIsAnalyzingAi(true);

    setTimeout(() => {
      const suggestion = getAISuggestions(title, description);
      setAiResult(suggestion);
      setCategory(suggestion.category);
      setIsAnalyzingAi(false);
    }, 400);
  };

  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newItems: ReportMediaItem[] = [];
    Array.from(files).forEach((file, index) => {
      const isVideo = file.type.startsWith('video');
      const url = URL.createObjectURL(file);
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      newItems.push({
        id: `upload-${Date.now()}-${index}`,
        name: file.name,
        type: isVideo ? 'video' : 'image',
        url,
        size: `${sizeMb} MB`,
      });
    });

    setMediaList((prev) => [...prev, ...newItems]);
    // Reset file input
    e.target.value = '';
  };

  const handleRemoveMedia = (id: string) => {
    setMediaList((prev) => prev.filter((m) => m.id !== id));
  };

  // Submit report handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Please enter a brief title for the civic issue.');
      return;
    }
    if (!description.trim()) {
      setError('Please provide a description explaining the problem.');
      return;
    }
    if (!address.trim()) {
      setError('Please provide the location or click "Use Current Location".');
      return;
    }

    setIsSubmitting(true);

    try {
      const created = createReport({
        citizenId: session?.phone || 'citizen_ashar',
        title: title.trim(),
        description: description.trim(),
        category,
        location: {
          address: address.trim(),
          latitude,
          longitude,
        },
        media: mediaList,
        severity: aiResult?.severity || 'Medium',
        aiSummary: aiResult?.shortSummary,
      });

      // Brief visual completion then redirect to report details
      setTimeout(() => {
        setIsSubmitting(false);
        navigate(`/citizen/reports/${created.id}`);
      }, 350);
    } catch {
      setIsSubmitting(false);
      setError('An error occurred while saving your report. Please try again.');
    }
  };

  return (
    <div className="w-full bg-[#FAF8F5] min-h-[calc(100vh-160px)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        {/* Page Header */}
        <div className="pb-6 border-b border-[#E4ECD8]">
          <span className="text-xs font-bold tracking-[0.2em] text-[#697962] uppercase block mb-2">
            NEW COMPLAINT
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#182315] tracking-tight">
            Report New Issue
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#55644F]">
            Tell us what happened. CivicFlow will help identify and coordinate the response.
          </p>
        </div>

        {/* Main Form Container */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-8">
          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Section 1: Issue Details */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E4ECD8] shadow-xs space-y-6">
            <h2 className="text-base font-bold text-[#182315] pb-2 border-b border-[#F0F4EC]">
              1. Issue Details
            </h2>

            {/* Title */}
            <div>
              <label htmlFor="issue-title" className="block text-xs font-bold uppercase tracking-wider text-[#697A62] mb-1.5">
                Issue Title <span className="text-rose-600">*</span>
              </label>
              <input
                id="issue-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Brief title of the issue"
                className="w-full px-4 py-2.5 rounded-xl border border-[#D4DCC9] bg-[#FDFCFB] text-sm text-[#182315] placeholder:text-[#9AA695] focus:outline-none focus:ring-2 focus:ring-[#4D602B] focus:border-transparent transition-all"
              />
            </div>

            {/* Description */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="issue-description" className="block text-xs font-bold uppercase tracking-wider text-[#697A62]">
                  Description <span className="text-rose-600">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleToggleVoice}
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                    isListening
                      ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
                      : 'bg-[#F4F7EE] text-[#4D602B] border-[#DCE4D1] hover:bg-[#EBF2E2]'
                  }`}
                >
                  {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  <span>{isListening ? 'Stop Listening' : 'Describe by Voice'}</span>
                </button>
              </div>

              <textarea
                id="issue-description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the problem in detail"
                className="w-full px-4 py-3 rounded-xl border border-[#D4DCC9] bg-[#FDFCFB] text-sm text-[#182315] placeholder:text-[#9AA695] focus:outline-none focus:ring-2 focus:ring-[#4D602B] focus:border-transparent transition-all resize-y"
              />

              {voiceNotice && (
                <p className="mt-1.5 text-xs text-[#62735B] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4D602B]" />
                  <span>{voiceNotice}</span>
                </p>
              )}
            </div>

            {/* AI Suggestions CTA */}
            <div className="pt-2">
              <button
                id="get-ai-suggestions-btn"
                type="button"
                onClick={handleGetAiSuggestions}
                disabled={isAnalyzingAi}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#F2F6ED] hover:bg-[#E8EFE1] text-[#3D4F23] border border-[#D4DFCA] text-xs font-semibold rounded-xl transition-all disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#4D602B]" />
                <span>{isAnalyzingAi ? 'Analyzing...' : 'Get AI Suggestions'}</span>
              </button>

              {aiResult && (
                <div className="mt-4 p-4 rounded-xl bg-[#F6F9F2] border border-[#D8E3CE] space-y-2 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#4D602B] uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#4D602B]" />
                      AI Analysis Suggestion
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-white text-[#4A5943] border border-[#D8E3CE] font-semibold">
                      Severity: {aiResult.severity}
                    </span>
                  </div>

                  <p className="text-xs text-[#4F5E48] leading-relaxed">
                    <strong className="text-[#182315]">Summary:</strong> {aiResult.shortSummary}
                  </p>

                  <div className="text-xs text-[#697962] pt-1">
                    Suggested Category:{' '}
                    <span className="font-semibold text-[#182315] bg-white px-2 py-0.5 rounded border border-[#D8E3CE]">
                      {aiResult.category}
                    </span>
                    <span className="ml-2 text-[11px] text-[#788871]">(You can modify it below)</span>
                  </div>
                </div>
              )}
            </div>

            {/* Category selection */}
            <div>
              <label htmlFor="issue-category" className="block text-xs font-bold uppercase tracking-wider text-[#697A62] mb-1.5">
                Issue Type
              </label>
              <select
                id="issue-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as IssueCategory)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#D4DCC9] bg-[#FDFCFB] text-sm text-[#182315] focus:outline-none focus:ring-2 focus:ring-[#4D602B] focus:border-transparent transition-all"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <p className="mt-1.5 text-xs text-[#71806A]">
                You do not need to know which department manages this. CivicFlow automatically routes your report.
              </p>
            </div>
          </div>

          {/* Section 2: Location */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E4ECD8] shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#F0F4EC]">
              <h2 className="text-base font-bold text-[#182315]">
                2. Location
              </h2>
              <button
                id="use-current-location-btn"
                type="button"
                onClick={handleGetCurrentLocation}
                disabled={geoLoading}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#F2F6ED] hover:bg-[#E8EFE1] text-[#435322] border border-[#D3DEC6] transition-all disabled:opacity-50 self-start sm:self-auto"
              >
                <Navigation className={`w-3.5 h-3.5 ${geoLoading ? 'animate-spin' : ''}`} />
                <span>{geoLoading ? 'Locating...' : 'Use Current Location'}</span>
              </button>
            </div>

            <div>
              <label htmlFor="location-address" className="block text-xs font-bold uppercase tracking-wider text-[#697A62] mb-1.5">
                Location Address <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7D8E76]">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  id="location-address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter street, landmark, or area (e.g. Main Road, Sector 4)"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D4DCC9] bg-[#FDFCFB] text-sm text-[#182315] placeholder:text-[#9AA695] focus:outline-none focus:ring-2 focus:ring-[#4D602B] focus:border-transparent transition-all"
                />
              </div>

              {geoNotice && (
                <p className="mt-1.5 text-xs text-[#62735B] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#4D602B]" />
                  <span>{geoNotice}</span>
                </p>
              )}
            </div>
          </div>

          {/* Section 3: Add Evidence */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E4ECD8] shadow-xs space-y-5">
            <h2 className="text-base font-bold text-[#182315] pb-2 border-b border-[#F0F4EC]">
              3. Add Evidence
            </h2>

            <div>
              <label
                htmlFor="media-file-upload"
                className="cursor-pointer border-2 border-dashed border-[#D4DCC9] hover:border-[#4D602B] bg-[#FAFBF8] hover:bg-[#F4F7EE] rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-white text-[#4D602B] group-hover:bg-[#4D602B] group-hover:text-white flex items-center justify-center transition-colors shadow-2xs mb-3 border border-[#E4ECD8]">
                  <Upload className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold text-[#182315] group-hover:text-[#4D602B] transition-colors">
                  + Add Photos or Videos
                </span>
                <span className="text-xs text-[#697962] mt-1">
                  Photos or videos can help explain the problem.
                </span>
                <input
                  id="media-file-upload"
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Media thumbnails preview */}
            {mediaList.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {mediaList.map((item) => (
                  <div
                    key={item.id}
                    className="relative group rounded-xl border border-[#DCE5D2] overflow-hidden bg-[#F8FAF4] aspect-square flex flex-col justify-end p-2"
                  >
                    {item.type === 'image' ? (
                      <img
                        src={item.url}
                        alt={item.name}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 text-white">
                        <FileText className="w-8 h-8 opacity-80" />
                      </div>
                    )}
                    <div className="relative z-10 bg-black/60 backdrop-blur-xs text-white p-1 rounded text-[10px] truncate">
                      {item.name}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveMedia(item.id)}
                      className="absolute top-1.5 right-1.5 z-20 w-6 h-6 rounded-full bg-black/70 hover:bg-rose-600 text-white flex items-center justify-center transition-colors"
                      title="Remove media"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/citizen/dashboard')}
              className="text-xs sm:text-sm font-semibold text-[#697A62] hover:text-[#182315] order-2 sm:order-1"
            >
              Cancel
            </button>

            <button
              id="submit-report-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#435322] hover:bg-[#35431A] text-white font-medium text-sm rounded-xl transition-all shadow-sm disabled:opacity-50 order-1 sm:order-2"
            >
              <span>{isSubmitting ? 'Submitting Report...' : 'Submit Report'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
