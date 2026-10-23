# 🛒 Bazar Dor — বাজার দর

**Bazar Dor** is a Bangla-based grocery price tracking web application that helps users explore daily market prices of essential products in Bangladesh. Users can browse products by category, compare current prices with previous prices, view market price information, and manage their accounts.

## 🌐 Project Overview

Bazar Dor aims to make grocery price information more accessible and help consumers understand price changes in the local market through a simple, responsive, and user-friendly interface.

## ✨ Key Features

- **Daily Price Tracking:** View current prices of essential grocery products.
- **Price Comparison:** Compare today's prices with yesterday's, last week's, and last month's prices.
- **Category Filtering:** Browse products by categories such as rice, lentils, vegetables, fish and meat, and oil and spices.
- **Product Details:** View detailed product information and market-wise price ranges.
- **User Authentication:** Register and sign in using Better Auth.
- **Social Login:** Google sign-in support, when OAuth credentials are configured.
- **Protected Routes:** Restrict access to product details and user-specific pages when authentication is required.
- **User Profile:** View and update profile information.
- **Product Sorting:** Sort products by price and price changes.
- **Responsive Design:** Optimized layouts for mobile, tablet, and desktop screens.
- **Notifications:** Display success and error messages for relevant user actions.

## 🛠️ Technologies Used

- **Next.js** — React framework and App Router
- **React** — User interface development
- **Tailwind CSS** — Responsive styling
- **Better Auth** — Authentication and session management
- **MongoDB Atlas** — Database
- **Programming Hero Bazar Dor API** — Product, category, and market price data
- **Lucide React** — Icons
- **React Hot Toast** — Toast notifications
- **Vercel** — Deployment platform

## 📦 Installation and Setup

### Prerequisites

- Node.js installed
- npm installed
- MongoDB Atlas account
- Google OAuth credentials for Google sign-in

### 1. Clone the Repository

```bash
git clone https://github.com/SkSabuj-Web/bazar-dor.git
cd bazar-dor
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root and add the following variables:

```env
MONGODB_URI="your_mongodb_connection_string"
BETTER_AUTH_SECRET="your_secure_random_secret"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
```

Replace the placeholder values with your actual credentials. Keep your secrets private and never commit `.env.local` to GitHub.

### 4. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔑 Google OAuth Configuration

To enable Google sign-in:

1. Create an OAuth 2.0 Client ID in the Google Cloud Console.
2. Configure the authorized redirect URI:

   `http://localhost:3000/api/auth/callback/google`

3. Add the Google Client ID and Client Secret to `.env.local`.
4. Restart the development server.

For production, configure the corresponding callback URL for your deployed domain.

## 🔌 API Integration

The application uses the Programming Hero Bazar Dor API.

**API Base URL:**  
[https://openapi.programming-hero.com/api/bazardor](https://openapi.programming-hero.com/api/bazardor)

Available endpoints include:

| Endpoint | Description |
|---|---|
| `/products` | Retrieve products |
| `/products/1` | Retrieve a product by ID |
| `/categories` | Retrieve all categories |
| `/categories/chal` | Retrieve products in the rice category |

Example category filtering:

`/products?category=chal`

## 📁 Project Structure

```text
bazar-dor/
├── public/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── auth/
│   │   ├── category/
│   │   ├── product/
│   │   ├── profile/
│   │   ├── signin/
│   │   ├── signup/
│   │   ├── globals.css
│   │   ├── layout.js
│   │   └── page.js
│   ├── components/
│   └── lib/
├── .env.local
├── package.json
└── README.md
```

## 🚀 Deployment

The project can be deployed on [Vercel](https://vercel.com/).

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Configure all required environment variables in Vercel.
4. Update the production authentication URL and Google OAuth redirect URI.
5. Deploy the application.

## 👨‍💻 Author

**Sajib Khan Sabuj**

- GitHub: [SkSabuj-Web](https://github.com/SkSabuj-Web)

## 📄 License

This project was developed for educational purposes as part of a Programming Hero assignment.
