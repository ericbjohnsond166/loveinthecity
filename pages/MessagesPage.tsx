import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, Copy, Check } from 'lucide-react';
import { MOCK_USERS } from '../constants';

export const MessagesPage: React.FC = () => {
  const telegramUrl = 'https://t.me/loveinthecity';
  const whatsappUrl = 'https://wa.me/1234567890'; // Update with your WhatsApp number
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    issue: 'reserve', // reserve, password, pin, funding, announcement, support
    selectedProfile: '',
    message: ''
  });

  const [copied, setCopied] = useState(false);

  // Generate pre-filled message
  const generateMessage = () => {
    const issueText = {
      reserve: 'I would like to reserve a date with',
      password: 'I need help changing my login password',
      pin: 'I need to reset my payment PIN',
      funding: 'I have a question about funding details',
      announcement: 'I would like to know about announcements',
      support: 'I need general support'
    };

    const selectedUser = MOCK_USERS.find(u => u.id === formData.selectedProfile);
    const baseMessage = `${issueText[formData.issue as keyof typeof issueText]}${selectedUser ? ` with ${selectedUser.name}` : ''}`;
    
    return `Hello! My name is ${formData.name || 'User'}. ${baseMessage}. ${formData.message ? `Additional details: ${formData.message}` : ''}`;
  };

  const message = generateMessage();

  const copyToClipboard = () => {
    const fullMessage = `📋 CUSTOMER INFO:\nName: ${formData.name || 'N/A'}\nPhone: ${formData.phone || 'N/A'}\n\n💬 MESSAGE:\n${message}`;
    navigator.clipboard.writeText(fullMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-full bg-gradient-to-b from-gray-50 to-white p-4 font-sans text-gray-900 pb-20">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Customer Care</h1>
        <p className="text-sm text-gray-500">Tell us what you need - we'll help you get matched!</p>
      </div>

      {/* Pre-fill Form Card */}
      <div className="bg-white rounded-2xl p-5 mb-6 border border-gray-200 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-2">
            <span className="text-primary font-bold">ℹ️</span>
          </div>
          Your Information
        </h3>

        {/* Name Input */}
        <div className="mb-4">
          <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Your Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-primary focus:bg-white focus:outline-none transition"
          />
        </div>

        {/* Phone Input */}
        <div className="mb-4">
          <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Phone Number</label>
          <input
            type="tel"
            placeholder="Your contact number"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-primary focus:bg-white focus:outline-none transition"
          />
        </div>

        {/* Issue Type */}
        <div className="mb-4">
          <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">What do you need?</label>
          <select
            value={formData.issue}
            onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-primary focus:bg-white focus:outline-none transition"
          >
            <option value="reserve">Reserve a date</option>
            <option value="password">Change password</option>
            <option value="pin">Reset PIN</option>
            <option value="funding">Funding details</option>
            <option value="announcement">Announcements</option>
            <option value="support">General support</option>
          </select>
        </div>

        {/* Profile Selection (if reserving) */}
        {formData.issue === 'reserve' && (
          <div className="mb-4">
            <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Which profile?</label>
            <select
              value={formData.selectedProfile}
              onChange={(e) => setFormData({ ...formData, selectedProfile: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-primary focus:bg-white focus:outline-none transition"
            >
              <option value="">Select a profile...</option>
              {MOCK_USERS.filter(u => u.id !== 'support').map(user => (
                <option key={user.id} value={user.id}>
                  {user.name}, {user.age} - {user.residence}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Additional Message */}
        <div className="mb-4">
          <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Additional Details (optional)</label>
          <textarea
            placeholder="Any other information..."
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-primary focus:bg-white focus:outline-none transition resize-none h-20"
          />
        </div>

        {/* Generated Message Preview */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4">
          <p className="text-[11px] font-bold text-blue-900 uppercase mb-2">Preview Message:</p>
          <p className="text-sm text-blue-800 leading-relaxed">{message}</p>
        </div>

        {/* Copy & Share Button */}
        <button
          onClick={copyToClipboard}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition flex items-center justify-center space-x-2 active:scale-95"
        >
          {copied ? (
            <>
              <Check size={18} />
              <span>Copied! Ready to share</span>
            </>
          ) : (
            <>
              <Copy size={18} />
              <span>Copy Message to Clipboard</span>
            </>
          )}
        </button>
      </div>

      {/* Main Service Card */}
      <div className="bg-gradient-to-br from-primary to-pink-600 text-white rounded-3xl p-8 mb-8 shadow-lg relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm">
            <MessageCircle size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Share With Our Team</h2>
          <p className="text-white/90 text-sm leading-relaxed">
            Copy your message above and paste it in the chat below. Our specialists will immediately know who you want to reserve and help you instantly!
          </p>
        </div>
      </div>

      {/* Contact Options */}
      <h3 className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-widest">Connect Now</h3>
      
      <div className="space-y-3 mb-8">
        {/* Telegram */}
        <a
          href={telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center p-5 bg-white rounded-2xl border border-gray-200 hover:border-blue-400 hover:shadow-lg active:scale-95 transition-all shadow-sm group cursor-pointer"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4 group-hover:bg-blue-200 transition">
            <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295-.41 0-.34-.145-.477-.477l-2.09-6.881c-.135-.43-.033-.662.352-.662l9.155-3.527c.41-.126.647.104.535.617z" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-gray-900 mb-0.5">Telegram</h4>
            <p className="text-xs text-gray-500">Paste message → Open chat</p>
          </div>
          <div className="text-blue-600 group-hover:text-blue-700 transition">
            <Send size={20} />
          </div>
        </a>

        {/* WhatsApp */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center p-5 bg-white rounded-2xl border border-gray-200 hover:border-green-400 hover:shadow-lg active:scale-95 transition-all shadow-sm group cursor-pointer"
        >
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4 group-hover:bg-green-200 transition">
            <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004c-1.052 0-2.081.405-2.84 1.12-.78.725-1.215 1.708-1.215 2.748 0 1.486.772 2.934 2.122 3.791 1.075.67 2.631 1.123 4.001 1.123h.004c2.176 0 4.236-1.41 5.115-3.44.559-1.331.665-2.432.318-3.519-.464-1.402-1.823-2.777-3.588-3.289-.52-.15-1.061-.226-1.629-.226 1.326-1.26 2.08-3.023 2.08-4.99 0-.268-.011-.533-.032-.795 1.326 1.26 2.08 3.023 2.08 4.99 0 .268.011.533.032.795-1.326-1.26-2.08-3.023-2.08-4.99 0-1.967.754-3.73 2.08-4.99-.021.262-.032.527-.032.795 0 1.967.754 3.73 2.08 4.99-1.326 1.26-2.08 3.023-2.08 4.99 0 .268.011.533.032.795z" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-gray-900 mb-0.5">WhatsApp</h4>
            <p className="text-xs text-gray-500">Paste message → Send directly</p>
          </div>
          <div className="text-green-600 group-hover:text-green-700 transition">
            <Send size={20} />
          </div>
        </a>
      </div>

      {/* Info Section */}
      <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
        <h4 className="font-bold text-green-900 mb-2 text-sm">⚡ How It Works:</h4>
        <ul className="text-xs text-green-800 space-y-1">
          <li>✓ Fill in your details above</li>
          <li>✓ Select the profile you're interested in</li>
          <li>✓ Copy your pre-filled message</li>
          <li>✓ Paste it to Telegram or WhatsApp</li>
          <li>✓ Our team matches you instantly!</li>
        </ul>
      </div>
    </div>
  );
};