import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Header } from "./components/layout/Header";
import { DataProvider } from "./contexts/DataContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import DashboardPage from "./pages/Dashboard";
import LandingPage from "./pages/Landing";
import DailyPlanPage from "./pages/DailyPlan";
import JourneyLogPage from "./pages/JourneyLog";
import StatsPage from "./pages/Stats";
import LoginPage from "./pages/Login";
// AI pages removed: see commit that removes AI tools UI
import { Toaster } from "./components/ui/toaster";
import { Facebook, Github, Instagram, Linkedin, Twitter } from "lucide-react";

// Protected route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

// Wrapper components to inject navigation
function DailyPlanWrapper() {
  const navigate = useNavigate();
  return <DailyPlanPage navigate={navigate} />;
}

function JourneyLogWrapper() {
  const navigate = useNavigate();
  return <JourneyLogPage navigate={navigate} />;
}

function AppContent() {
  const [exportDataCallback, setExportDataCallback] = useState<(() => void) | undefined>(undefined);
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-background ">
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/*"
            element={
              <>
                {user && <Header onExportData={exportDataCallback} />}
                <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                  <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute>
                          <DashboardPage setExportCallback={setExportDataCallback} />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/daily-plan"
                      element={
                        <ProtectedRoute>
                          <DailyPlanWrapper />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/journey-log"
                      element={
                        <ProtectedRoute>
                          <JourneyLogWrapper />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/stats"
                      element={
                        <ProtectedRoute>
                          <StatsPage />
                        </ProtectedRoute>
                      }
                    />
                    {/* AI tool routes removed */}
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </main>


              

               <footer className="mt-4 border-t border-white/10  backdrop-blur-xl">
             <div className="py-12 text-center container mx-auto px-6 flex flex-col items-center gap-3">

            <h2 className="text-xl font-bold font-sans flex items-center justify-center gap-0">
  <span className="text-black dark:text-white">
    TrackMy
  </span>
  <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
    Progress
  </span>
</h2>





             {/* COPYRIGHT */}
              <p className="text-sm text-neutral-400">
               Copyright © {new Date().getFullYear()} TrackMyProgress. All rights reserved.
              </p>

        {/* SOCIAL LINKS */}
        <div className="flex items-center gap-4 text-neutral-400. ">
          <a href="#" className="hover:text-black transition"><Facebook size={22} /></a>
          <a href="#" className="hover:text-black transition"><Instagram size={22} /></a>
          <a href="https://www.linkedin.com/in/manishpatel005" className="hover:text-black transition"><Linkedin size={22} /></a>
          <a href="#" className="hover:text-black transition"><Twitter size={22} /></a>
          <a href="#" className="hover:text-black transition"><Github size={22} /></a>
        </div>

      </div>
    </footer>
  
   

              </>
            }
          />
        </Routes>
      </Router>
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
