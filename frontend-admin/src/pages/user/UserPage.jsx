import { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";

import {
    Box,
    Typography,
    Button,
    Paper,
    Fade,
    Chip
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import PeopleIcon from "@mui/icons-material/People";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

import UserTable from "../../components/user/UserTable";
import UserDialog from "../../components/user/UserDialog";

import {
    getUsers,
    createUser,
    updateUser,
    toggleUserStatus
} from "../../services/userService";

export default function UserPage() {

    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(false);

    const blue = {
        main: "#2563eb",
        light: "#3b82f6",
        lighter: "#60a5fa",
        lightest: "#93c5fd",
        dark: "#1d4ed8",
        darker: "#1e3a8a",
        bg: "rgba(37, 99, 235, 0.06)",
        gradient:
            "linear-gradient(135deg, #2563eb 0%, #60a5fa 100%)",
        gradientDark:
            "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
        text: isDark ? "#e8edf5" : "#1e293b",
        textLight: isDark ? "#94a3b8" : "#64748b"
    };

    // =========================================================
    // LOAD USERS
    // =========================================================

    const loadUsers = async () => {

        setLoading(true);

        try {

            const response = await getUsers();

            setUsers(response.data);

        } catch (error) {

            console.error(
                "Error loading users:",
                error
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {

        loadUsers();

    }, []);

    // =========================================================
    // CREATE / UPDATE USER
    // =========================================================

    const handleSave = async (userData) => {

        try {

            console.log(
                "📤 Sending user data:",
                JSON.stringify(
                    userData,
                    null,
                    2
                )
            );

            if (selectedUser) {

                // =============================================
                // UPDATE
                // =============================================

                await updateUser(
                    selectedUser.id,
                    userData
                );

                alert(
                    "Utilisateur mis à jour avec succès."
                );

            } else {

                // =============================================
                // CREATE
                // =============================================

                const response =
                    await createUser(userData);

                console.log(
                    "📥 Create user response:",
                    response.data
                );

                alert(
                    `Utilisateur créé avec succès !\n\n` +
                    `Un mot de passe temporaire a été généré ` +
                    `et envoyé à l'adresse email de l'utilisateur.\n\n` +
                    `Mot de passe temporaire :\n` +
                    `${response.data.temporaryPassword}\n\n` +
                    `L'utilisateur devra modifier ce mot de passe ` +
                    `lors de sa première connexion.`
                );
            }

            await loadUsers();

            setSelectedUser(null);
            setOpen(false);

        } catch (error) {

            console.error(
                "❌ Error creating/updating user:",
                error
            );

            console.error(
                "❌ Error response:",
                error.response?.data
            );

            alert(
                error.response?.data?.message ||
                "Impossible d'enregistrer l'utilisateur."
            );
        }
    };

    // =========================================================
    // EDIT
    // =========================================================

    const handleEdit = (user) => {

        setSelectedUser(user);
        setOpen(true);
    };

    // =========================================================
    // TOGGLE STATUS
    // =========================================================

    const handleToggle = async (id) => {

        try {

            await toggleUserStatus(id);

            await loadUsers();

        } catch (error) {

            console.error(
                "Error changing user status:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Impossible de modifier le statut de l'utilisateur."
            );
        }
    };

    // =========================================================
    // BACKGROUND
    // =========================================================

    const bgGradient = isDark
        ? "linear-gradient(160deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%)"
        : "linear-gradient(160deg, #f0f5ff 0%, #e3ecfa 50%, #d6e3f5 100%)";

    const paperBg = isDark
        ? "rgba(255,255,255,0.05)"
        : "rgba(255,255,255,0.85)";

    const paperBorder = isDark
        ? "1px solid rgba(255,255,255,0.06)"
        : "1px solid rgba(255,255,255,0.8)";

    return (

        <Fade
            in={true}
            timeout={500}
        >

            <Box
                sx={{
                    minHeight:
                        "calc(100vh - 64px)",
                    background: bgGradient,
                    px: {
                        xs: 2,
                        sm: 3,
                        md: 4
                    },
                    py: {
                        xs: 3,
                        md: 4
                    },
                    position: "relative",
                    overflow: "hidden",
                    transition:
                        "background 0.3s ease"
                }}
            >

                {/* =================================================
                    DECORATIVE BACKGROUND
                ================================================= */}

                {!isDark && (
                    <>

                        {[...Array(12)].map(
                            (_, i) => {

                                const size =
                                    14 +
                                    Math.random() * 25;

                                const delay =
                                    Math.random() * 12;

                                const duration =
                                    14 +
                                    Math.random() * 18;

                                const xStart =
                                    Math.random() * 100;

                                const rotate =
                                    Math.random() * 360;

                                const opacity =
                                    0.08 +
                                    Math.random() * 0.12;

                                return (

                                    <Box
                                        key={`petal-${i}`}
                                        sx={{
                                            position:
                                                "absolute",
                                            width: size,
                                            height:
                                                size * 1.5,
                                            borderRadius:
                                                "50% 0 50% 50%",
                                            background:
                                                `radial-gradient(
                                                    ellipse at center,
                                                    rgba(
                                                        37,
                                                        99,
                                                        235,
                                                        ${opacity}
                                                    ) 0%,
                                                    rgba(
                                                        96,
                                                        165,
                                                        250,
                                                        ${opacity * 0.5}
                                                    ) 40%,
                                                    transparent
                                                    100%
                                                )`,
                                            left:
                                                `${xStart}%`,
                                            top:
                                                "-30px",
                                            transform:
                                                `rotate(${rotate}deg)`,
                                            animation:
                                                `petalFloat ${duration}s ease-in-out infinite`,
                                            animationDelay:
                                                `${delay}s`,
                                            pointerEvents:
                                                "none",
                                            zIndex: 0
                                        }}
                                    />

                                );
                            }
                        )}

                        {[...Array(8)].map(
                            (_, i) => {

                                const size =
                                    20 +
                                    Math.random() * 50;

                                const delay =
                                    Math.random() * 10;

                                const duration =
                                    15 +
                                    Math.random() * 15;

                                const xPos =
                                    5 +
                                    Math.random() * 90;

                                const yPos =
                                    5 +
                                    Math.random() * 90;

                                return (

                                    <Box
                                        key={`bubble-${i}`}
                                        sx={{
                                            position:
                                                "absolute",
                                            width: size,
                                            height: size,
                                            borderRadius:
                                                "50%",
                                            background:
                                                "radial-gradient(circle at 30% 30%, rgba(37,99,235,0.06) 0%, rgba(96,165,250,0.03) 60%, transparent 100%)",
                                            border:
                                                `1px solid rgba(37,99,235,${0.03 + Math.random() * 0.05})`,
                                            left:
                                                `${xPos}%`,
                                            top:
                                                `${yPos}%`,
                                            animation:
                                                `bubbleFloat ${duration}s ease-in-out infinite`,
                                            animationDelay:
                                                `${delay}s`,
                                            pointerEvents:
                                                "none",
                                            zIndex: 0
                                        }}
                                    />

                                );
                            }
                        )}

                        <Box
                            sx={{
                                position:
                                    "absolute",
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: "150px",
                                background:
                                    `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%232563eb' fill-opacity='0.03' d='M0,192L48,176C96,160,192,128,288,138.7C384,149,480,203,576,213.3C672,224,768,192,864,181.3C960,171,1056,181,1152,197.3C1248,213,1344,235,1392,245.3L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'/%3E%3C/svg%3E")`,
                                backgroundSize:
                                    "cover",
                                backgroundRepeat:
                                    "no-repeat",
                                pointerEvents:
                                    "none",
                                zIndex: 0
                            }}
                        />

                    </>
                )}

                {/* =================================================
                    MAIN CONTENT
                ================================================= */}

                <Box
                    sx={{
                        maxWidth: 1500,
                        mx: "auto",
                        position: "relative",
                        zIndex: 1
                    }}
                >

                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <Paper
                        elevation={0}
                        sx={{
                            p: 3.5,
                            mb: 4,
                            borderRadius: "24px",
                            background: isDark
                                ? "rgba(255,255,255,0.05)"
                                : blue.gradient,
                            color: isDark
                                ? blue.text
                                : "#fff",
                            position: "relative",
                            overflow: "hidden",
                            boxShadow: isDark
                                ? "0 20px 40px rgba(0,0,0,0.3)"
                                : "0 20px 40px rgba(37,99,235,0.3)",
                            border: isDark
                                ? "1px solid rgba(255,255,255,0.06)"
                                : "none",
                            transition:
                                "all 0.3s ease"
                        }}
                    >

                        <Box
                            sx={{
                                position:
                                    "absolute",
                                top: -50,
                                right: -50,
                                width: 200,
                                height: 200,
                                borderRadius:
                                    "50%",
                                background: isDark
                                    ? "rgba(255,255,255,0.02)"
                                    : "rgba(255,255,255,0.06)",
                                animation:
                                    "pulse 6s ease-in-out infinite"
                            }}
                        />

                        <Box
                            sx={{
                                position:
                                    "absolute",
                                bottom: -30,
                                left: -30,
                                width: 120,
                                height: 120,
                                borderRadius:
                                    "50%",
                                background: isDark
                                    ? "rgba(255,255,255,0.01)"
                                    : "rgba(255,255,255,0.04)"
                            }}
                        />

                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: {
                                    xs: "column",
                                    sm: "row"
                                },
                                alignItems: {
                                    xs: "flex-start",
                                    sm: "center"
                                },
                                justifyContent:
                                    "space-between",
                                position:
                                    "relative",
                                zIndex: 1,
                                gap: 2
                            }}
                        >

                            <Box>

                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems:
                                            "center",
                                        gap: 1.5,
                                        mb: 1
                                    }}
                                >

                                    <PeopleIcon
                                        sx={{
                                            fontSize:
                                                "2rem",
                                            opacity: 0.9
                                        }}
                                    />

                                    <Typography
                                        sx={{
                                            fontSize: {
                                                xs: "1.6rem",
                                                md: "2rem"
                                            },
                                            fontWeight: 800,
                                            letterSpacing:
                                                "-0.8px",
                                            lineHeight: 1.2,
                                            color:
                                                isDark
                                                    ? blue.text
                                                    : "#fff"
                                        }}
                                    >
                                        Utilisateurs
                                    </Typography>

                                </Box>

                                <Typography
                                    sx={{
                                        fontSize:
                                            "0.85rem",
                                        opacity: 0.85,
                                        fontWeight: 400,
                                        color:
                                            isDark
                                                ? blue.textLight
                                                : "rgba(255,255,255,0.8)"
                                    }}
                                >
                                    Gérez les utilisateurs et leurs accès à la plateforme
                                </Typography>

                            </Box>

                            <Chip
                                icon={
                                    <PersonAddIcon />
                                }
                                label={`${users.length} utilisateurs`}
                                sx={{
                                    backgroundColor:
                                        isDark
                                            ? "rgba(255,255,255,0.08)"
                                            : "rgba(255,255,255,0.15)",
                                    color:
                                        isDark
                                            ? blue.text
                                            : "#fff",
                                    fontWeight: 600,
                                    "& .MuiChip-icon": {
                                        color:
                                            isDark
                                                ? blue.text
                                                : "#fff"
                                    }
                                }}
                            />

                        </Box>

                    </Paper>

                    {/* =================================================
                        ADD USER BUTTON
                    ================================================= */}

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent:
                                "flex-end",
                            mb: 3
                        }}
                    >

                        <Button
                            variant="contained"
                            startIcon={
                                <AddIcon />
                            }
                            onClick={() => {

                                setSelectedUser(null);
                                setOpen(true);

                            }}
                            sx={{
                                height: 48,
                                px: 3.5,
                                borderRadius:
                                    "14px",
                                textTransform:
                                    "none",
                                fontSize:
                                    "0.85rem",
                                fontWeight: 700,
                                background:
                                    blue.gradient,
                                color: "#fff",
                                boxShadow:
                                    isDark
                                        ? "0 8px 24px rgba(0,0,0,0.3)"
                                        : "0 8px 24px rgba(37,99,235,0.3)",
                                transition:
                                    "all 0.3s ease",
                                "&:hover": {
                                    transform:
                                        "translateY(-2px)",
                                    boxShadow:
                                        isDark
                                            ? "0 12px 32px rgba(0,0,0,0.4)"
                                            : "0 12px 32px rgba(37,99,235,0.5)",
                                    background:
                                        blue.gradientDark
                                },
                                "&:active": {
                                    transform:
                                        "translateY(0px)"
                                }
                            }}
                        >
                            Ajouter un Utilisateur
                        </Button>

                    </Box>

                    {/* =================================================
                        USER TABLE
                    ================================================= */}

                    <Paper
                        elevation={0}
                        sx={{
                            borderRadius:
                                "24px",
                            overflow:
                                "hidden",
                            background:
                                paperBg,
                            backdropFilter:
                                "blur(10px)",
                            border:
                                paperBorder,
                            boxShadow:
                                isDark
                                    ? "0 10px 30px rgba(0,0,0,0.15)"
                                    : "0 10px 30px rgba(0,0,0,0.04)",
                            transition:
                                "transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease",
                            "&:hover": {
                                transform:
                                    "translateY(-4px)",
                                boxShadow:
                                    isDark
                                        ? "0 20px 40px rgba(0,0,0,0.25)"
                                        : "0 20px 40px rgba(37,99,235,0.08)"
                            }
                        }}
                    >

                        <UserTable
                            rows={users}
                            onEdit={handleEdit}
                            onToggle={handleToggle}
                            loading={loading}
                        />

                    </Paper>

                    {/* =================================================
                        DIALOG
                    ================================================= */}

                    <UserDialog
                        open={open}
                        onClose={() => {

                            setOpen(false);
                            setSelectedUser(null);

                        }}
                        onSave={handleSave}
                        user={selectedUser}
                    />

                </Box>

                {/* =====================================================
                    ANIMATIONS
                ===================================================== */}

                <style>
                    {`
                        @keyframes petalFloat {
                            0% {
                                transform: translateY(0) rotate(0deg) scale(1);
                                opacity: 0.08;
                            }

                            25% {
                                transform: translateY(25vh) rotate(90deg) scale(1.1);
                                opacity: 0.18;
                            }

                            50% {
                                transform: translateY(50vh) rotate(180deg) scale(0.9);
                                opacity: 0.08;
                            }

                            75% {
                                transform: translateY(75vh) rotate(270deg) scale(1.05);
                                opacity: 0.15;
                            }

                            100% {
                                transform: translateY(100vh) rotate(360deg) scale(1);
                                opacity: 0.03;
                            }
                        }

                        @keyframes bubbleFloat {
                            0%, 100% {
                                transform: translate(0, 0) scale(1);
                                opacity: 0.3;
                            }

                            25% {
                                transform: translate(30px, -20px) scale(1.1);
                                opacity: 0.5;
                            }

                            50% {
                                transform: translate(-20px, -35px) scale(0.9);
                                opacity: 0.3;
                            }

                            75% {
                                transform: translate(20px, -10px) scale(1.05);
                                opacity: 0.4;
                            }
                        }

                        @keyframes pulse {
                            0%, 100% {
                                transform: scale(1);
                                opacity: 0.6;
                            }

                            50% {
                                transform: scale(1.05);
                                opacity: 1;
                            }
                        }
                    `}
                </style>

            </Box>

        </Fade>
    );
}
