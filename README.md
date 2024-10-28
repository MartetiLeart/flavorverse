This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

Flavorverse is a platform for discovering and sharing delicious and healthy recipes. Our mission is to bring together food enthusiasts from around the world to explore new flavors and culinary experiences.

## Features

- User registration and authentication
- Create, view, and delete recipes
- Upload images for recipes
- Filter recipes by user
- Responsive design

## Technologies Used

- Frontend: Next.js, React, Bootstrap
- Backend: Node.js, Express, MongoDB
- Authentication: JWT
- Image Upload: Multer

## Installation

### Prerequisites

- Node.js and npm installed on your machine
- MongoDB installed and running locally

### Clone the repository

```bash
git clone https://github.com/your-username/flavorverse.git
cd flavorverse
```

### Frontend Setup

1. **Navigate to the frontend directory:**

   ```bash
   cd flavorverse-frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the frontend development server:**

   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:3000`.

### Backend Setup

1. **Navigate to the backend directory:**

   ```bash
   cd ../flavorverse-backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the backend server:**

   ```bash
   npm start
   ```

   The server will run on `http://localhost:5000`.

## Usage

- Register a new account or log in with an existing account.
- Create new recipes by providing a title, ingredients, instructions, and an optional image.
- View all recipes or filter to see only your recipes.
- Delete your recipes if needed.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.

## Contact

For any questions or feedback, please contact us at support@flavorverse.com.
