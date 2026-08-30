import { useEffect, useState } from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControlLabel,
    Switch,
    Stack,
    Box,
    Typography,
    IconButton,
    Chip,
    Divider,
    InputAdornment
} from "@mui/material";

import {
    Close,
    Person,
    Email,
    Phone,
    Badge,
    CheckCircle,
    Cancel
} from "@mui/icons-material";

export default function UserDialog({
    open,
    onClose,
    onSave,
    user
}) {

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        active: true
    });

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

        if (user) {

            setForm({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "",
                phone: user.phone || "",
                active: user.active !== undefined
                    ? user.active
                    : true
            });

        } else {

            setForm({
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                active: true
            });

        }

    }, [user, open]);

    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleSave = () => {

        /*
         * IMPORTANT:
         *
         * mustChangePassword is intentionally NOT sent here.
         *
         * The backend is responsible for:
         * - generating the temporary password
         * - setting mustChangePassword = true
         * - sending the temporary password by email
         */

        onSave(form);
    };

    const isEdit = !!user;

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

            {/* =====================================================
                HEADER
            ===================================================== */}

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
                        <Person sx={{ fontSize: 28 }} />
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
                            {isEdit ? "Modification" : "Création"}
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: "1.5rem",
                                fontWeight: 800,
                                letterSpacing: "-0.8px"
                            }}
                        >
                            {isEdit
                                ? "Modifier l'utilisateur"
                                : "Ajouter un utilisateur"
                            }
                        </Typography>

                    </Box>

                </Box>

            </DialogTitle>

            {/* =====================================================
                CONTENT
            ===================================================== */}

            <DialogContent
                sx={{
                    px: { xs: 3, sm: 4 },
                    py: 3.5,
                    backgroundColor: "transparent",
                    overflowY: "auto"
                }}
            >

                <Stack spacing={3}>

                    {/* =================================================
                        PERSONAL INFORMATION
                    ================================================= */}

                    <Box>

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5,
                                mb: 2
                            }}
                        >

                            <Badge
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
                                Informations personnelles
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

                        <Stack spacing={2.5}>

                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: {
                                        xs: "1fr",
                                        sm: "1fr 1fr"
                                    },
                                    gap: 2.5
                                }}
                            >

                                <TextField
                                    label="Prénom"
                                    name="firstName"
                                    value={form.firstName}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Person
                                                    sx={{
                                                        color: blue.textLight,
                                                        fontSize: 20
                                                    }}
                                                />
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
                                                boxShadow:
                                                    `0 0 0 4px ${blue.bg}`
                                            }
                                        }
                                    }}
                                />

                                <TextField
                                    label="Nom"
                                    name="lastName"
                                    value={form.lastName}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Badge
                                                    sx={{
                                                        color: blue.textLight,
                                                        fontSize: 20
                                                    }}
                                                />
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
                                                boxShadow:
                                                    `0 0 0 4px ${blue.bg}`
                                            }
                                        }
                                    }}
                                />

                            </Box>

                        </Stack>

                    </Box>

                    <Divider
                        sx={{
                            borderColor: "rgba(0,0,0,0.06)"
                        }}
                    />

                    {/* =================================================
                        CONTACT
                    ================================================= */}

                    <Box>

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5,
                                mb: 2
                            }}
                        >

                            <Email
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
                                Coordonnées
                            </Typography>

                        </Box>

                        <Stack spacing={2.5}>

                            <TextField
                                label="Email"
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                fullWidth
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Email
                                                sx={{
                                                    color: blue.textLight,
                                                    fontSize: 20
                                                }}
                                            />
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
                                            boxShadow:
                                                `0 0 0 4px ${blue.bg}`
                                        }
                                    }
                                }}
                            />

                            <TextField
                                label="Téléphone"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Phone
                                                sx={{
                                                    color: blue.textLight,
                                                    fontSize: 20
                                                }}
                                            />
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
                                            boxShadow:
                                                `0 0 0 4px ${blue.bg}`
                                        }
                                    }
                                }}
                            />

                        </Stack>

                    </Box>

                    <Divider
                        sx={{
                            borderColor: "rgba(0,0,0,0.06)"
                        }}
                    />

                    {/* =================================================
                        ACTIVE STATUS
                    ================================================= */}

                    <Box
                        sx={{
                            p: 2.5,
                            borderRadius: "16px",
                            backgroundColor: form.active
                                ? "rgba(67, 233, 123, 0.04)"
                                : "rgba(245, 87, 108, 0.04)",
                            border:
                                `1px solid ${
                                    form.active
                                        ? "rgba(67, 233, 123, 0.2)"
                                        : "rgba(245, 87, 108, 0.2)"
                                }`,
                            transition: "all 0.3s ease"
                        }}
                    >

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={form.active}
                                    onChange={(e) =>
                                        setForm((previous) => ({
                                            ...previous,
                                            active: e.target.checked
                                        }))
                                    }
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
                                            <CheckCircle
                                                sx={{
                                                    color: "#43e97b",
                                                    fontSize: 20
                                                }}
                                            />
                                        ) : (
                                            <Cancel
                                                sx={{
                                                    color: "#f5576c",
                                                    fontSize: 20
                                                }}
                                            />
                                        )}

                                        Utilisateur{" "}
                                        {form.active
                                            ? "Actif"
                                            : "Inactif"
                                        }

                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontSize: "0.75rem",
                                            color: blue.textLight,
                                            mt: 0.3
                                        }}
                                    >
                                        {form.active
                                            ? "L'utilisateur peut accéder à la plateforme"
                                            : "L'utilisateur ne peut pas accéder à la plateforme"
                                        }
                                    </Typography>

                                </Box>
                            }
                        />

                    </Box>

                    {/* =================================================
                        TEMPORARY PASSWORD INFORMATION
                    ================================================= */}

                    {!isEdit && (
                        <Chip
                            icon={<Badge />}
                            label="Un mot de passe temporaire sera généré et envoyé par email"
                            sx={{
                                backgroundColor: blue.bg,
                                color: blue.main,
                                fontWeight: 600,
                                fontSize: "0.75rem",
                                py: 2,
                                height: "auto",
                                "& .MuiChip-icon": {
                                    color: blue.main
                                }
                            }}
                        />
                    )}

                </Stack>

            </DialogContent>

            {/* =====================================================
                ACTIONS
            ===================================================== */}

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
                        boxShadow:
                            "0 8px 24px rgba(37, 99, 235, 0.35)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow:
                                "0 12px 32px rgba(37, 99, 235, 0.5)",
                            background: blue.gradientDark
                        },
                        "&:active": {
                            transform: "translateY(0px)"
                        }
                    }}
                >
                    {isEdit
                        ? "Enregistrer"
                        : "Créer l'utilisateur"
                    }
                </Button>

            </DialogActions>

        </Dialog>
    );
}

