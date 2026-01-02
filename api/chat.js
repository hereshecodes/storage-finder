// Vercel Serverless Function for Storage Finder chatbot
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// FAQ knowledge base for quick responses
const FAQ_RESPONSES = {
  pricing: `Our storage units range from $49/month for small 5x5 units to $299/month for large 10x30 units. Prices vary by location, features (climate control, 24-hour access), and availability. Use our filters to find units in your budget!`,

  sizes: `We offer various unit sizes:
• Small (5x5): Perfect for boxes, small furniture - like a closet
• Medium (5x10): Fits a studio apartment - bed, dresser, boxes
• Large (10x10): Holds a 1-bedroom apartment's contents
• Extra Large (10x20): Fits a 2-3 bedroom home or vehicle
• Garage (10x30): For cars, boats, or large household moves`,

  climate: `Climate-controlled units maintain temperature between 55-85°F year-round. They're ideal for:
• Wood furniture (prevents warping)
• Electronics and appliances
• Photos, documents, artwork
• Wine collections
• Musical instruments
Expect to pay 20-50% more than standard units.`,

  security: `Our partner facilities offer multiple security features:
• 24/7 video surveillance
• Individual unit alarms
• Gated access with personal codes
• On-site management
• Well-lit facilities
Look for the security camera icon on unit listings!`,

  access: `Access hours vary by facility:
• Standard: 6am - 9pm daily
• Extended: 6am - 10pm
• 24-hour: Anytime access available
Filter by "24-Hour Access" to find units with round-the-clock availability.`,

  insurance: `Most facilities require insurance for stored items. Options include:
• Your homeowner's/renter's policy (often covers storage)
• Facility-provided coverage ($10-30/month)
• Third-party storage insurance
We recommend documenting items with photos before storing.`,

  reservation: `To reserve a unit:
1. Search by location or ZIP code
2. Filter by size, price, and features
3. Click "View Details" on your preferred unit
4. Complete the reservation form
Most facilities offer online reservations with first-month discounts!`,

  moving: `Many facilities offer moving help:
• Truck rentals at discounted rates
• Free moving truck with rental
• Packing supplies for purchase
• Dollies and carts on-site
Check the facility amenities when viewing details.`,

  payment: `Payment options typically include:
• Credit/debit cards (auto-pay available)
• ACH bank transfers
• Cash/check at office locations
Most facilities offer discounts for annual prepayment.`,

  cancellation: `Storage rentals are typically month-to-month:
• No long-term contracts required
• Give 30-day notice to cancel
• Prorated refunds may be available
• Remove all items by your last day
Check specific facility policies when reserving.`
};

// Keywords to match FAQs
const FAQ_KEYWORDS = {
  pricing: ['price', 'cost', 'how much', 'expensive', 'cheap', 'affordable', 'rate', 'monthly', 'pricing', 'pay'],
  sizes: ['size', 'dimension', 'big', 'small', 'large', 'fit', 'hold', 'space', 'square feet', 'sq ft', '5x5', '10x10', '10x20'],
  climate: ['climate', 'temperature', 'heat', 'cold', 'humidity', 'controlled', 'air condition', 'ac'],
  security: ['security', 'safe', 'secure', 'camera', 'surveillance', 'alarm', 'theft', 'break in'],
  access: ['access', 'hours', 'open', 'close', '24 hour', 'weekend', 'time', 'when can i'],
  insurance: ['insurance', 'coverage', 'protect', 'damage', 'liability', 'insure'],
  reservation: ['reserve', 'book', 'rent', 'how do i', 'get started', 'sign up', 'reservation'],
  moving: ['moving', 'truck', 'dolly', 'cart', 'packing', 'supplies', 'boxes', 'help move'],
  payment: ['payment', 'pay', 'credit card', 'debit', 'cash', 'check', 'auto pay', 'billing'],
  cancellation: ['cancel', 'stop', 'end', 'terminate', 'leave', 'move out', 'contract', 'month to month']
};

function findFAQMatch(message) {
  const lowerMessage = message.toLowerCase();

  for (const [topic, keywords] of Object.entries(FAQ_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerMessage.includes(keyword)) {
        return FAQ_RESPONSES[topic];
      }
    }
  }
  return null;
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, history = [] } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Try FAQ match first (no API call needed)
  const faqResponse = findFAQMatch(message);
  if (faqResponse) {
    return res.status(200).json({
      response: faqResponse,
      source: 'faq'
    });
  }

  // If no API key, return a helpful fallback
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(200).json({
      response: `I'd be happy to help! Here are some topics I can assist with:

• **Pricing** - Unit costs and what affects pricing
• **Sizes** - Which size is right for your needs
• **Climate Control** - When you need it
• **Security** - How facilities keep items safe
• **Access Hours** - When you can visit your unit
• **Reservations** - How to book a unit

Just ask about any of these topics!`,
      source: 'fallback'
    });
  }

  try {
    // Build conversation history for context
    const messages = [
      ...history.slice(-6).map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      system: `You are a helpful customer service assistant for Storage Finder, a self-storage marketplace demo.

Your role is to help users find the right storage unit and answer questions about self-storage.

Key information:
- This is a DEMO site with simulated data for portfolio purposes
- Users can search by location, filter by size/price/features
- Available features: climate control, 24-hour access, drive-up access, security cameras
- Sizes range from 5x5 (small closet) to 10x30 (large garage)
- Prices in the demo range from $49-$299/month

Keep responses concise (2-3 sentences for simple questions, brief lists for complex ones).
Be friendly and helpful. If asked about specific bookings or real facilities, remind them this is a demo.
For technical issues, suggest refreshing or trying different filters.`,
      messages
    });

    const assistantMessage = response.content[0].text;

    return res.status(200).json({
      response: assistantMessage,
      source: 'claude',
      usage: {
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens,
      }
    });

  } catch (error) {
    console.error('Chat error:', error);

    // Graceful fallback
    return res.status(200).json({
      response: `I'm having trouble connecting right now. In the meantime, try using our search filters to find storage units, or ask me about pricing, sizes, or security features!`,
      source: 'error'
    });
  }
}
