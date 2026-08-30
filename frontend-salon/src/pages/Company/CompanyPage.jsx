import {
    Alert,
    Box,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    Typography,
    Fade
} from "@mui/material";

import {
    Business,
    LocationOn,
    Phone,
    Email,
    CreditCard,
    CalendarToday,
    Storefront,
    Spa
} from "@mui/icons-material";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import { useAuth } from "../../context/AuthContext";

// Company color palette based on ID
const companyColors = [
    { main: "#B76E79", light: "#F5E6E8", gradient: "linear-gradient(135deg, #B76E79 0%, #D4A0A8 100%)" },
    { main: "#7C927F", light: "#E7EEE8", gradient: "linear-gradient(135deg, #7C927F 0%, #B5C4B7 100%)" },
    { main: "#C9A87C", light: "#F5EDE2", gradient: "linear-gradient(135deg, #C9A87C 0%, #E0CDB5 100%)" },
    { main: "#B7836B", light: "#F3E6DF", gradient: "linear-gradient(135deg, #B7836B 0%, #D5BCAE 100%)" },
    { main: "#8B9DC3", light: "#E8ECF5", gradient: "linear-gradient(135deg, #8B9DC3 0%, #BCC8DF 100%)" },
    { main: "#C48A9E", light: "#F5E8ED", gradient: "linear-gradient(135deg, #C48A9E 0%, #DFC0CC 100%)" },
    { main: "#9CAF88", light: "#EEF2E8", gradient: "linear-gradient(135deg, #9CAF88 0%, #C9D4BC 100%)" },
    { main: "#D4A08A", light: "#F5ECE6", gradient: "linear-gradient(135deg, #D4A08A 0%, #E8D0C4 100%)" },
];

const getCompanyColor = (id) => {
    return companyColors[id % companyColors.length] || companyColors[0];
};

