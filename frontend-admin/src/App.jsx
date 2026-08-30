import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./components/layout/MainLayout";

import LoginPage from "./pages/login/LoginPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import CompanyPage from "./pages/companies/CompanyPage";
import PlanPage from "./pages/plans/PlanPage";
import SubscriptionPage from "./pages/subscriptions/SubscriptionPage";
import UserPage from "./pages/user/UserPage";
import ProfilePage from "./pages/profile/ProfilePage";
import SettingsPage from "./pages/settings/SettingsPage";

function ProtectedRoute({ children }) {

    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

function App() {

    return (

        <Routes>

            <Route
                path="/"
                element={<Navigate to="/login" replace />}
            />

            <Route
                path="/login"
                element={<LoginPage />}
            />

            <Route
                path="/*"
                element={
                    <ProtectedRoute>

                        <MainLayout>

                            <Routes>

                                <Route
                                    path="/dashboard"
                                    element={<DashboardPage />}
                                />

                                <Route
                                    path="/companies"
                                    element={<CompanyPage />}
                                />

                                <Route
                                    path="/plans"
                                    element={<PlanPage />}
                                />

                                <Route
                                    path="/subscriptions"
                                    element={<SubscriptionPage />}
                                />
                                <Route
                                    path="/users"
                                    element={<UserPage />}
                                />
                                <Route
                                    path="/profile"
                                    element={<ProfilePage />}
                                />
                                <Route
    path="/settings"
    element={<SettingsPage />}
/>
                            </Routes>

                        </MainLayout>

                    </ProtectedRoute>
                }
            />

        </Routes>

    );

}

export default App;