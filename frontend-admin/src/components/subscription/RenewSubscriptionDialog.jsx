import { useState, useEffect } from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Stack,
    Box,
    Divider,
    IconButton,
    Chip,
    Paper,
    LinearProgress
} from "@mui/material";

import {
    Close,
    AutorenewOutlined,
    BusinessOutlined,
    CalendarMonthOutlined,
    WorkspacePremiumOutlined,
    CheckCircleOutlineRounded,
    TrendingUp
} from "@mui/icons-material";

import { getPlans } from "../../services/planService";

export default function RenewSubscriptionDialog({
    open,
    onClose,
    onConfirm,
    subscription
}) {
    const [durationMonths, setDurationMonths] = useState(1);
    const [planId, setPlanId] = useState("");
    const [plans, setPlans] = useState([]);

    const blue = {
        main: "#2563eb",
        light: "#3b82f6",
        lighter: "#60a5fa",
        lightest: "#93c5fd",
        dark: "#1d4ed8",
        darker: "#1e3a8a",
        gradient: "linear-gradient(135deg, #2563eb 0%, #60a5fa 100%)",
        gradientDark: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
        bg: "rgba(37, 99, 235, 0.06)",
        text: "#1e293b",
        textLight: "#64748b"
    };

    useEffect(() => {
        loadPlans();
    }, []);

    useEffect(() => {
        if (open) {
            setDurationMonths(1);
            setPlanId(subscription?.planId || "");
        }
    }, [open, subscription]);

    async function loadPlans() {
        try {
            const response = await getPlans();
            setPlans(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    const handleRenew = () => {
        onConfirm(planId, durationMonths);
    };

    const selectedPlan = plans.find(
        (plan) => plan.id === planId
    );

    const getEndDate = () => {
        if (!subscription?.endDate) return "Non définie";
        const date = new Date(subscription.endDate);
        return date.toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
    };

    const getDaysRemaining = () => {
        if (!subscription?.endDate) return 0;
        const now = new Date();
        const end = new Date(subscription.endDate);
        const diff = end - now;
        return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    };

    const daysRemaining = getDaysRemaining();

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            PaperProps={{
                sx: {
                    borderRadius: "28px",
                    overflow: "hidden",
                    background: "rgba(255,255,255,0.95)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    boxShadow: "0 40px 80px rgba(0,0,0,0.15)",
                    maxHeight: "90vh"
                }
            }}
        >
            <DialogTitle
                sx={{
                    px: { xs: 3, sm: 4 },
                    pt: 3.5,
                    pb: 2.8,
                    background: blue.gradient,
                    color: "#FFFFFF",
                    position: "relative",
                    borderBottom: "1px solid rgba(255,255,255,0.1)"
                }}
            >
                <IconButton
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        right: 16,
                        top: 16,
                        width: 38,
                        height: 38,
                        color: "#FFFFFF",
                        backgroundColor: "rgba(255,255,255,0.12)",
                        "&:hover": {
                            backgroundColor: "rgba(255,255,255,0.25)",
                            transform: "rotate(90deg)"
                        },
                        transition: "transform 0.3s ease"
                    }}
                >
                    <Close fontSize="small" />
                </IconButton>

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2
                    }}
                >
                    <Box
                        sx={{
                            width: 52,
                            height: 52,
                            borderRadius: "16px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "rgba(255,255,255,0.15)",
                            border: "1px solid rgba(255,255,255,0.2)",
                            backdropFilter: "blur(10px)"
                        }}
                    >
                        <AutorenewOutlined sx={{ fontSize: 28 }} />
                    </Box>

                    <Box>
                        <Typography
                            sx={{
                                fontSize: "0.65rem",
                                textTransform: "uppercase",
                                letterSpacing: "1.8px",
                                fontWeight: 700,
                                color: "rgba(255,255,255,0.7)",
                                mb: 0.3
                            }}
                        >
                            Renouvellement
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: "1.5rem",
                                fontWeight: 800,
                                letterSpacing: "-0.8px"
                            }}
                        >
                            Renouveler l'abonnement
                        </Typography>
                    </Box>
                </Box>
            </DialogTitle>

            <DialogContent
                sx={{
                    px: { xs: 3, sm: 4 },
                    py: 3.5,
                    backgroundColor: "transparent",
                    overflowY: "auto"
                }}
            >
                <Stack spacing={3}>

                    <Paper
                        elevation={0}
                        sx={{
                            p: 2.5,
                            borderRadius: "16px",
                            backgroundColor: blue.bg,
                            border: `1px solid ${blue.bg}`
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                mb: 1.5
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: "0.65rem",
                                    fontWeight: 800,
                                    textTransform: "uppercase",
                                    letterSpacing: "1.2px",
                                    color: blue.main
                                }}
                            >
                                Abonnement actuel
                            </Typography>

                            {daysRemaining > 0 && (
                                <Chip
                                    icon={<TrendingUp />}
                                    label={`${daysRemaining} jours restants`}
                                    size="small"
                                    sx={{
                                        backgroundColor: daysRemaining > 30 ? "rgba(67, 233, 123, 0.15)" : "rgba(245, 87, 108, 0.15)",
                                        color: daysRemaining > 30 ? "#43e97b" : "#f5576c",
                                        fontWeight: 700,
                                        fontSize: "0.7rem",
                                        height: 26
                                    }}
                                />
                            )}
                        </Box>

                        <Stack spacing={1.5}>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1.5
                                }}
                            >
                                <BusinessOutlined
                                    sx={{
                                        fontSize: 20,
                                        color: blue.main
                                    }}
                                />

                                <Typography
                                    sx={{
                                        fontSize: "0.9rem",
                                        color: blue.text,
                                        fontWeight: 600
                                    }}
                                >
                                    {subscription?.company || "—"}
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1.5
                                }}
                            >
                                <CalendarMonthOutlined
                                    sx={{
                                        fontSize: 20,
                                        color: blue.main
                                    }}
                                />

                                <Typography
                                    sx={{
                                        fontSize: "0.85rem",
                                        color: blue.textLight
                                    }}
                                >
                                    <Box
                                        component="span"
                                        sx={{
                                            fontWeight: 700,
                                            color: blue.text,
                                            mr: 0.5
                                        }}
                                    >
                                        Expiration:
                                    </Box>
                                    {getEndDate()}
                                </Typography>
                            </Box>
                        </Stack>

                        {daysRemaining <= 30 && daysRemaining > 0 && (
                            <Box sx={{ mt: 1.5 }}>
                                <LinearProgress
                                    variant="determinate"
                                    value={(daysRemaining / 30) * 100}
                                    sx={{
                                        height: 6,
                                        borderRadius: "4px",
                                        backgroundColor: "rgba(245, 87, 108, 0.1)",
                                        "& .MuiLinearProgress-bar": {
                                            backgroundColor: daysRemaining > 15 ? "#43e97b" : "#f5576c",
                                            borderRadius: "4px"
                                        }
                                    }}
                                />
                            </Box>
                        )}
                    </Paper>

                    <Divider sx={{ borderColor: "rgba(0,0,0,0.06)" }} />

                    <Box>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5,
                                mb: 2
                            }}
                        >
                            <WorkspacePremiumOutlined
                                sx={{
                                    fontSize: 20,
                                    color: blue.main
                                }}
                            />

                            <Typography
                                sx={{
                                    fontSize: "0.75rem",
                                    fontWeight: 800,
                                    textTransform: "uppercase",
                                    letterSpacing: "1.2px",
                                    color: blue.text
                                }}
                            >
                                Nouveau plan
                            </Typography>

                            <Chip
                                label="Sélection requis"
                                size="small"
                                sx={{
                                    height: 20,
                                    backgroundColor: "rgba(245, 87, 108, 0.1)",
                                    color: "#f5576c",
                                    fontSize: "0.6rem",
                                    fontWeight: 700
                                }}
                            />
                        </Box>

                        <Stack spacing={2.5}>
                            <FormControl fullWidth>
                                <InputLabel sx={{ color: blue.textLight }}>
                                    Sélectionner un plan
                                </InputLabel>

                                <Select
                                    value={planId}
                                    label="Sélectionner un plan"
                                    onChange={(e) =>
                                        setPlanId(e.target.value)
                                    }
                                    sx={{
                                        borderRadius: "14px",
                                        backgroundColor: "#f9fafb",
                                        "&:hover .MuiOutlinedInput-notchedOutline": {
                                            borderColor: blue.main
                                        },
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            borderColor: blue.main,
                                            boxShadow: `0 0 0 4px ${blue.bg}`
                                        }
                                    }}
                                >
                                    {plans.map((plan) => (
                                        <MenuItem
                                            key={plan.id}
                                            value={plan.id}
                                            sx={{
                                                py: 1.5,
                                                "&:hover": {
                                                    backgroundColor: blue.bg
                                                }
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "space-between",
                                                    width: "100%"
                                                }}
                                            >
                                                <Box>
                                                    <Typography
                                                        sx={{
                                                            fontSize: "0.9rem",
                                                            fontWeight: 700,
                                                            color: blue.text
                                                        }}
                                                    >
                                                        {plan.name}
                                                    </Typography>
                                                    <Typography
                                                        sx={{
                                                            fontSize: "0.7rem",
                                                            color: blue.textLight
                                                        }}
                                                    >
                                                        {plan.maxEmployees || 0} employés · {plan.maxServices || 0} services
                                                    </Typography>
                                                </Box>

                                                {plan.monthlyPrice != null && (
                                                    <Chip
                                                        label={`${plan.monthlyPrice} MAD`}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: blue.bg,
                                                            color: blue.main,
                                                            fontWeight: 700,
                                                            fontSize: "0.75rem"
                                                        }}
                                                    />
                                                )}
                                            </Box>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth>
                                <InputLabel sx={{ color: blue.textLight }}>
                                    Durée du renouvellement
                                </InputLabel>

                                <Select
                                    value={durationMonths}
                                    label="Durée du renouvellement"
                                    onChange={(e) =>
                                        setDurationMonths(e.target.value)
                                    }
                                    sx={{
                                        borderRadius: "14px",
                                        backgroundColor: "#f9fafb",
                                        "&:hover .MuiOutlinedInput-notchedOutline": {
                                            borderColor: blue.main
                                        },
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            borderColor: blue.main,
                                            boxShadow: `0 0 0 4px ${blue.bg}`
                                        }
                                    }}
                                >
                                    <MenuItem value={1}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <span>📅</span>
                                            1 mois
                                        </Box>
                                    </MenuItem>
                                    <MenuItem value={3}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <span>📅</span>
                                            3 mois <Chip label="Économie 10%" size="small" sx={{ ml: 1, height: 20, fontSize: "0.6rem" }} />
                                        </Box>
                                    </MenuItem>
                                    <MenuItem value={6}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <span>📅</span>
                                            6 mois <Chip label="Économie 20%" size="small" sx={{ ml: 1, height: 20, fontSize: "0.6rem" }} />
                                        </Box>
                                    </MenuItem>
                                    <MenuItem value={12}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <span>📅</span>
                                            12 mois <Chip label="Économie 30%" size="small" sx={{ ml: 1, height: 20, fontSize: "0.6rem", backgroundColor: "rgba(67, 233, 123, 0.15)", color: "#43e97b" }} />
                                        </Box>
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Stack>
                    </Box>

                    {selectedPlan && (
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2.5,
                                borderRadius: "16px",
                                background: blue.gradient,
                                color: "#FFFFFF",
                                border: "1px solid rgba(255,255,255,0.1)"
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: "0.6rem",
                                    textTransform: "uppercase",
                                    letterSpacing: "1.5px",
                                    fontWeight: 700,
                                    color: "rgba(255,255,255,0.6)",
                                    mb: 1
                                }}
                            >
                                Résumé du renouvellement
                            </Typography>

                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "flex-end",
                                    justifyContent: "space-between"
                                }}
                            >
                                <Box>
                                    <Typography
                                        sx={{
                                            fontSize: "1.1rem",
                                            fontWeight: 800
                                        }}
                                    >
                                        {selectedPlan.name}
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontSize: "0.75rem",
                                            color: "rgba(255,255,255,0.7)",
                                            mt: 0.3
                                        }}
                                    >
                                        {durationMonths} {durationMonths === 1 ? "mois" : "mois"}
                                    </Typography>

                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                                        <CheckCircleOutlineRounded sx={{ fontSize: 16, color: "rgba(255,255,255,0.6)" }} />
                                        <Typography sx={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.6)" }}>
                                            Renouvellement automatique
                                        </Typography>
                                    </Box>
                                </Box>

                                {selectedPlan.monthlyPrice != null && (
                                    <Box sx={{ textAlign: "right" }}>
                                        <Typography
                                            sx={{
                                                fontSize: "1.6rem",
                                                fontWeight: 800,
                                                letterSpacing: "-0.5px"
                                            }}
                                        >
                                            {selectedPlan.monthlyPrice * durationMonths}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontSize: "0.7rem",
                                                color: "rgba(255,255,255,0.6)",
                                                fontWeight: 600
                                            }}
                                        >
                                            MAD total
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </Paper>
                    )}

                </Stack>
            </DialogContent>

            <DialogActions
                sx={{
                    px: { xs: 3, sm: 4 },
                    py: 2.5,
                    borderTop: "1px solid rgba(0,0,0,0.06)",
                    backgroundColor: "rgba(249, 250, 251, 0.5)",
                    gap: 1.5
                }}
            >
                <Button
                    onClick={onClose}
                    sx={{
                        px: 3,
                        py: 1.2,
                        borderRadius: "12px",
                        color: blue.textLight,
                        textTransform: "none",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        "&:hover": {
                            backgroundColor: "rgba(0,0,0,0.04)"
                        }
                    }}
                >
                    Annuler
                </Button>

                <Button
                    variant="contained"
                    onClick={handleRenew}
                    disabled={!planId}
                    startIcon={<AutorenewOutlined />}
                    sx={{
                        px: 3.5,
                        py: 1.2,
                        borderRadius: "12px",
                        background: blue.gradient,
                        color: "#FFFFFF",
                        textTransform: "none",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        boxShadow: `0 8px 24px rgba(37, 99, 235, 0.35)`,
                        transition: "all 0.3s ease",
                        "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: `0 12px 32px rgba(37, 99, 235, 0.5)`,
                            background: blue.gradientDark
                        },
                        "&:active": {
                            transform: "translateY(0px)"
                        },
                        "&:disabled": {
                            background: "#d1d5db",
                            boxShadow: "none"
                        }
                    }}
                >
                    Renouveler
                </Button>
            </DialogActions>
        </Dialog>
    );
}