import {
    Box,
    Card,
    CardContent,
    Grid,
    Typography,
    Chip,
    Divider,
    Button,
    Fade,
    Avatar,
    Paper,
    Stack,
    LinearProgress
} from "@mui/material";

import BusinessIcon from "@mui/icons-material/Business";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LockIcon from "@mui/icons-material/Lock";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import StorefrontIcon from "@mui/icons-material/Storefront";
import SpaIcon from "@mui/icons-material/Spa";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ScheduleIcon from "@mui/icons-material/Schedule";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getCompanyTheme } from "../../utils/companyThemes";

export default function DashboardPage() {

    const {
        user,
        companies
    } = useAuth();

    const navigate = useNavigate();

    const API_URL = "http://localhost:8080";

    const salon = {
        background: "#FAF9F7",
        surface: "#FFFFFF",
        text: "#242424",
        textSecondary: "#737373",
        border: "#E8E4DE",
        accent: "#B76E79",
        accentLight: "#F5E6E8",
        gradient: "linear-gradient(135deg, #B76E79 0%, #D4A0A8 100%)",
        shadow: "0 20px 60px rgba(183, 110, 121, 0.08)"
    };

    function handleManageCompany(company) {
        if (company.subscriptionStatus !== "ACTIVE") {
            return;
        }
        navigate(`/company/${company.id}`);
    }

    function formatDate(date) {
        if (!date) return "—";
        const [year, month, day] = date.split("-");
        return `${day}/${month}/${year}`;
    }

    function getSubscriptionStatusColor(status) {
        switch (status) {
            case "ACTIVE": return "success";
            case "EXPIRED": return "error";
            case "CANCELLED": return "warning";
            default: return "default";
        }
    }

    function getSubscriptionStatusLabel(status) {
        switch (status) {
            case "ACTIVE": return "Actif";
            case "EXPIRED": return "Expiré";
            case "CANCELLED": return "Annulé";
            default: return "Aucun abonnement";
        }
    }

    function getDaysRemaining(endDate) {
        if (!endDate) return null;
        const now = new Date();
        const end = new Date(endDate);
        const diff = end - now;
        return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    }

    return (
        <Fade in timeout={600}>
            <Box sx={{ width: "100%" }}>
                {/* Header */}
                <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                borderRadius: "16px",
                                background: salon.gradient,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 4px 16px rgba(183, 110, 121, 0.2)"
                            }}
                        >
                            <SpaIcon sx={{ color: "#fff", fontSize: 28 }} />
                        </Box>
                        <Box>
                            <Typography
                                sx={{
                                    fontSize: { xs: "1.5rem", md: "2rem" },
                                    fontWeight: 800,
                                    color: salon.text,
                                    letterSpacing: "-0.8px"
                                }}
                            >
                                Bienvenue, {user?.firstName}
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: "0.85rem",
                                    color: salon.textSecondary
                                }}
                            >
                                Sélectionnez une entreprise à gérer
                            </Typography>
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            mt: 2,
                            height: "3px",
                            width: "48px",
                            background: salon.gradient,
                            borderRadius: "2px"
                        }}
                    />
                </Box>

                {/* Stats Summary */}
                <Box
                    sx={{
                        display: "flex",
                        gap: 3,
                        mb: 4,
                        flexWrap: "wrap",
                        p: 2.5,
                        borderRadius: "16px",
                        background: "rgba(255,255,255,0.6)",
                        border: `1px solid ${salon.border}`
                    }}
                >
                    <Box>
                        <Typography sx={{ fontSize: "0.65rem", fontWeight: 600, color: salon.textSecondary, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                            Total entreprises
                        </Typography>
                        <Typography sx={{ fontSize: "1.3rem", fontWeight: 800, color: salon.text }}>
                            {companies.length}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography sx={{ fontSize: "0.65rem", fontWeight: 600, color: salon.textSecondary, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                            Actives
                        </Typography>
                        <Typography sx={{ fontSize: "1.3rem", fontWeight: 800, color: "#43e97b" }}>
                            {companies.filter(c => c.status === "ACTIVE").length}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography sx={{ fontSize: "0.65rem", fontWeight: 600, color: salon.textSecondary, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                            Abonnements actifs
                        </Typography>
                        <Typography sx={{ fontSize: "1.3rem", fontWeight: 800, color: salon.accent }}>
                            {companies.filter(c => c.subscriptionStatus === "ACTIVE").length}
                        </Typography>
                    </Box>
                </Box>

                {/* Company List */}
                <Typography
                    sx={{
                        fontSize: "1.1rem",
                        fontWeight: 700,
                        color: salon.text,
                        mb: 2.5
                    }}
                >
                    Vos entreprises
                </Typography>

                <Grid container spacing={3}>
                    {companies.map((company) => {
                        const hasActiveSubscription = company.subscriptionStatus === "ACTIVE";
                        const theme = getCompanyTheme(company.id);
                        const daysRemaining = getDaysRemaining(company.subscriptionEndDate);

                        return (
                            <Grid item xs={12} key={company.id}>
                                <Card
                                    elevation={0}
                                    sx={{
                                        borderRadius: "24px",
                                        background: "rgba(255,255,255,0.92)",
                                        backdropFilter: "blur(10px)",
                                        border: `1px solid ${theme.border}30`,
                                        boxShadow: `0 4px 20px ${theme.shadow}`,
                                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                        width: "100%",
                                        position: "relative",
                                        overflow: "hidden",
                                        "&:hover": {
                                            transform: "translateY(-4px)",
                                            boxShadow: `0 24px 60px ${theme.shadow}50`
                                        },
                                        "&::before": {
                                            content: '""',
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: "4px",
                                            background: theme.gradient,
                                            borderRadius: "24px 24px 0 0"
                                        }
                                    }}
                                >
                                    <CardContent sx={{ p: 3.5 }}>
                                        {/* Company Header */}
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "flex-start",
                                                mb: 3,
                                                flexDirection: { xs: "column", sm: "row" },
                                                gap: { xs: 2, sm: 0 }
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 2.5
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        width: 64,
                                                        height: 64,
                                                        borderRadius: "16px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        background: company.logo ? "#ffffff" : theme.light,
                                                        border: company.logo ? "1px solid #e5e5e5" : "none",
                                                        overflow: "hidden",
                                                        flexShrink: 0,
                                                        boxShadow: company.logo ? "0 4px 12px rgba(0,0,0,0.04)" : "none"
                                                    }}
                                                >
                                                    {company.logo ? (
                                                        <Box
                                                            component="img"
                                                            src={company.logo?.startsWith("http") ? company.logo : `${API_URL}${company.logo}`}
                                                            alt={`${company.name} logo`}
                                                            onError={(e) => { e.currentTarget.style.display = "none"; }}
                                                            sx={{
                                                                width: "100%",
                                                                height: "100%",
                                                                objectFit: "contain",
                                                                p: 0.5
                                                            }}
                                                        />
                                                    ) : (
                                                        <StorefrontIcon sx={{ color: theme.main, fontSize: 32 }} />
                                                    )}
                                                </Box>

                                                <Box>
                                                    <Typography
                                                        sx={{
                                                            fontSize: "1.1rem",
                                                            fontWeight: 700,
                                                            color: salon.text
                                                        }}
                                                    >
                                                        {company.name}
                                                    </Typography>
                                                    <Box sx={{ display: "flex", gap: 1, mt: 0.5, flexWrap: "wrap" }}>
                                                        <Chip
                                                            label={company.status === "ACTIVE" ? "Actif" : company.status}
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: company.status === "ACTIVE" ? "rgba(67,233,123,0.12)" : "rgba(156,163,175,0.12)",
                                                                color: company.status === "ACTIVE" ? "#43e97b" : "#9ca3af",
                                                                fontWeight: 600,
                                                                fontSize: "0.6rem",
                                                                height: 22
                                                            }}
                                                        />
                                                        <Chip
                                                            label={getSubscriptionStatusLabel(company.subscriptionStatus)}
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: getSubscriptionStatusColor(company.subscriptionStatus) === "success" ? "rgba(67,233,123,0.12)" : "rgba(156,163,175,0.12)",
                                                                color: getSubscriptionStatusColor(company.subscriptionStatus) === "success" ? "#43e97b" : "#9ca3af",
                                                                fontWeight: 600,
                                                                fontSize: "0.6rem",
                                                                height: 22
                                                            }}
                                                        />
                                                        {daysRemaining !== null && daysRemaining > 0 && (
                                                            <Chip
                                                                icon={<ScheduleIcon sx={{ fontSize: 14 }} />}
                                                                label={`${daysRemaining} jours`}
                                                                size="small"
                                                                sx={{
                                                                    backgroundColor: daysRemaining > 30 ? "rgba(67,233,123,0.08)" : "rgba(245,87,108,0.08)",
                                                                    color: daysRemaining > 30 ? "#43e97b" : "#f5576c",
                                                                    fontWeight: 600,
                                                                    fontSize: "0.6rem",
                                                                    height: 22
                                                                }}
                                                            />
                                                        )}
                                                    </Box>
                                                </Box>
                                            </Box>

                                            <Button
                                                variant="contained"
                                                disabled={!hasActiveSubscription}
                                                onClick={() => handleManageCompany(company)}
                                                endIcon={hasActiveSubscription ? <ArrowForwardIcon /> : <LockIcon />}
                                                sx={{
                                                    borderRadius: "12px",
                                                    textTransform: "none",
                                                    fontWeight: 700,
                                                    fontSize: "0.85rem",
                                                    px: 3,
                                                    py: 1,
                                                    background: hasActiveSubscription ? theme.buttonGradient : "#e5e5e5",
                                                    color: hasActiveSubscription ? "#fff" : "#9ca3af",
                                                    boxShadow: hasActiveSubscription ? `0 4px 16px ${theme.shadow}` : "none",
                                                    transition: "all 0.3s ease",
                                                    "&:hover": {
                                                        transform: hasActiveSubscription ? "translateY(-2px)" : "none",
                                                        boxShadow: hasActiveSubscription ? `0 8px 24px ${theme.shadow}50` : "none",
                                                        background: hasActiveSubscription ? theme.buttonHover : "#e5e5e5"
                                                    },
                                                    "&.Mui-disabled": {
                                                        background: "#e5e5e5",
                                                        color: "#9ca3af"
                                                    }
                                                }}
                                            >
                                                {hasActiveSubscription ? "Gérer l'entreprise" : "Abonnement requis"}
                                            </Button>
                                        </Box>

                                        <Divider sx={{ mb: 3, borderColor: salon.border }} />

                                        {/* Company Information */}
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <Box
                                                    sx={{
                                                        p: 2,
                                                        borderRadius: "16px",
                                                        background: `linear-gradient(135deg, ${theme.light} 0%, rgba(255,255,255,0.4) 100%)`,
                                                        border: `1px solid ${theme.border}30`,
                                                        transition: "all 0.3s ease",
                                                        "&:hover": {
                                                            borderColor: theme.main,
                                                            boxShadow: `0 4px 16px ${theme.shadow}`,
                                                            transform: "translateY(-2px)"
                                                        }
                                                    }}
                                                >
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                                                        <Box
                                                            sx={{
                                                                width: 32,
                                                                height: 32,
                                                                borderRadius: "10px",
                                                                background: `${theme.main}15`,
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center"
                                                            }}
                                                        >
                                                            <EmailIcon sx={{ color: theme.main, fontSize: 18 }} />
                                                        </Box>
                                                        <Typography sx={{ fontSize: "0.6rem", fontWeight: 600, color: salon.textSecondary, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                                            Email
                                                        </Typography>
                                                    </Box>
                                                    <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: salon.text, ml: 1 }}>
                                                        {company.email || "—"}
                                                    </Typography>
                                                </Box>
                                            </Grid>

                                            <Grid item xs={12} sm={6} md={3}>
                                                <Box
                                                    sx={{
                                                        p: 2,
                                                        borderRadius: "16px",
                                                        background: `linear-gradient(135deg, ${theme.light} 0%, rgba(255,255,255,0.4) 100%)`,
                                                        border: `1px solid ${theme.border}30`,
                                                        transition: "all 0.3s ease",
                                                        "&:hover": {
                                                            borderColor: theme.main,
                                                            boxShadow: `0 4px 16px ${theme.shadow}`,
                                                            transform: "translateY(-2px)"
                                                        }
                                                    }}
                                                >
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                                                        <Box
                                                            sx={{
                                                                width: 32,
                                                                height: 32,
                                                                borderRadius: "10px",
                                                                background: `${theme.main}15`,
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center"
                                                            }}
                                                        >
                                                            <PhoneIcon sx={{ color: theme.main, fontSize: 18 }} />
                                                        </Box>
                                                        <Typography sx={{ fontSize: "0.6rem", fontWeight: 600, color: salon.textSecondary, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                                            Téléphone
                                                        </Typography>
                                                    </Box>
                                                    <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: salon.text, ml: 1 }}>
                                                        {company.phone || "—"}
                                                    </Typography>
                                                </Box>
                                            </Grid>

                                            <Grid item xs={12} sm={6} md={3}>
                                                <Box
                                                    sx={{
                                                        p: 2,
                                                        borderRadius: "16px",
                                                        background: `linear-gradient(135deg, ${theme.light} 0%, rgba(255,255,255,0.4) 100%)`,
                                                        border: `1px solid ${theme.border}30`,
                                                        transition: "all 0.3s ease",
                                                        "&:hover": {
                                                            borderColor: theme.main,
                                                            boxShadow: `0 4px 16px ${theme.shadow}`,
                                                            transform: "translateY(-2px)"
                                                        }
                                                    }}
                                                >
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                                                        <Box
                                                            sx={{
                                                                width: 32,
                                                                height: 32,
                                                                borderRadius: "10px",
                                                                background: `${theme.main}15`,
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center"
                                                            }}
                                                        >
                                                            <LocationOnIcon sx={{ color: theme.main, fontSize: 18 }} />
                                                        </Box>
                                                        <Typography sx={{ fontSize: "0.6rem", fontWeight: 600, color: salon.textSecondary, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                                            Ville
                                                        </Typography>
                                                    </Box>
                                                    <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: salon.text, ml: 1 }}>
                                                        {company.city || "—"}
                                                    </Typography>
                                                </Box>
                                            </Grid>

                                            <Grid item xs={12} sm={6} md={3}>
                                                <Box
                                                    sx={{
                                                        p: 2,
                                                        borderRadius: "16px",
                                                        background: `linear-gradient(135deg, ${theme.light} 0%, rgba(255,255,255,0.4) 100%)`,
                                                        border: `1px solid ${theme.border}30`,
                                                        transition: "all 0.3s ease",
                                                        "&:hover": {
                                                            borderColor: theme.main,
                                                            boxShadow: `0 4px 16px ${theme.shadow}`,
                                                            transform: "translateY(-2px)"
                                                        }
                                                    }}
                                                >
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                                                        <Box
                                                            sx={{
                                                                width: 32,
                                                                height: 32,
                                                                borderRadius: "10px",
                                                                background: `${theme.main}15`,
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center"
                                                            }}
                                                        >
                                                            <LocationOnIcon sx={{ color: theme.main, fontSize: 18 }} />
                                                        </Box>
                                                        <Typography sx={{ fontSize: "0.6rem", fontWeight: 600, color: salon.textSecondary, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                                            Pays
                                                        </Typography>
                                                    </Box>
                                                    <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: salon.text, ml: 1 }}>
                                                        {company.country || "—"}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>

                                        <Divider sx={{ my: 3, borderColor: salon.border }} />

                                        {/* Subscription */}
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                                            <CreditCardIcon sx={{ color: theme.main }} />
                                            <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: salon.text }}>
                                                Abonnement
                                            </Typography>
                                            {hasActiveSubscription && (
                                                <Chip
                                                    icon={<CheckCircleIcon sx={{ fontSize: 14 }} />}
                                                    label="Actif"
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: "rgba(67,233,123,0.12)",
                                                        color: "#43e97b",
                                                        fontWeight: 600,
                                                        fontSize: "0.6rem",
                                                        height: 22
                                                    }}
                                                />
                                            )}
                                        </Box>

                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <Box
                                                    sx={{
                                                        p: 2,
                                                        borderRadius: "16px",
                                                        background: `linear-gradient(135deg, ${theme.light} 0%, rgba(255,255,255,0.4) 100%)`,
                                                        border: `1px solid ${theme.border}30`,
                                                        transition: "all 0.3s ease",
                                                        "&:hover": {
                                                            borderColor: theme.main,
                                                            boxShadow: `0 4px 16px ${theme.shadow}`,
                                                            transform: "translateY(-2px)"
                                                        }
                                                    }}
                                                >
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                                                        <Box
                                                            sx={{
                                                                width: 32,
                                                                height: 32,
                                                                borderRadius: "10px",
                                                                background: `${theme.main}15`,
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center"
                                                            }}
                                                        >
                                                            <CreditCardIcon sx={{ color: theme.main, fontSize: 18 }} />
                                                        </Box>
                                                        <Typography sx={{ fontSize: "0.6rem", fontWeight: 600, color: salon.textSecondary, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                                            Formule
                                                        </Typography>
                                                    </Box>
                                                    <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: salon.text, ml: 1 }}>
                                                        {company.plan || "Aucun"}
                                                    </Typography>
                                                </Box>
                                            </Grid>

                                            <Grid item xs={12} sm={6} md={3}>
                                                <Box
                                                    sx={{
                                                        p: 2,
                                                        borderRadius: "16px",
                                                        background: `linear-gradient(135deg, ${theme.light} 0%, rgba(255,255,255,0.4) 100%)`,
                                                        border: `1px solid ${theme.border}30`,
                                                        transition: "all 0.3s ease",
                                                        "&:hover": {
                                                            borderColor: theme.main,
                                                            boxShadow: `0 4px 16px ${theme.shadow}`,
                                                            transform: "translateY(-2px)"
                                                        }
                                                    }}
                                                >
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                                                        <Box
                                                            sx={{
                                                                width: 32,
                                                                height: 32,
                                                                borderRadius: "10px",
                                                                background: `${theme.main}15`,
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center"
                                                            }}
                                                        >
                                                            <CalendarTodayIcon sx={{ color: theme.main, fontSize: 18 }} />
                                                        </Box>
                                                        <Typography sx={{ fontSize: "0.6rem", fontWeight: 600, color: salon.textSecondary, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                                            Durée
                                                        </Typography>
                                                    </Box>
                                                    <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: salon.text, ml: 1 }}>
                                                        {company.durationMonths ? `${company.durationMonths} mois` : "—"}
                                                    </Typography>
                                                </Box>
                                            </Grid>

                                            <Grid item xs={12} sm={6} md={3}>
                                                <Box
                                                    sx={{
                                                        p: 2,
                                                        borderRadius: "16px",
                                                        background: `linear-gradient(135deg, ${theme.light} 0%, rgba(255,255,255,0.4) 100%)`,
                                                        border: `1px solid ${theme.border}30`,
                                                        transition: "all 0.3s ease",
                                                        "&:hover": {
                                                            borderColor: theme.main,
                                                            boxShadow: `0 4px 16px ${theme.shadow}`,
                                                            transform: "translateY(-2px)"
                                                        }
                                                    }}
                                                >
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                                                        <Box
                                                            sx={{
                                                                width: 32,
                                                                height: 32,
                                                                borderRadius: "10px",
                                                                background: `${theme.main}15`,
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center"
                                                            }}
                                                        >
                                                            <CalendarTodayIcon sx={{ color: theme.main, fontSize: 18 }} />
                                                        </Box>
                                                        <Typography sx={{ fontSize: "0.6rem", fontWeight: 600, color: salon.textSecondary, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                                            Début
                                                        </Typography>
                                                    </Box>
                                                    <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: salon.text, ml: 1 }}>
                                                        {formatDate(company.subscriptionStartDate)}
                                                    </Typography>
                                                </Box>
                                            </Grid>

                                            <Grid item xs={12} sm={6} md={3}>
                                                <Box
                                                    sx={{
                                                        p: 2,
                                                        borderRadius: "16px",
                                                        background: `linear-gradient(135deg, ${theme.light} 0%, rgba(255,255,255,0.4) 100%)`,
                                                        border: `1px solid ${theme.border}30`,
                                                        transition: "all 0.3s ease",
                                                        "&:hover": {
                                                            borderColor: theme.main,
                                                            boxShadow: `0 4px 16px ${theme.shadow}`,
                                                            transform: "translateY(-2px)"
                                                        }
                                                    }}
                                                >
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                                                        <Box
                                                            sx={{
                                                                width: 32,
                                                                height: 32,
                                                                borderRadius: "10px",
                                                                background: `${theme.main}15`,
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center"
                                                            }}
                                                        >
                                                            <CalendarTodayIcon sx={{ color: theme.main, fontSize: 18 }} />
                                                        </Box>
                                                        <Typography sx={{ fontSize: "0.6rem", fontWeight: 600, color: salon.textSecondary, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                                            Expiration
                                                        </Typography>
                                                    </Box>
                                                    <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: salon.text, ml: 1 }}>
                                                        {formatDate(company.subscriptionEndDate)}
                                                    </Typography>
                                                    {daysRemaining !== null && daysRemaining > 0 && daysRemaining <= 30 && (
                                                        <LinearProgress
                                                            variant="determinate"
                                                            value={(daysRemaining / 30) * 100}
                                                            sx={{
                                                                mt: 1,
                                                                height: 3,
                                                                borderRadius: "4px",
                                                                backgroundColor: "rgba(245,87,108,0.1)",
                                                                "& .MuiLinearProgress-bar": {
                                                                    backgroundColor: daysRemaining > 15 ? "#43e97b" : "#f5576c"
                                                                }
                                                            }}
                                                        />
                                                    )}
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}

                    {companies.length === 0 && (
                        <Grid item xs={12}>
                            <Card
                                elevation={0}
                                sx={{
                                    borderRadius: "24px",
                                    background: "rgba(255,255,255,0.92)",
                                    backdropFilter: "blur(10px)",
                                    border: "1px solid rgba(255,255,255,0.6)",
                                    boxShadow: salon.shadow,
                                    p: 4,
                                    textAlign: "center"
                                }}
                            >
                                <BusinessIcon sx={{ fontSize: 48, color: salon.border, mb: 2 }} />
                                <Typography sx={{ fontWeight: 700, fontSize: "1.1rem", color: salon.text, mb: 1 }}>
                                    Aucune entreprise
                                </Typography>
                                <Typography sx={{ color: salon.textSecondary }}>
                                    Aucune entreprise n'est actuellement associée à votre compte.
                                </Typography>
                            </Card>
                        </Grid>
                    )}
                </Grid>
            </Box>
        </Fade>
    );
}