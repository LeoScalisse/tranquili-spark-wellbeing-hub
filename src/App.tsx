
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { UserProvider } from "./contexts/UserContext";
import { AudioProvider } from "./contexts/AudioContext";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import ReportPage from "./pages/ReportPage";
import AchievementsPage from "./pages/AchievementsPage";
import TranquiliSpacePage from "./pages/TranquiliSpacePage";
import TranquiliGamesPage from "./pages/TranquiliGamesPage";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <UserProvider>
            <AudioProvider>
              <BrowserRouter>
                <Toaster />
                <Sonner />
                <Routes>
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/" element={
                    <ProtectedRoute>
                      <HomePage />
                    </ProtectedRoute>
                  } />
                  <Route path="/chat" element={
                    <ProtectedRoute>
                      <ChatPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/reports" element={
                    <ProtectedRoute>
                      <ReportPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/achievements" element={
                    <ProtectedRoute>
                      <AchievementsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/shop" element={
                    <ProtectedRoute>
                      <TranquiliSpacePage />
                    </ProtectedRoute>
                  } />
                  <Route path="/games" element={
                    <ProtectedRoute>
                      <TranquiliGamesPage />
                    </ProtectedRoute>
                  } />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </AudioProvider>
          </UserProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
