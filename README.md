# Walmart Smart Shopping E-commerce Platform

A full-stack e-commerce platform with AI-powered shopping assistance, built with Next.js 14, Express.js, and a microservices architecture.

## 🚀 Features

- **Smart Shopping Assistant**: AI-powered product extraction from text and images
- **Multiple Input Methods**: Manual entry, text input, image upload, and camera capture
- **Product Search**: Intelligent product matching with top 6 results per item
- **Shopping Cart**: Full cart management with quantity adjustments and coupon support
- **Walmart Branding**: Clean, modern UI with authentic Walmart styling
- **Microservices Architecture**: Scalable backend with separate NLP and search services
- **Real-time Updates**: Seamless cart synchronization across pages

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │  NLP Service    │
│  (Next.js 14)   │◄──►│  (Express.js)   │◄──►│    (Port 4001)  │
│   Port 3000     │    │   Port 4000     │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │ Search Service  │
                       │   (Port 4002)   │
                       └─────────────────┘
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **React Dropzone** for file uploads
- **Axios** for API calls

### Backend
- **Express.js** REST API
- **Node.js** runtime
- **CORS** for cross-origin requests
- **Dotenv** for environment variables

### Services
- **IP Service**: Image processing for product extraction
- **Search Service**: Product search and matching with mock Walmart data
- **Natural** library for text processing

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd walmart-autocart
   ```

2. **Install dependencies for all services**
   ```bash
   npm run install:all
   ```

3. **Start all services**
   ```bash
   npm run dev
   ```

This will start:
- Frontend: http://localhost:3000
- Backend: http://localhost:4000
- NLP Service: http://localhost:4001
- Search Service: http://localhost:4002

### Manual Installation

If you prefer to start services individually:

```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend (in new terminal)
cd backend
npm install
npm run dev

# NLP Service (in new terminal)
cd nlp-service
npm install
npm run dev

# Search Service (in new terminal)
cd search-service
npm install
npm run dev
```

## 🐳 Docker Support

### Using Docker Compose
```bash
docker-compose up -d
```

### Building Individual Services
```bash
# Frontend
docker build -t walmart-frontend ./frontend

# Backend
docker build -t walmart-backend ./backend

# NLP Service
docker build -t walmart-nlp ./nlp-service

# Search Service
docker build -t walmart-search ./search-service
```

## 🌟 Usage

### 1. Home Page
- **Manual Entry**: Add products manually with names and quantities
- **Text Input**: Paste shopping lists or product descriptions
- **Image Upload**: Drag and drop product images
- **Camera Capture**: Take photos of products or shopping lists

### 2. Product Search
- System processes input through NLP service
- Finds top 6 product matches per item
- Displays results with prices, ratings, and reviews

### 3. Shopping Cart
- Add products to cart from results page
- Adjust quantities with +/- buttons
- Apply coupon codes (try "SAVE10" or "WELCOME")
- Proceed to checkout

### 4. Text Input Examples
```
2 gallons of milk
1 loaf of bread
toothpaste
bananas
```

or

```
- Milk (2 gallons)
- Bread
- Eggs (12 count)
- Toothpaste
```
or

### 🔽 Input: Handwritten Image

![Shopping List Image](./shopping_list.jpg)

User uploads this photo of a handwritten list containing:

1. Maggi 2 Packet  
2. Peanut Butter Creamy  
3. 1kg Maida  
4. Toothpaste  
5. Garam Masala

---

### 🪄 NLP Service Converts This To:

```json
[
  { "name": "Maggi", "query": "2 Packet Maggi" },
  { "name": "Peanut", "query": "Peanut Butter Creamy" },
  { "name": "Maida", "query": "1kg Maida" },
  { "name": "Toothpaste", "query": "Toothpaste" },
  { "name": "Garam", "query": "Garam Masala" }
]
  ```

## 🔧 Configuration

### Environment Variables

#### Frontend (.env.local)
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
NEXT_PUBLIC_NLP_SERVICE_URL=http://localhost:4001
NEXT_PUBLIC_SEARCH_SERVICE_URL=http://localhost:4002
```

#### Backend (.env)
```
PORT=4000
NLP_SERVICE_URL=http://localhost:4001
SEARCH_SERVICE_URL=http://localhost:4002
NODE_ENV=development
```

#### NLP Service (.env)
```
PORT=4001
NODE_ENV=development
MAX_FILE_SIZE=10mb
```

#### Search Service (.env)
```
PORT=4002
NODE_ENV=development
WALMART_API_KEY=your_walmart_api_key_here
CACHE_TTL=3600
```

## 📝 API Endpoints

### Backend (Port 4000)
- `POST /api/process-products` - Main processing endpoint

### NLP Service (Port 4001)
- `POST /api/extract-products` - Extract products from text/images

### Search Service (Port 4002)
- `POST /api/search-products` - Search for products

## 🎨 Styling

The application uses Walmart's official branding:
- **Primary Blue**: #0071ce
- **Walmart Yellow**: #ffc220
- **Typography**: BogleWeb font family
- **Clean Design**: Modern, accessible interface

## 🚧 Development

### Project Structure
```
walmart-autocart/
├── frontend/              # Next.js frontend
│   ├── src/
│   │   ├── app/           # App router pages
│   │   └── components/    # React components
│   └── public/            # Static assets
├── backend/               # Express.js backend
├── nlp-service/           # NLP microservice
├── search-service/        # Search microservice
└── docker-compose.yml     # Docker configuration
```

### Adding New Features
1. **New Components**: Add to `frontend/src/components/`
2. **New Pages**: Add to `frontend/src/app/`
3. **API Endpoints**: Add to respective service files
4. **Styling**: Use Tailwind classes with Walmart theme

### Testing
- Frontend components can be tested with Jest/React Testing Library
- Backend APIs can be tested with Postman or curl
- End-to-end testing with Cypress (future enhancement)

## 🔮 Future Enhancements

- **Real Walmart API Integration**: Replace mock data with actual Walmart API
- **Advanced NLP**: Implement more sophisticated product extraction
- **Image Recognition**: Add actual image processing capabilities
- **User Authentication**: Add login/signup functionality
- **Order History**: Track past purchases
- **Real Payment Integration**: Add Stripe/PayPal support
- **Mobile App**: React Native version
- **Analytics**: User behavior tracking
- **Caching**: Redis for improved performance
- **Search Optimization**: Elasticsearch integration

## 🐛 Known Issues

- Image processing returns mock data (needs actual ML integration)
- Cart persistence is local storage only
- No real payment processing
- Limited product database (mock data)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For issues and questions:
- Check the existing issues
- Create a new issue with detailed description
- Include steps to reproduce any bugs

---

Built with ❤️ using modern web technologies and Walmart's design principles.
