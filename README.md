# ProChesta 🤝

> **Create. Join. Impact.**

ProChesta is a community-driven platform to create, join, and track social service events in your local area — from winter clothes distribution and blanket drives to cleanups, plantations, and blood donation camps.

🔗 **Live Site:** [https://prochesta-client.vercel.app/](https://prochesta-client.vercel.app/)

---

## ✨ Features

- **🗓 Create & Manage Events** — Any logged-in user can organize social service events with a title, description, event type (Cleanup, Plantation, Donation, Blood Drive, and more), thumbnail, location, and a future event date. Creators can update or delete their own events from the Manage Events dashboard.
- **🙋 Join Events & Track Participation** — Browse upcoming events, view full details, and join with one click. Joined events are saved to your personal Joined Events page so you can track your volunteer commitments.
- **🔐 Secure Authentication** — Email & password login and registration with strong password validation (uppercase, lowercase, minimum 6 characters), protected/private routes, and conditional navbar states with a profile dropdown.
- **⚡ Real-Time Event Feed** — The home page showcases the 6 most recent upcoming events fetched live from the database, so volunteers always see the latest community activities.
- **🎨 Modern, Responsive UI** — Built with Next.js, Tailwind CSS, and shadcn/ui, featuring dark mode, smooth Framer Motion animations, toast notifications, and a fully responsive layout across devices.

---

## 🛠 Tech Stack

| Category | Technology |
| --- | --- |
| Framework | [Next.js](https://nextjs.org/) (React 19) |
| Styling | Tailwind CSS 4, shadcn/ui, Framer Motion |
| Forms & Validation | React Hook Form, Zod |
| State & Auth | React Context API, JWT-based auth |
| Notifications | Sonner (toasts) |
| Deployment | Vercel |

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd Prochesta-Client

# Install dependencies
npm install

# Set up environment variables
# Create a .env file and add your backend API URL:
# NEXT_PUBLIC_API_URL=<your-server-url>

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

---

## 📁 Available Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Build the production bundle |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |

---

> Made with ❤️ for the community. Together, we create, join, and make an impact.
