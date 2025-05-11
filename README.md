# Perfume Apps V1

Perfume Apps V1 is a modern web application designed to explore and showcase a collection of perfumes with a clean, responsive interface. Built using the latest technologies, it offers fast performance, consistent UI, and efficient data handling.

## 🌐 Live Demo

[https://perfume-apps.vercel.app/](https://perfume-apps.vercel.app/)

## 🧰 Tech Stack

* **Next.js 15** – Full-stack React framework with App Router and Server Actions.
* **Shadcn UI** – Accessible and customizable UI components built on Tailwind CSS.
* **Prisma ORM** – Modern database toolkit for TypeScript & Node.js.
* **PostgreSQL** – Reliable relational database for structured data.
* **Vercel Blob** – CDN storage solution for handling perfume image uploads.
* **Vercel** – Hosting and deployment platform optimized for Next.js.

## 📦 Key Features

* **Perfume Collection Display** – Browse various perfumes with images, descriptions, and tags.
* **Responsive UI** – Works seamlessly across devices (mobile, tablet, desktop).
* **Efficient Data Handling** – Powered by Prisma and PostgreSQL for robust backend operations.
* **Image Uploads with Vercel Blob** – Store and serve images via CDN for fast load times.

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/username/perfume-apps.git
cd perfume-apps
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file

```env example
DATABASE_URL=
NEXT_PUBLIC_BASE_URL=
AUTH_SECRET=
ADMIN_EMAIL="admin@gmail.com"
ADMIN_PASSWORD="admin123456"
BLOB_READ_WRITE_TOKEN=

```

### 4. Initialize Prisma and Apply Migrations

```bash
npx prisma init
npx prisma migrate dev --name init
```

### 5. Run the Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to view the app in your browser.

## 📁 Project Structure

```
.
├── app/                # Next.js pages and routing
├── components/         # Reusable UI components
├── prisma/             # Prisma schema and migrations
├── public/             # Static assets
├── styles/             # Tailwind CSS configurations
├── .env                # Environment variables
├── next.config.js      # Next.js configuration
└── README.md           # Project documentation
```

## 📸 Image Storage

Perfume images are uploaded and served via **Vercel Blob**, enabling fast and scalable CDN delivery.

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## 🙌 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request for improvements, bug fixes, or new features.

---

Let me know if you’d like a badge section (like build status, license, live link, etc.) added too.
