import React, { useState } from 'react';
import { MapPin, Mail, Phone, Clock, ArrowRight, CheckCircle2, Linkedin, Github, Youtube } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Please enter your name.';
    }
    if (!email.trim()) {
      newErrors.email = 'Please enter your email address.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!message.trim()) {
      newErrors.message = 'Please provide your message.';
    } else if (message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    // Simulate clean prototype submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 500);
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setSubject('General Inquiry');
    setMessage('');
    setIsSubmitted(false);
    setErrors({});
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: Heading & Description matching reference */}
          <div className="lg:col-span-4">
            <span className="text-xs font-bold tracking-[0.2em] text-[#697962] uppercase block mb-3">
              CONTACT US
            </span>

            <h1 className="text-4xl sm:text-5xl font-bold text-[#182315] tracking-tight leading-[1.12]">
              Let’s build <br />
              better cities <br />
              <span className="text-[#4D602B]">together.</span>
            </h1>

            <p className="mt-5 text-sm sm:text-base text-[#55644F] leading-relaxed max-w-sm">
              We’d love to hear from you. Reach out for collaborations, feedback,
              or support.
            </p>
          </div>

          {/* Middle Column: Send us a message form card */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-[#DFE7D6] rounded-3xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-lg font-bold text-[#182315] mb-5">
                Send us a message
              </h3>

              {isSubmitted ? (
                <div className="py-8 text-center space-y-4 animate-in fade-in duration-200">
                  <div className="w-14 h-14 bg-[#EFF4E7] text-[#4D602B] rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[#182315]">
                      Message Received!
                    </h4>
                    <p className="text-xs text-[#63745C] mt-1 max-w-xs mx-auto leading-relaxed">
                      Thank you, <span className="font-semibold text-[#182315]">{name}</span>. Our support team has received your message and will respond within 24 hours.
                    </p>
                  </div>
                  <button
                    id="contact-send-another-btn"
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#F2F6ED] hover:bg-[#E5ECD9] text-[#3A4B1F] text-xs font-semibold rounded-xl transition-colors"
                  >
                    Send Another Note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name field */}
                  <div>
                    <input
                      id="contact-name-input"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your Name"
                      className="w-full px-4 py-3 text-sm bg-white border border-[#DCE4D2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4D602B] text-[#182315] placeholder:text-[#909E8B] transition-all"
                    />
                    {errors.name && (
                      <span className="text-[11px] text-rose-600 mt-1 block">
                        {errors.name}
                      </span>
                    )}
                  </div>

                  {/* Email field */}
                  <div>
                    <input
                      id="contact-email-input"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your Email"
                      className="w-full px-4 py-3 text-sm bg-white border border-[#DCE4D2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4D602B] text-[#182315] placeholder:text-[#909E8B] transition-all"
                    />
                    {errors.email && (
                      <span className="text-[11px] text-rose-600 mt-1 block">
                        {errors.email}
                      </span>
                    )}
                  </div>

                  {/* Subject field (dropdown/select as required) */}
                  <div>
                    <select
                      id="contact-subject-select"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-4 py-3 text-sm bg-white border border-[#DCE4D2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4D602B] text-[#182315] transition-all cursor-pointer"
                    >
                      <option value="General Inquiry">Subject: General Inquiry</option>
                      <option value="Municipal Collaboration">Subject: Municipal Agency Collaboration</option>
                      <option value="Citizen Feedback">Subject: Citizen Feedback & Bug Report</option>
                      <option value="Technical Architecture">Subject: Technical & Integration Inquiries</option>
                    </select>
                  </div>

                  {/* Message field */}
                  <div>
                    <textarea
                      id="contact-message-input"
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Your Message"
                      className="w-full px-4 py-3 text-sm bg-white border border-[#DCE4D2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4D602B] text-[#182315] placeholder:text-[#909E8B] resize-none transition-all"
                    />
                    {errors.message && (
                      <span className="text-[11px] text-rose-600 mt-1 block">
                        {errors.message}
                      </span>
                    )}
                  </div>

                  {/* Submit Button matching reference */}
                  <button
                    id="contact-submit-btn"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 bg-[#435322] hover:bg-[#35431A] text-white font-medium text-sm rounded-xl transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4D602B] disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <span>Sending Message...</span>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right Column: Get in touch card matching reference */}
          <div className="lg:col-span-3">
            <div className="bg-[#F4F7EE] border border-[#E0E9D5] rounded-3xl p-6 sm:p-7 shadow-sm space-y-6">
              <h3 className="text-base font-bold text-[#182315]">
                Get in touch
              </h3>

              {/* Location */}
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-full bg-[#1E2819] text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#182315]">
                    CivicFlow AI
                  </h4>
                  <p className="text-xs text-[#5D6F55] mt-0.5">
                    Hyderabad, India
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-full bg-[#1E2819] text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#182315]">Email</h4>
                  <a
                    href="mailto:team@civicflowai.in"
                    className="text-xs text-[#4D602B] hover:underline font-semibold block mt-0.5 break-all"
                  >
                    team@civicflowai.in
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-full bg-[#1E2819] text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#182315]">Phone</h4>
                  <p className="text-xs font-mono text-[#182315] font-semibold mt-0.5">
                    +91 98765 43210
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-full bg-[#1E2819] text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#182315]">Hours</h4>
                  <p className="text-xs text-[#5D6F55] mt-0.5">
                    Mon - Sat <br />
                    9 AM - 6 PM
                  </p>
                </div>
              </div>

              {/* Socials Divider */}
              <div className="pt-4 border-t border-[#DDE6D2]">
                <h4 className="text-xs font-bold text-[#182315] mb-3">
                  Follow us
                </h4>
                <div className="flex items-center gap-3">
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-xl bg-white border border-[#DCE4D2] flex items-center justify-center text-[#1E2819] hover:text-[#4D602B] hover:border-[#4D602B] transition-colors"
                    title="LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-xl bg-white border border-[#DCE4D2] flex items-center justify-center text-[#1E2819] hover:text-[#4D602B] hover:border-[#4D602B] transition-colors"
                    title="GitHub"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-xl bg-white border border-[#DCE4D2] flex items-center justify-center text-[#1E2819] hover:text-[#4D602B] hover:border-[#4D602B] transition-colors"
                    title="YouTube"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
