import React, { useState } from 'react';
import {
  Sparkles,
  MapPin,
  Mic,
  MicOff,
  Navigation,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { IssueCategory, ReportMedia } from '../../types/report';
import { analyzeReportWithAI, AISuggestionResult } from '../../services/reportService';
import { useReports } from '../../context/ReportsContext';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from '../../context/RouterContext';
import { EvidenceUploader } from './EvidenceUploader';

const CATEGORY_OPTIONS: IssueCategory[] = [
  'Pothole',
  'Waterlogging',
  'Garbage',
  'Streetlight',
  'Traffic',
  'Other',
];

export const ReportForm: React.FC = () => {
  const { addReport } = useReports();
  const { session } = useAuth();
  const { navigate } = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<IssueCategory>('Pothole');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState<number | undefined>();
  const [longitude, setLongitude] = useState<number | undefined>();
  const [media, setMedia] = useState<ReportMedia[]>([]);

  // AI Suggestion State
  const [aiResult, setAiResult] = useState<AISuggestionResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Geolocation State
  const [locationMode, setLocationMode] = useState<'current' | 'manual'>('current');
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoMessage, setGeoMessage] = useState<string | null>(null);

  // Voice Input State
  const [isListening, setIsListening] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  // Validation / Submission
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // AI Suggestions Handler
  const handleGetAiSuggestions = () => {
    if (!title.trim() && !description.trim()) {
      setFormError('Please enter a title or description first to get AI suggestions.');
      return;
    }
    setFormError(null);
    setIsAnalyzing(true);

    setTimeout(() => {
      const result = analyzeReportWithAI(title, description);
      setAiResult(result);
      setIsAnalyzing(false);
    }, 400);
  };

  const handleApplyAiSuggestion = () => {
    if (aiResult) {
      setCategory(aiResult.category);
    }
  };

  // Geolocation Handler
  const handleUseCurrentLocation = () => {
    setLocationMode('current');
    setGeoMessage(null);
    if (!navigator.geolocation) {
      setGeoMessage('Geolocation is not supported by your browser. Please enter location manually.');
      setLocationMode('manual');
      return;
    }

    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLatitude(lat);
        setLongitude(lng);
        const resolvedAddress = `Near Coordinates: ${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E, Hyderabad`;
        setAddress(resolvedAddress);
        setGeoMessage(`Location detected: ${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`);
        setGeoLoading(false);
      },
      (error) => {
        console.warn('Geolocation error:', error);
        setGeoMessage('Could not retrieve GPS coordinates. You can still type your address manually.');
        setGeoLoading(false);
      },
      { timeout: 10000 }
    );
  };

  // Web Speech Voice Input Handler
  const handleToggleVoice = () => {
    setVoiceNotice(null);

    // Check browser compatibility
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: any }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceNotice('Voice input is not supported in this browser. You can type directly in the description.');
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
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setDescription((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        setVoiceNotice('Could not capture speech. Please ensure microphone permissions are allowed or type description.');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setVoiceNotice('Microphone access is not available.');
      setIsListening(false);
    }
  };

  // Form Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!title.trim()) {
      setFormError('Please enter a brief title for the issue.');
      return;
    }

    if (!description.trim()) {
      setFormError('Please provide a description of the problem.');
      return;
    }

    if (!address.trim()) {
      setFormError('Please provide a location (use current location or enter address).');
      return;
    }

    setIsSubmitting(true);

    try {
      const newReport = addReport({
        citizenId: session?.phone || 'CIT-8821',
        title: title.trim(),
        description: description.trim(),
        category,
        location: {
          address: address.trim(),
          latitude,
          longitude,
        },
        media,
        severity: aiResult?.severity || 'Medium',
        aiSummary: aiResult?.summary,
      });

      navigate(`/citizen/reports/${newReport.id}`);
    } catch (err) {
      console.error('Failed to submit report:', err);
      setFormError('An error occurred while saving your report. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E4ECD8] shadow-xs max-w-3xl mx-auto">
      {/* Header */}
      <div className="border-b border-[#EEF2E6] pb-6 mb-8">
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#697A62] block mb-1">
          CITIZEN REPORTING
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#182315] tracking-tight">
          Report New Issue
        </h2>
        <p className="mt-2 text-sm sm:text-base text-[#576650] leading-relaxed">
          Tell us what happened. CivicFlow will help identify and coordinate the response.
        </p>
      </div>

      {formError && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>{formError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-7">
        {/* Title */}
        <div>
          <label
            htmlFor="report-title"
            className="text-xs font-bold uppercase tracking-wider text-[#182315] block mb-2"
          >
            Title
          </label>
          <input
            id="report-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Brief title of the issue"
            className="w-full px-4 py-3 rounded-xl border border-[#D5DFC9] focus:border-[#4D602B] focus:ring-2 focus:ring-[#4D602B]/20 text-sm text-[#182315] placeholder-[#94A48C] transition-all bg-[#FAFBF9]"
          />
        </div>

        {/* Description & Voice Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="report-description"
              className="text-xs font-bold uppercase tracking-wider text-[#182315]"
            >
              Description
            </label>

            {/* Voice Input Button */}
            <button
              type="button"
              onClick={handleToggleVoice}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                isListening
                  ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
                  : 'bg-[#F2F6ED] text-[#435322] border-[#D8E3CC] hover:bg-[#E7EFE0]'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-3.5 h-3.5 text-rose-600" />
                  <span>Listening...</span>
                </>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5 text-[#435322]" />
                  <span>Describe by Voice</span>
                </>
              )}
            </button>
          </div>

          <textarea
            id="report-description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the problem in detail"
            className="w-full px-4 py-3 rounded-xl border border-[#D5DFC9] focus:border-[#4D602B] focus:ring-2 focus:ring-[#4D602B]/20 text-sm text-[#182315] placeholder-[#94A48C] transition-all bg-[#FAFBF9] resize-y"
          />

          {voiceNotice && (
            <p className="mt-1.5 text-xs text-[#71826B]">{voiceNotice}</p>
          )}

          {/* AI Suggestions Trigger */}
          <div className="mt-2.5 flex items-center justify-between">
            <button
              type="button"
              onClick={handleGetAiSuggestions}
              disabled={isAnalyzing}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#F0F5E9] hover:bg-[#E3EDD5] text-[#36491E] border border-[#CAD8BC] transition-colors shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#4D602B]" />
              <span>{isAnalyzing ? 'Analyzing...' : 'Get AI Suggestions'}</span>
            </button>
            <span className="text-[11px] text-[#71826B]">
              Auto-categorizes severity & department scope
            </span>
          </div>

          {/* AI Suggestion Output Card */}
          {aiResult && (
            <div className="mt-3.5 p-4 rounded-xl bg-[#F6F9F1] border border-[#D5E2C7] animate-in fade-in duration-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#435322] flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#4D602B]" />
                  AI Analysis Suggestion
                </span>
                <button
                  type="button"
                  onClick={handleApplyAiSuggestion}
                  className="text-xs font-semibold text-[#435322] hover:underline"
                >
                  Apply to Form ✓
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#52634A]">
                <div>
                  <span className="text-[10px] text-[#7C8F73] block">Category</span>
                  <span className="font-bold text-[#182315]">{aiResult.category}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#7C8F73] block">Possible Severity</span>
                  <span className="font-semibold text-[#384A1F]">{aiResult.severity}</span>
                </div>
                <div className="sm:col-span-1">
                  <span className="text-[10px] text-[#7C8F73] block">Summary</span>
                  <span className="text-[#364426] leading-tight block truncate" title={aiResult.summary}>
                    {aiResult.summary}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Issue Type */}
        <div>
          <label
            htmlFor="report-category"
            className="text-xs font-bold uppercase tracking-wider text-[#182315] block mb-2"
          >
            Issue Type
          </label>
          <div className="relative">
            <select
              id="report-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as IssueCategory)}
              className="w-full px-4 py-3 rounded-xl border border-[#D5DFC9] focus:border-[#4D602B] focus:ring-2 focus:ring-[#4D602B]/20 text-sm text-[#182315] bg-[#FAFBF9] appearance-none cursor-pointer transition-all"
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#6A7B62]">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
          <p className="mt-1 text-[11px] text-[#697B62]">
            You do not need to choose a government department. Simply describe what needs attention.
          </p>
        </div>

        {/* Location Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-[#182315]">
              Location
            </label>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors inline-flex items-center gap-1 ${
                  locationMode === 'current'
                    ? 'bg-[#435322] text-white border-[#435322]'
                    : 'bg-[#FAFBF8] text-[#55644F] border-[#D5DFC9] hover:bg-[#F2F6ED]'
                }`}
              >
                <Navigation className="w-3 h-3" />
                <span>Use Current Location</span>
              </button>
              <button
                type="button"
                onClick={() => setLocationMode('manual')}
                className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                  locationMode === 'manual'
                    ? 'bg-[#435322] text-white border-[#435322]'
                    : 'bg-[#FAFBF8] text-[#55644F] border-[#D5DFC9] hover:bg-[#F2F6ED]'
                }`}
              >
                Enter Location
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#73846C]">
              <MapPin className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                setLocationMode('manual');
              }}
              placeholder="E.g. Main Road near Metro Pillar 142, Banjara Hills, Hyderabad"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#D5DFC9] focus:border-[#4D602B] focus:ring-2 focus:ring-[#4D602B]/20 text-sm text-[#182315] placeholder-[#94A48C] transition-all bg-[#FAFBF9]"
            />
          </div>

          {geoLoading && (
            <p className="text-xs text-[#52634A] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#4D602B] animate-ping" />
              Retrieving device GPS coordinates...
            </p>
          )}

          {geoMessage && (
            <p className="text-xs text-[#596B51] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#4D602B]" />
              {geoMessage}
            </p>
          )}
        </div>

        {/* Evidence Uploader */}
        <EvidenceUploader media={media} onMediaChange={setMedia} />

        {/* Submit Button */}
        <div className="pt-4 border-t border-[#EEF2E6] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/citizen/dashboard')}
            className="px-5 py-3 rounded-xl text-sm font-medium text-[#576650] hover:text-[#182315] hover:bg-[#F2F5ED] transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#435322] hover:bg-[#35431A] text-white font-medium text-sm rounded-xl transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4D602B] disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Submitting Report...' : 'Submit Report →'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