export default function CompanyPage() {

    const { id } = useParams();
    const { user, companies } = useAuth();

    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const salon = {
        background: "#FAF9F7",
        surface: "#FFFFFF",
        text: "#242424",
        textSecondary: "#737373",
        border: "#E8E4DE",
        accent: "#B76E79",
        accentLight: "#F5E6E8",
        gradient: "linear-gradient(135deg, #B76E79 0%, #D4A0A8 100%)"
    };

    // =========================================================
    // LOAD COMPANY
    // =========================================================

    useEffect(() => {

        async function loadCompany() {

            try {

                setLoading(true);
                setError("");

                const token = localStorage.getItem("salonToken");

                const selectedCompany = companies?.find(
                    company => String(company.id) === String(id)
                );

                if (!selectedCompany) {
                    setError("Vous n'êtes pas autorisé à accéder à cette entreprise.");
                    return;
                }

                const response = await axios.get(
                    `http://localhost:8080/companies/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setCompany(response.data);

            } catch (err) {

                console.error("Failed to load company:", err);
                setError(
                    err.response?.data?.message ||
                    "Échec du chargement de l'entreprise."
                );

            } finally {

                setLoading(false);
            }
        }

        if (user && companies) {
            loadCompany();
        }

    }, [id, user, companies]);

    const companyColor = company ? getCompanyColor(company.id) : companyColors[0];

    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (
            <Box
                sx={{
                    minHeight: "70vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                <CircularProgress sx={{ color: salon.accent }} />
            </Box>
        );
    }

    // =========================================================
    // ERROR
    // =========================================================

    if (error) {
        return (
            <Alert severity="error" sx={{ borderRadius: "16px" }}>
                {error}
            </Alert>
        );
    }

    if (!company) {
        return null;
    }

    // =========================================================
    // STATUS COLOR
    // =========================================================

    const statusColor = company.status === "ACTIVE" ? "success" : "error";

    return (
        <Fade in timeout={500}>
            <Box sx={{ width: "100%" }}>

                {/* =================================================
                    HEADER
                ================================================== */}

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 2,
                        mb: 4,
                        flexWrap: "wrap"
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
                                width: 65,
                                height: 65,
                                borderRadius: "18px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: company.logo ? "#ffffff" : companyColor.gradient,
                                overflow: "hidden",
                                border: company.logo ? `1px solid ${salon.border}` : "none",
                                flexShrink: 0,
                                boxShadow: `0 4px 16px ${companyColor.main}30`
                            }}
                        >
                            {company.logo ? (
                                <Box
                                    component="img"
                                    src={company.logo}
                                    alt={`${company.name} logo`}
                                    sx={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "contain",
                                        p: 0.5
                                    }}
                                />
                            ) : (
                                <Storefront sx={{ color: "#fff", fontSize: 32 }} />
                            )}
                        </Box>

                        <Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                <Typography
                                    sx={{
                                        fontSize: "1.6rem",
                                        fontWeight: 800,
                                        color: salon.text,
                                        letterSpacing: "-0.5px"
                                    }}
                                >
                                    {company.name}
                                </Typography>
                                <Chip
                                    label={company.status === "ACTIVE" ? "Actif" : company.status}
                                    size="small"
                                    sx={{
                                        backgroundColor: company.status === "ACTIVE" ? "rgba(67,233,123,0.12)" : "rgba(245,87,108,0.12)",
                                        color: company.status === "ACTIVE" ? "#43e97b" : "#f5576c",
                                        fontWeight: 700,
                                        fontSize: "0.65rem",
                                        height: 24
                                    }}
                                />
                            </Box>
                            <Typography
                                sx={{
                                    fontSize: "0.85rem",
                                    color: salon.textSecondary,
                                    mt: 0.3
                                }}
                            >
                                Aperçu de l'entreprise
                            </Typography>
                        </Box>
                    </Box>

                    <Chip
                        icon={<Spa sx={{ fontSize: 16 }} />}
                        label="Salon actif"
                        sx={{
                            backgroundColor: salon.accentLight,
                            color: salon.accent,
                            fontWeight: 600,
                            fontSize: "0.75rem",
                            height: 32
                        }}
                    />
                </Box>

                {/* =================================================
                    MAIN CONTENT
                ================================================== */}

                <Grid container spacing={3}>

                    {/* =================================================
                        COMPANY INFORMATION
                    ================================================== */}

                    <Grid item xs={12} md={8}>
                        <Card
                            elevation={0}
                            sx={{
                                borderRadius: "20px",
                                background: "rgba(255,255,255,0.92)",
                                backdropFilter: "blur(10px)",
                                border: "1px solid rgba(255,255,255,0.6)",
                                boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                                height: "100%",
                                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                "&:hover": {
                                    transform: "translateY(-4px)",
                                    boxShadow: "0 12px 40px rgba(183,110,121,0.08)"
                                }
                            }}
                        >
                            <CardContent sx={{ p: 3.5 }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                                    <Business sx={{ color: salon.accent, fontSize: 22 }} />
                                    <Typography
                                        sx={{
                                            fontSize: "1rem",
                                            fontWeight: 700,
                                            color: salon.text
                                        }}
                                    >
                                        Informations de l'entreprise
                                    </Typography>
                                </Box>

                                {company.logo && (
                                    <Box
                                        sx={{
                                            mb: 3,
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 2.5,
                                            p: 2,
                                            borderRadius: "14px",
                                            background: salon.background,
                                            border: `1px solid ${salon.border}`
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 80,
                                                height: 80,
                                                borderRadius: "14px",
                                                border: `1px solid ${salon.border}`,
                                                backgroundColor: "#fff",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                overflow: "hidden"
                                            }}
                                        >
                                            <Box
                                                component="img"
                                                src={company.logo}
                                                alt={`${company.name} logo`}
                                                sx={{
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "contain",
                                                    p: 1
                                                }}
                                            />
                                        </Box>
                                        <Box>
                                            <Typography
                                                sx={{
                                                    fontSize: "0.65rem",
                                                    fontWeight: 600,
                                                    color: salon.textSecondary,
                                                    textTransform: "uppercase",
                                                    letterSpacing: "0.5px"
                                                }}
                                            >
                                                Logo
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    fontWeight: 700,
                                                    fontSize: "0.95rem",
                                                    color: salon.text
                                                }}
                                            >
                                                {company.name}
                                            </Typography>
                                        </Box>
                                    </Box>
                                )}

                                <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
                                        <Box
                                            sx={{
                                                width: 36,
                                                height: 36,
                                                borderRadius: "10px",
                                                background: `${salon.accent}10`,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center"
                                            }}
                                        >
                                            <Email sx={{ color: salon.accent, fontSize: 18 }} />
                                        </Box>
                                        <Box>
                                            <Typography
                                                sx={{
                                                    fontSize: "0.6rem",
                                                    fontWeight: 600,
                                                    color: salon.textSecondary,
                                                    textTransform: "uppercase",
                                                    letterSpacing: "0.5px"
                                                }}
                                            >
                                                Email
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    fontSize: "0.9rem",
                                                    color: salon.text,
                                                    fontWeight: 500
                                                }}
                                            >
                                                {company.email || "—"}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
                                        <Box
                                            sx={{
                                                width: 36,
                                                height: 36,
                                                borderRadius: "10px",
                                                background: `${salon.accent}10`,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center"
                                            }}
                                        >
                                            <Phone sx={{ color: salon.accent, fontSize: 18 }} />
                                        </Box>
                                        <Box>
                                            <Typography
                                                sx={{
                                                    fontSize: "0.6rem",
                                                    fontWeight: 600,
                                                    color: salon.textSecondary,
                                                    textTransform: "uppercase",
                                                    letterSpacing: "0.5px"
                                                }}
                                            >
                                                Téléphone
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    fontSize: "0.9rem",
                                                    color: salon.text,
                                                    fontWeight: 500
                                                }}
                                            >
                                                {company.phone || "—"}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
                                        <Box
                                            sx={{
                                                width: 36,
                                                height: 36,
                                                borderRadius: "10px",
                                                background: `${salon.accent}10`,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center"
                                            }}
                                        >
                                            <LocationOn sx={{ color: salon.accent, fontSize: 18 }} />
                                        </Box>
                                        <Box>
                                            <Typography
                                                sx={{
                                                    fontSize: "0.6rem",
                                                    fontWeight: 600,
                                                    color: salon.textSecondary,
                                                    textTransform: "uppercase",
                                                    letterSpacing: "0.5px"
                                                }}
                                            >
                                                Localisation
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    fontSize: "0.9rem",
                                                    color: salon.text,
                                                    fontWeight: 500
                                                }}
                                            >
                                                {[
                                                    company.address,
                                                    company.city,
                                                    company.country
                                                ].filter(Boolean).join(", ") || "—"}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* =================================================
                        ACCOUNT STATUS
                    ================================================== */}

                    <Grid item xs={12} md={4}>
                        <Card
                            elevation={0}
                            sx={{
                                borderRadius: "20px",
                                background: "rgba(255,255,255,0.92)",
                                backdropFilter: "blur(10px)",
                                border: "1px solid rgba(255,255,255,0.6)",
                                boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                                height: "100%",
                                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                "&:hover": {
                                    transform: "translateY(-4px)",
                                    boxShadow: "0 12px 40px rgba(183,110,121,0.08)"
                                }
                            }}
                        >
                            <CardContent sx={{ p: 3.5 }}>
                                <Typography
                                    sx={{
                                        fontSize: "1rem",
                                        fontWeight: 700,
                                        color: salon.text,
                                        mb: 3
                                    }}
                                >
                                    Statut du compte
                                </Typography>

                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                    <Box
                                        sx={{
                                            width: 12,
                                            height: 12,
                                            borderRadius: "50%",
                                            background: company.status === "ACTIVE" ? "#43e97b" : "#f5576c",
                                            animation: company.status === "ACTIVE" ? "pulseDot 2s ease-in-out infinite" : "none"
                                        }}
                                    />
                                    <Chip
                                        label={company.status === "ACTIVE" ? "Actif" : company.status}
                                        color={statusColor}
                                        sx={{
                                            fontWeight: 700,
                                            borderRadius: "8px"
                                        }}
                                    />
                                </Box>

                                <Divider sx={{ my: 3, borderColor: salon.border }} />

                                <Box>
                                    <Typography
                                        sx={{
                                            fontSize: "0.65rem",
                                            fontWeight: 600,
                                            color: salon.textSecondary,
                                            textTransform: "uppercase",
                                            letterSpacing: "0.5px",
                                            mb: 0.5
                                        }}
                                    >
                                        ID de l'entreprise
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: "0.9rem",
                                            fontWeight: 700,
                                            color: salon.text
                                        }}
                                    >
                                        #{company.id}
                                    </Typography>
                                </Box>

                                <Divider sx={{ my: 3, borderColor: salon.border }} />

                                <Box>
                                    <Typography
                                        sx={{
                                            fontSize: "0.65rem",
                                            fontWeight: 600,
                                            color: salon.textSecondary,
                                            textTransform: "uppercase",
                                            letterSpacing: "0.5px",
                                            mb: 0.5
                                        }}
                                    >
                                        Propriétaire
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: "0.9rem",
                                            fontWeight: 700,
                                            color: salon.text
                                        }}
                                    >
                                        {user?.firstName} {user?.lastName}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* =================================================
                        SUBSCRIPTION
                    ================================================== */}

                    <Grid item xs={12}>
                        <Card
                            elevation={0}
                            sx={{
                                borderRadius: "20px",
                                background: "rgba(255,255,255,0.92)",
                                backdropFilter: "blur(10px)",
                                border: "1px solid rgba(255,255,255,0.6)",
                                boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                "&:hover": {
                                    transform: "translateY(-4px)",
                                    boxShadow: "0 12px 40px rgba(183,110,121,0.08)"
                                }
                            }}
                        >
                            <CardContent sx={{ p: 3.5 }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                                    <Box
                                        sx={{
                                            width: 36,
                                            height: 36,
                                            borderRadius: "10px",
                                            background: `${salon.accent}10`,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}
                                    >
                                        <CreditCard sx={{ color: salon.accent, fontSize: 20 }} />
                                    </Box>
                                    <Typography
                                        sx={{
                                            fontSize: "1rem",
                                            fontWeight: 700,
                                            color: salon.text
                                        }}
                                    >
                                        Abonnement
                                    </Typography>
                                    <Chip
                                        label={company.subscriptionStatus === "ACTIVE" ? "Actif" : company.subscriptionStatus || "Inactif"}
                                        size="small"
                                        sx={{
                                            backgroundColor: company.subscriptionStatus === "ACTIVE" ? "rgba(67,233,123,0.12)" : "rgba(156,163,175,0.12)",
                                            color: company.subscriptionStatus === "ACTIVE" ? "#43e97b" : "#9ca3af",
                                            fontWeight: 600,
                                            fontSize: "0.6rem",
                                            height: 22
                                        }}
                                    />
                                </Box>

                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={4}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                            <Box
                                                sx={{
                                                    width: 34,
                                                    height: 34,
                                                    borderRadius: "8px",
                                                    background: `${salon.accent}10`,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center"
                                                }}
                                            >
                                                <CreditCard sx={{ color: salon.accent, fontSize: 16 }} />
                                            </Box>
                                            <Box>
                                                <Typography
                                                    sx={{
                                                        fontSize: "0.6rem",
                                                        fontWeight: 600,
                                                        color: salon.textSecondary,
                                                        textTransform: "uppercase",
                                                        letterSpacing: "0.5px"
                                                    }}
                                                >
                                                    Formule
                                                </Typography>
                                                <Typography
                                                    sx={{
                                                        fontSize: "0.9rem",
                                                        fontWeight: 700,
                                                        color: salon.text
                                                    }}
                                                >
                                                    {company.plan || "—"}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12} md={4}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                            <Box
                                                sx={{
                                                    width: 34,
                                                    height: 34,
                                                    borderRadius: "8px",
                                                    background: `${salon.accent}10`,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center"
                                                }}
                                            >
                                                <CalendarToday sx={{ color: salon.accent, fontSize: 16 }} />
                                            </Box>
                                            <Box>
                                                <Typography
                                                    sx={{
                                                        fontSize: "0.6rem",
                                                        fontWeight: 600,
                                                        color: salon.textSecondary,
                                                        textTransform: "uppercase",
                                                        letterSpacing: "0.5px"
                                                    }}
                                                >
                                                    Date de début
                                                </Typography>
                                                <Typography
                                                    sx={{
                                                        fontSize: "0.9rem",
                                                        fontWeight: 700,
                                                        color: salon.text
                                                    }}
                                                >
                                                    {company.subscriptionStartDate || "—"}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12} md={4}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                            <Box
                                                sx={{
                                                    width: 34,
                                                    height: 34,
                                                    borderRadius: "8px",
                                                    background: `${salon.accent}10`,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center"
                                                }}
                                            >
                                                <CalendarToday sx={{ color: salon.accent, fontSize: 16 }} />
                                            </Box>
                                            <Box>
                                                <Typography
                                                    sx={{
                                                        fontSize: "0.6rem",
                                                        fontWeight: 600,
                                                        color: salon.textSecondary,
                                                        textTransform: "uppercase",
                                                        letterSpacing: "0.5px"
                                                    }}
                                                >
                                                    Date d'expiration
                                                </Typography>
                                                <Typography
                                                    sx={{
                                                        fontSize: "0.9rem",
                                                        fontWeight: 700,
                                                        color: salon.text
                                                    }}
                                                >
                                                    {company.subscriptionEndDate || "—"}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <style>
                    {`
                        @keyframes pulseDot {
                            0%, 100% { opacity: 1; transform: scale(1); }
                            50% { opacity: 0.5; transform: scale(0.8); }
                        }
                    `}
                </style>
            </Box>
        </Fade>
    );
}