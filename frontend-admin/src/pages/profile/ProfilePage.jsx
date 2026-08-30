import { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";

import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    Stack,
    TextField,
    Typography,
    Paper,
    Fade,
    Chip,
    IconButton
} from "@mui/material";

import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import VerifiedIcon from "@mui/icons-material/Verified";

import {
    getMyProfile,
    updateMyProfile,
    changePassword
} from "../../services/profileService";

import {
    uploadProfilePicture as uploadProfilePictureFile
} from "../../services/uploadService";

import { useAuth } from "../../context/AuthContext";

export default function ProfilePage() {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const {
        setUser,
        loadUser
    } = useAuth();

    const [profile, setProfile] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        profilePicture: ""
    });

    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [loading, setLoading] = useState(false);

    const blue = {
        main: "#2563eb",
        light: "#3b82f6",
        lighter: "#60a5fa",
        lightest: "#93c5fd",
        dark: "#1d4ed8",
        darker: "#1e3a8a",
        bg: "rgba(37, 99, 235, 0.06)",
        gradient: "linear-gradient(135deg, #2563eb 0%, #60a5fa 100%)",
        gradientDark: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
        text: isDark ? "#e8edf5" : "#1e293b",
        textLight: isDark ? "#94a3b8" : "#64748b"
    };

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        setLoading(true);
        try {
            const res = await getMyProfile();
            setProfile(res.data);
            setUser(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const saveProfile = async () => {
        try {
            const res = await updateMyProfile(profile);
            setProfile(res.data);
            await loadUser();
            alert("Profil mis à jour avec succès.");
        } catch (error) {
            console.error(error);
            alert("Impossible de mettre à jour le profil.");
        }
    };

    const uploadProfilePicture = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            const uploadResponse = await uploadProfilePictureFile(file);
            const picture = uploadResponse.data;
            const updatedProfile = {
                ...profile,
                profilePicture: picture
            };
            const saveResponse = await updateMyProfile(updatedProfile);
            setProfile(saveResponse.data);
            await loadUser();
            alert("Photo de profil mise à jour.");
        } catch (err) {
            console.error(err);
            alert("Impossible de télécharger la photo.");
        }
    };

    const savePassword = async () => {
        if (passwords.newPassword !== passwords.confirmPassword) {
            alert("Les mots de passe ne correspondent pas.");
            return;
        }
        try {
            await changePassword({
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            });
            alert("Mot de passe changé avec succès.");
            setPasswords({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });
        } catch (error) {
            console.error(error);
            alert(
                error.response?.data?.message ||
                "Impossible de changer le mot de passe."
            );
        }
    };

    const bgGradient = isDark 
        ? "linear-gradient(160deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%)" 
        : "linear-gradient(160deg, #f0f5ff 0%, #e3ecfa 50%, #d6e3f5 100%)";

    const paperBg = isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.85)";
    const paperBorder = isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(255,255,255,0.8)";

    return (
        <Fade in={true} timeout={500}>
            <Box
                sx={{
                    minHeight: "calc(100vh - 64px)",
                    background: bgGradient,
                    px: { xs: 2, sm: 3, md: 4 },
                    py: { xs: 3, md: 4 },
                    position: "relative",
                    overflow: "hidden",
                    transition: "background 0.3s ease"
                }}
            >
                {!isDark && (
                    <>
                        {[...Array(12)].map((_, i) => {
                            const size = 14 + Math.random() * 25;
                            const delay = Math.random() * 12;
                            const duration = 14 + Math.random() * 18;
                            const xStart = Math.random() * 100;
                            const rotate = Math.random() * 360;
                            const opacity = 0.08 + Math.random() * 0.12;

                            return (
                                <Box
                                    key={`petal-${i}`}
                                    sx={{
                                        position: "absolute",
                                        width: size,
                                        height: size * 1.5,
                                        borderRadius: "50% 0 50% 50%",
                                        background: `radial-gradient(ellipse at center, rgba(37,99,235,${opacity}) 0%, rgba(96,165,250,${opacity * 0.5}) 40%, transparent 100%)`,
                                        left: `${xStart}%`,
                                        top: "-30px",
                                        transform: `rotate(${rotate}deg)`,
                                        animation: `petalFloat ${duration}s ease-in-out infinite`,
                                        animationDelay: `${delay}s`,
                                        pointerEvents: "none",
                                        zIndex: 0
                                    }}
                                />
                            );
                        })}

                        {[...Array(8)].map((_, i) => {
                            const size = 20 + Math.random() * 50;
                            const delay = Math.random() * 10;
                            const duration = 15 + Math.random() * 15;
                            const xPos = 5 + Math.random() * 90;
                            const yPos = 5 + Math.random() * 90;

                            return (
                                <Box
                                    key={`bubble-${i}`}
                                    sx={{
                                        position: "absolute",
                                        width: size,
                                        height: size,
                                        borderRadius: "50%",
                                        background: `radial-gradient(circle at 30% 30%, rgba(37,99,235,0.06) 0%, rgba(96,165,250,0.03) 60%, transparent 100%)`,
                                        border: `1px solid rgba(37,99,235,${0.03 + Math.random() * 0.05})`,
                                        left: `${xPos}%`,
                                        top: `${yPos}%`,
                                        animation: `bubbleFloat ${duration}s ease-in-out infinite`,
                                        animationDelay: `${delay}s`,
                                        pointerEvents: "none",
                                        zIndex: 0
                                    }}
                                />
                            );
                        })}

                        <Box
                            sx={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: "150px",
                                background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%232563eb' fill-opacity='0.03' d='M0,192L48,176C96,160,192,128,288,138.7C384,149,480,203,576,213.3C672,224,768,192,864,181.3C960,171,1056,181,1152,197.3C1248,213,1344,235,1392,245.3L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'/%3E%3C/svg%3E")`,
                                backgroundSize: "cover",
                                backgroundRepeat: "no-repeat",
                                pointerEvents: "none",
                                zIndex: 0
                            }}
                        />
                    </>
                )}

                <Box
                    sx={{
                        maxWidth: 1100,
                        mx: "auto",
                        position: "relative",
                        zIndex: 1
                    }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3.5,
                            mb: 4,
                            borderRadius: "24px",
                            background: isDark 
                                ? "rgba(255,255,255,0.05)" 
                                : blue.gradient,
                            color: isDark ? blue.text : "#fff",
                            position: "relative",
                            overflow: "hidden",
                            boxShadow: isDark 
                                ? "0 20px 40px rgba(0,0,0,0.3)" 
                                : "0 20px 40px rgba(37,99,235,0.3)",
                            border: isDark ? "1px solid rgba(255,255,255,0.06)" : "none",
                            transition: "all 0.3s ease"
                        }}
                    >
                        <Box
                            sx={{
                                position: "absolute",
                                top: -50,
                                right: -50,
                                width: 200,
                                height: 200,
                                borderRadius: "50%",
                                background: isDark 
                                    ? "rgba(255,255,255,0.02)" 
                                    : "rgba(255,255,255,0.06)",
                                animation: "pulse 6s ease-in-out infinite"
                            }}
                        />
                        <Box
                            sx={{
                                position: "absolute",
                                bottom: -30,
                                left: -30,
                                width: 120,
                                height: 120,
                                borderRadius: "50%",
                                background: isDark 
                                    ? "rgba(255,255,255,0.01)" 
                                    : "rgba(255,255,255,0.04)"
                            }}
                        />

                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: { xs: "column", sm: "row" },
                                alignItems: { xs: "flex-start", sm: "center" },
                                justifyContent: "space-between",
                                position: "relative",
                                zIndex: 1,
                                gap: 2
                            }}
                        >
                            <Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1.5,
                                        mb: 1
                                    }}
                                >
                                    <PersonIcon sx={{ fontSize: "2rem", opacity: 0.9 }} />
                                    <Typography
                                        sx={{
                                            fontSize: { xs: "1.6rem", md: "2rem" },
                                            fontWeight: 800,
                                            letterSpacing: "-0.8px",
                                            lineHeight: 1.2,
                                            color: isDark ? blue.text : "#fff"
                                        }}
                                    >
                                        Mon Profil
                                    </Typography>
                                </Box>

                                <Typography
                                    sx={{
                                        fontSize: "0.85rem",
                                        opacity: 0.85,
                                        fontWeight: 400,
                                        color: isDark ? blue.textLight : "rgba(255,255,255,0.8)"
                                    }}
                                >
                                    Gérez vos informations personnelles et la sécurité de votre compte
                                </Typography>
                            </Box>

                            <Chip
                                icon={<VerifiedIcon />}
                                label="Compte vérifié"
                                sx={{
                                    backgroundColor: isDark 
                                        ? "rgba(255,255,255,0.08)" 
                                        : "rgba(255,255,255,0.15)",
                                    color: isDark ? blue.text : "#fff",
                                    fontWeight: 600,
                                    "& .MuiChip-icon": { 
                                        color: isDark ? blue.text : "#fff" 
                                    }
                                }}
                            />
                        </Box>
                    </Paper>

                    <Card
                        elevation={0}
                        sx={{
                            borderRadius: "24px",
                            mb: 3,
                            background: paperBg,
                            backdropFilter: "blur(10px)",
                            border: paperBorder,
                            boxShadow: isDark 
                                ? "0 10px 30px rgba(0,0,0,0.15)" 
                                : "0 10px 30px rgba(0,0,0,0.04)",
                            transition: "transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease",
                            "&:hover": {
                                transform: "translateY(-4px)",
                                boxShadow: isDark 
                                    ? "0 20px 40px rgba(0,0,0,0.25)" 
                                    : "0 20px 40px rgba(37,99,235,0.08)"
                            }
                        }}
                    >
                        <CardContent
                            sx={{
                                p: { xs: 3, md: 4 },
                                "&:last-child": { pb: { xs: 3, md: 4 } }
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 3,
                                    flexDirection: { xs: "column", sm: "row" }
                                }}
                            >
                                <Box
                                    sx={{
                                        position: "relative",
                                        "&:hover .upload-overlay": { opacity: 1 }
                                    }}
                                >
                                    <Avatar
                                        src={
                                            profile.profilePicture
                                                ? `http://localhost:8080${profile.profilePicture}`
                                                : ""
                                        }
                                        sx={{
                                            width: 120,
                                            height: 120,
                                            fontSize: "2.5rem",
                                            fontWeight: 700,
                                            background: isDark 
                                                ? "rgba(255,255,255,0.1)" 
                                                : blue.gradient,
                                            color: isDark ? blue.text : "#fff",
                                            boxShadow: isDark 
                                                ? "0 8px 24px rgba(0,0,0,0.3)" 
                                                : "0 8px 24px rgba(37,99,235,0.3)"
                                        }}
                                    >
                                        {!profile.profilePicture &&
                                            profile.firstName?.charAt(0)}
                                    </Avatar>

                                    <Box
                                        className="upload-overlay"
                                        sx={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            borderRadius: "50%",
                                            background: "rgba(0,0,0,0.4)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            opacity: 0,
                                            transition: "opacity 0.3s ease",
                                            cursor: "pointer"
                                        }}
                                    >
                                        <CameraAltOutlinedIcon sx={{ color: "#fff", fontSize: "2rem" }} />
                                    </Box>

                                    <input
                                        hidden
                                        type="file"
                                        accept="image/*"
                                        onChange={uploadProfilePicture}
                                        id="profile-picture-input"
                                    />

                                    <IconButton
                                        component="label"
                                        htmlFor="profile-picture-input"
                                        sx={{
                                            position: "absolute",
                                            right: -4,
                                            bottom: -4,
                                            width: 38,
                                            height: 38,
                                            borderRadius: "50%",
                                            background: isDark 
                                                ? "rgba(255,255,255,0.1)" 
                                                : blue.gradient,
                                            border: "3px solid #fff",
                                            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                                            "&:hover": {
                                                background: isDark 
                                                    ? "rgba(255,255,255,0.15)" 
                                                    : blue.gradientDark
                                            }
                                        }}
                                    >
                                        <CameraAltOutlinedIcon sx={{ fontSize: 18, color: isDark ? blue.text : "#fff" }} />
                                    </IconButton>
                                </Box>

                                <Box
                                    sx={{
                                        flex: 1,
                                        textAlign: { xs: "center", sm: "left" }
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: "1.3rem",
                                            fontWeight: 750,
                                            color: blue.text
                                        }}
                                    >
                                        {profile.firstName} {profile.lastName}
                                    </Typography>

                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                            mt: 0.5,
                                            justifyContent: { xs: "center", sm: "flex-start" }
                                        }}
                                    >
                                        <EmailIcon sx={{ fontSize: "0.9rem", color: blue.textLight }} />
                                        <Typography sx={{ fontSize: "0.85rem", color: blue.textLight }}>
                                            {profile.email}
                                        </Typography>
                                    </Box>

                                    {profile.phone && (
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                                mt: 0.3,
                                                justifyContent: { xs: "center", sm: "flex-start" }
                                            }}
                                        >
                                            <PhoneIcon sx={{ fontSize: "0.9rem", color: blue.textLight }} />
                                            <Typography sx={{ fontSize: "0.85rem", color: blue.textLight }}>
                                                {profile.phone}
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            </Box>

                            <Divider sx={{ my: 4, borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }} />

                            <Box sx={{ mb: 3 }}>
                                <Typography
                                    sx={{
                                        fontSize: "1rem",
                                        fontWeight: 750,
                                        color: blue.text,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1
                                    }}
                                >
                                    <PersonIcon sx={{ color: blue.main }} />
                                    Informations Personnelles
                                </Typography>
                                <Typography sx={{ fontSize: "0.8rem", color: blue.textLight, mt: 0.5 }}>
                                    Mettez à jour vos coordonnées ci-dessous.
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                                    gap: 2.5
                                }}
                            >
                                <TextField
                                    label="Prénom"
                                    value={profile.firstName}
                                    onChange={(e) =>
                                        setProfile({
                                            ...profile,
                                            firstName: e.target.value
                                        })
                                    }
                                    fullWidth
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: "14px",
                                            backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "#f9fafb",
                                            color: blue.text,
                                            "&:hover fieldset": { borderColor: blue.main },
                                            "&.Mui-focused fieldset": {
                                                borderColor: blue.main,
                                                boxShadow: `0 0 0 4px ${blue.bg}`
                                            }
                                        },
                                        "& .MuiInputLabel-root": {
                                            color: blue.textLight
                                        },
                                        "& .MuiInputBase-input": {
                                            color: blue.text
                                        }
                                    }}
                                />

                                <TextField
                                    label="Nom"
                                    value={profile.lastName}
                                    onChange={(e) =>
                                        setProfile({
                                            ...profile,
                                            lastName: e.target.value
                                        })
                                    }
                                    fullWidth
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: "14px",
                                            backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "#f9fafb",
                                            color: blue.text,
                                            "&:hover fieldset": { borderColor: blue.main },
                                            "&.Mui-focused fieldset": {
                                                borderColor: blue.main,
                                                boxShadow: `0 0 0 4px ${blue.bg}`
                                            }
                                        },
                                        "& .MuiInputLabel-root": {
                                            color: blue.textLight
                                        },
                                        "& .MuiInputBase-input": {
                                            color: blue.text
                                        }
                                    }}
                                />

                                <TextField
                                    label="Email"
                                    value={profile.email}
                                    disabled
                                    fullWidth
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: "14px",
                                            backgroundColor: isDark ? "rgba(255,255,255,0.02)" : "#f3f4f6",
                                            color: blue.textLight
                                        },
                                        "& .MuiInputLabel-root": {
                                            color: blue.textLight
                                        },
                                        "& .MuiInputBase-input": {
                                            color: blue.textLight
                                        }
                                    }}
                                />

                                <TextField
                                    label="Téléphone"
                                    value={profile.phone}
                                    onChange={(e) =>
                                        setProfile({
                                            ...profile,
                                            phone: e.target.value
                                        })
                                    }
                                    fullWidth
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: "14px",
                                            backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "#f9fafb",
                                            color: blue.text,
                                            "&:hover fieldset": { borderColor: blue.main },
                                            "&.Mui-focused fieldset": {
                                                borderColor: blue.main,
                                                boxShadow: `0 0 0 4px ${blue.bg}`
                                            }
                                        },
                                        "& .MuiInputLabel-root": {
                                            color: blue.textLight
                                        },
                                        "& .MuiInputBase-input": {
                                            color: blue.text
                                        }
                                    }}
                                />
                            </Box>

                            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3.5 }}>
                                <Button
                                    variant="contained"
                                    startIcon={<SaveOutlinedIcon />}
                                    onClick={saveProfile}
                                    sx={{
                                        borderRadius: "14px",
                                        px: 3.5,
                                        height: 48,
                                        background: isDark 
                                            ? "rgba(255,255,255,0.1)" 
                                            : blue.gradient,
                                        color: isDark ? blue.text : "#fff",
                                        textTransform: "none",
                                        fontSize: "0.85rem",
                                        fontWeight: 700,
                                        boxShadow: isDark 
                                            ? "0 8px 24px rgba(0,0,0,0.2)" 
                                            : "0 8px 24px rgba(37,99,235,0.3)",
                                        transition: "all 0.3s ease",
                                        "&:hover": {
                                            transform: "translateY(-2px)",
                                            boxShadow: isDark 
                                                ? "0 12px 32px rgba(0,0,0,0.3)" 
                                                : "0 12px 32px rgba(37,99,235,0.5)",
                                            background: isDark 
                                                ? "rgba(255,255,255,0.15)" 
                                                : blue.gradientDark
                                        },
                                        "&:active": { transform: "translateY(0px)" }
                                    }}
                                >
                                    Enregistrer le Profil
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>

                    <Card
                        elevation={0}
                        sx={{
                            borderRadius: "24px",
                            background: paperBg,
                            backdropFilter: "blur(10px)",
                            border: paperBorder,
                            boxShadow: isDark 
                                ? "0 10px 30px rgba(0,0,0,0.15)" 
                                : "0 10px 30px rgba(0,0,0,0.04)",
                            transition: "transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease",
                            "&:hover": {
                                transform: "translateY(-4px)",
                                boxShadow: isDark 
                                    ? "0 20px 40px rgba(0,0,0,0.25)" 
                                    : "0 20px 40px rgba(37,99,235,0.08)"
                            }
                        }}
                    >
                        <CardContent
                            sx={{
                                p: { xs: 3, md: 4 },
                                "&:last-child": { pb: { xs: 3, md: 4 } }
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                    mb: 3
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 44,
                                        height: 44,
                                        borderRadius: "14px",
                                        background: isDark 
                                            ? "rgba(255,255,255,0.08)" 
                                            : blue.gradient,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}
                                >
                                    <LockOutlinedIcon sx={{ fontSize: 22, color: isDark ? blue.text : "#fff" }} />
                                </Box>

                                <Box>
                                    <Typography sx={{ fontSize: "1rem", fontWeight: 750, color: blue.text }}>
                                        Changer le Mot de Passe
                                    </Typography>
                                    <Typography sx={{ fontSize: "0.8rem", color: blue.textLight, mt: 0.3 }}>
                                        Utilisez un mot de passe fort pour sécuriser votre compte.
                                    </Typography>
                                </Box>
                            </Box>

                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                                    gap: 2.5
                                }}
                            >
                                <TextField
                                    type="password"
                                    label="Mot de Passe Actuel"
                                    value={passwords.currentPassword}
                                    onChange={(e) =>
                                        setPasswords({
                                            ...passwords,
                                            currentPassword: e.target.value
                                        })
                                    }
                                    fullWidth
                                    sx={{
                                        gridColumn: { xs: "auto", md: "1 / -1" },
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: "14px",
                                            backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "#f9fafb",
                                            color: blue.text,
                                            "&:hover fieldset": { borderColor: blue.main },
                                            "&.Mui-focused fieldset": {
                                                borderColor: blue.main,
                                                boxShadow: `0 0 0 4px ${blue.bg}`
                                            }
                                        },
                                        "& .MuiInputLabel-root": {
                                            color: blue.textLight
                                        },
                                        "& .MuiInputBase-input": {
                                            color: blue.text
                                        }
                                    }}
                                />

                                <TextField
                                    type="password"
                                    label="Nouveau Mot de Passe"
                                    value={passwords.newPassword}
                                    onChange={(e) =>
                                        setPasswords({
                                            ...passwords,
                                            newPassword: e.target.value
                                        })
                                    }
                                    fullWidth
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: "14px",
                                            backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "#f9fafb",
                                            color: blue.text,
                                            "&:hover fieldset": { borderColor: blue.main },
                                            "&.Mui-focused fieldset": {
                                                borderColor: blue.main,
                                                boxShadow: `0 0 0 4px ${blue.bg}`
                                            }
                                        },
                                        "& .MuiInputLabel-root": {
                                            color: blue.textLight
                                        },
                                        "& .MuiInputBase-input": {
                                            color: blue.text
                                        }
                                    }}
                                />

                                <TextField
                                    type="password"
                                    label="Confirmer le Mot de Passe"
                                    value={passwords.confirmPassword}
                                    onChange={(e) =>
                                        setPasswords({
                                            ...passwords,
                                            confirmPassword: e.target.value
                                        })
                                    }
                                    fullWidth
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: "14px",
                                            backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "#f9fafb",
                                            color: blue.text,
                                            "&:hover fieldset": { borderColor: blue.main },
                                            "&.Mui-focused fieldset": {
                                                borderColor: blue.main,
                                                boxShadow: `0 0 0 4px ${blue.bg}`
                                            }
                                        },
                                        "& .MuiInputLabel-root": {
                                            color: blue.textLight
                                        },
                                        "& .MuiInputBase-input": {
                                            color: blue.text
                                        }
                                    }}
                                />
                            </Box>

                            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3.5 }}>
                                <Button
                                    variant="contained"
                                    startIcon={<LockOutlinedIcon />}
                                    onClick={savePassword}
                                    sx={{
                                        borderRadius: "14px",
                                        px: 3.5,
                                        height: 48,
                                        background: isDark 
                                            ? "rgba(255,255,255,0.1)" 
                                            : blue.gradient,
                                        color: isDark ? blue.text : "#fff",
                                        textTransform: "none",
                                        fontSize: "0.85rem",
                                        fontWeight: 700,
                                        boxShadow: isDark 
                                            ? "0 8px 24px rgba(0,0,0,0.2)" 
                                            : "0 8px 24px rgba(37,99,235,0.3)",
                                        transition: "all 0.3s ease",
                                        "&:hover": {
                                            transform: "translateY(-2px)",
                                            boxShadow: isDark 
                                                ? "0 12px 32px rgba(0,0,0,0.3)" 
                                                : "0 12px 32px rgba(37,99,235,0.5)",
                                            background: isDark 
                                                ? "rgba(255,255,255,0.15)" 
                                                : blue.gradientDark
                                        },
                                        "&:active": { transform: "translateY(0px)" }
                                    }}
                                >
                                    Changer le Mot de Passe
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>

                <style>
                    {`
                        @keyframes petalFloat {
                            0% { transform: translateY(0) rotate(0deg) scale(1); opacity: 0.08; }
                            25% { transform: translateY(25vh) rotate(90deg) scale(1.1); opacity: 0.18; }
                            50% { transform: translateY(50vh) rotate(180deg) scale(0.9); opacity: 0.08; }
                            75% { transform: translateY(75vh) rotate(270deg) scale(1.05); opacity: 0.15; }
                            100% { transform: translateY(100vh) rotate(360deg) scale(1); opacity: 0.03; }
                        }
                        @keyframes bubbleFloat {
                            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
                            25% { transform: translate(30px, -20px) scale(1.1); opacity: 0.5; }
                            50% { transform: translate(-20px, -35px) scale(0.9); opacity: 0.3; }
                            75% { transform: translate(20px, -10px) scale(1.05); opacity: 0.4; }
                        }
                        @keyframes pulse {
                            0%, 100% { transform: scale(1); opacity: 0.6; }
                            50% { transform: scale(1.05); opacity: 1; }
                        }
                    `}
                </style>
            </Box>
        </Fade>
    );
}