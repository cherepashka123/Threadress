# Threadress - AI-Powered Fashion Discovery

A modern AI-powered fashion discovery platform built with Next.js and Square API integration, allowing users to find clothing and accessories from local boutiques using natural language search and instant pickup.

## 🎯 App Concept

Threadress is an **AI-powered fashion discovery platform** that connects customers with local boutiques through intelligent search and matching. Think of it as "Google for fashion" - users describe what they want in natural language, and AI finds the perfect match from local inventory for instant pickup.

### Key Features:

- **Natural Language Search**: "I need a long gold dress for tonight"
- **AI Style Matching**: Intelligent style vector matching with match scores
- **Local Inventory Sync**: Real-time availability across boutiques
- **Quick Pickup**: Reserve and pickup within hours
- **Distance Tracking**: See how far each boutique is
- **Smart Recommendations**: AI-powered style suggestions

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **AI/ML**: Style vector matching and natural language processing
- **Inventory**: Square API (Sandbox)
- **Styling**: Tailwind CSS with custom components

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Square Developer Account
- Square Sandbox Access Token

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd threadress-site
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file:

   ```env
   SQUARE_ACCESS_TOKEN=your_square_sandbox_access_token
   SQUARE_APP_ID=your_square_app_id
   SQUARE_ENVIRONMENT=sandbox
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🧪 Testing the Threadress App

### Square Demo Environment

Visit `/square-demo` to test the complete Threadress AI discovery platform with Square integration.

### Testing Flow:

1. **🔍 AI Discovery Tab**

   - Browse AI-matched items from local boutiques
   - See match scores and style tags
   - View distance and availability
   - Click "Reserve Now" to test pickup flow

2. **💬 Smart Search Tab**

   - Use natural language search: "I need a long gold dress for tonight"
   - Add style, occasion, color, and budget filters
   - Watch AI process and match results
   - See match scores and recommendations

3. **📦 Inventory Tab**

   - Real-time inventory tracking
   - Monitor item availability across locations
   - View stock levels and pricing

4. **📅 Reservations Tab**

   - Track pickup reservations
   - Monitor pickup status and timing
   - View reservation history

5. **📈 Analytics Tab**
   - AI matching performance metrics
   - Popular search terms and trends
   - Boutique performance data

### Key Testing Scenarios:

#### 1. Natural Language Search

1. Go to "Smart Search" tab
2. Enter: "I need a long gold dress for tonight's party"
3. Add filters: Style="Luxury", Budget="$100-300"
4. Click "Find My Perfect Match"
5. Review AI-matched results with scores

#### 2. AI Discovery Browse

1. Go to "AI Discovery" tab
2. Browse AI-matched items
3. Click on any item to see details
4. Check match score, distance, and availability
5. Click "Reserve & Pickup"

#### 3. Quick Pickup Flow

1. Select an item from discovery
2. Click "Reserve & Pickup"
3. Review pickup details
4. Confirm reservation
5. Check pickup location and timing

## 🏗️ Project Structure

```
src/
├── app/
│   ├── api/square/          # Square API routes
│   ├── square-demo/         # Threadress demo page
│   ├── threadress/          # Main app page
│   └── page.tsx            # Landing page
├── components/
│   ├── threadress/         # Threadress app components
│   ├── SquareDemo.tsx      # Square integration demo
│   └── ...
├── lib/
│   └── square-client.ts    # Square API client
└── scripts/
    └── bulk-upload.ts      # Product upload script
```

## 🔧 Square Integration

### API Endpoints

- `/api/square/catalog` - Product catalog management
- `/api/square/inventory` - Real-time inventory tracking
- `/api/square/customers` - Customer management
- `/api/square/orders` - Pickup reservation orders
- `/api/square/locations` - Boutique location management

### Key Features

- **Real-time Inventory**: Track item availability across locations
- **Order Management**: Handle pickup reservations as orders
- **Customer Profiles**: Store customer information
- **Multi-location**: Support multiple boutique locations
- **Instant Sync**: Live inventory updates

## 💡 Business Model

### Discovery & Pickup

- **Natural Language Search**: AI-powered query understanding
- **Style Matching**: Intelligent vector-based matching
- **Local Inventory**: Real-time boutique stock sync
- **Quick Pickup**: Reserve and pickup within hours
- **Distance Optimization**: Find closest available items

### Revenue Streams

- **Commission**: Percentage of successful pickups
- **Premium Features**: Advanced AI matching
- **Boutique Partnerships**: Featured listings
- **Analytics**: Business insights for boutiques

## 🎨 UI/UX Features

### Design System

- **Modern Interface**: Clean, intuitive design
- **Responsive Layout**: Works on all devices
- **AI Integration**: Visual match scores and recommendations
- **Loading States**: Smooth AI processing experience

### User Experience

- **Natural Language**: Type what you want in plain English
- **AI Matching**: Intelligent style and preference matching
- **Local Focus**: Find items nearby for quick pickup
- **Real-time Updates**: Live inventory and availability

## 🔒 Security & Compliance

- **PCI Compliance**: Square handles all payment data
- **Data Encryption**: Secure transmission of sensitive data
- **AI Ethics**: Transparent matching algorithms
- **Privacy**: User data protection and control

## 🚀 Deployment

### Production Setup

1. Update environment variables for production
2. Set `SQUARE_ENVIRONMENT=production`
3. Use production Square credentials
4. Deploy to your preferred hosting platform

### Recommended Platforms

- **Vercel**: Optimized for Next.js
- **Netlify**: Easy deployment and CI/CD
- **AWS**: Scalable infrastructure
- **Google Cloud**: Enterprise-grade hosting

## 📈 Future Enhancements

### Planned Features

- **Mobile App**: Native iOS/Android applications
- **Advanced AI**: Machine learning for better matching
- **Virtual Try-On**: AR/VR fitting experiences
- **Social Features**: Style sharing and recommendations
- **Voice Search**: Voice-activated fashion discovery
- **Delivery Options**: Same-day delivery service

### Technical Improvements

- **Real-time Chat**: Customer support integration
- **Advanced Analytics**: Deep learning insights
- **Predictive Inventory**: Smart restocking alerts
- **Multi-language**: International expansion support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

- Check the Square Developer Documentation
- Review the testing guide in `/square-demo`
- Open an issue in the repository

---

**Threadress** - Find your perfect piece with AI-powered discovery! 👗✨
