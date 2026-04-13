import { useState } from "react";
import { Code2, Users, ArrowRight, Copy, Key, Sparkles } from "lucide-react";

const RoomEntry = ({ onJoinRoom, initialRoomId = "" }) => {
  const [mode, setMode] = useState("join"); // 'join' or 'create'
  const [roomId, setRoomId] = useState(initialRoomId);
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const generateRoomId = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleCreateRoom = () => {
    const newRoomId = generateRoomId();
    setRoomId(newRoomId);
    setMode("join");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim()) {
      setError("Please enter your name");
      return;
    }

    if (!roomId.trim()) {
      setError("Please enter a room ID");
      return;
    }

    if (username.length < 2) {
      setError("Name must be at least 2 characters");
      return;
    }

    if (roomId.length < 4) {
      setError("Room ID must be at least 4 characters");
      return;
    }

    onJoinRoom(roomId.toUpperCase(), username.trim());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-2xl shadow-lg">
              <Code2 className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            CodersRoom
          </h1>
          <p className="text-gray-600">
            Real-time collaborative coding environment
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
          {/* Mode Toggle */}
          <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-lg">
            <button
              onClick={() => setMode("join")}
              className={`flex-1 py-2 px-4 rounded-md font-medium text-sm transition-all duration-200 ${
                mode === "join"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Join Room
            </button>
            <button
              onClick={() => setMode("create")}
              className={`flex-1 py-2 px-4 rounded-md font-medium text-sm transition-all duration-200 ${
                mode === "create"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Create Room
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Your Name
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  maxLength={20}
                />
              </div>
            </div>

            {/* Room ID Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Room ID
              </label>
              {mode === "create" ? (
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <button
                    type="button"
                    onClick={handleCreateRoom}
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>Generate New Room</span>
                  </button>
                  <p className="text-xs text-gray-500 mt-3">
                    A unique room ID will be generated for you
                  </p>
                </div>
              ) : (
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                    placeholder="Enter room ID"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all uppercase"
                    maxLength={20}
                  />
                </div>
              )}
            </div>

            {/* Display generated room ID */}
            {mode === "create" && roomId && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-xs text-blue-600 mb-2 font-medium">Your Room ID:</p>
                <div className="flex items-center justify-between">
                  <code className="text-2xl font-bold text-blue-700 tracking-wider">
                    {roomId}
                  </code>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(roomId);
                    }}
                    className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                    title="Copy room ID"
                  >
                    <Copy className="h-4 w-4 text-blue-600" />
                  </button>
                </div>
                <p className="text-xs text-blue-600 mt-2">
                  Share this ID with others to collaborate
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={mode === "create" && !roomId}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
            >
              <span>
                {mode === "create" ? "Create & Join Room" : "Join Room"}
              </span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Info */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">Collaborative Coding</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Code together in real-time. Share the room ID with your team to start collaborating.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomEntry;