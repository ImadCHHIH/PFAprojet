import {
    Box,
    Button,
    Card,
    CardContent,
    TextField,
    Typography,
    Fade,
    Chip,
    InputAdornment,
    IconButton
} from "@mui/material";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import SpaIcon from "@mui/icons-material/Spa";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

export default function ChangePasswordPage() {

    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [newPasswordFocused, setNewPasswordFocused] = useState(false);
    const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);

    // Salon theme colors
    const salon = {
        background: "#FAF9F7",
        surface: "#FFFFFF",
        text: "#242424",
        textSecondary: "#737373",
        border: "#E8E4DE",
        accent: "#B76E79",
        accentDark: "#8B5A63",
        accentLight: "#F5E6E8",
        accentHover: "#A05E68",
        gradient: "linear-gradient(135deg, #B76E79 0%, #D4A0A8 100%)",
        shadow: "0 20px 60px rgba(183, 110, 121, 0.15)"
    };

    // Password strength checker
    const getPasswordStrength = (password) => {
        let score = 0;
        if (password.length >= 8) score++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
        if (/\d/.test(password)) score++;
        if (/[^a-zA-Z0-9]/.test(password)) score++;
        return score;
    };

    const strength = getPasswordStrength(newPassword);
    const isStrong = strength >= 3;

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");

        if (newPassword.length < 8) {
            setError("Le mot de passe doit contenir au moins 8 caractères.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem("salonToken");

            await axios.put(
                "http://localhost:8080/users/change-password",
                { newPassword },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            navigate("/");
        } catch (error) {
            console.error(error);
            setError(
                error.response?.data?.message ||
                "Échec du changement de mot de passe."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: "linear-gradient(160deg, #FAF9F7 0%, #F5F0EC 50%, #EDE6E1 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: 2,
                position: "relative",
                overflow: "hidden"
            }}
        >
            {/* Animated Background - Flowers & Confetti */}
            {[...Array(8)].map((_, i) => {
                const size = 40 + Math.random() * 50;
                const delay = i * 1.8 + Math.random() * 3;
                const duration = 22 + Math.random() * 14;
                const xPos = 5 + Math.random() * 90;
                const yPos = 5 + Math.random() * 90;

                return (
                    <Box
                        key={`flower-${i}`}
                        sx={{
                            position: "absolute",
                            width: size,
                            height: size,
                            left: `${xPos}%`,
                            top: `${yPos}%`,
                            animation: `flowerFloat ${duration}s ease-in-out infinite`,
                            animationDelay: `${delay}s`,
                            pointerEvents: "none",
                            zIndex: 0,
                            opacity: 0.15 + Math.random() * 0.12
                        }}
                    >
                        {[...Array(6)].map((_, j) => {
                            const angle = (j * 60) * (Math.PI / 180);
                            const petalSize = size * 0.38;
                            return (
                                <Box
                                    key={`petal-${i}-${j}`}
                                    sx={{
                                        position: "absolute",
                                        width: petalSize,
                                        height: petalSize * 1.8,
                                        borderRadius: "50% 0 50% 50%",
                                        background: `radial-gradient(ellipse at center, rgba(139, 90, 99, 0.45) 0%, rgba(183, 110, 121, 0.25) 50%, transparent 100%)`,
                                        left: "50%",
                                        top: "50%",
                                        transform: `translate(-50%, -50%) rotate(${angle}rad) translateY(-${size * 0.35}px) rotate(${45 + j * 20}deg)`,
                                        transformOrigin: "center center"
                                    }}
                                />
                            );
                        })}
                        <Box
                            sx={{
                                position: "absolute",
                                width: size * 0.22,
                                height: size * 0.22,
                                borderRadius: "50%",
                                background: `radial-gradient(circle, rgba(139, 90, 99, 0.55) 0%, rgba(183, 110, 121, 0.25) 100%)`,
                                left: "50%",
                                top: "50%",
                                transform: "translate(-50%, -50%)"
                            }}
                        />
                    </Box>
                );
            })}

            {[...Array(35)].map((_, i) => {
                const width = 5 + Math.random() * 8;
                const height = 3 + Math.random() * 6;
                const delay = Math.random() * 12;
                const duration = 14 + Math.random() * 16;
                const xStart = Math.random() * 100;
                const rotation = Math.random() * 720;
                const colors = [
                    "rgba(139, 90, 99, 0.3)",
                    "rgba(183, 110, 121, 0.25)",
                    "rgba(212, 160, 168, 0.2)",
                    "rgba(160, 94, 104, 0.3)",
                    "rgba(200, 150, 158, 0.2)"
                ];
                const color = colors[Math.floor(Math.random() * colors.length)];
                const shape = Math.random() > 0.5 ? "50% 0 50% 50%" : "0 50% 50% 50%";

                return (
                    <Box
                        key={`confetti-${i}`}
                        sx={{
                            position: "absolute",
                            width: width,
                            height: height,
                            borderRadius: shape,
                            background: color,
                            left: `${xStart}%`,
                            top: "-20px",
                            transform: `rotate(${rotation}deg)`,
                            animation: `confettiFall ${duration}s ease-in-out infinite`,
                            animationDelay: `${delay}s`,
                            pointerEvents: "none",
                            zIndex: 0,
                            opacity: 0.6
                        }}
                    />
                );
            })}

            <Fade in timeout={800}>
                <Card
                    elevation={0}
                    sx={{
                        width: "100%",
                        maxWidth: 440,
                        borderRadius: "28px",
                        background: "rgba(255,255,255,0.92)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(255,255,255,0.6)",
                        boxShadow: salon.shadow,
                        position: "relative",
                        zIndex: 1,
                        overflow: "hidden",
                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                        "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: "0 30px 80px rgba(183, 110, 121, 0.2)"
                        },
                        "&::before": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            height: "4px",
                            background: salon.gradient,
                            borderRadius: "28px 28px 0 0"
                        }
                    }}
                >
                    <CardContent
                        sx={{
                            p: { xs: 3.5, sm: 4.5 },
                            "&:last-child": { pb: { xs: 3.5, sm: 4.5 } }
                        }}
                    >
                        {/* Brand */}
                        <Box sx={{ textAlign: "center", mb: 4 }}>
                            <Box
                                sx={{
                                    width: 60,
                                    height: 60,
                                    mx: "auto",
                                    mb: 2,
                                    borderRadius: "18px",
                                    background: salon.gradient,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow: "0 12px 32px rgba(183, 110, 121, 0.25)"
                                }}
                            >
                                <LockOutlinedIcon sx={{ color: "#fff", fontSize: "1.8rem" }} />
                            </Box>

                            <Typography
                                sx={{
                                    fontSize: "1.6rem",
                                    fontWeight: 800,
                                    letterSpacing: "-0.8px",
                                    color: salon.text
                                }}
                            >
                                Changer le mot de passe
                            </Typography>

                            <Chip
                                label="Sécurité"
                                size="small"
                                sx={{
                                    mt: 1,
                                    backgroundColor: salon.accentLight,
                                    color: salon.accent,
                                    fontWeight: 600,
                                    fontSize: "0.65rem",
                                    height: 24,
                                    letterSpacing: "0.5px"
                                }}
                            />
                        </Box>

                        {/* Message */}
                        <Box sx={{ mb: 4 }}>
                            <Typography
                                sx={{
                                    fontSize: "0.95rem",
                                    fontWeight: 400,
                                    color: salon.textSecondary,
                                    textAlign: "center",
                                    lineHeight: 1.6
                                }}
                            >
                                Vous devez changer le mot de passe fourni par votre administrateur avant de continuer.
                            </Typography>
                            <Box
                                sx={{
                                    mt: 2,
                                    height: "3px",
                                    width: "40px",
                                    margin: "0 auto",
                                    background: salon.gradient,
                                    borderRadius: "2px"
                                }}
                            />
                        </Box>

                        {/* Form */}
                        <Box component="form" onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="Nouveau mot de passe"
                                type={showNewPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                onFocus={() => setNewPasswordFocused(true)}
                                onBlur={() => setNewPasswordFocused(false)}
                                margin="normal"
                                required
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                edge="end"
                                                sx={{ color: salon.textSecondary }}
                                            >
                                                {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: "14px",
                                        backgroundColor: "#FAF9F7",
                                        transition: "all 0.3s ease",
                                        "& fieldset": {
                                            borderColor: salon.border,
                                            borderWidth: "1.5px"
                                        },
                                        "&:hover fieldset": {
                                            borderColor: salon.accent
                                        },
                                        "&.Mui-focused fieldset": {
                                            borderColor: salon.accent,
                                            borderWidth: "2px",
                                            boxShadow: "0 0 0 4px rgba(183, 110, 121, 0.08)"
                                        }
                                    },
                                    "& .MuiInputLabel-root": {
                                        color: salon.textSecondary,
                                        "&.Mui-focused": {
                                            color: salon.accent
                                        }
                                    }
                                }}
                            />

                            {/* Password strength indicator */}
                            {newPassword.length > 0 && (
                                <Box sx={{ mt: 1.5 }}>
                                    <Box sx={{ display: "flex", gap: 0.8 }}>
                                        {[...Array(4)].map((_, index) => (
                                            <Box
                                                key={index}
                                                sx={{
                                                    flex: 1,
                                                    height: 4,
                                                    borderRadius: "4px",
                                                    background: index < strength
                                                        ? index < 2
                                                            ? "#f5576c"
                                                            : index < 3
                                                                ? "#f093fb"
                                                                : "#43e97b"
                                                        : salon.border,
                                                    transition: "background 0.3s ease"
                                                }}
                                            />
                                        ))}
                                    </Box>
                                    <Typography
                                        sx={{
                                            fontSize: "0.6rem",
                                            color: strength >= 3 ? "#43e97b" : strength >= 2 ? "#f093fb" : "#f5576c",
                                            mt: 0.5,
                                            fontWeight: 600
                                        }}
                                    >
                                        {strength >= 3 ? "✅ Mot de passe fort" : strength >= 2 ? "⚠️ Moyen" : "❌ Faible"}
                                    </Typography>
                                </Box>
                            )}

                            <TextField
                                fullWidth
                                label="Confirmer le mot de passe"
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                onFocus={() => setConfirmPasswordFocused(true)}
                                onBlur={() => setConfirmPasswordFocused(false)}
                                margin="normal"
                                required
                                sx={{
                                    mt: 2,
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: "14px",
                                        backgroundColor: "#FAF9F7",
                                        transition: "all 0.3s ease",
                                        "& fieldset": {
                                            borderColor: salon.border,
                                            borderWidth: "1.5px"
                                        },
                                        "&:hover fieldset": {
                                            borderColor: salon.accent
                                        },
                                        "&.Mui-focused fieldset": {
                                            borderColor: salon.accent,
                                            borderWidth: "2px",
                                            boxShadow: "0 0 0 4px rgba(183, 110, 121, 0.08)"
                                        }
                                    },
                                    "& .MuiInputLabel-root": {
                                        color: salon.textSecondary,
                                        "&.Mui-focused": {
                                            color: salon.accent
                                        }
                                    }
                                }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                edge="end"
                                                sx={{ color: salon.textSecondary }}
                                            >
                                                {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />

                            {/* Match indicator */}
                            {confirmPassword.length > 0 && newPassword.length > 0 && (
                                <Box sx={{ mt: 1 }}>
                                    <Typography
                                        sx={{
                                            fontSize: "0.6rem",
                                            color: newPassword === confirmPassword ? "#43e97b" : "#f5576c",
                                            fontWeight: 600,
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 0.5
                                        }}
                                    >
                                        {newPassword === confirmPassword ? (
                                            <>
                                                <CheckCircleIcon sx={{ fontSize: 14 }} />
                                                Les mots de passe correspondent
                                            </>
                                        ) : (
                                            "❌ Les mots de passe ne correspondent pas"
                                        )}
                                    </Typography>
                                </Box>
                            )}

                            {error && (
                                <Typography
                                    color="error"
                                    sx={{ mt: 2, fontSize: "0.85rem" }}
                                >
                                    {error}
                                </Typography>
                            )}

                            <Button
                                fullWidth
                                variant="contained"
                                type="submit"
                                disabled={loading}
                                sx={{
                                    mt: 3.5,
                                    height: 52,
                                    borderRadius: "14px",
                                    background: salon.gradient,
                                    color: "#fff",
                                    textTransform: "none",
                                    fontSize: "1rem",
                                    fontWeight: 700,
                                    boxShadow: "0 8px 24px rgba(183, 110, 121, 0.3)",
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                        transform: "translateY(-2px)",
                                        boxShadow: "0 12px 32px rgba(183, 110, 121, 0.45)",
                                        background: "linear-gradient(135deg, #A05E68 0%, #B76E79 100%)"
                                    },
                                    "&:disabled": {
                                        background: "#d1d1d1",
                                        boxShadow: "none"
                                    }
                                }}
                            >
                                {loading ? "Enregistrement..." : "Changer le mot de passe"}
                            </Button>
                        </Box>

                        {/* Footer */}
                        <Box sx={{ mt: 4, textAlign: "center" }}>
                            <Typography
                                sx={{
                                    fontSize: "0.7rem",
                                    color: "#b5b5b5",
                                    fontWeight: 400,
                                    letterSpacing: "0.3px"
                                }}
                            >
                                © 2026 BeautyCloud · Sécurité
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Fade>

            <style>
                {`
                    @keyframes flowerFloat {
                        0%, 100% {
                            transform: translate(0, 0) rotate(0deg) scale(1);
                            opacity: 0.15;
                        }
                        33% {
                            transform: translate(30px, -20px) rotate(120deg) scale(1.1);
                            opacity: 0.28;
                        }
                        66% {
                            transform: translate(-20px, 15px) rotate(240deg) scale(0.9);
                            opacity: 0.2;
                        }
                    }

                    @keyframes confettiFall {
                        0% {
                            transform: translateY(0) rotate(0deg) scale(1);
                            opacity: 0.6;
                        }
                        25% {
                            transform: translateY(25vh) rotate(180deg) scale(1.1);
                            opacity: 0.8;
                        }
                        50% {
                            transform: translateY(50vh) rotate(360deg) scale(0.9);
                            opacity: 0.6;
                        }
                        75% {
                            transform: translateY(75vh) rotate(540deg) scale(1.05);
                            opacity: 0.8;
                        }
                        100% {
                            transform: translateY(100vh) rotate(720deg) scale(1);
                            opacity: 0.3;
                        }
                    }
                `}
            </style>
        </Box>
    );
}