# BuyYantra FrontStore

A modern e-commerce storefront built for a fast and seamless online shopping experience. This frontend is designed to work with the ShopHub backend and provides a responsive, customer-friendly interface for browsing products, managing carts, placing orders, and handling account activities.

## Live Demo

- Frontend: [BuyYantra FrontStore](https://buyyantra.systemizer.site/)
- Backend: [Discover Quality Products · ShopHub](https://api.systemizer.site/)

## Overview

BuyYantra is a digital storefront focused on delivering a clean shopping experience for customers seeking quality products. The application includes:

- Product discovery and category browsing
- Search and filtering for a better catalog experience
- Product detail pages with rich information
- Cart and quantity management
- Secure checkout flow for authenticated users
- Order tracking and order history
- User profile and address management
- Responsive design optimized for mobile and desktop experiences

## Key Features

- Modern React + TypeScript architecture
- Vite-powered fast development workflow
- Tailwind-based responsive UI
- Token-based authentication with refresh handling
- React Query for efficient server state management
- Zustand for simplified global state management
- Protected routes for checkout and account features
- Clean routing structure with React Router

## Screenshots

### Homepage

<div align="center">
  <img src="https://placehold.co/1200x700/111827/ffffff?text=Homepage+Screenshot" alt="Homepage screenshot placeholder" width="100%" />
</div>

### Product Listing

<div align="center">
  <img src="https://placehold.co/1200x700/1f2937/ffffff?text=Product+Listing+Screenshot" alt="Product listing screenshot placeholder" width="100%" />
</div>

### Cart and Checkout

<div align="center">
  <img src="https://placehold.co/1200x700/374151/ffffff?text=Cart+and+Checkout+Screenshot" alt="Cart and checkout screenshot placeholder" width="100%" />
</div>

### Account and Orders

<div align="center">
  <img src="https://placehold.co/1200x700/4b5563/ffffff?text=Account+and+Orders+Screenshot" alt="Account and orders screenshot placeholder" width="100%" />
</div>

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router
- TanStack React Query
- Zustand
- Axios
- Tailwind CSS
- Lucide React
- Sonner for notifications

## Project Structure

```text
src/
├── api/
│   ├── axiosClient.ts
│   └── endpoints/
├── components/
├── features/
│   ├── account/
│   ├── auth/
│   ├── cart/
│   ├── catalog/
│   ├── checkout/
│   └── orders/
├── hooks/
├── lib/
├── routes/
├── stores/
├── types/
├── App.tsx
├── index.css
├── main.tsx
└── ...
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A running backend service from the ShopHub API

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd BuyYantraFront
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

Create a `.env.local` file in the project root and add:

```bash
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

4. Start the development server:

```bash
npm run dev
```

The application will run locally at:

```text
http://localhost:3000
```

## Available Scripts

```bash
npm run dev      # start the Vite development server
npm run build    # create a production build
npm run preview  # preview the production build locally
npm run lint     # run the project lint checks
```

## Backend Integration

This frontend connects to the ShopHub backend API for authentication, product data, order management, and user account features. The API base URL can be configured using the `VITE_API_BASE_URL` environment variable.

## Deployment

This storefront is deployed and available at:

- Frontend: [BuyYantra FrontStore](https://buyyantra.systemizer.site/)
- Backend: [Discover Quality Products · ShopHub](https://api.systemizer.site/)

## Notes

- The app includes protected customer flows such as checkout, orders, and account settings.
- Authentication tokens are refreshed automatically when needed.
- The UI is designed to be responsive and accessible across a wide range of devices.

## License

This project is for internal or business use as defined by the project owner. Please contact the maintainers for licensing details.

## Contributors

Built for the BuyYantra storefront experience with a modern frontend architecture focused on usability, performance, and ecommerce functionality.
