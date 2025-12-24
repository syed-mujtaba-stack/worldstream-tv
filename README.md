# WorldStream TV

A modern TV streaming application built with React, TypeScript, and Vite, featuring a beautiful UI and seamless video playback experience.

## 🚀 Features

- 🎬 High-quality video streaming with HLS support
- 🔒 Secure authentication with Supabase
- 📱 Responsive design for all devices
- ⚡ Blazing fast performance with Vite
- 🎨 Beautiful UI with shadcn/ui components
- 🔍 Advanced search functionality
- ❤️ Favorites system
- 📊 User profiles and preferences

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **State Management**: React Query, React Context
- **Backend**: Supabase (Auth, Database, Storage)
- **Video Playback**: HLS.js
- **Routing**: React Router v6
- **Form Handling**: React Hook Form
- **Icons**: Lucide React

## 📦 Prerequisites

- Node.js 16+ (LTS recommended)
- npm or yarn
- Supabase account (for backend services)

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/syed-mujtaba-stack/worldstream-tv.git
   cd worldstream-tv
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Build for production**
   ```bash
   npm run build
   # or
   yarn build
   ```

## 📂 Project Structure

```
src/
├── components/    # Reusable UI components
├── contexts/     # React contexts (Auth, etc.)
├── hooks/        # Custom React hooks
├── integrations/ # Third-party integrations
├── lib/          # Utility functions and configs
├── pages/        # Page components
└── App.tsx       # Main application component
```

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful components
- [Radix UI](https://www.radix-ui.com/) for accessible primitives
- [Vite](https://vitejs.dev/) for the amazing developer experience
- [Supabase](https://supabase.com/) for the backend services

---

Made with ❤️ by Syed Mujtaba Abbas(https://github.com/syed-mujtaba-stack)