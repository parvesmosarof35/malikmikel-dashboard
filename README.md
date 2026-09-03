# Malik Dashboard 🚀

A modern, animated **Admin Dashboard UI** built with **Next.js 16 (App Router)** and **React 19**, featuring reusable components, Radix UI primitives, and a clean, scalable architecture.

---

## 🌟 Overview

**Malik Dashboard** is a demo admin dashboard project designed to showcase modern frontend practices using the latest React and Next.js versions.  
It focuses on **UI quality, animations, accessibility, and maintainable structure**, making it ideal for dashboards, SaaS products, and internal tools.

---

## ✨ Features

### 🧩 Core
- Built with **Next.js 16 (App Router)**
- Powered by **React 19**
- Fully written in **TypeScript**
- Clean, scalable folder structure
- Custom dashboard routes and layouts

### 🎨 UI & UX
- Accessible UI components using **Radix UI**
- Smooth animations and transitions
- Custom theme support
- Responsive dashboard layout
- Reusable component system (shadcn-style)

### ⚙️ Architecture
- Component-driven development
- Context-based state management
- Utility-first styling approach
- Easy to extend with new dashboard modules

---

## 🛠 Tech Stack

### Core
- **Framework:** Next.js 16
- **UI Library:** React 19
- **Language:** TypeScript

### Styling & UI
- **Styling:** Tailwind CSS v4
- **UI Primitives:** Radix UI
- **Icons:** Lucide React
- **Animations:** tw-animate-css
- **Toasts:** Sonner

### Utilities
- clsx
- tailwind-merge
- class-variance-authority

### Tooling
- ESLint
- pnpm / npm / yarn
- PostCSS

---

## 📁 Project Structure

```

malik-dashboard/
├── app/                 # App Router pages & layouts
├── components/          # Reusable components
│   └── ui/              # Base UI components (Radix-based)
├── contexts/            # React Context providers
├── lib/                 # Utility helpers
├── public/              # Static assets & themes
├── components.json      # UI component config
├── next.config.ts       # Next.js config
├── tsconfig.json        # TypeScript config
└── package.json         # Dependencies & scripts

````

---

## 🚀 Getting Started

### Prerequisites
- Node.js **v18+** recommended
- pnpm / npm / yarn / bun

### Installation

Clone the repository:

```bash
git clone https://github.com/parvesmosarof35/malikmikel-dashboard.git
cd malikmikel-dashboard
````

Install dependencies:

```bash
pnpm install
# or
npm install
```

Start the development server:

```bash
pnpm dev
# or
npm run dev
```

Open your browser:

```
http://localhost:3000
```

---

## 🧪 Development Notes

* Routes and layouts live inside `app/`
* UI components are located in `components/ui`
* Animations are applied at component level
* Context providers manage shared state
* Tailwind v4 is used with utility-first styling

---

## 🌐 Deployment

This project is optimized for **Vercel** deployment.

Steps:

1. Push the repository to GitHub
2. Import the project into Vercel
3. Select **Next.js** as the framework
4. Deploy 🚀

---

## 📌 Use Cases

* Admin dashboards
* SaaS control panels
* Analytics dashboards
* Internal management tools
* Dashboard starter templates

---

## 👤 Author

**Parves Mosarof**
GitHub: [@parvesmosarof35](https://github.com/parvesmosarof35)

---

## 📄 License

This project is licensed under the **MIT License**.

---

Built with ❤️ using **Next.js 16, React 19, and TypeScript**

```

