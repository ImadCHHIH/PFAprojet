import { useState, useEffect } from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Stack,
    Switch,
    FormControlLabel,
    Box,
    Typography,
    Divider,
    IconButton,
    Chip,
    Paper,
    InputAdornment
} from "@mui/material";

import {
    Close,
    AutoAwesomeOutlined,
    AttachMoneyOutlined,
    People,
    DesignServicesOutlined,
    CalendarMonthOutlined,
    Category,
    CheckCircleOutlineRounded,
    Star,
    Diamond,
    Storefront
} from "@mui/icons-material";

const emptyPlan = {
    name: "",
    type: "BASIC",
    monthlyPrice: "",
    maxEmployees: "",
    maxServices: "",
    maxAppointmentsPerMonth: "",
    active: true
};

export default function PlanDialog({
    open,
    onClose,
    onSave,
    plan
}) {
    const [form, setForm] = useState(emptyPlan);

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
        if (plan) {
            setForm(plan);
        } else {
            setForm(emptyPlan);
        }
    }, [plan, open]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSwitch = (e) => {
        setForm((prev) => ({
            ...prev,
            active: e.target.checked
        }));
    };

    const handleSave = () => {
        onSave(form);
    };

    const getTypeIcon = (type) => {
        switch(type) {
            case "BASIC":
                return <Star sx={{ fontSize: 20 }} />;
            case "PREMIUM":
                return <Diamond sx={{ fontSize: 20 }} />;
            case "ENTERPRISE":
                return <Storefront sx={{ fontSize: 20 }} />;
            default:
                return <Category sx={{ fontSize: 20 }} />;
        }
    };

    const getTypeColor = (type) => {
        switch(type) {
            case "BASIC":
                return "#4facfe";
            case "PREMIUM":
                return "#f093fb";
            case "ENTERPRISE":
                return "#43e97b";
            default:
                return blue.main;
        }
    };

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
                            {plan ? "Modification" : "Création"}
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: "1.5rem",
                                fontWeight: 800,
                                letterSpacing: "-0.8px"
                            }}
                        >
                            {plan ? "Modifier le Plan" : "Ajouter un Plan"}
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
                            <Category
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
                                Informations générales
                            </Typography>
                        </Box>

                        <Stack spacing={2.5}>
                            <TextField
                                label="Nom du plan"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Category sx={{ color: blue.textLight, fontSize: 20 }} />
                                        </InputAdornment>
                                    )
                                }}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: "14px",
                                        backgroundColor: "#f9fafb",
                                        "&:hover fieldset": {
                                            borderColor: blue.main
                                        },
                                        "&.Mui-focused fieldset": {
                                            borderColor: blue.main,
                                            boxShadow: `0 0 0 4px ${blue.bg}`
                                        }
                                    }
                                }}
                            />

                            <TextField
                                select
                                label="Type de plan"
                                name="type"
                                value={form.type}
                                onChange={handleChange}
                                fullWidth
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: "14px",
                                        backgroundColor: "#f9fafb",
                                        "&:hover fieldset": {
                                            borderColor: blue.main
                                        },
                                        "&.Mui-focused fieldset": {
                                            borderColor: blue.main,
                                            boxShadow: `0 0 0 4px ${blue.bg}`
                                        }
                                    }
                                }}
                            >
                                <MenuItem value="BASIC">
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                        <Star sx={{ color: "#4facfe", fontSize: 20 }} />
                                        <Typography>Basique</Typography>
                                    </Box>
                                </MenuItem>

                                <MenuItem value="PREMIUM">
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                        <Diamond sx={{ color: "#f093fb", fontSize: 20 }} />
                                        <Typography>Premium</Typography>
                                    </Box>
                                </MenuItem>

                                <MenuItem value="ENTERPRISE">
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                        <Storefront sx={{ color: "#43e97b", fontSize: 20 }} />
                                        <Typography>Entreprise</Typography>
                                    </Box>
                                </MenuItem>
                            </TextField>

                            {form.type && (
                                <Chip
                                    icon={getTypeIcon(form.type)}
                                    label={`Plan ${getTypeLabel(form.type)}`}
                                    sx={{
                                        alignSelf: "flex-start",
                                        backgroundColor: `${getTypeColor(form.type)}15`,
                                        color: getTypeColor(form.type),
                                        fontWeight: 700,
                                        fontSize: "0.75rem",
                                        height: 32,
                                        "& .MuiChip-icon": {
                                            color: getTypeColor(form.type)
                                        }
                                    }}
                                />
                            )}
                        </Stack>
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
                            <AttachMoneyOutlined
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
                                Tarification
                            </Typography>

                            <Chip
                                label="Prix mensuel"
                                size="small"
                                sx={{
                                    height: 20,
                                    backgroundColor: blue.bg,
                                    color: blue.main,
                                    fontSize: "0.6rem",
                                    fontWeight: 700
                                }}
                            />
                        </Box>

                        <TextField
                            label="Prix mensuel"
                            type="number"
                            name="monthlyPrice"
                            value={form.monthlyPrice}
                            onChange={handleChange}
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AttachMoneyOutlined sx={{ color: blue.textLight, fontSize: 20 }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Typography
                                            sx={{
                                                fontSize: "0.8rem",
                                                color: blue.textLight,
                                                fontWeight: 600
                                            }}
                                        >
                                            MAD / mois
                                        </Typography>
                                    </InputAdornment>
                                )
                            }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "14px",
                                    backgroundColor: "#f9fafb",
                                    "&:hover fieldset": {
                                        borderColor: blue.main
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: blue.main,
                                        boxShadow: `0 0 0 4px ${blue.bg}`
                                    }
                                }
                            }}
                        />
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
                            <DesignServicesOutlined
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
                                Limites du plan
                            </Typography>
                        </Box>

                        <Stack spacing={2.5}>
                            <TextField
                                label="Nombre max d'employés"
                                type="number"
                                name="maxEmployees"
                                value={form.maxEmployees}
                                onChange={handleChange}
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <People sx={{ color: blue.textLight, fontSize: 20 }} />
                                        </InputAdornment>
                                    )
                                }}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: "14px",
                                        backgroundColor: "#f9fafb",
                                        "&:hover fieldset": {
                                            borderColor: blue.main
                                        },
                                        "&.Mui-focused fieldset": {
                                            borderColor: blue.main,
                                            boxShadow: `0 0 0 4px ${blue.bg}`
                                        }
                                    }
                                }}
                            />

                            <TextField
                                label="Nombre max de services"
                                type="number"
                                name="maxServices"
                                value={form.maxServices}
                                onChange={handleChange}
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <DesignServicesOutlined sx={{ color: blue.textLight, fontSize: 20 }} />
                                        </InputAdornment>
                                    )
                                }}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: "14px",
                                        backgroundColor: "#f9fafb",
                                        "&:hover fieldset": {
                                            borderColor: blue.main
                                        },
                                        "&.Mui-focused fieldset": {
                                            borderColor: blue.main,
                                            boxShadow: `0 0 0 4px ${blue.bg}`
                                        }
                                    }
                                }}
                            />

                            <TextField
                                label="Nombre max de rendez-vous / mois"
                                type="number"
                                name="maxAppointmentsPerMonth"
                                value={form.maxAppointmentsPerMonth}
                                onChange={handleChange}
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <CalendarMonthOutlined sx={{ color: blue.textLight, fontSize: 20 }} />
                                        </InputAdornment>
                                    )
                                }}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: "14px",
                                        backgroundColor: "#f9fafb",
                                        "&:hover fieldset": {
                                            borderColor: blue.main
                                        },
                                        "&.Mui-focused fieldset": {
                                            borderColor: blue.main,
                                            boxShadow: `0 0 0 4px ${blue.bg}`
                                        }
                                    }
                                }}
                            />
                        </Stack>
                    </Box>

                    <Divider sx={{ borderColor: "rgba(0,0,0,0.06)" }} />

                    <Paper
                        elevation={0}
                        sx={{
                            p: 2.5,
                            borderRadius: "16px",
                            backgroundColor: form.active ? "rgba(67, 233, 123, 0.04)" : "rgba(245, 87, 108, 0.04)",
                            border: `1px solid ${form.active ? "rgba(67, 233, 123, 0.2)" : "rgba(245, 87, 108, 0.2)"}`,
                            transition: "all 0.3s ease"
                        }}
                    >
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={form.active}
                                    onChange={handleSwitch}
                                    sx={{
                                        "& .MuiSwitch-switchBase.Mui-checked": {
                                            color: "#43e97b"
                                        },
                                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                            backgroundColor: "#43e97b",
                                            opacity: 1
                                        },
                                        "& .MuiSwitch-switchBase": {
                                            color: "#d1d5db"
                                        },
                                        "& .MuiSwitch-switchBase + .MuiSwitch-track": {
                                            backgroundColor: "#d1d5db",
                                            opacity: 1
                                        }
                                    }}
                                />
                            }
                            label={
                                <Box>
                                    <Typography
                                        sx={{
                                            fontSize: "0.9rem",
                                            fontWeight: 700,
                                            color: blue.text,
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1
                                        }}
                                    >
                                        {form.active ? (
                                            <CheckCircleOutlineRounded sx={{ color: "#43e97b", fontSize: 20 }} />
                                        ) : (
                                            <Close sx={{ color: "#f5576c", fontSize: 20 }} />
                                        )}
                                        Plan {form.active ? "Actif" : "Inactif"}
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontSize: "0.75rem",
                                            color: blue.textLight,
                                            mt: 0.3
                                        }}
                                    >
                                        {form.active
                                            ? "Ce plan est disponible pour les nouveaux abonnements"
                                            : "Ce plan n'est pas disponible pour les nouveaux abonnements"}
                                    </Typography>
                                </Box>
                            }
                        />
                    </Paper>

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
                        }
                    }}
                >
                    {plan ? "Enregistrer" : "Créer le plan"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}