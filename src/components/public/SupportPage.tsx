import React, { useState } from 'react';
import { Search, ChevronDown, Phone, Mail, MessageSquare, Check, ExternalLink } from 'lucide-react';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'citizen' | 'officer' | 'general';
}

export const SupportPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatResponses, setChatResponses] = useState<Array<{ sender: 'user' | 'support'; text: string }>>([
    {
      sender: 'support',
      text: 'Hello! Welcome to CivicFlow AI Support. How can we help coordinate your civic request today?',
    },
  ]);

  const faqs: FaqItem[] = [
    {
      id: 'faq-1',
      question: 'How do I report an issue?',
      answer:
        'To report an issue, log in as a Citizen using your mobile number and prototype OTP. Tap "Report Issue", capture or upload a clear photo of the irregularity (pothole, streetlight failure, garbage overflow), confirm your location via GPS, and submit. CivicFlow AI will auto-triage and dispatch the ticket to the relevant municipal department.',
      category: 'citizen',
    },
    {
      id: 'faq-2',
      question: 'How can I track my complaint?',
      answer:
        'Every submitted issue is assigned a unique tracking ID (e.g. #CF-2849). You can track real-time SLA progression, department assignment, and officer field updates directly from your dashboard under "My Reports".',
      category: 'citizen',
    },
    {
      id: 'faq-3',
      question: "Why haven't I received the OTP?",
      answer:
        'OTP verification is delivered via SMS to your registered 10-digit mobile number. Please check your network connection and ensure your number is entered accurately. If the code does not arrive within 60 seconds, tap "Resend OTP".',
      category: 'general',
    },
    {
      id: 'faq-4',
      question: 'What do the status updates mean?',
      answer:
        '• Reported: Issue logged and queued for AI classification.\n• Triaged: Department & severity SLA determined.\n• Dispatched: Field officer assigned to location.\n• Resolved: Problem fixed and verified with photo proof.',
      category: 'general',
    },
    {
      id: 'faq-5',
      question: 'I am an officer. How do I login?',
      answer:
        'Switch to "Officer Login" on the portal login card. Enter your registered departmental mobile number (or use the quick "Officer Demo" preset). Upon entering the verification code, you will access the municipal field operations view.',
      category: 'officer',
    },
    {
      id: 'faq-6',
      question: 'How do I contact the right department?',
      answer:
        'You do not need to identify specific municipal departments yourself! CivicFlow AI’s coordination engine automatically parses photo metadata and categorization to route directly to sanitation, public works, water board, or electrical maintenance.',
      category: 'general',
    },
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    const userText = chatMessage.trim();
    setChatResponses((prev) => [...prev, { sender: 'user', text: userText }]);
    setChatMessage('');

    setTimeout(() => {
      setChatResponses((prev) => [
        ...prev,
        {
          sender: 'support',
          text: 'Thank you! Our CivicFlow support team has received your query regarding "' + userText + '". For urgent municipal assistance, please also call our toll-free line: 1800 123 4567.',
        },
      ]);
    }, 600);
  };

  return (
    <div className="w-full bg-[#FAF8F5] min-h-[calc(100vh-160px)] relative overflow-hidden">
      {/* Decorative leaf watermarks in bottom-left matching reference image */}
      <svg
        className="absolute -bottom-16 -left-16 w-80 h-80 text-[#E2EBD5]/50 pointer-events-none select-none -z-0"
        viewBox="0 0 200 200"
        fill="currentColor"
      >
        <path d="M40 180C40 110 90 60 160 50C160 120 110 170 40 180Z" />
        <path d="M20 120C40 70 90 40 150 40C130 90 80 120 20 120Z" opacity="0.6" />
      </svg>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Heading & Introduction */}
          <div className="lg:col-span-4">
            <span className="text-xs font-bold tracking-[0.2em] text-[#697962] uppercase block mb-3">
              SUPPORT
            </span>

            <h1 className="text-4xl sm:text-5xl font-bold text-[#182315] tracking-tight leading-[1.12]">
              We’re here <br />
              to <span className="text-[#4D602B]">help.</span>
            </h1>

            <p className="mt-5 text-sm sm:text-base text-[#55644F] leading-relaxed max-w-sm">
              Find quick answers to common questions and get the support you need.
            </p>
          </div>

          {/* Right Column: Search + FAQ Accordion + Still Need Help Card */}
          <div className="lg:col-span-8 space-y-6">
            {/* Top Search Bar matching reference */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-[#4D602B]">
                <Search className="w-5 h-5" />
              </div>
              <input
                id="support-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for help (e.g. report issue, track status...)"
                className="w-full pl-13 pr-6 py-3.5 bg-white border border-[#DCE4D2] rounded-full text-sm text-[#182315] placeholder:text-[#8D9C86] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4D602B] focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-5 flex items-center text-xs text-[#7B8B74] hover:text-[#182315]"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Content Area: Accordion & Right Support Card */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
              {/* Accordion: 7 cols on md */}
              <div className="md:col-span-7 space-y-3">
                <h3 className="text-base font-bold text-[#182315] mb-4">
                  Frequently Asked Questions
                </h3>

                {filteredFaqs.length === 0 ? (
                  <div className="p-6 bg-white border border-[#E0E7D6] rounded-2xl text-center text-xs text-[#6F7F68]">
                    No results found for &ldquo;{searchQuery}&rdquo;. Try another keyword or browse our support contacts.
                  </div>
                ) : (
                  filteredFaqs.map((faq) => {
                    const isOpen = openFaqId === faq.id;
                    return (
                      <div
                        key={faq.id}
                        className="bg-white border border-[#E1E8D8] rounded-2xl overflow-hidden transition-all shadow-2xs hover:border-[#CAD8BE]"
                      >
                        <button
                          type="button"
                          onClick={() => toggleFaq(faq.id)}
                          className="w-full py-4 px-5 flex items-center justify-between text-left focus:outline-none"
                        >
                          <span className="text-sm font-semibold text-[#182315] pr-3">
                            {faq.question}
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 text-[#697962] shrink-0 transition-transform duration-200 ${
                              isOpen ? 'transform rotate-180 text-[#4D602B]' : ''
                            }`}
                          />
                        </button>

                        {isOpen && (
                          <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#576850] border-t border-[#F2F6ED] leading-relaxed whitespace-pre-line animate-in fade-in duration-150">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Right Side Card: Still need help? matching reference */}
              <div className="md:col-span-5">
                <div className="bg-[#F4F7EE] border border-[#E0E9D5] rounded-3xl p-6 sm:p-7 shadow-sm space-y-6 sticky top-24">
                  <h3 className="text-base font-bold text-[#182315]">
                    Still need help?
                  </h3>

                  {/* Call Us */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-[#1E2819] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#182315]">Call Us</h4>
                      <p className="text-sm font-bold text-[#182315] mt-0.5 tracking-tight">
                        1800 123 4567
                      </p>
                      <span className="text-[11px] text-[#6F8067] block mt-0.5">
                        Mon - Sat, 9 AM - 6 PM
                      </span>
                    </div>
                  </div>

                  {/* Email Us */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-[#1E2819] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#182315]">Email Us</h4>
                      <a
                        href="mailto:support@civicflowai.in"
                        className="text-xs font-semibold text-[#4D602B] hover:underline mt-0.5 block break-all"
                      >
                        support@civicflowai.in
                      </a>
                      <span className="text-[11px] text-[#6F8067] block mt-0.5">
                        Average response: ~2 hours
                      </span>
                    </div>
                  </div>

                  {/* Live Chat */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-[#1E2819] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#182315]">Live Chat</h4>
                      <button
                        type="button"
                        onClick={() => setChatModalOpen(true)}
                        className="text-xs font-semibold text-[#4D602B] hover:underline mt-0.5 text-left block"
                      >
                        Chat with our support team
                      </button>
                      <span className="text-[11px] text-[#6F8067] block mt-0.5">
                        Direct support response
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#DDE6D2] text-[11px] text-[#7A8A73] leading-snug">
                    CivicFlow Citizen & Municipal Support
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Chat Prototype Modal */}
      {chatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-[#DCE4D0] overflow-hidden flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#FAF8F5] border-b border-[#E7ECE0] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#3A4B1F] text-white flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#182315]">CivicFlow Live Support</h4>
                  <span className="text-[10px] text-emerald-700 flex items-center gap-1 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    Support Team Online
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setChatModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold px-2 py-1 rounded"
              >
                ✕
              </button>
            </div>

            {/* Chat conversation area */}
            <div className="p-4 flex-1 overflow-y-auto space-y-3 bg-[#FAF8F5]/50 min-h-[220px]">
              {chatResponses.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs ${
                      msg.sender === 'user'
                        ? 'bg-[#435322] text-white rounded-br-none'
                        : 'bg-white border border-[#E0E7D6] text-[#182315] rounded-bl-none shadow-2xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendChat} className="p-3 bg-white border-t border-[#E7ECE0] flex gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Type your civic question..."
                className="flex-1 px-4 py-2 text-xs bg-[#F7F9F4] border border-[#DDE5D2] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#4D602B] text-[#182315]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#435322] text-white text-xs font-semibold rounded-xl hover:bg-[#35431A]"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
