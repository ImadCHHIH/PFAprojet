import React from "react";
import ReactDOM from "react-dom/client";

import { BrowserRouter } from "react-router-dom";

import App from "./App";

import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import "./i18n/i18n";
import { LanguageProvider } from "./context/LanguageContext";
import { SettingsProvider } from "./context/SettingsContext";
import "@fontsource/roboto";

ReactDOM.createRoot(document.getElementById("root")).render(

    <BrowserRouter>

    <ThemeProvider>
    <LanguageProvider>
        <AuthProvider>
        <SettingsProvider>
            <App />
        </SettingsProvider>
        </AuthProvider>
    </LanguageProvider>
</ThemeProvider>

</BrowserRouter>
);