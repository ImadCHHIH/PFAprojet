import { useEffect, useState } from "react";

import {
    Typography,
    Grid,
    CircularProgress,
    Box,
    Paper,
    Chip,
    Fade,
    useTheme
} from "@mui/material";

import BusinessIcon from "@mui/icons-material/Business";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PaymentsIcon from "@mui/icons-material/Payments";
import PeopleIcon from "@mui/icons-material/People";
import SpaIcon from "@mui/icons-material/Spa";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

import { useTranslation } from "react-i18next";

import StatCard from "../../components/dashboard/StatCard";
import RecentCompaniesTable from "../../components/table/RecentCompaniesTable";
import SubscriptionStatusChart from "../../components/charts/SubscriptionStatusChart";

import { getDashboard } from "../../services/dashboardService";

import axios from "axios";

export default function DashboardPage() {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const { t } = useTranslation();

    const [dashboard, setDashboard] = useState(null);
    const [currency, setCurrency] = useState("MAD");
    const [numberFormat, setNumberFormat] = useState("1 234,56");

    const blue = {
        main: "#2563eb",
        light: "#3b82f6",
        lighter: "#60a5fa",
        lightest: "#93c5fd",
        dark: "#1d4ed8",
        darker: "#1e3a8a",
        bg: "rgba(37, 99, 235, 0.06)",
        text: isDark ? "#e8edf5" : "#1e293b",
        textLight: isDark ? "#94a3b8" : "#64748b"
    };

    const loadDashboard = async () => {
        try {
            const response = await getDashboard();
            setDashboard(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const loadFormattingSettings = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const currencyResponse = await axios.get(
                "http://localhost:8080/api/settings/currency",
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const numberResponse = await axios.get(
                "http://localhost:8080/api/settings/number-format",
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setCurrency(currencyResponse.data.currency);
            setNumberFormat(numberResponse.data.numberFormat);
        } catch (error) {
            console.error("Échec du chargement des paramètres de formatage", error);
        }
    };

    useEffect(() => {
        loadDashboard();
        loadFormattingSettings();
    }, []);

    const formatRevenue = (value) => {
        const numericValue = Number(value);
        if (isNaN(numericValue)) return value;

        const useFrenchFormat = numberFormat === "1 234,56";
        const formattedNumber = new Intl.NumberFormat(
            useFrenchFormat ? "fr-FR" : "en-US",
            { minimumFractionDigits: 2, maximumFractionDigits: 2 }
        ).format(numericValue);

        const currencySymbols = { MAD: "MAD", EUR: "€", USD: "$", CNY: "¥" };
        const symbol = currencySymbols[currency] || currency;

        return useFrenchFormat ? `${formattedNumber} ${symbol}` : `${symbol}${formattedNumber}`;
    };

    if (!dashboard) {
        return (
            <Box
                sx={{
                    minHeight: "calc(100vh - 64px)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    gap: 3
                }}
            >
                <CircularProgress size={50} thickness={4} sx={{ color: blue.main }} />
                <Typography sx={{ color: blue.textLight, fontWeight: 500, fontSize: "0.9rem" }}>
                    Chargement de votre tableau de bord...
                </Typography>
            </Box>
        );
    }

    const paperBg = isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.85)";
    const paperBorder = isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(255,255,255,0.8)";
    const paperShadow = isDark ? "0 10px 30px rgba(0,0,0,0.2)" : "0 10px 30px rgba(0,0,0,0.04)";

    return (
        <Fade in={true} timeout={600}>
            <Box sx={{ width: "100%" }}>
                <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
                        <Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                <SpaIcon sx={{ color: blue.main, fontSize: 28 }} />
                                <Typography
                                    sx={{
                                        fontSize: { xs: "1.5rem", md: "2rem" },
                                        fontWeight: 800,
                                        color: blue.text,
                                        letterSpacing: "-0.8px"
                                    }}
                                >
                                    Tableau de bord
                                </Typography>
                                <Chip
                                    label="Aujourd'hui"
                                    size="small"
                                    icon={<CalendarTodayIcon sx={{ fontSize: 14 }} />}
                                    sx={{
                                        backgroundColor: isDark ? "rgba(37,99,235,0.15)" : "rgba(37,99,235,0.06)",
                                        color: blue.main,
                                        fontWeight: 600,
                                        fontSize: "0.7rem",
                                        height: 28
                                    }}
                                />
                            </Box>
                            <Typography
                                sx={{
                                    mt: 0.5,
                                    fontSize: "0.85rem",
                                    color: blue.textLight,
                                    ml: 4.5
                                }}
                            >
                                Aperçu de votre plateforme BeautyCloud
                            </Typography>
                        </Box>

                        <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                            <Chip
                                label="Mis à jour"
                                size="small"
                                sx={{
                                    backgroundColor: "rgba(67,233,123,0.08)",
                                    color: "#43e97b",
                                    fontWeight: 600,
                                    fontSize: "0.65rem"
                                }}
                            />
                            <Chip
                                label="En ligne"
                                size="small"
                                sx={{
                                    backgroundColor: "rgba(67,233,123,0.08)",
                                    color: "#43e97b",
                                    fontWeight: 600,
                                    fontSize: "0.65rem"
                                }}
                            />
                        </Box>
                    </Box>
                </Box>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StatCard
                            title="ENTREPRISES"
                            value={dashboard.companies}
                            subtitle="Total entreprises"
                            icon={<BusinessIcon sx={{ fontSize: 28 }} />}
                            color="#2563eb"
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StatCard
                            title="ABONNEMENTS"
                            value={dashboard.subscriptions}
                            subtitle="Total abonnements"
                            icon={<ReceiptLongIcon sx={{ fontSize: 28 }} />}
                            color="#3b82f6"
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StatCard
                            title="REVENUS"
                            value={formatRevenue(dashboard.revenue)}
                            subtitle="Revenus totaux"
                            icon={<PaymentsIcon sx={{ fontSize: 28 }} />}
                            color="#1d4ed8"
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StatCard
                            title="ABONNEMENTS ACTIFS"
                            value={dashboard.activeSubscriptions}
                            subtitle="Actifs actuellement"
                            icon={<PeopleIcon sx={{ fontSize: 28 }} />}
                            color="#60a5fa"
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 5 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                borderRadius: "20px",
                                p: 3,
                                background: paperBg,
                                backdropFilter: "blur(10px)",
                                border: paperBorder,
                                boxShadow: paperShadow,
                                height: "100%",
                                minHeight: 380,
                                transition: "transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease",
                                "&:hover": {
                                    transform: "translateY(-4px)",
                                    boxShadow: isDark 
                                        ? "0 20px 40px rgba(0,0,0,0.3)" 
                                        : "0 12px 40px rgba(37,99,235,0.08)"
                                }
                            }}
                        >
                            <SubscriptionStatusChart dashboard={dashboard} />
                        </Paper>
                    </Grid>

                    <Grid size={{ xs: 12, md: 7 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                borderRadius: "20px",
                                p: 3,
                                background: paperBg,
                                backdropFilter: "blur(10px)",
                                border: paperBorder,
                                boxShadow: paperShadow,
                                transition: "transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease",
                                "&:hover": {
                                    transform: "translateY(-4px)",
                                    boxShadow: isDark 
                                        ? "0 20px 40px rgba(0,0,0,0.3)" 
                                        : "0 12px 40px rgba(37,99,235,0.08)"
                                }
                            }}
                        >
                            <RecentCompaniesTable companies={dashboard.latestCompanies} />
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Fade>
    );
}