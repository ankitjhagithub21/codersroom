# CodersRoom

A collaborative real-time coding platform where multiple users can write, compile, and execute code together in shared rooms. Built with React, Node.js, and Socket.IO for seamless real-time collaboration.

## Features

### Core Functionality
- **Real-time Code Collaboration**: Multiple users can code together in real-time
- **Code Execution**: Compile and run code in various programming languages
- **Live Code Sync**: Changes are instantly synchronized across all room participants
- **Room System**: Create and join collaborative coding rooms
- **User Management**: See who's currently in the room and track user activities

### Code Editor Features
- **Multi-language Support**: Support for 5+ programming languages
- **Syntax Highlighting**: Powered by Monaco Editor with full IntelliSense support
- **Theme Customization**: Dark and light themes with instant sync across users
- **Custom Input**: Support for stdin input during code execution
- **Real-time Compilation**: See compilation results, output, errors, and performance metrics

### User Interface
- **Intuitive Layout**: Clean separation between editor, input, and output areas
- **Visual Feedback**: Loading states, error messages, and execution status
- **Room Sharing**: Easy room link sharing with clipboard functionality

## Tech Stack

### Frontend
- **React 19.2.4** - Modern React with hooks and concurrent features
- **Vite 8.0.4** - Fast development server and build tool
- **Monaco Editor** - Professional code editor with IntelliSense
- **TailwindCSS 4.2.2** - Utility-first CSS framework
- **Socket.IO Client 4.8.3** - Real-time bidirectional communication
- **Lucide React** - Modern icon library
- **Lodash** - Utility library for common operations

### Backend
- **Node.js** - JavaScript runtime
- **Express 5.2.1** - Web framework for API endpoints
- **Socket.IO 4.8.3** - Real-time WebSocket server
- **Axios 1.14.0** - HTTP client for external API calls
- **Judge0 API** - Code compilation and execution service
- **CORS 2.8.6** - Cross-origin resource sharing
- **Dotenv 17.4.2** - Environment variable management

## Project Structure

```
codersroom/
|
|__ frontend/                 # React frontend application
|   |__ public/              # Static assets
|   |__ src/
|   |   |__ components/      # React components
|   |   |   |__ CodeEditorWindow.jsx
|   |   |   |__ CompileRunButton.jsx
|   |   |   |__ CustomInput.jsx
|   |   |   |__ LanguageDropDown.jsx
|   |   |   |__ OutputWindow.jsx
|   |   |   |__ RoomEntry.jsx
|   |   |   |__ ThemeDropDown.jsx
|   |   |__ constants/       # Configuration constants
|   |   |   |__ languageOptions.js
|   |   |   |__ starterCode.js
|   |   |__ lib/            # Utility libraries
|   |   |   |__ socket.js
|   |   |__ App.jsx         # Main application component
|   |   |__ main.jsx        # Application entry point
|   |   |__ index.css       # Global styles
|   |__ package.json
|   |__ vite.config.js
|
|__ backend/                 # Node.js backend server
|   |__ src/
|   |   |__ app.js          # Express app configuration
|   |   |__ server.js       # Server entry point
|   |   |__ config/         # Configuration files
|   |   |   |__ env.js      # Environment variables
|   |   |   |__ judge0.js   # Judge0 API configuration
|   |   |__ controllers/    # API controllers
|   |   |__ routes/         # API routes
|   |   |__ socket/         # Socket.IO handlers
|   |   |   |__ index.js    # Socket event handlers
|   |   |__ utils/          # Utility functions
|   |__ package.json
|
|__ .gitignore
|__ README.md
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- Judge0 API credentials (for code execution)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ankitjhagithub21/codersroom
   cd codersroom
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Setup**
   
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=8080
   ORIGIN=http://localhost:5173
   RAPID_API_HOST=your-judge0-host
   RAPID_API_KEY=your-judge0-api-key
   RAPID_API_URL=https://judge0-ce.p.rapidapi.com
   ```

   Create a `.env` file in the `frontend` directory:
   ```env
   VITE_SOCKET_URL=http://localhost:8080
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```
   The backend will start on `http://localhost:8080`

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will start on `http://localhost:5173`

3. **Access the application**
   Open your browser and navigate to `http://localhost:5173`

## Usage

### Creating a Room
1. Enter a username and room ID (or generate one)
2. Click "Join Room" to create or join a collaborative session
3. Share the room URL with others to invite them

### Coding Together
- **Code Editor**: Write code with full syntax highlighting and IntelliSense
- **Language Selection**: Choose from 5+ supported programming languages
- **Real-time Sync**: All code changes are instantly shared with room participants
- **Custom Input**: Provide stdin input for your programs
- **Run Code**: Compile and execute code with results shown in real-time

### Features
- **Theme Sync**: Change editor theme and it updates for everyone
- **User Presence**: See who's currently in the room
- **Execution Status**: Track compilation progress and results
- **Performance Metrics**: View execution time and memory usage

## API Integration

### Judge0 API
The application uses Judge0 CE API for code compilation and execution. You'll need:
- RapidAPI account
- Judge0 CE API subscription
- API key and host configuration

### Socket.IO Events

#### Client to Server
- `join-room` - Join a collaborative room
- `leave-room` - Leave current room
- `code-update` - Broadcast code changes
- `language-update` - Change programming language
- `theme-update` - Update editor theme
- `custom-input-update` - Update stdin input
- `compile-start` - Initiate code compilation
- `compile-result` - Share compilation results

#### Server to Client
- `room-users` - Update room user list
- `code-update` - Receive code changes
- `language-update` - Receive language changes
- `theme-update` - Receive theme updates
- `custom-input-update` - Receive input updates
- `compile-start` - Compilation started notification
- `compile-result` - Compilation results
- `user-joined` - User joined notification
- `user-left` - User left notification

## Configuration

### Supported Languages
The application supports 5+ programming languages including:
- Python, JavaScript, Java, C++, C#


### Environment Variables
- `PORT` - Backend server port (default: 8080)
- `ORIGIN` - Frontend URL for CORS
- `VITE_SOCKET_URL` - Backend Socket.IO server URL
- `RAPID_API_*` - Judge0 API credentials

## Development

### Scripts

#### Backend
- `npm run dev` - Start development server with hot reload
- `npm start` - Start production server

#### Frontend
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style
- Uses ESLint for code quality
- Follows React hooks patterns
- Component-based architecture
- TailwindCSS for styling

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure `ORIGIN` environment variable matches frontend URL
2. **Socket Connection**: Verify `VITE_SOCKET_URL` matches backend URL
3. **Judge0 API**: Check API credentials and rate limits
4. **Port Conflicts**: Ensure ports 8080 and 5173 are available

### Debug Tips
- Check browser console for frontend errors
- Monitor backend console for server logs
- Verify Socket.IO connection in network tab
- Test API endpoints directly

## Future Enhancements

- [ ] Persistent room storage
- [ ] User authentication system
- [ ] Code snippet sharing
- [ ] Video/audio chat integration
- [ ] Code version history
- [ ] Collaborative debugging tools
- [ ] Mobile responsive design improvements
- [ ] Advanced code formatting options

## Support

For support and questions, please open an issue on the GitHub repository.
