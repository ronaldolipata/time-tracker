# Time Tracker

A modern web application for tracking time spent on different projects and managing payroll periods. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🕒 Time tracking for multiple projects
- 📅 Payroll period management
- 📊 Project data visualization
- 🌓 Dark/Light mode support
- 🎨 Modern UI with shadcn/ui and Radix UI components
- 📱 Responsive design

## Tech Stack

- **Framework:** Next.js 15.2.1
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui (built on Radix UI)
- **State Management:** React Context
- **Date Handling:** date-fns
- **Notifications:** react-toastify
- **Icons:** lucide-react

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/ronaldolipata/time-tracker.git
   cd time-tracker
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start the development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code linting

## Project Structure

```
time-tracker/
├── app/                    # Next.js app directory
│   ├── components/        # App-specific components
│   ├── periods/          # Payroll periods pages
│   ├── projects/         # Projects pages
│   └── layout.tsx        # Root layout
├── components/           # Shared components
├── context/             # React Context providers
├── helpers/             # Helper functions
├── hooks/               # Custom React hooks
├── lib/                 # Library code
├── utils/               # Utility functions
└── enums/               # TypeScript enums
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
