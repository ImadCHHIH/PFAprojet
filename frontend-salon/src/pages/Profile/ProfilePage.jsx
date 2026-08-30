import {
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";

import {
    Box,
    Card,
    CardContent,
    Typography,
    Avatar,
    Chip,
    Divider,
    Grid,
    Button,
    IconButton,
    Tooltip,
    Snackbar,
    Alert,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    InputAdornment,
    CircularProgress
} from "@mui/material";

import {
    Person,
    Email,
    ContentCopy,
    Shield,
    AccountCircle,
    CheckCircle,
    PhotoCamera,
    Lock,
    Visibility,
    VisibilityOff,
    Security,
    Key,
    CloudUpload,
    Spa,
    AutoAwesome,
    VerifiedUser,
    LocalFlorist,
    WorkspacePremium
} from "@mui/icons-material";

import axios from "axios";

import { useAuth } from "../../context/AuthContext";

const API_URL = "http://localhost:8080";

// Même palette que UserLayout
const SALON = {
    background: "#FAF9F7",
    surface: "#FFFFFF",
    text: "#2C1810",
    textSecondary: "#8B7A6E",
    border: "#E8E4DE",
    accent: "#B76E79",
    accentDark: "#8B5A63",
    accentLight: "#F5E6E8",
    accentHover: "#A05E68",
    gold: "#C9A15A",
    gradient: "linear-gradient(135deg, #B76E79 0%, #D4A0A8 100%)",
    gradientDark: "linear-gradient(135deg, #2C1810 0%, #1F110A 60%, #140B06 100%)",
    gradientGold: "linear-gradient(135deg, #C9A15A 0%, #E8CFA0 100%)"
};

export default function ProfilePage() {

    const {
        user,
        updateUser
    } = useAuth();

    const fileInputRef = useRef(null);

    const [copied, setCopied] =
        useState(false);

    const [pictureDialogOpen, setPictureDialogOpen] =
        useState(false);

    const [passwordDialogOpen, setPasswordDialogOpen] =
        useState(false);

    const [selectedPicture, setSelectedPicture] =
        useState(null);

    const [previewPicture, setPreviewPicture] =
        useState("");

    const [savingPicture, setSavingPicture] =
        useState(false);

    const [changingPassword, setChangingPassword] =
        useState(false);

    const [passwordData, setPasswordData] =
        useState({
            newPassword: "",
            confirmPassword: ""
        });

    const [showPassword, setShowPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [message, setMessage] =
        useState({
            open: false,
            severity: "success",
            text: ""
        });


    useEffect(() => {

        return () => {

            if (previewPicture) {
                URL.revokeObjectURL(previewPicture);
            }

        };

    }, [previewPicture]);


    const fullName =
        [
            user?.firstName,
            user?.lastName
        ]
            .filter(Boolean)
            .join(" ") ||
        "Utilisateur";


    const initials =
        useMemo(() => {

            const first =
                user?.firstName
                    ?.charAt(0)
                    ?.toUpperCase() || "";

            const last =
                user?.lastName
                    ?.charAt(0)
                    ?.toUpperCase() || "";

            return (
                `${first}${last}` ||
                "U"
            );

        }, [user]);


    const profilePicture =
        user?.profilePicture ||
        "";


    const copyEmail = async () => {

        if (!user?.email) {
            return;
        }

        try {

            await navigator.clipboard.writeText(
                user.email
            );

            setCopied(true);

        } catch (error) {

            console.error(
                "Could not copy email:",
                error
            );

        }

    };


    function openPictureDialog() {

        setSelectedPicture(null);
        setPreviewPicture("");
        setPictureDialogOpen(true);

    }


    function closePictureDialog() {

        if (savingPicture) {
            return;
        }

        setPictureDialogOpen(false);
        setSelectedPicture(null);

        if (previewPicture) {
            URL.revokeObjectURL(previewPicture);
        }

        setPreviewPicture("");

    }


    function handlePictureSelect(event) {

        const file =
            event.target.files?.[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {

            setMessage({
                open: true,
                severity: "error",
                text: "Veuillez sélectionner une image."
            });

            return;
        }


        const maxSize =
            5 * 1024 * 1024;

        if (file.size > maxSize) {

            setMessage({
                open: true,
                severity: "error",
                text: "L'image ne doit pas dépasser 5 Mo."
            });

            return;
        }


        setSelectedPicture(file);

        if (previewPicture) {
            URL.revokeObjectURL(previewPicture);
        }

        setPreviewPicture(
            URL.createObjectURL(file)
        );

    }


    async function savePicture() {

        if (!selectedPicture) {
            return;
        }

        try {

            setSavingPicture(true);

            const token =
                localStorage.getItem("salonToken");


            const base64 =
                await fileToBase64(
                    selectedPicture
                );


            const response =
                await axios.put(
                    `${API_URL}/users/me`,
                    {
                        firstName:
                            user?.firstName || "",

                        lastName:
                            user?.lastName || "",

                        phone:
                            user?.phone || "",

                        profilePicture:
                            base64
                    },
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );


            const updatedUser =
                response.data;


            updateUser(updatedUser);


            setMessage({
                open: true,
                severity: "success",
                text: "Photo de profil mise à jour."
            });


            setPictureDialogOpen(false);

            setSelectedPicture(null);

            if (previewPicture) {
                URL.revokeObjectURL(previewPicture);
            }

            setPreviewPicture("");


        } catch (error) {

            console.error(
                "Profile picture update error:",
                error
            );

            setMessage({
                open: true,
                severity: "error",
                text:
                    error.response?.data?.message ||
                    "Impossible de modifier la photo de profil."
            });

        } finally {

            setSavingPicture(false);

        }

    }


    function openPasswordDialog() {

        setPasswordData({
            newPassword: "",
            confirmPassword: ""
        });

        setShowPassword(false);
        setShowConfirmPassword(false);

        setPasswordDialogOpen(true);

    }


    function closePasswordDialog() {

        if (changingPassword) {
            return;
        }

        setPasswordDialogOpen(false);

        setPasswordData({
            newPassword: "",
            confirmPassword: ""
        });

    }


    function handlePasswordChange(event) {

        setPasswordData({
            ...passwordData,
            [event.target.name]:
                event.target.value
        });

    }


    async function handleChangePassword() {

        const newPassword =
            passwordData.newPassword.trim();

        const confirmPassword =
            passwordData.confirmPassword.trim();


        if (!newPassword) {

            setMessage({
                open: true,
                severity: "error",
                text: "Veuillez saisir un nouveau mot de passe."
            });

            return;
        }


        if (newPassword.length < 8) {

            setMessage({
                open: true,
                severity: "error",
                text: "Le mot de passe doit contenir au moins 8 caractères."
            });

            return;
        }


        if (newPassword !== confirmPassword) {

            setMessage({
                open: true,
                severity: "error",
                text: "Les mots de passe ne correspondent pas."
            });

            return;
        }


        try {

            setChangingPassword(true);

            const token =
                localStorage.getItem("salonToken");


            await axios.put(
                `${API_URL}/users/change-password`,
                {
                    newPassword
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );


            setMessage({
                open: true,
                severity: "success",
                text: "Mot de passe modifié avec succès."
            });


            setPasswordDialogOpen(false);

            setPasswordData({
                newPassword: "",
                confirmPassword: ""
            });


        } catch (error) {

            console.error(
                "Change password error:",
                error
            );

            setMessage({
                open: true,
                severity: "error",
                text:
                    error.response?.data?.message ||
                    "Impossible de modifier le mot de passe."
            });

        } finally {

            setChangingPassword(false);

        }

    }


    return (

        <Box
            sx={{
                width: "100%",
                maxWidth: 1200,
                mx: "auto"
            }}
        >

            {/* =====================================================
                HEADER
            ====================================================== */}

            <Box
                sx={{
                    mb: 4,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5
                }}
            >

                <Box
                    sx={{
                        width: 44,
                        height: 44,
                        borderRadius: "14px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: SALON.gradient,
                        boxShadow: "0 6px 16px rgba(183,110,121,0.3)",
                        flexShrink: 0
                    }}
                >
                    <Spa sx={{ color: "#fff", fontSize: 24 }} />
                </Box>

                <Box>
                    <Typography
                        variant="h4"
                        fontWeight={800}
                        sx={{
                            letterSpacing: "-0.5px",
                            color: SALON.text,
                            lineHeight: 1.1
                        }}
                    >
                        Mon profil
                    </Typography>

                    <Typography
                        sx={{
                            mt: 0.3,
                            color: SALON.textSecondary
                        }}
                    >
                        Gérez vos informations personnelles et la sécurité de votre compte.
                    </Typography>
                </Box>

            </Box>


            {/* =====================================================
                PROFILE HERO — MEMBERSHIP CARD STYLE
            ====================================================== */}

            <Card
                elevation={0}
                sx={{
                    borderRadius: 5,
                    mb: 3,
                    overflow: "hidden",
                    position: "relative",
                    border: `1px solid ${SALON.border}`
                }}
            >

                {/* Bandeau décoratif */}
                <Box
                    sx={{
                        height: 150,
                        background: SALON.gradientDark,
                        position: "relative",
                        overflow: "hidden"
                    }}
                >

                    {/* Motif décoratif — cercles flottants */}
                    <Box sx={{
                        position: "absolute",
                        width: 220,
                        height: 220,
                        borderRadius: "50%",
                        top: -100,
                        right: -60,
                        background: "radial-gradient(circle, rgba(183,110,121,0.35) 0%, transparent 70%)"
                    }} />

                    <Box sx={{
                        position: "absolute",
                        width: 140,
                        height: 140,
                        borderRadius: "50%",
                        bottom: -80,
                        right: 120,
                        background: "radial-gradient(circle, rgba(201,161,90,0.2) 0%, transparent 70%)"
                    }} />

                    {/* Icônes décoratives spa éparpillées */}
                    <LocalFlorist sx={{
                        position: "absolute",
                        top: 18,
                        right: 40,
                        fontSize: 28,
                        color: "rgba(255,255,255,0.12)",
                        transform: "rotate(-15deg)"
                    }} />

                    <AutoAwesome sx={{
                        position: "absolute",
                        bottom: 22,
                        right: 90,
                        fontSize: 20,
                        color: "rgba(255,255,255,0.15)"
                    }} />

                    <Spa sx={{
                        position: "absolute",
                        top: 50,
                        right: 160,
                        fontSize: 34,
                        color: "rgba(255,255,255,0.08)"
                    }} />

                    {/* Badge premium coin haut-droit */}
                    <Chip
                        icon={<WorkspacePremium sx={{ fontSize: 16, color: `${SALON.gold} !important` }} />}
                        label="Membre BeautyCloud"
                        size="small"
                        sx={{
                            position: "absolute",
                            top: 16,
                            left: 16,
                            fontWeight: 700,
                            fontSize: "0.7rem",
                            color: "#F5E6E8",
                            bgcolor: "rgba(255,255,255,0.08)",
                            border: "1px solid rgba(255,255,255,0.15)",
                            backdropFilter: "blur(4px)"
                        }}
                    />

                </Box>


                <CardContent
                    sx={{
                        px: {
                            xs: 3,
                            md: 4
                        },
                        pb: 4,
                        pt: 0,
                        bgcolor: SALON.surface
                    }}
                >

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: {
                                xs: "flex-start",
                                sm: "flex-end"
                            },
                            justifyContent: "space-between",
                            gap: 2,
                            flexDirection: {
                                xs: "column",
                                sm: "row"
                            },
                            mt: -7
                        }}
                    >

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "flex-end",
                                gap: 2
                            }}
                        >

                            {/* PROFILE PICTURE avec halo animé */}

                            <Box
                                sx={{
                                    position: "relative"
                                }}
                            >

                                {/* Halo tournant décoratif */}
                                <Box
                                    sx={{
                                        position: "absolute",
                                        inset: -6,
                                        borderRadius: "50%",
                                        background: `conic-gradient(from 0deg, ${SALON.accent}, ${SALON.gold}, ${SALON.accent})`,
                                        opacity: 0.6,
                                        animation: "spinHalo 6s linear infinite",
                                        zIndex: 0
                                    }}
                                />

                                <Avatar
                                    src={profilePicture}
                                    sx={{
                                        width: 116,
                                        height: 116,
                                        fontSize: 36,
                                        fontWeight: 800,
                                        background: SALON.gradient,
                                        color: "#fff",
                                        border: "5px solid white",
                                        position: "relative",
                                        zIndex: 1,
                                        boxShadow:
                                            "0 8px 24px rgba(139,90,99,0.3)"
                                    }}
                                >
                                    {!profilePicture &&
                                        initials}
                                </Avatar>


                                <Tooltip title="Modifier la photo">

                                    <IconButton
                                        onClick={
                                            openPictureDialog
                                        }
                                        sx={{
                                            position: "absolute",
                                            right: 2,
                                            bottom: 2,
                                            zIndex: 2,
                                            width: 38,
                                            height: 38,
                                            backgroundColor:
                                                SALON.accent,
                                            color: "white",
                                            border:
                                                "3px solid white",
                                            transition: "transform 0.2s ease",
                                            "&:hover": {
                                                backgroundColor:
                                                    SALON.accentHover,
                                                transform: "scale(1.08) rotate(-6deg)"
                                            }
                                        }}
                                    >

                                        <PhotoCamera
                                            fontSize="small"
                                        />

                                    </IconButton>

                                </Tooltip>

                            </Box>


                            <Box
                                sx={{
                                    pb: 1
                                }}
                            >

                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                                    <Typography
                                        variant="h5"
                                        fontWeight={800}
                                        sx={{ color: SALON.text }}
                                    >
                                        {fullName}
                                    </Typography>
                                    <VerifiedUser sx={{ fontSize: 19, color: SALON.accent }} />
                                </Box>

                                <Typography
                                    sx={{ color: SALON.textSecondary }}
                                >
                                    {user?.email ||
                                        "Aucun e-mail disponible"}
                                </Typography>

                            </Box>

                        </Box>


                        <Chip
                            icon={
                                <CheckCircle sx={{ fontSize: 16 }} />
                            }
                            label="Compte actif"
                            variant="outlined"
                            sx={{
                                fontWeight: 700,
                                mb: 1,
                                color: "#2E7D32",
                                borderColor: "#2E7D3240",
                                bgcolor: "#2E7D3208",
                                "& .MuiChip-icon": {
                                    color: "#2E7D32"
                                }
                            }}
                        />

                    </Box>


                    {/* PROFILE ACTIONS */}

                    <Box
                        sx={{
                            display: "flex",
                            gap: 1.5,
                            mt: 3,
                            flexWrap: "wrap"
                        }}
                    >

                        <Button
                            variant="contained"
                            startIcon={
                                <PhotoCamera />
                            }
                            onClick={
                                openPictureDialog
                            }
                            sx={{
                                borderRadius: 2.5,
                                textTransform: "none",
                                fontWeight: 700,
                                background: SALON.gradient,
                                boxShadow: "0 4px 14px rgba(183,110,121,0.3)",
                                transition: "transform 0.2s ease",
                                "&:hover": {
                                    background: SALON.accentDark,
                                    boxShadow: "0 6px 18px rgba(183,110,121,0.4)",
                                    transform: "translateY(-2px)"
                                }
                            }}
                        >
                            Modifier la photo
                        </Button>


                        <Button
                            variant="outlined"
                            startIcon={
                                <Lock />
                            }
                            onClick={
                                openPasswordDialog
                            }
                            sx={{
                                borderRadius: 2.5,
                                textTransform: "none",
                                fontWeight: 700,
                                color: SALON.accentDark,
                                borderColor: SALON.accent,
                                transition: "transform 0.2s ease",
                                "&:hover": {
                                    borderColor: SALON.accentDark,
                                    backgroundColor: SALON.accentLight,
                                    transform: "translateY(-2px)"
                                }
                            }}
                        >
                            Modifier le mot de passe
                        </Button>

                    </Box>

                </CardContent>

            </Card>


            {/* =====================================================
                MAIN GRID
            ====================================================== */}

            <Grid
                container
                spacing={3}
            >

                {/* =================================================
                    PERSONAL INFORMATION
                ================================================== */}

                <Grid
                    item
                    xs={12}
                    md={8}
                >

                    <Card
                        elevation={0}
                        sx={{
                            borderRadius: 4,
                            height: "100%",
                            border: `1px solid ${SALON.border}`,
                            bgcolor: SALON.surface
                        }}
                    >

                        <CardContent
                            sx={{
                                p: {
                                    xs: 3,
                                    md: 4
                                }
                            }}
                        >

                            <SectionHeader
                                icon={<Person sx={{ fontSize: 18 }} />}
                                title="Informations personnelles"
                                subtitle="Informations de votre compte."
                            />


                            <Grid
                                container
                                spacing={3}
                                sx={{ mt: 0.5 }}
                            >

                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                >

                                    <ProfileField
                                        icon={<Person />}
                                        label="Prénom"
                                        value={
                                            user?.firstName ||
                                            "—"
                                        }
                                    />

                                </Grid>


                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                >

                                    <ProfileField
                                        icon={<Person />}
                                        label="Nom"
                                        value={
                                            user?.lastName ||
                                            "—"
                                        }
                                    />

                                </Grid>


                                <Grid
                                    item
                                    xs={12}
                                >

                                    <Box
                                        sx={{
                                            p: 2,
                                            borderRadius: 3,
                                            backgroundColor:
                                                SALON.accentLight,
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 2,
                                            position: "relative",
                                            overflow: "hidden",
                                            transition: "background 0.2s ease",
                                            "&:hover": {
                                                backgroundColor: "#F0D8DC"
                                            }
                                        }}
                                    >

                                        <Email sx={{
                                            position: "absolute",
                                            right: -8,
                                            bottom: -10,
                                            fontSize: 64,
                                            color: SALON.accent,
                                            opacity: 0.08
                                        }} />

                                        <Box
                                            sx={{
                                                width: 42,
                                                height: 42,
                                                borderRadius: 2,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                backgroundColor:
                                                    "#FFFFFF",
                                                color:
                                                    SALON.accentDark,
                                                flexShrink: 0
                                            }}
                                        >

                                            <Email />

                                        </Box>


                                        <Box
                                            sx={{
                                                flex: 1,
                                                minWidth: 0,
                                                zIndex: 1
                                            }}
                                        >

                                            <Typography
                                                variant="caption"
                                                sx={{ color: SALON.textSecondary }}
                                            >
                                                Adresse e-mail
                                            </Typography>

                                            <Typography
                                                fontWeight={700}
                                                sx={{
                                                    color: SALON.text,
                                                    overflow: "hidden",
                                                    textOverflow:
                                                        "ellipsis",
                                                    whiteSpace:
                                                        "nowrap"
                                                }}
                                            >
                                                {user?.email ||
                                                    "—"}
                                            </Typography>

                                        </Box>


                                        {user?.email && (

                                            <Tooltip
                                                title="Copier l'e-mail"
                                            >

                                                <IconButton
                                                    onClick={
                                                        copyEmail
                                                    }
                                                    sx={{
                                                        color: SALON.accentDark,
                                                        zIndex: 1,
                                                        bgcolor: "rgba(255,255,255,0.6)",
                                                        "&:hover": {
                                                            bgcolor: "#FFFFFF"
                                                        }
                                                    }}
                                                >

                                                    <ContentCopy
                                                        fontSize="small"
                                                    />

                                                </IconButton>

                                            </Tooltip>

                                        )}

                                    </Box>

                                </Grid>


                                {user?.phone && (

                                    <Grid
                                        item
                                        xs={12}
                                    >

                                        <ProfileField
                                            icon={<Person />}
                                            label="Téléphone"
                                            value={
                                                user.phone
                                            }
                                        />

                                    </Grid>

                                )}

                            </Grid>

                        </CardContent>

                    </Card>

                </Grid>


                {/* =================================================
                    SECURITY
                ================================================== */}

                <Grid
                    item
                    xs={12}
                    md={4}
                >

                    <Card
                        elevation={0}
                        sx={{
                            borderRadius: 4,
                            height: "100%",
                            border: `1px solid ${SALON.border}`,
                            bgcolor: SALON.surface,
                            position: "relative",
                            overflow: "hidden"
                        }}
                    >

                        {/* Watermark décoratif */}
                        <Shield sx={{
                            position: "absolute",
                            right: -18,
                            top: -18,
                            fontSize: 120,
                            color: SALON.accent,
                            opacity: 0.04
                        }} />

                        <CardContent
                            sx={{
                                p: 4,
                                position: "relative"
                            }}
                        >

                            <SectionHeader
                                icon={<Security sx={{ fontSize: 18 }} />}
                                title="Sécurité"
                                subtitle="Gardez votre compte BeautyCloud sécurisé."
                            />


                            <Stack
                                spacing={2.5}
                                sx={{ mt: 1 }}
                            >

                                <AccountRow
                                    icon={
                                        <Security />
                                    }
                                    label="Mot de passe"
                                    value="Protégé"
                                    color="#2E7D32"
                                />


                                <Box sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1
                                }}>
                                    <Divider sx={{ flex: 1, borderColor: SALON.border }} />
                                    <LocalFlorist sx={{ fontSize: 14, color: SALON.border }} />
                                    <Divider sx={{ flex: 1, borderColor: SALON.border }} />
                                </Box>


                                <AccountRow
                                    icon={
                                        <Shield />
                                    }
                                    label="État du compte"
                                    value={
                                        user?.active === false
                                            ? "Inactif"
                                            : "Actif"
                                    }
                                    color={
                                        user?.active === false
                                            ? "#C62828"
                                            : "#2E7D32"
                                    }
                                    success={
                                        user?.active !== false
                                    }
                                />


                                <Button
                                    fullWidth
                                    variant="outlined"
                                    startIcon={
                                        <Key />
                                    }
                                    onClick={
                                        openPasswordDialog
                                    }
                                    sx={{
                                        mt: 1,
                                        borderRadius: 2.5,
                                        textTransform: "none",
                                        fontWeight: 700,
                                        color: SALON.accentDark,
                                        borderColor: SALON.accent,
                                        transition: "transform 0.2s ease",
                                        "&:hover": {
                                            borderColor: SALON.accentDark,
                                            backgroundColor: SALON.accentLight,
                                            transform: "translateY(-2px)"
                                        }
                                    }}
                                >
                                    Modifier le mot de passe
                                </Button>

                            </Stack>

                        </CardContent>

                    </Card>

                </Grid>


                {/* =================================================
                    ACCOUNT INFORMATION
                ================================================== */}

                <Grid
                    item
                    xs={12}
                >

                    <Card
                        elevation={0}
                        sx={{
                            borderRadius: 4,
                            border: `1px solid ${SALON.border}`,
                            background:
                                `linear-gradient(135deg, ${SALON.accentLight} 0%, #FFFFFF 60%)`,
                            position: "relative",
                            overflow: "hidden"
                        }}
                    >

                        <AutoAwesome sx={{
                            position: "absolute",
                            right: 24,
                            top: 18,
                            fontSize: 22,
                            color: SALON.gold,
                            opacity: 0.5
                        }} />

                        <LocalFlorist sx={{
                            position: "absolute",
                            right: 70,
                            bottom: -10,
                            fontSize: 70,
                            color: SALON.accent,
                            opacity: 0.06,
                            transform: "rotate(15deg)"
                        }} />

                        <CardContent
                            sx={{
                                p: {
                                    xs: 3,
                                    md: 4
                                }
                            }}
                        >

                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                    flexWrap: "wrap"
                                }}
                            >

                                <Box
                                    sx={{
                                        width: 52,
                                        height: 52,
                                        borderRadius: 3,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        background: SALON.gradient,
                                        color: "white",
                                        boxShadow: "0 6px 16px rgba(183,110,121,0.3)"
                                    }}
                                >

                                    <AccountCircle />

                                </Box>


                                <Box
                                    sx={{
                                        flex: 1,
                                        minWidth: 220
                                    }}
                                >

                                    <Typography
                                        variant="h6"
                                        fontWeight={800}
                                        sx={{ color: SALON.text }}
                                    >
                                        Votre compte BeautyCloud
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        sx={{ color: SALON.textSecondary }}
                                    >
                                        Vous pouvez modifier votre photo de profil et votre mot de passe à tout moment.
                                    </Typography>

                                </Box>

                            </Box>

                        </CardContent>

                    </Card>

                </Grid>

            </Grid>


            {/* =====================================================
                CHANGE PICTURE DIALOG
            ====================================================== */}

            <Dialog
                open={pictureDialogOpen}
                onClose={closePictureDialog}
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    sx: { borderRadius: 4 }
                }}
            >

                <DialogTitle
                    sx={{
                        fontWeight: 800,
                        color: SALON.text,
                        display: "flex",
                        alignItems: "center",
                        gap: 1.2
                    }}
                >
                    <Box sx={{
                        width: 34,
                        height: 34,
                        borderRadius: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: SALON.gradient
                    }}>
                        <PhotoCamera sx={{ fontSize: 18, color: "#fff" }} />
                    </Box>
                    Modifier la photo de profil
                </DialogTitle>


                <DialogContent>

                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            py: 3
                        }}
                    >

                        <Avatar
                            src={
                                previewPicture ||
                                profilePicture
                            }
                            sx={{
                                width: 150,
                                height: 150,
                                fontSize: 48,
                                fontWeight: 800,
                                background: SALON.gradient,
                                color: "#fff",
                                mb: 3,
                                boxShadow: "0 10px 28px rgba(139,90,99,0.25)"
                            }}
                        >
                            {!previewPicture &&
                                !profilePicture &&
                                initials}
                        </Avatar>


                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={
                                handlePictureSelect
                            }
                        />


                        <Button
                            variant="outlined"
                            startIcon={
                                <CloudUpload />
                            }
                            onClick={() =>
                                fileInputRef.current?.click()
                            }
                            sx={{
                                borderRadius: 2.5,
                                textTransform: "none",
                                fontWeight: 700,
                                color: SALON.accentDark,
                                borderColor: SALON.accent,
                                "&:hover": {
                                    borderColor: SALON.accentDark,
                                    backgroundColor: SALON.accentLight
                                }
                            }}
                        >
                            Choisir une image
                        </Button>


                        <Typography
                            variant="caption"
                            sx={{
                                mt: 1.5,
                                color: SALON.textSecondary
                            }}
                        >
                            JPG, PNG, WEBP • Taille maximale : 5 Mo
                        </Typography>


                        {selectedPicture && (

                            <Typography
                                variant="body2"
                                fontWeight={600}
                                sx={{
                                    mt: 2,
                                    color: SALON.text
                                }}
                            >
                                {selectedPicture.name}
                            </Typography>

                        )}

                    </Box>

                </DialogContent>


                <DialogActions
                    sx={{
                        p: 2.5
                    }}
                >

                    <Button
                        onClick={
                            closePictureDialog
                        }
                        disabled={savingPicture}
                        sx={{
                            color: SALON.textSecondary,
                            textTransform: "none",
                            fontWeight: 700
                        }}
                    >
                        Annuler
                    </Button>


                    <Button
                        variant="contained"
                        onClick={
                            savePicture
                        }
                        disabled={
                            !selectedPicture ||
                            savingPicture
                        }
                        startIcon={
                            savingPicture
                                ? <CircularProgress
                                    size={18}
                                    sx={{ color: "#fff" }}
                                  />
                                : <PhotoCamera />
                        }
                        sx={{
                            borderRadius: 2.5,
                            textTransform: "none",
                            fontWeight: 700,
                            background: SALON.gradient,
                            "&:hover": {
                                background: SALON.accentDark
                            }
                        }}
                    >
                        {savingPicture
                            ? "Enregistrement..."
                            : "Enregistrer la photo"}
                    </Button>

                </DialogActions>

            </Dialog>


            {/* =====================================================
                CHANGE PASSWORD DIALOG
            ====================================================== */}

            <Dialog
                open={passwordDialogOpen}
                onClose={closePasswordDialog}
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    sx: { borderRadius: 4 }
                }}
            >

                <DialogTitle
                    sx={{
                        fontWeight: 800,
                        color: SALON.text,
                        display: "flex",
                        alignItems: "center",
                        gap: 1.2
                    }}
                >
                    <Box sx={{
                        width: 34,
                        height: 34,
                        borderRadius: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: SALON.gradient
                    }}>
                        <Lock sx={{ fontSize: 18, color: "#fff" }} />
                    </Box>
                    Modifier le mot de passe
                </DialogTitle>


                <DialogContent>

                    <Alert
                        severity="info"
                        icon={<Spa fontSize="inherit" />}
                        sx={{
                            mt: 1,
                            mb: 3,
                            borderRadius: 2.5,
                            bgcolor: SALON.accentLight,
                            color: SALON.accentDark,
                            "& .MuiAlert-icon": {
                                color: SALON.accentDark
                            }
                        }}
                    >
                        Choisissez un mot de passe d'au moins 8 caractères.
                    </Alert>


                    <Stack
                        spacing={3}
                    >

                        <TextField
                            fullWidth
                            label="Nouveau mot de passe"
                            name="newPassword"
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }
                            value={
                                passwordData.newPassword
                            }
                            onChange={
                                handlePasswordChange
                            }
                            autoComplete="new-password"
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 2
                                },
                                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                    borderColor: SALON.accent
                                },
                                "& label.Mui-focused": {
                                    color: SALON.accentDark
                                }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock sx={{ color: SALON.accent }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() =>
                                                setShowPassword(
                                                    !showPassword
                                                )
                                            }
                                            edge="end"
                                        >
                                            {showPassword
                                                ? <VisibilityOff />
                                                : <Visibility />
                                            }
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />


                        <TextField
                            fullWidth
                            label="Confirmer le mot de passe"
                            name="confirmPassword"
                            type={
                                showConfirmPassword
                                    ? "text"
                                    : "password"
                            }
                            value={
                                passwordData.confirmPassword
                            }
                            onChange={
                                handlePasswordChange
                            }
                            autoComplete="new-password"
                            error={
                                passwordData.confirmPassword.length > 0 &&
                                passwordData.newPassword !==
                                    passwordData.confirmPassword
                            }
                            helperText={
                                passwordData.confirmPassword.length > 0 &&
                                passwordData.newPassword !==
                                    passwordData.confirmPassword
                                    ? "Les mots de passe ne correspondent pas"
                                    : ""
                            }
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 2
                                },
                                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                    borderColor: SALON.accent
                                },
                                "& label.Mui-focused": {
                                    color: SALON.accentDark
                                }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock sx={{ color: SALON.accent }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    !showConfirmPassword
                                                )
                                            }
                                            edge="end"
                                        >
                                            {showConfirmPassword
                                                ? <VisibilityOff />
                                                : <Visibility />
                                            }
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />

                    </Stack>

                </DialogContent>


                <DialogActions
                    sx={{
                        p: 2.5
                    }}
                >

                    <Button
                        onClick={
                            closePasswordDialog
                        }
                        disabled={
                            changingPassword
                        }
                        sx={{
                            color: SALON.textSecondary,
                            textTransform: "none",
                            fontWeight: 700
                        }}
                    >
                        Annuler
                    </Button>


                    <Button
                        variant="contained"
                        onClick={
                            handleChangePassword
                        }
                        disabled={
                            changingPassword
                        }
                        startIcon={
                            changingPassword
                                ? <CircularProgress
                                    size={18}
                                    sx={{ color: "#fff" }}
                                  />
                                : <Lock />
                        }
                        sx={{
                            borderRadius: 2.5,
                            textTransform: "none",
                            fontWeight: 700,
                            background: SALON.gradient,
                            "&:hover": {
                                background: SALON.accentDark
                            }
                        }}
                    >
                        {changingPassword
                            ? "Modification..."
                            : "Modifier le mot de passe"}
                    </Button>

                </DialogActions>

            </Dialog>


            {/* =====================================================
                SNACKBARS
            ====================================================== */}

            <Snackbar
                open={copied}
                autoHideDuration={2500}
                onClose={() =>
                    setCopied(false)
                }
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center"
                }}
            >

                <Alert
                    severity="success"
                    variant="filled"
                    onClose={() =>
                        setCopied(false)
                    }
                >
                    E-mail copié dans le presse-papiers
                </Alert>

            </Snackbar>


            <Snackbar
                open={message.open}
                autoHideDuration={3500}
                onClose={() =>
                    setMessage({
                        ...message,
                        open: false
                    })
                }
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center"
                }}
            >

                <Alert
                    severity={message.severity}
                    variant="filled"
                    onClose={() =>
                        setMessage({
                            ...message,
                            open: false
                        })
                    }
                >
                    {message.text}
                </Alert>

            </Snackbar>


            {/* =====================================================
                ANIMATIONS
            ====================================================== */}

            <style>
                {`
                    @keyframes spinHalo {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                `}
            </style>

        </Box>
    );
}


