/**
 * Generate Telegram contact links for customer care
 * Auto-encodes customer info, profile interest, and issue type
 * 
 * ⚠️ NOTE: Customer care is now Telegram-only
 */

export const encodeMessage = (text: string): string => {
  return encodeURIComponent(text);
};

// Telegram contact information
const TELEGRAM_USERNAME = 'findlovenow'; // Replace with your Telegram bot/channel

/**
 * Generate Telegram contact link with pre-filled message
 */
export const generateTelegramLink = (message: string): string => {
  const encodedMessage = encodeMessage(message);
  return `https://t.me/${TELEGRAM_USERNAME}?text=${encodedMessage}`;
};

/**
 * Generate context-aware message for profile reservation
 */
export const generateReservationMessage = (
  profileName: string,
  profileAge: number,
  customerName?: string
): string => {
  if (customerName) {
    return `Hi! I'm ${customerName} and I'd like to reserve a date with ${profileName}, ${profileAge} years old. Can you help me with that?`;
  }
  return `Hi! I'd like to reserve a date with ${profileName}, ${profileAge} years old. Can you assist me?`;
};

/**
 * Generate context-aware message for service requests
 */
export const generateServiceMessage = (
  serviceType: string,
  details?: string,
  customerName?: string
): string => {
  const serviceMessages: { [key: string]: string } = {
    password: 'I need help changing my login password.',
    pin: 'I need to reset my payment PIN.',
    funding: 'I have questions about funding details.',
    announcement: 'Can you share the latest announcements?',
    support: 'I need general customer support.'
  };

  const message = serviceMessages[serviceType] || 'I need help with something.';
  const prefix = customerName ? `Hi! I'm ${customerName}. ` : 'Hi! ';
  const suffix = details ? ` Additional details: ${details}` : '';

  return `${prefix}${message}${suffix}`;
};

/**
 * Generate quick action message for common requests
 */
export const generateQuickMessage = (action: 'reserve' | 'support' | 'contact'): string => {
  const messages: { [key: string]: string } = {
    reserve: 'Hi! I\'m interested in making a reservation. Can you help me find a match?',
    support: 'Hi! I have a support question and need assistance.',
    contact: 'Hi! I\'d like to get in touch with your team.'
  };
  return messages[action];
};

/**
 * Generate full context message combining all information
 */
export const generateFullContextMessage = (
  profileName?: string,
  profileAge?: number,
  customerName?: string,
  phone?: string,
  serviceType?: string,
  location?: string,
  city?: string,
  state?: string
): string => {
  let message = customerName ? `👤 Name: ${customerName}\n` : '';
  message += phone ? `📱 Phone: ${phone}\n` : '';
  message += location ? `📍 Location: ${location}\n` : '';
  message += city ? `🏙️ City: ${city}\n` : '';
  message += state ? `🏛️ State: ${state}\n` : '';
  message += '\n---\n\n';

  if (profileName && profileAge) {
    message += `I'd like to reserve a date with ${profileName}, ${profileAge} years old.`;
  } else if (serviceType) {
    message += generateServiceMessage(serviceType, '', customerName);
  } else {
    message += 'I\'d like to connect with your customer care team.';
  }

  return message;
};
