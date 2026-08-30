import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";

import LoginPage from "./pages/Login/LoginPage";
import ChangePasswordPage from "./pages/Login/ChangePasswordPage";

import UserLayout from "./components/layout/UserLayout";
import CompanyLayout from "./components/layout/CompanyLayout";

import DashboardPage from "./pages/Dashboard/DashboardPage";
import CompanyPage from "./pages/Company/CompanyPage";
import CompanyDashboardPage from "./pages/Company/CompanyDashboardPage";
import ProfilePage from "./pages/Profile/ProfilePage";
import AppointmentsPage from "./pages/Appointments/AppointmentsPage";
import TeamPage from "./pages/Team/TeamPage";
import StockPage from "./pages/Stock/StockPage";
import ServicePage from "./pages/Service/ServicePage";
import PromoCodePage from "./pages/Promo/PromoCodePage";


function ProtectedRoute({ children }) {

    const { user, loading } = useAuth();

    if (loading) {
        return null;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}


function AppRoutes() {

    const { user } = useAuth();

    return (
        <Routes>

            {/* LOGIN */}

            <Route
                path="/login"
                element={
                    user
                        ? <Navigate to="/" replace />
                        : <LoginPage />
                }
            />


            {/* CHANGE PASSWORD */}

            <Route
                path="/change-password"
                element={
                    <ProtectedRoute>
                        <ChangePasswordPage />
                    </ProtectedRoute>
                }
            />


            {/* MAIN DASHBOARD */}

            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <UserLayout>
                            <DashboardPage />
                        </UserLayout>
                    </ProtectedRoute>
                }
            />


            {/* PROFILE */}

            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <UserLayout>
                            <ProfilePage />
                        </UserLayout>
                    </ProtectedRoute>
                }
            />



           


            {/* COMPANY DASHBOARD */}

            <Route
                path="/company/:id"
                element={
                    <ProtectedRoute>
                        <CompanyLayout>
                            <CompanyDashboardPage />
                        </CompanyLayout>
                    </ProtectedRoute>
                }
            />


            {/* APPOINTMENTS */}

            <Route
                path="/company/:id/appointments"
                element={
                    <ProtectedRoute>
                        <CompanyLayout>
                            <AppointmentsPage />
                        </CompanyLayout>
                    </ProtectedRoute>
                }
            />


            {/* TEAM */}

            <Route
                path="/company/:id/team"
                element={
                    <ProtectedRoute>
                        <CompanyLayout>
                            <TeamPage />
                        </CompanyLayout>
                    </ProtectedRoute>
                }
            />


            {/* SERVICES */}

            <Route
                path="/company/:id/services"
                element={
                    <ProtectedRoute>
                        <CompanyLayout>
                            <ServicePage />
                        </CompanyLayout>
                    </ProtectedRoute>
                }
            />
            <Route
    path="/company/:id/promo-codes"
    element={
        <ProtectedRoute>
        <CompanyLayout>
            <PromoCodePage />
        </CompanyLayout>
        </ProtectedRoute>
    }
/>

            {/* STOCK */}

            <Route
                path="/company/:id/stock"
                element={
                    <ProtectedRoute>
                        <CompanyLayout>
                            <StockPage />
                        </CompanyLayout>
                    </ProtectedRoute>
                }
            />


            {/* UNKNOWN URL */}

            <Route
                path="*"
                element={
                    <Navigate to="/" replace />
                }
            />

        </Routes>
    );
}


export default function App() {

    return (
        <BrowserRouter>

            <AuthProvider>
                <AppRoutes />
            </AuthProvider>

        </BrowserRouter>
    );
}