// =============================================================
// SECTION HEADER
// =============================================================

function SectionHeader({ icon, title, subtitle }) {
    return (
        <Box sx={{ mb: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box sx={{
                    width: 30,
                    height: 30,
                    borderRadius: "9px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: SALON.accentLight,
                    color: SALON.accentDark
                }}>
                    {icon}
                </Box>
                <Typography
                    variant="h6"
                    fontWeight={800}
                    sx={{ color: SALON.text }}
                >
                    {title}
                </Typography>
            </Box>

            {subtitle && (
                <Typography
                    variant="body2"
                    sx={{ color: SALON.textSecondary, mt: 0.5, ml: 4.7 }}
                >
                    {subtitle}
                </Typography>
            )}
        </Box>
    );
}


// =============================================================
// PROFILE FIELD
// =============================================================

function ProfileField({
    icon,
    label,
    value
}) {

    return (

        <Box
            sx={{
                p: 2,
                borderRadius: 3,
                backgroundColor: SALON.accentLight,
                display: "flex",
                alignItems: "center",
                gap: 2,
                transition: "background 0.2s ease",
                "&:hover": {
                    backgroundColor: "#F0D8DC"
                }
            }}
        >

            <Box
                sx={{
                    width: 42,
                    height: 42,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#FFFFFF",
                    color: SALON.accentDark,
                    flexShrink: 0
                }}
            >
                {icon}
            </Box>


            <Box
                sx={{
                    minWidth: 0
                }}
            >

                <Typography
                    variant="caption"
                    sx={{ color: SALON.textSecondary }}
                >
                    {label}
                </Typography>

                <Typography
                    fontWeight={700}
                    sx={{ color: SALON.text }}
                >
                    {value}
                </Typography>

            </Box>

        </Box>
    );
}


// =============================================================
// ACCOUNT ROW
// =============================================================

function AccountRow({
    icon,
    label,
    value,
    color,
    success = true
}) {

    return (

        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 2
            }}
        >

            <Box
                sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: SALON.accentLight,
                    color
                }}
            >
                {icon}
            </Box>


            <Box
                sx={{
                    flex: 1
                }}
            >

                <Typography
                    variant="body2"
                    sx={{ color: SALON.textSecondary }}
                >
                    {label}
                </Typography>

                <Typography
                    fontWeight={700}
                    sx={{ color: SALON.text }}
                >
                    {value}
                </Typography>

            </Box>


            <CheckCircle
                sx={{
                    color: success ? "#2E7D32" : "#C62828"
                }}
                fontSize="small"
            />

        </Box>
    );
}


// =============================================================
// FILE TO BASE64
// =============================================================

function fileToBase64(file) {

    return new Promise(
        (
            resolve,
            reject
        ) => {

            const reader =
                new FileReader();

            reader.onload = () =>
                resolve(
                    reader.result
                );

            reader.onerror = reject;

            reader.readAsDataURL(file);

        }
    );
}