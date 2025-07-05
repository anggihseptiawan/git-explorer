# Git Explorer

A modern web application for exploring GitHub users and their repositories with a sleek interface.

## 🌟 Project Overview

Git Explorer allows you to search for GitHub users and dive deep into their profiles and repositories. Built with modern web technologies, it provides an intuitive interface to discover developers and explore their open-source contributions.

### ✨ Features

- **User Search**: Search for GitHub users with real-time results
- **User Profiles**: View detailed user information including followers, following, location, and join date
- **Repository Exploration**: Browse user repositories with detailed information
- **Repository Insights**: View stars, forks, programming languages, and topics
- **Responsive Design**: Fully responsive interface that works on all devices
- **Direct GitHub Links**: Quick access to GitHub profiles and repositories

## 🚀 How to Run

### Prerequisites

- Node.js (version 20 or higher)
- npm or yarn package manager

### Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/anggihseptiawan/git-explorer.git
   cd git-explorer
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

### Build for Production

```bash
npm run build
```

The built files will be generated in the `dist` directory.

## 🛠️ Tech Stack

### Frontend Framework & Libraries

- **React 19** - Modern React with hooks and functional components
- **TypeScript** - Type-safe JavaScript for better development experience
- **Vite** - Fast build tool and development server
- **Vitest** - Modern testing library

### UI & Styling

- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **shadcn/ui** - High-quality React components built on Radix UI
- **Lucide React** - Beautiful and consistent icon library
- **Radix UI** - Unstyled, accessible UI primitives

### Routing & Navigation

- **React Router DOM** - Declarative routing for React applications

## 🔌 API Integration

### GitHub REST API

The application integrates with the **GitHub REST API v3** to fetch user and repository data.

#### Endpoints Used

1. **User Search**

   - `GET https://api.github.com/search/users`
   - Search for users by username or name
   - Returns paginated results with basic user information

2. **User Details**

   - `GET https://api.github.com/users/{username}`
   - Fetch detailed information about a specific user
   - Includes profile data, statistics, and metadata

3. **User Repositories**
   - `GET https://api.github.com/users/{username}/repos`
   - Retrieve repositories owned by a user
   - Sorted by last updated, limited to 12 most recent

#### API Features Utilized

- **No Authentication Required**: Uses public API endpoints
- **Rate Limiting**: Handles GitHub's rate limiting with user feedback
- **Error Handling**: Comprehensive error handling for API failures
- **Real-time Data**: Fetches fresh data on each request

#### API Response Handling

- **User Search Results**: Displays avatar, username, and account type
- **User Profiles**: Shows comprehensive profile information including:
  - Avatar and basic info
  - Follower/following counts
  - Repository count
  - Location and join date
  - Bio and website links
- **Repository Data**: Displays detailed repository information including:
  - Repository name and description
  - Programming language with color coding
  - Star and fork counts
  - Topics/tags
  - Last updated date

## 📱 Responsive Design

The application is fully responsive and optimized for:

- Desktop computers (1024px and above)
- Tablets (768px - 1023px)
- Mobile devices (320px - 767px)

## 🎨 Design Features

- **Gradient Accents**: Subtle gradients for visual appeal
- **Loading States**: Visual feedback during data fetching
- **Error Handling**: User-friendly error messages and fallbacks

## 🚀 Deployment

This project can be deployed on various platforms:

- **Vercel**: Connect your GitHub repository
- **Netlify**: Deploy from Git or upload build files
- **GitHub Pages**: Deploy static build files

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
