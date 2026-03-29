import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "./theme/theme";
import AuthPage from "./pages/LoginPage/LoginPage";
import { AuthProvider } from "./context/AuthProvider";
import { NavBar } from "./components/Navbar/Navbar";
import ProtectedRoute from "./routes/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";
import FeedPage from "./pages/FeedPage/FeedPage";
import AskTheChefPage from "./pages/AskTheChefPage/AskTheChefPage";
import ViewPostPage from "./pages/ViewPostPage/ViewPostPage";
import UploadPostPage from "./pages/UploadPostPage/UploadPostPage";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

function AppContent() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  return (
    <>
      {isAuthenticated && <NavBar />}
      
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/" element={<ProtectedRoute><FeedPage></FeedPage></ProtectedRoute>}/>
        <Route path="/search" element={<ProtectedRoute><AskTheChefPage></AskTheChefPage></ProtectedRoute>}/>
        <Route path="/post/:id" element={<ProtectedRoute><ViewPostPage /></ProtectedRoute>}/>
        <Route path="/upload" element={<ProtectedRoute><UploadPostPage /></ProtectedRoute>}/>
      </Routes>
    </>
  );
}