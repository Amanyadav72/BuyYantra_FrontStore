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
  <img width="1592" height="976" alt="Screenshot 2026-09-24 224916" src="https://github.com/user-attachments/assets/a89097b9-8d77-4d7e-86bd-9f4435fdf791" />

</div>

### Product Listing

<div align="center">
 <img width="1665" height="854" alt="Screenshot 2026-09-24 221539" src="https://github.com/user-attachments/assets/968336e8-32e9-4d1b-b057-38d83bdba47b" />

</div>

### Cart and Checkout

<div align="center">
  <img width="1786" height="975" alt="Screenshot 2026-09-24 224849" src="https://github.com/user-attachments/assets/09b1203e-f775-474d-b17f-f9a238732183" />

</div>

### Account and Orders

<div align="center">
  <img width="1571" height="979" alt="Screenshot 2026-09-24 224945" src="https://github.com/user-attachments/assets/76ecccc3-425e-455a-8a4d-ddde9550bb61" />

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
