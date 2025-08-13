# Protein Hub - Premium High-Protein Foods & Supplements

A modern MERN stack application for ordering high-protein foods, shakes, and supplements. Built with React, TypeScript, Node.js, Express, and MongoDB.

## 🏋️ Features

- **High-Protein Focus**: Specialized in protein shakes, bars, meals, and supplements
- **Protein Content Display**: Prominent display of protein content for each item
- **Modern UI/UX**: Beautiful, responsive design with Tailwind CSS
- **User Authentication**: Secure login/register with JWT
- **Shopping Cart**: Add items to cart and manage quantities
- **Order Management**: Track orders and delivery status
- **Admin Panel**: Manage products, orders, and users
- **Real-time Updates**: Live cart and order updates
- **Mobile Responsive**: Works perfectly on all devices

## 🍗 Protein Categories

- **Protein Shakes**: Whey protein, casein, and plant-based shakes
- **Protein Bars**: High-protein bars and snacks
- **Protein Meals**: Chicken, eggs, tuna, and other protein-rich meals
- **Protein Snacks**: Quick protein snacks and supplements
- **Protein Desserts**: Protein-rich desserts and treats
- **Protein Supplements**: Various protein supplements and powders

## 🚀 Tech Stack

### Frontend
- **React 18+** with TypeScript
- **Create React App** for development and build
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Hot Toast** for notifications
- **Lucide React** for icons
- **Axios** for API calls

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Bcrypt** for password hashing
- **CORS** for cross-origin requests
- **Dotenv** for environment variables

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd protein-hub
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   npm install

   # Install backend dependencies
   cd server
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the `server` directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/protein-hub
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   PORT=5000
   CLIENT_URL=http://localhost:5173
   ```

4. **Database Setup**
   ```bash
   cd server
   node seedData.js
   ```

5. **Run the application**
   
   **Terminal 1 - Backend:**
   ```bash
   cd server
   npm run dev
   ```
   
   **Terminal 2 - Frontend:**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

## 👥 Demo Accounts

### Admin Account
- **Email**: admin@proteinhub.com
- **Password**: password123
- **Features**: Manage products, orders, and users

### Customer Account
- **Email**: customer@proteinhub.com
- **Password**: password123
- **Features**: Browse products, add to cart, place orders

## 🎯 Key Features

### For Customers
- Browse high-protein foods by category
- Search and filter products
- View detailed nutrition information
- Add items to cart
- Place orders with delivery details
- Track order status
- View order history

### For Admins
- Manage product inventory
- Add/edit/delete products
- View and manage orders
- Update order status
- Monitor sales and analytics

## 🏗️ Project Structure

```
protein-hub/
├── client/                 # Frontend React app
├── server/                 # Backend Node.js app
│   ├── config/            # Database configuration
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   └── server.js         # Main server file
├── src/                  # Frontend source code
│   ├── components/       # Reusable components
│   ├── context/         # React context providers
│   ├── pages/           # Page components
│   ├── services/        # API services
│   ├── types/           # TypeScript types
│   └── utils/           # Utility functions
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Products
- `GET /api/foods` - Get all products
- `POST /api/foods` - Create new product (admin)
- `PUT /api/foods/:id` - Update product (admin)
- `DELETE /api/foods/:id` - Delete product (admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/:itemId` - Update cart item
- `DELETE /api/cart/:itemId` - Remove item from cart

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order status (admin)

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface
- **Protein-Focused**: Highlighted protein content
- **Responsive**: Works on all screen sizes
- **Accessible**: WCAG compliant design
- **Fast Loading**: Optimized performance
- **Intuitive Navigation**: Easy-to-use interface

## 🔒 Security Features

- JWT authentication
- Password hashing with bcrypt
- Protected routes
- Input validation
- CORS configuration
- Environment variables

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder

### Backend (Heroku/Railway)
1. Set environment variables
2. Deploy to your preferred platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@proteinhub.com or create an issue in the repository.

---

**Protein Hub** - Fuel your fitness journey with premium high-protein foods! 💪