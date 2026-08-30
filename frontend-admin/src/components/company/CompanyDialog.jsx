import { useState, useEffect } from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Stack,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Avatar,
    Typography,
    Box,
    Divider,
    IconButton,
    CircularProgress,
    Chip,
    Paper
} from "@mui/material";

import {
    Close,
    CloudUploadOutlined,
    BusinessOutlined,
    Person,
    LocationOnOutlined,
    Storefront,
    Email,
    Phone,
    Public,
    Home
} from "@mui/icons-material";

import { uploadLogo } from "../../services/uploadService";
import { getUsers } from "../../services/userService";

const emptyCompany = {
    id: null,
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    ownerId: "",
    logo: ""
};

export default function CompanyDialog({
    open,
    onClose,
    onSave,
    company
}) {
    const [form, setForm] = useState(emptyCompany);
    const [owners, setOwners] = useState([]);
    const [uploading, setUploading] = useState(false);

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
        const loadOwners = async () => {
            try {
                const response = await getUsers();
                setOwners(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        if (open) {
            loadOwners();
        }
    }, [open]);

    useEffect(() => {
        if (company) {
            setForm({
                ...company,
                ownerId: company.ownerId || "",
                logo: company.logo || ""
            });
        } else {
            setForm(emptyCompany);
        }
    }, [company, open]);

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        });
    };

    const handleLogoUpload = async (event) => {
        const file = event.target.files[0];

        if (!file) return;

        try {
            setUploading(true);
            const response = await uploadLogo(file);
            setForm({
                ...form,
                logo: response.data
            });
        } catch (error) {
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    const handleSave = () => {
        onSave(form);
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
                    boxShadow: "0 40px 80px rgba(0,0,0,0.2)",
                    maxHeight: "90vh"
                }
            }}
        >
            <DialogTitle
                sx={{
                    px: { xs: 3, sm: 4 },
                    pt: 3.5,
                    pb: 2.5,
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
                            width: 50,
                            height: 50,
                            borderRadius: "16px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "rgba(255,255,255,0.15)",
                            border: "1px solid rgba(255,255,255,0.2)",
                            backdropFilter: "blur(10px)"
                        }}
                    >
                        {company ? (
                            <Storefront sx={{ fontSize: 28 }} />
                        ) : (
                            <BusinessOutlined sx={{ fontSize: 28 }} />
                        )}
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
                            {company ? "Modification" : "Création"}
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: "1.5rem",
                                fontWeight: 800,
                                letterSpacing: "-0.8px"
                            }}
                        >
                            {company ? "Modifier l'Entreprise" : "Ajouter une Entreprise"}
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
                            <CloudUploadOutlined
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
                                Logo de l'entreprise
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

                        <Paper
                            elevation={0}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2.5,
                                p: 2.5,
                                borderRadius: "16px",
                                border: `2px dashed ${blue.bg}`,
                                backgroundColor: blue.bg,
                                transition: "all 0.3s ease",
                                "&:hover": {
                                    borderColor: blue.main,
                                    backgroundColor: "rgba(37, 99, 235, 0.06)"
                                }
                            }}
                        >
                            <Avatar
                                src={
                                    form.logo
                                        ? `http://localhost:8080${form.logo}`
                                        : ""
                                }
                                sx={{
                                    width: 72,
                                    height: 72,
                                    borderRadius: "18px",
                                    background: blue.gradient,
                                    border: "3px solid rgba(255,255,255,0.8)",
                                    boxShadow: `0 8px 24px rgba(37, 99, 235, 0.25)`,
                                    fontSize: 28,
                                    color: "#fff"
                                }}
                            >
                                {!form.logo && <BusinessOutlined />}
                            </Avatar>

                            <Box sx={{ flex: 1 }}>
                                <Typography
                                    sx={{
                                        fontSize: "0.9rem",
                                        fontWeight: 700,
                                        color: blue.text,
                                        mb: 0.3
                                    }}
                                >
                                    Téléchargez le logo
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: "0.7rem",
                                        color: blue.textLight,
                                        mb: 1.5
                                    }}
                                >
                                    PNG, JPG ou WEBP · Max 5MB
                                </Typography>

                                <Button
                                    variant="contained"
                                    component="label"
                                    disabled={uploading}
                                    startIcon={
                                        uploading ? (
                                            <CircularProgress
                                                size={18}
                                                sx={{ color: "#fff" }}
                                            />
                                        ) : (
                                            <CloudUploadOutlined />
                                        )
                                    }
                                    sx={{
                                        borderRadius: "12px",
                                        textTransform: "none",
                                        fontWeight: 700,
                                        fontSize: "0.8rem",
                                        px: 2.5,
                                        height: 38,
                                        background: blue.gradient,
                                        boxShadow: `0 6px 20px rgba(37, 99, 235, 0.3)`,
                                        "&:hover": {
                                            boxShadow: `0 8px 28px rgba(37, 99, 235, 0.45)`,
                                            transform: "translateY(-2px)"
                                        }
                                    }}
                                >
                                    {uploading ? "Téléchargement..." : "Choisir un fichier"}
                                    <input
                                        hidden
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoUpload}
                                    />
                                </Button>
                            </Box>
                        </Paper>
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
                            <BusinessOutlined
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
                                label="Nom de l'entreprise"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <Storefront sx={{ color: blue.textLight, mr: 1, fontSize: 20 }} />
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
                                    label="Email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    fullWidth
                                    InputProps={{
                                        startAdornment: (
                                            <Email sx={{ color: blue.textLight, mr: 1, fontSize: 20 }} />
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
                                    label="Téléphone"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    fullWidth
                                    InputProps={{
                                        startAdornment: (
                                            <Phone sx={{ color: blue.textLight, mr: 1, fontSize: 20 }} />
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
                            <LocationOnOutlined
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
                                Localisation
                            </Typography>
                        </Box>

                        <Stack spacing={2.5}>
                            <TextField
                                label="Adresse"
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <Home sx={{ color: blue.textLight, mr: 1, fontSize: 20 }} />
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
                                    label="Ville"
                                    name="city"
                                    value={form.city}
                                    onChange={handleChange}
                                    fullWidth
                                    InputProps={{
                                        startAdornment: (
                                            <Public sx={{ color: blue.textLight, mr: 1, fontSize: 20 }} />
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
                                    label="Pays"
                                    name="country"
                                    value={form.country}
                                    onChange={handleChange}
                                    fullWidth
                                    InputProps={{
                                        startAdornment: (
                                            <Public sx={{ color: blue.textLight, mr: 1, fontSize: 20 }} />
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
                            <Person
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
                                Propriétaire
                            </Typography>

                            <Chip
                                label="Optionnel"
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

                        <FormControl fullWidth>
                            <InputLabel sx={{ color: blue.textLight }}>
                                Sélectionner un propriétaire
                            </InputLabel>

                            <Select
                                name="ownerId"
                                value={form.ownerId}
                                label="Sélectionner un propriétaire"
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
                                <MenuItem value="">
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1
                                        }}
                                    >
                                        <Person sx={{ fontSize: 18, color: blue.textLight }} />
                                        Aucun propriétaire
                                    </Box>
                                </MenuItem>

                                {owners.map((owner) => (
                                    <MenuItem
                                        key={owner.id}
                                        value={owner.id}
                                        sx={{
                                            py: 1.2,
                                            "&:hover": {
                                                backgroundColor: blue.bg
                                            }
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1.5
                                            }}
                                        >
                                            <Avatar
                                                sx={{
                                                    width: 32,
                                                    height: 32,
                                                    fontSize: 12,
                                                    fontWeight: 700,
                                                    background: blue.gradient,
                                                    color: "#fff"
                                                }}
                                            >
                                                {owner.firstName?.[0]}
                                                {owner.lastName?.[0]}
                                            </Avatar>

                                            <Box>
                                                <Typography
                                                    sx={{
                                                        fontWeight: 600,
                                                        fontSize: "0.9rem",
                                                        color: blue.text
                                                    }}
                                                >
                                                    {owner.firstName} {owner.lastName}
                                                </Typography>
                                                <Typography
                                                    sx={{
                                                        fontSize: "0.7rem",
                                                        color: blue.textLight
                                                    }}
                                                >
                                                    {owner.email}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

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
                    disabled={uploading}
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
                    {company ? "Enregistrer" : "Créer l'entreprise"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}