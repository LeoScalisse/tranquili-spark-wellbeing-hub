import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { UserProvider } from "./contexts/UserContext";
import { AudioProvider } from "./contexts/AudioContext";
import { AchievementAnimationProvider } from "./contexts/AchievementAnimationContext";
import AuthPage from "./pages/AuthPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import ReportPage from "./pages/ReportPage";
import AchievementsPage from "./pages/AchievementsPage";
import TranquiliSpacePage from "./pages/TranquiliSpacePage";
import TranquiliGamesPage from "./pages/TranquiliGamesPage";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import OnboardingPage from "./pages/OnboardingPage";
import SettingsPage from "./pages/SettingsPage";
import GlobalAchievementWrapper from "./components/GlobalAchievementWrapper";
import PWAInstallPrompt from "./components/PWAInstallPrompt";
import PWAUpdateNotification from "./components/PWAUpdateNotification";
import PWAStatusIndicator from "./components/PWAStatusIndicator";

const App = () => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <UserProvider>
            <AudioProvider>
              <AchievementAnimationProvider>
                <BrowserRouter>
                  <Toaster />
                  <Sonner />
                  <GlobalAchievementWrapper />
                  <PWAStatusIndicator />
                  <PWAUpdateNotification />
                  <PWAInstallPrompt />
                  <Routes>
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/email-verification" element={<EmailVerificationPage />} />
                    <Route path="/onboarding" element={<OnboardingPage />} />
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
                    <Route path="/settings" element={
                      <ProtectedRoute>
                        <SettingsPage />
                      </ProtectedRoute>
                    } />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </AchievementAnimationProvider>
            </AudioProvider>
          </UserProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
