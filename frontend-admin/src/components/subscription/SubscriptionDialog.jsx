import { useEffect, useState } from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Stack,
    Box,
    Typography,
    Divider,
    IconButton,
    Chip,
    Paper,
    Avatar
} from "@mui/material";

import {
    Close,
    AddBusinessOutlined,
    WorkspacePremiumOutlined,
    CalendarMonthOutlined,
    AutoAwesomeOutlined,
    BusinessOutlined,
    CheckCircleOutlineRounded,
    Storefront
} from "@mui/icons-material";

import { getCompanies } from "../../services/companyService";
import { getPlans } from "../../services/planService";

export default function SubscriptionDialog({
    open,
    onClose,
    onSave,
    subscription
}) {
    const emptySubscription = {
        companyId: "",
        planId: "",
        durationMonths: ""
    };

    const [form, setForm] = useState(emptySubscription);
    const [companies, setCompanies] = useState([]);
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
        if (subscription) {
            setForm({
                companyId: subscription.companyId,
                planId: subscription.planId,
                durationMonths: subscription.durationMonths ?? 1
            });
        } else {
            setForm(emptySubscription);
        }
    }, [subscription, open]);

    useEffect(() => {
        loadCompanies();
        loadPlans();
    }, []);

    async function loadCompanies() {
        try {
            const response = await getCompanies();
            setCompanies(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    async function loadPlans() {
        try {
            const response = await getPlans();
            setPlans(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        });
    };

    const handleSave = () => {
        onSave(form);
    };

    const selectedCompany = companies.find(
        (company) => company.id === form.companyId
    );

    const selectedPlan = plans.find(
        (plan) => plan.id === form.planId
    );

    const getTypeLabel = (type) => {
        switch(type) {
            case "BASIC":
                return "Basique";
            case "PREMIUM":
                return "Premium";
            case "ENTERPRISE":
                return "Entreprise";
            default:
                return type;
        }
    };

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
                        <AutoAwesomeOutlined sx={{ fontSize: 28 }} />
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
                            {subscription ? "Modification" : "Création"}
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: "1.5rem",
                                fontWeight: 800,
                                letterSpacing: "-0.8px"
                            }}
                        >
                            {subscription ? "Modifier l'abonnement" : "Nouvel abonnement"}
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
                <Stack spacing={3.5}>

                    <Box>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5,
                                mb: 2
                            }}
                        >
                            <AddBusinessOutlined
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
                                Entreprise
                            </Typography>

                            <Chip
                                label="Requis"
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

                        <FormControl fullWidth>
                            <InputLabel sx={{ color: blue.textLight }}>
                                Sélectionner une entreprise
                            </InputLabel>

                            <Select
                                name="companyId"
                                value={form.companyId}
                                label="Sélectionner une entreprise"
                                onChange={handleChange}
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
                                {companies.map((company) => (
                                    <MenuItem
                                        key={company.id}
                                        value={company.id}
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
                                                gap: 2
                                            }}
                                        >
                                            <Avatar
                                                src={
                                                    company.logo
                                                        ? `http://localhost:8080${company.logo}`
                                                        : ""
                                                }
                                                sx={{
                                                    width: 32,
                                                    height: 32,
                                                    borderRadius: "8px",
                                                    background: blue.gradient,
                                                    color: "#fff",
                                                    fontSize: "0.7rem",
                                                    fontWeight: 700
                                                }}
                                            >
                                                {!company.logo && company.name?.charAt(0)}
                                            </Avatar>

                                            <Box>
                                                <Typography
                                                    sx={{
                                                        fontSize: "0.9rem",
                                                        fontWeight: 700,
                                                        color: blue.text
                                                    }}
                                                >
                                                    {company.name}
                                                </Typography>
                                                <Typography
                                                    sx={{
                                                        fontSize: "0.7rem",
                                                        color: blue.textLight
                                                    }}
                                                >
                                                    {company.email}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

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
                                Plan d'abonnement
                            </Typography>

                            <Chip
                                label="Requis"
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

                        <FormControl fullWidth>
                            <InputLabel sx={{ color: blue.textLight }}>
                                Sélectionner un plan
                            </InputLabel>

                            <Select
                                name="planId"
                                value={form.planId}
                                label="Sélectionner un plan"
                                onChange={handleChange}
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
                                                    {getTypeLabel(plan.type)} · {plan.maxEmployees || 0} employés · {plan.maxServices || 0} services
                                                </Typography>
                                            </Box>

                                            {plan.monthlyPrice != null && (
                                                <Chip
                                                    label={`${plan.monthlyPrice} MAD/mois`}
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
                    </Box>

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
                            <CalendarMonthOutlined
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
                                Durée
                            </Typography>

                            <Chip
                                label="Requis"
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

                        <FormControl fullWidth>
                            <InputLabel sx={{ color: blue.textLight }}>
                                Durée de l'abonnement
                            </InputLabel>

                            <Select
                                name="durationMonths"
                                value={form.durationMonths}
                                label="Durée de l'abonnement"
                                onChange={handleChange}
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
                    </Box>

                    {(selectedCompany || selectedPlan) && (
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
                                Résumé de l'abonnement
                            </Typography>

                            {selectedCompany && (
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1.5,
                                        mb: 1
                                    }}
                                >
                                    <Storefront sx={{ fontSize: 20, color: "rgba(255,255,255,0.7)" }} />
                                    <Typography
                                        sx={{
                                            fontSize: "1rem",
                                            fontWeight: 700
                                        }}
                                    >
                                        {selectedCompany.name}
                                    </Typography>
                                </Box>
                            )}

                            {selectedPlan && (
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        mt: 0.5
                                    }}
                                >
                                    <Box>
                                        <Typography
                                            sx={{
                                                fontSize: "0.85rem",
                                                fontWeight: 600
                                            }}
                                        >
                                            {selectedPlan.name}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontSize: "0.7rem",
                                                color: "rgba(255,255,255,0.6)"
                                            }}
                                        >
                                            {getTypeLabel(selectedPlan.type)} · {form.durationMonths} {Number(form.durationMonths) === 1 ? "mois" : "mois"}
                                        </Typography>
                                    </Box>

                                    {selectedPlan.monthlyPrice != null && form.durationMonths && (
                                        <Box sx={{ textAlign: "right" }}>
                                            <Typography
                                                sx={{
                                                    fontSize: "1.2rem",
                                                    fontWeight: 800,
                                                    letterSpacing: "-0.5px"
                                                }}
                                            >
                                                {selectedPlan.monthlyPrice * Number(form.durationMonths)} MAD
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    fontSize: "0.6rem",
                                                    color: "rgba(255,255,255,0.5)"
                                                }}
                                            >
                                                Total
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            )}

                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1.5 }}>
                                <CheckCircleOutlineRounded sx={{ fontSize: 16, color: "rgba(255,255,255,0.6)" }} />
                                <Typography sx={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.6)" }}>
                                    Renouvellement automatique activé
                                </Typography>
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
                    onClick={handleSave}
                    disabled={!form.companyId || !form.planId || !form.durationMonths}
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
                    {subscription ? "Enregistrer" : "Créer l'abonnement"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}