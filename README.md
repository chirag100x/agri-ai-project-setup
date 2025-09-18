# AgriAI - Agricultural AI Assistant

AgriAI is a comprehensive agricultural AI assistant that provides farmers with personalized crop recommendations, real-time weather insights, soil analysis, and expert farming guidance.

## Features

### 🌱 Core Functionality
- **AI-Powered Chat**: Intelligent agricultural assistant with natural language processing
- **Crop Recommendations**: Personalized crop suggestions based on soil, weather, and market conditions
- **Weather Intelligence**: Real-time weather data and 7-day forecasts
- **Soil Analysis**: Comprehensive soil health monitoring and nutrient analysis
- **Multilingual Support**: Available in 10+ regional languages

### 📊 Dashboard & Analytics
- **Farm Dashboard**: Centralized view of farm health, weather, and activities
- **Task Management**: Track farming activities and deadlines
- **Satellite Imagery**: NDVI analysis and vegetation health monitoring
- **Historical Data**: Chat history and farming activity logs

### 🔐 User Management
- **Secure Authentication**: Email/password login with profile management
- **Farm Profiles**: Customizable farm information and preferences
- **Data Privacy**: Secure handling of agricultural data

## Technology Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS v4**: Modern styling with design tokens
- **shadcn/ui**: High-quality UI components
- **Lucide Icons**: Beautiful icon library

### Backend
- **Next.js API Routes**: Serverless API endpoints
- **PostgreSQL**: Robust database for agricultural data
- **External APIs**: Weather, soil, and satellite data integration

### Integrations
- **Weather API**: Real-time weather data and forecasts
- **SoilGrids**: Global soil information system
- **Bhuvan/Satellite APIs**: Satellite imagery and NDVI analysis
- **OpenAI**: AI-powered agricultural advice

## Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- API keys for external services

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd agri-ai
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Fill in your API keys and database connection:
   \`\`\`env
   DATABASE_URL="your_postgresql_connection_string"
   OPENAI_API_KEY="your_openai_api_key"
   WEATHER_API_KEY="your_weather_api_key"
   BHUVAN_API_KEY="your_bhuvan_api_key"
   NEXTAUTH_SECRET="your_nextauth_secret"
   \`\`\`

4. **Set up the database**
   \`\`\`bash
   # Run the database initialization script
   psql -d your_database -f scripts/init-database.sql
   \`\`\`

5. **Start the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Open your browser**
   Navigate to `http://localhost:3000`

### Docker Deployment

1. **Build and run with Docker Compose**
   \`\`\`bash
   docker-compose up -d
   \`\`\`

2. **Access the application**
   - Application: `http://localhost:3000`
   - Database: `localhost:5432`

## Usage

### Demo Account
- **Email**: demo@agri.ai
- **Password**: password

### Key Features

1. **Chat with AgriAI**
   - Ask questions about crops, weather, soil, or farming practices
   - Get personalized recommendations based on your location and farm profile
   - Access multilingual support for regional languages

2. **Dashboard Overview**
   - Monitor weather conditions and forecasts
   - View crop recommendations and suitability scores
   - Track farming tasks and deadlines
   - Analyze soil health and nutrient levels

3. **Profile Management**
   - Update farm information (location, size, primary crops)
   - Manage account settings and preferences
   - View chat history and past recommendations

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration

### Agricultural Data
- `GET /api/weather?lat={lat}&lon={lon}` - Weather data by coordinates
- `GET /api/weather?city={city}` - Weather data by city
- `GET /api/soil?lat={lat}&lon={lon}` - Soil analysis data
- `GET /api/satellite?lat={lat}&lon={lon}` - Satellite imagery and NDVI

### AI Chat
- `POST /api/chat` - Generate AI responses for agricultural queries

## Database Schema

The application uses PostgreSQL with the following main tables:
- `users` - User accounts and farm profiles
- `chat_sessions` - Chat conversation sessions
- `chat_messages` - Individual chat messages
- `farm_fields` - User's farm field information
- `crop_recommendations` - AI-generated crop suggestions
- `farm_tasks` - Farming activity tracking
- `weather_cache` - Cached weather data
- `soil_cache` - Cached soil analysis data

## External Integrations

### Weather Data
- **OpenWeatherMap API**: Real-time weather and forecasts
- **Meteorological Services**: Local weather alerts and advisories

### Soil Information
- **SoilGrids**: Global soil property maps
- **Local Soil Testing**: Integration with regional soil testing services

### Satellite Imagery
- **Bhuvan (ISRO)**: Indian satellite imagery and geospatial data
- **Sentinel/Landsat**: Global satellite imagery for NDVI analysis

### AI Services
- **OpenAI GPT**: Natural language processing for agricultural advice
- **Custom Models**: Specialized agricultural knowledge models

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue on GitHub
- Contact: support@agri.ai
- Documentation: [docs.agri.ai](https://docs.agri.ai)

## Acknowledgments

- Agricultural research institutions for domain knowledge
- Open source community for tools and libraries
- Farmers and agricultural experts for feedback and insights
