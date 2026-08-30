import {
    Box,
    Button,
    Card,
    CardContent,
    TextField,
    Typography,
    Fade,
    Chip
} from "@mui/material";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import SpaIcon from "@mui/icons-material/Spa";

export default function LoginPage() {

    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);

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

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            const data = await login(email, password);

            if (data.user.mustChangePassword) {
                navigate("/change-password");
                return;
            }

            navigate("/");
        } catch (error) {
            console.error("LOGIN ERROR:", error);
            setError(
                error.response?.data?.message ||
                error.message ||
                "Login failed."
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
            {/* ============ ANIMATED BEAUTY BACKGROUND ============ */}

            {/* 1. Flowers - Darker and more visible */}
            {[...Array(10)].map((_, i) => {
                const size = 45 + Math.random() * 55;
                const delay = i * 1.5 + Math.random() * 3;
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
                            opacity: 0.2 + Math.random() * 0.15
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
                                        background: `radial-gradient(ellipse at center, rgba(139, 90, 99, 0.5) 0%, rgba(183, 110, 121, 0.3) 50%, transparent 100%)`,
                                        left: "50%",
                                        top: "50%",
                                        transform: `translate(-50%, -50%) rotate(${angle}rad) translateY(-${size * 0.35}px) rotate(${45 + j * 20}deg)`,
                                        transformOrigin: "center center",
                                        boxShadow: `0 2px 16px rgba(139, 90, 99, 0.08)`
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
                                background: `radial-gradient(circle, rgba(139, 90, 99, 0.6) 0%, rgba(183, 110, 121, 0.3) 100%)`,
                                left: "50%",
                                top: "50%",
                                transform: "translate(-50%, -50%)",
                                boxShadow: `0 0 30px rgba(139, 90, 99, 0.12)`
                            }}
                        />
                    </Box>
                );
            })}

            {/* 2. Confetti - Darker and more visible */}
            {[...Array(40)].map((_, i) => {
                const width = 6 + Math.random() * 8;
                const height = 4 + Math.random() * 6;
                const delay = Math.random() * 12;
                const duration = 14 + Math.random() * 16;
                const xStart = Math.random() * 100;
                const rotation = Math.random() * 720;
                const colors = [
                    "rgba(139, 90, 99, 0.35)",
                    "rgba(183, 110, 121, 0.3)",
                    "rgba(212, 160, 168, 0.25)",
                    "rgba(160, 94, 104, 0.35)",
                    "rgba(200, 150, 158, 0.25)"
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
                            boxShadow: `0 2px 8px rgba(139, 90, 99, 0.05)`,
                            opacity: 0.7
                        }}
                    />
                );
            })}

            {/* 3. Additional floating petals - Darker */}
            {[...Array(15)].map((_, i) => {
                const size = 14 + Math.random() * 28;
                const delay = Math.random() * 14;
                const duration = 16 + Math.random() * 18;
                const xStart = Math.random() * 100;
                const rotate = Math.random() * 360;
                const opacity = 0.15 + Math.random() * 0.2;

                return (
                    <Box
                        key={`petal-${i}`}
                        sx={{
                            position: "absolute",
                            width: size,
                            height: size * 1.6,
                            borderRadius: "50% 0 50% 50%",
                            background: `radial-gradient(ellipse at center, rgba(139, 90, 99, ${opacity}) 0%, rgba(183, 110, 121, ${opacity * 0.7}) 40%, transparent 100%)`,
                            left: `${xStart}%`,
                            top: "-30px",
                            transform: `rotate(${rotate}deg)`,
                            animation: `petalFloat ${duration}s ease-in-out infinite`,
                            animationDelay: `${delay}s`,
                            pointerEvents: "none",
                            zIndex: 0,
                            boxShadow: `0 2px 12px rgba(139, 90, 99, 0.05)`
                        }}
                    />
                );
            })}

            {/* 4. Soft glowing circles */}
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "600px",
                    height: "600px",
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(183, 110, 121, 0.05) 0%, transparent 70%)",
                    animation: "glowPulse 8s ease-in-out infinite",
                    pointerEvents: "none",
                    zIndex: 0
                }}
            />

            {/* ============ END BACKGROUND ============ */}

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
                                    width: 64,
                                    height: 64,
                                    mx: "auto",
                                    mb: 2,
                                    borderRadius: "20px",
                                    background: salon.gradient,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow: "0 12px 32px rgba(183, 110, 121, 0.25)",
                                    transition: "transform 0.3s ease",
                                    "&:hover": {
                                        transform: "scale(1.05) rotate(-3deg)"
                                    }
                                }}
                            >
                                <SpaIcon sx={{ color: "#fff", fontSize: "2rem" }} />
                            </Box>

                            <Typography
                                sx={{
                                    fontSize: "1.8rem",
                                    fontWeight: 800,
                                    letterSpacing: "-0.8px",
                                    color: salon.text
                                }}
                            >
                                BeautyCloud
                            </Typography>

                            <Chip
                                label="Salon Access"
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

                        {/* Welcome */}
                        <Box sx={{ mb: 4 }}>
                            <Typography
                                sx={{
                                    fontSize: "1.3rem",
                                    fontWeight: 700,
                                    color: salon.text,
                                    letterSpacing: "-0.3px"
                                }}
                            >
                                Bienvenue
                            </Typography>
                            <Typography
                                sx={{
                                    mt: 0.5,
                                    fontSize: "0.9rem",
                                    color: salon.textSecondary
                                }}
                            >
                                Connectez-vous à votre espace salon
                            </Typography>
                            <Box
                                sx={{
                                    mt: 2,
                                    height: "3px",
                                    width: "40px",
                                    background: salon.gradient,
                                    borderRadius: "2px"
                                }}
                            />
                        </Box>

                        {/* Form */}
                        <Box component="form" onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onFocus={() => setEmailFocused(true)}
                                onBlur={() => setEmailFocused(false)}
                                margin="normal"
                                required
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

                            <TextField
                                fullWidth
                                label="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onFocus={() => setPasswordFocused(true)}
                                onBlur={() => setPasswordFocused(false)}
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
                            />

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
                                {loading ? "Connexion..." : "Se connecter"}
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
                                © 2026 BeautyCloud · Salon Platform
                            </Typography>
                            <Box sx={{ display: "flex", justifyContent: "center", gap: 2.5, mt: 1.5 }}>
                                <Typography
                                    sx={{
                                        fontSize: "0.6rem",
                                        color: "#d1d1d1",
                                        cursor: "pointer",
                                        fontWeight: 500,
                                        transition: "color 0.2s ease",
                                        "&:hover": { color: salon.accent }
                                    }}
                                >
                                    Confidentialité
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: "0.6rem",
                                        color: "#d1d1d1",
                                        cursor: "pointer",
                                        fontWeight: 500,
                                        transition: "color 0.2s ease",
                                        "&:hover": { color: salon.accent }
                                    }}
                                >
                                    Conditions
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: "0.6rem",
                                        color: "#d1d1d1",
                                        cursor: "pointer",
                                        fontWeight: 500,
                                        transition: "color 0.2s ease",
                                        "&:hover": { color: salon.accent }
                                    }}
                                >
                                    Support
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Fade>

            {/* ============ ANIMATIONS ============ */}
            <style>
                {`
                    @keyframes petalFloat {
                        0% {
                            transform: translateY(0) rotate(0deg) scale(1);
                            opacity: 0.15;
                        }
                        25% {
                            transform: translateY(25vh) rotate(90deg) scale(1.1);
                            opacity: 0.3;
                        }
                        50% {
                            transform: translateY(50vh) rotate(180deg) scale(0.9);
                            opacity: 0.15;
                        }
                        75% {
                            transform: translateY(75vh) rotate(270deg) scale(1.05);
                            opacity: 0.25;
                        }
                        100% {
                            transform: translateY(100vh) rotate(360deg) scale(1);
                            opacity: 0.05;
                        }
                    }

                    @keyframes flowerFloat {
                        0%, 100% {
                            transform: translate(0, 0) rotate(0deg) scale(1);
                            opacity: 0.2;
                        }
                        33% {
                            transform: translate(30px, -20px) rotate(120deg) scale(1.1);
                            opacity: 0.35;
                        }
                        66% {
                            transform: translate(-20px, 15px) rotate(240deg) scale(0.9);
                            opacity: 0.25;
                        }
                    }

                    @keyframes confettiFall {
                        0% {
                            transform: translateY(0) rotate(0deg) scale(1);
                            opacity: 0.7;
                        }
                        25% {
                            transform: translateY(25vh) rotate(180deg) scale(1.1);
                            opacity: 0.9;
                        }
                        50% {
                            transform: translateY(50vh) rotate(360deg) scale(0.9);
                            opacity: 0.7;
                        }
                        75% {
                            transform: translateY(75vh) rotate(540deg) scale(1.05);
                            opacity: 0.9;
                        }
                        100% {
                            transform: translateY(100vh) rotate(720deg) scale(1);
                            opacity: 0.3;
                        }
                    }

                    @keyframes glowPulse {
                        0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
                        50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.6; }
                    }
                `}
            </style>
        </Box>
    );
}