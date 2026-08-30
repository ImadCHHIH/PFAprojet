import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    TextField,
    Typography,
    InputAdornment,
    IconButton,
    Chip,
    Fade,
    Stack
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import SpaIcon from "@mui/icons-material/Spa";

import { login } from "../../services/authService";

export default function LoginPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);

    const handleLogin = async () => {
        setIsLoading(true);
        try {
            const response = await login(email, password);
            localStorage.setItem("token", response.token);
            navigate("/dashboard", { replace: true });
        } catch (error) {
            console.error(error);
            alert("Email ou mot de passe incorrect");
        } finally {
            setIsLoading(false);
        }
    };

    const blue = {
        main: "#2563eb",
        light: "#3b82f6",
        dark: "#1d4ed8",
        darker: "#1e3a8a",
        bg: "rgba(37, 99, 235, 0.08)",
        bgHover: "rgba(37, 99, 235, 0.15)",
        border: "rgba(37, 99, 235, 0.2)",
        gradient: "linear-gradient(135deg, #2563eb 0%, #60a5fa 100%)",
        gradientHover: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)",
        text: "#1e293b",
        textLight: "#64748b"
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: "linear-gradient(160deg, #f0f5ff 0%, #e3ecfa 50%, #d6e3f5 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: 2,
                position: "relative",
                overflow: "hidden"
            }}
        >
            {/* ============ FOND ANIMÉ "BEAUTY SALON" - VERSION VISIBLE ============ */}

            {/* 1. Pétales de fleurs - Bleu plus foncé */}
            {[...Array(16)].map((_, i) => {
                const size = 20 + Math.random() * 35;
                const delay = Math.random() * 12;
                const duration = 14 + Math.random() * 18;
                const xStart = Math.random() * 100;
                const rotate = Math.random() * 360;
                const opacity = 0.25 + Math.random() * 0.3;

                return (
                    <Box
                        key={`petal-${i}`}
                        sx={{
                            position: "absolute",
                            width: size,
                            height: size * 1.5,
                            borderRadius: "50% 0 50% 50%",
                            background: `radial-gradient(ellipse at center, rgba(30, 58, 138, ${opacity}) 0%, rgba(37, 99, 235, ${opacity * 0.7}) 40%, transparent 100%)`,
                            left: `${xStart}%`,
                            top: "-40px",
                            transform: `rotate(${rotate}deg)`,
                            animation: `petalFloat ${duration}s ease-in-out infinite`,
                            animationDelay: `${delay}s`,
                            pointerEvents: "none",
                            zIndex: 0,
                            boxShadow: `0 4px 20px rgba(30,58,138,0.1)`
                        }}
                    />
                );
            })}

            {/* 2. Fleurs stylisées - Bleu plus foncé */}
            {[...Array(8)].map((_, i) => {
                const size = 55 + Math.random() * 60;
                const delay = i * 2 + Math.random() * 4;
                const duration = 20 + Math.random() * 14;
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
                            opacity: 0.2 + Math.random() * 0.2
                        }}
                    >
                        {/* Pétales de la fleur */}
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
                                        background: `radial-gradient(ellipse at center, rgba(30, 58, 138, 0.5) 0%, rgba(37, 99, 235, 0.25) 50%, transparent 100%)`,
                                        left: "50%",
                                        top: "50%",
                                        transform: `translate(-50%, -50%) rotate(${angle}rad) translateY(-${size * 0.35}px) rotate(${45 + j * 20}deg)`,
                                        transformOrigin: "center center",
                                        boxShadow: `0 2px 16px rgba(30,58,138,0.08)`
                                    }}
                                />
                            );
                        })}
                        {/* Centre de la fleur */}
                        <Box
                            sx={{
                                position: "absolute",
                                width: size * 0.22,
                                height: size * 0.22,
                                borderRadius: "50%",
                                background: `radial-gradient(circle, rgba(30, 58, 138, 0.6) 0%, rgba(37, 99, 235, 0.3) 100%)`,
                                left: "50%",
                                top: "50%",
                                transform: "translate(-50%, -50%)",
                                boxShadow: `0 0 40px rgba(30,58,138,0.15)`
                            }}
                        />
                    </Box>
                );
            })}

            {/* 3. Bulles d'eau - Bleu plus foncé */}
            {[...Array(14)].map((_, i) => {
                const size = 18 + Math.random() * 45;
                const delay = Math.random() * 10;
                const duration = 12 + Math.random() * 15;
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
                            background: `radial-gradient(circle at 30% 30%, rgba(30, 58, 138, 0.2) 0%, rgba(37, 99, 235, 0.08) 60%, transparent 100%)`,
                            border: `2px solid rgba(30, 58, 138, ${0.1 + Math.random() * 0.12})`,
                            left: `${xPos}%`,
                            top: `${yPos}%`,
                            animation: `bubbleFloat ${duration}s ease-in-out infinite`,
                            animationDelay: `${delay}s`,
                            pointerEvents: "none",
                            zIndex: 0,
                            boxShadow: `inset 0 -4px 20px rgba(30,58,138,0.08)`
                        }}
                    />
                );
            })}

            {/* 4. Formes organiques - Bleu plus foncé */}
            {[...Array(7)].map((_, i) => {
                const size = 90 + Math.random() * 140;
                const delay = i * 3 + Math.random() * 4;
                const duration = 22 + Math.random() * 15;
                const xPos = 5 + Math.random() * 90;
                const yPos = 5 + Math.random() * 90;
                const rotation = Math.random() * 360;

                return (
                    <Box
                        key={`blob-${i}`}
                        sx={{
                            position: "absolute",
                            width: size,
                            height: size,
                            borderRadius: "50% 50% 35% 65% / 45% 40% 60% 55%",
                            background: `radial-gradient(circle, rgba(30, 58, 138, ${0.08 + Math.random() * 0.08}) 0%, transparent 70%)`,
                            border: `2px solid rgba(30, 58, 138, ${0.05 + Math.random() * 0.06})`,
                            left: `${xPos}%`,
                            top: `${yPos}%`,
                            transform: `rotate(${rotation}deg)`,
                            animation: `blobFloat ${duration}s ease-in-out infinite`,
                            animationDelay: `${delay}s`,
                            pointerEvents: "none",
                            zIndex: 0,
                            boxShadow: `0 8px 40px rgba(30,58,138,0.05)`
                        }}
                    />
                );
            })}

            {/* 5. Ondes lumineuses - Bleu plus foncé */}
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "800px",
                    height: "800px",
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(30, 58, 138, 0.08) 0%, rgba(37, 99, 235, 0.04) 40%, transparent 70%)",
                    animation: "glowPulse 6s ease-in-out infinite",
                    pointerEvents: "none",
                    zIndex: 0
                }}
            />
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "550px",
                    height: "550px",
                    borderRadius: "50%",
                    border: "2px solid rgba(30, 58, 138, 0.06)",
                    animation: "rippleExpand 8s ease-in-out infinite",
                    pointerEvents: "none",
                    zIndex: 0
                }}
            />
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "380px",
                    height: "380px",
                    borderRadius: "50%",
                    border: "2px solid rgba(30, 58, 138, 0.05)",
                    animation: "rippleExpand 10s ease-in-out infinite reverse",
                    pointerEvents: "none",
                    zIndex: 0
                }}
            />

            {/* 6. Vagues - Bleu plus foncé */}
            <Box
                sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "280px",
                    background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%231e3a8a' fill-opacity='0.08' d='M0,192L48,176C96,160,192,128,288,138.7C384,149,480,203,576,213.3C672,224,768,192,864,181.3C960,171,1056,181,1152,197.3C1248,213,1344,235,1392,245.3L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'/%3E%3C/svg%3E")`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    opacity: 0.8,
                    pointerEvents: "none",
                    zIndex: 0
                }}
            />
            <Box
                sx={{
                    position: "absolute",
                    bottom: -20,
                    left: 0,
                    right: 0,
                    height: "220px",
                    background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%232563eb' fill-opacity='0.06' d='M0,224L48,208C96,192,192,160,288,170.7C384,181,480,235,576,245.3C672,256,768,224,864,213.3C960,203,1056,213,1152,229.3C1248,245,1344,267,1392,277.3L1440,288L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'/%3E%3C/svg%3E")`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    opacity: 0.6,
                    pointerEvents: "none",
                    zIndex: 0
                }}
            />

            {/* 7. Particules lumineuses - Bleu plus foncé */}
            {[...Array(30)].map((_, i) => {
                const size = 2.5 + Math.random() * 5;
                const delay = Math.random() * 6;
                const duration = 5 + Math.random() * 7;
                const xPos = Math.random() * 100;
                const yPos = Math.random() * 100;

                return (
                    <Box
                        key={`sparkle-${i}`}
                        sx={{
                            position: "absolute",
                            width: size,
                            height: size,
                            borderRadius: "50%",
                            background: `radial-gradient(circle, rgba(30, 58, 138, ${0.15 + Math.random() * 0.2}) 0%, transparent 100%)`,
                            left: `${xPos}%`,
                            top: `${yPos}%`,
                            animation: `sparkleFloat ${duration}s ease-in-out infinite`,
                            animationDelay: `${delay}s`,
                            pointerEvents: "none",
                            zIndex: 0,
                            boxShadow: `0 0 ${size * 5}px rgba(30,58,138,0.12)`
                        }}
                    />
                );
            })}

            {/* ============ FIN DU FOND ANIMÉ ============ */}

            <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
                <Fade in timeout={800}>
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Card
                            elevation={0}
                            sx={{
                                width: "100%",
                                maxWidth: 480,
                                borderRadius: "32px",
                                background: "rgba(255,255,255,0.92)",
                                backdropFilter: "blur(24px)",
                                border: "1px solid rgba(255,255,255,0.6)",
                                boxShadow: "0 40px 90px rgba(37,99,235,0.06), 0 10px 30px rgba(0,0,0,0.03)",
                                transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                                "&:hover": {
                                    boxShadow: "0 60px 120px rgba(37,99,235,0.08)"
                                },
                                position: "relative",
                                overflow: "hidden",
                                "&::before": {
                                    content: '""',
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: "4px",
                                    background: blue.gradient,
                                    animation: "gradientMove 4s ease-in-out infinite"
                                }
                            }}
                        >
                            <CardContent
                                sx={{
                                    p: { xs: 3.5, sm: 5 },
                                    "&:last-child": { pb: { xs: 3.5, sm: 5 } }
                                }}
                            >
                                {/* Logo */}
                                <Box sx={{ textAlign: "center", mb: 4 }}>
                                    <Box
                                        sx={{
                                            width: 72,
                                            height: 72,
                                            mx: "auto",
                                            mb: 2.5,
                                            borderRadius: "24px",
                                            background: blue.gradient,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            boxShadow: "0 16px 40px rgba(37,99,235,0.25)",
                                            transition: "transform 0.4s ease, box-shadow 0.4s ease",
                                            "&:hover": {
                                                transform: "scale(1.05) rotate(-4deg)",
                                                boxShadow: "0 20px 50px rgba(37,99,235,0.35)"
                                            }
                                        }}
                                    >
                                        <SpaIcon sx={{ color: "#fff", fontSize: "2.2rem" }} />
                                    </Box>

                                    <Typography
                                        sx={{
                                            fontSize: "2rem",
                                            fontWeight: 800,
                                            letterSpacing: "-0.8px",
                                            color: blue.main
                                        }}
                                    >
                                        BeautyCloud
                                    </Typography>

                                    <Chip
                                        label="Accès sécurisé"
                                        size="small"
                                        sx={{
                                            mt: 1.5,
                                            backgroundColor: blue.bg,
                                            color: blue.main,
                                            fontWeight: 600,
                                            fontSize: "0.65rem",
                                            height: 26,
                                            letterSpacing: "0.3px"
                                        }}
                                    />
                                </Box>

                                {/* Welcome */}
                                <Box sx={{ mb: 4 }}>
                                    <Typography
                                        sx={{
                                            fontSize: "1.4rem",
                                            fontWeight: 800,
                                            color: blue.text,
                                            letterSpacing: "-0.3px",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1
                                        }}
                                    >
                                        Content de vous revoir
                                    </Typography>
                                    <Typography
                                        sx={{
                                            mt: 0.5,
                                            fontSize: "0.9rem",
                                            color: blue.textLight,
                                            fontWeight: 400
                                        }}
                                    >
                                        Connectez-vous pour accéder à votre espace
                                    </Typography>
                                    <Box
                                        sx={{
                                            mt: 2.5,
                                            height: "4px",
                                            width: "48px",
                                            background: blue.gradient,
                                            borderRadius: "4px",
                                            animation: "pulseWidth 2s ease-in-out infinite"
                                        }}
                                    />
                                </Box>

                                {/* Formulaire */}
                                <Stack spacing={2.5}>
                                    <Box>
                                        <Typography
                                            sx={{
                                                fontSize: "0.75rem",
                                                fontWeight: 600,
                                                color: blue.textLight,
                                                mb: 0.8,
                                                letterSpacing: "0.5px"
                                            }}
                                        >
                                            ADRESSE EMAIL
                                        </Typography>
                                        <TextField
                                            placeholder="exemple@email.com"
                                            fullWidth
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            onFocus={() => setEmailFocused(true)}
                                            onBlur={() => setEmailFocused(false)}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <EmailOutlinedIcon
                                                            sx={{
                                                                color: emailFocused ? blue.main : "#9ca3af",
                                                                transition: "color 0.2s ease"
                                                            }}
                                                        />
                                                    </InputAdornment>
                                                )
                                            }}
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    borderRadius: "16px",
                                                    backgroundColor: "#f9fafb",
                                                    transition: "all 0.3s ease",
                                                    "& fieldset": {
                                                        borderColor: emailFocused ? blue.main : "#e5e7eb",
                                                        borderWidth: emailFocused ? "2px" : "1.5px"
                                                    },
                                                    "&:hover fieldset": {
                                                        borderColor: emailFocused ? blue.main : blue.main
                                                    },
                                                    "&.Mui-focused fieldset": {
                                                        borderColor: blue.main,
                                                        borderWidth: "2px",
                                                        boxShadow: "0 0 0 4px rgba(37,99,235,0.08)"
                                                    }
                                                },
                                                "& .MuiInputBase-input": {
                                                    fontSize: "0.95rem",
                                                    fontWeight: 500
                                                }
                                            }}
                                        />
                                    </Box>

                                    <Box>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                mb: 0.8
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontSize: "0.75rem",
                                                    fontWeight: 600,
                                                    color: blue.textLight,
                                                    letterSpacing: "0.5px"
                                                }}
                                            >
                                                MOT DE PASSE
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    fontSize: "0.7rem",
                                                    color: blue.main,
                                                    fontWeight: 600,
                                                    cursor: "pointer",
                                                    "&:hover": { color: blue.dark, textDecoration: "underline" }
                                                }}
                                            >
                                                Mot de passe oublié ?
                                            </Typography>
                                        </Box>
                                        <TextField
                                            placeholder="••••••••"
                                            type={showPassword ? "text" : "password"}
                                            fullWidth
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            onFocus={() => setPasswordFocused(true)}
                                            onBlur={() => setPasswordFocused(false)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") handleLogin();
                                            }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <LockOutlinedIcon
                                                            sx={{
                                                                color: passwordFocused ? blue.main : "#9ca3af",
                                                                transition: "color 0.2s ease"
                                                            }}
                                                        />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            edge="end"
                                                            sx={{
                                                                color: showPassword ? blue.main : "#9ca3af",
                                                                transition: "color 0.2s ease",
                                                                "&:hover": { color: blue.main }
                                                            }}
                                                        >
                                                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                )
                                            }}
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    borderRadius: "16px",
                                                    backgroundColor: "#f9fafb",
                                                    transition: "all 0.3s ease",
                                                    "& fieldset": {
                                                        borderColor: passwordFocused ? blue.main : "#e5e7eb",
                                                        borderWidth: passwordFocused ? "2px" : "1.5px"
                                                    },
                                                    "&:hover fieldset": {
                                                        borderColor: passwordFocused ? blue.main : blue.main
                                                    },
                                                    "&.Mui-focused fieldset": {
                                                        borderColor: blue.main,
                                                        borderWidth: "2px",
                                                        boxShadow: "0 0 0 4px rgba(37,99,235,0.08)"
                                                    }
                                                },
                                                "& .MuiInputBase-input": {
                                                    fontSize: "0.95rem",
                                                    fontWeight: 500
                                                }
                                            }}
                                        />
                                    </Box>

                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            pt: 0.5
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                                cursor: "pointer",
                                                "&:hover": {
                                                    "& .MuiTypography-root": { color: blue.main }
                                                }
                                            }}
                                            onClick={() => setRememberMe(!rememberMe)}
                                        >
                                            <Box
                                                sx={{
                                                    width: 20,
                                                    height: 20,
                                                    borderRadius: "6px",
                                                    border: "2px solid",
                                                    borderColor: rememberMe ? blue.main : "#d1d5db",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    backgroundColor: rememberMe ? blue.main : "transparent",
                                                    transition: "all 0.2s ease",
                                                    flexShrink: 0
                                                }}
                                            >
                                                {rememberMe && (
                                                    <CheckCircleOutlineRoundedIcon
                                                        sx={{
                                                            color: "#fff",
                                                            fontSize: 14
                                                        }}
                                                    />
                                                )}
                                            </Box>
                                            <Typography
                                                sx={{
                                                    fontSize: "0.8rem",
                                                    color: blue.textLight,
                                                    fontWeight: 500,
                                                    transition: "color 0.2s ease"
                                                }}
                                            >
                                                Se souvenir de moi
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Button
                                        variant="contained"
                                        fullWidth
                                        endIcon={!isLoading && <ArrowForwardIcon />}
                                        onClick={handleLogin}
                                        disabled={isLoading}
                                        sx={{
                                            height: 56,
                                            borderRadius: "16px",
                                            background: blue.gradient,
                                            color: "#fff",
                                            textTransform: "none",
                                            fontSize: "1rem",
                                            fontWeight: 700,
                                            boxShadow: "0 8px 32px rgba(37,99,235,0.25)",
                                            transition: "all 0.4s ease",
                                            position: "relative",
                                            overflow: "hidden",
                                            mt: 1,
                                            "&:hover": {
                                                transform: "translateY(-3px)",
                                                boxShadow: "0 16px 48px rgba(37,99,235,0.35)",
                                                background: blue.gradientHover
                                            },
                                            "&:active": {
                                                transform: "translateY(0px)"
                                            },
                                            "&.Mui-disabled": {
                                                background: "#d1d5db",
                                                boxShadow: "none"
                                            },
                                            "&::after": {
                                                content: '""',
                                                position: "absolute",
                                                top: "-50%",
                                                left: "-50%",
                                                width: "200%",
                                                height: "200%",
                                                background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%)",
                                                opacity: 0,
                                                transition: "opacity 0.6s ease",
                                                pointerEvents: "none"
                                            },
                                            "&:hover::after": {
                                                opacity: 1
                                            }
                                        }}
                                    >
                                        {isLoading ? (
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                                <Box
                                                    sx={{
                                                        width: 20,
                                                        height: 20,
                                                        borderRadius: "50%",
                                                        border: "3px solid rgba(255,255,255,0.2)",
                                                        borderTopColor: "#fff",
                                                        animation: "spin 0.8s linear infinite"
                                                    }}
                                                />
                                                Connexion...
                                            </Box>
                                        ) : (
                                            "Se connecter"
                                        )}
                                    </Button>
                                </Stack>

                                <Box sx={{ mt: 4, textAlign: "center" }}>
                                    <Typography
                                        sx={{
                                            fontSize: "0.7rem",
                                            color: "#9ca3af",
                                            fontWeight: 400,
                                            letterSpacing: "0.3px"
                                        }}
                                    >
                                        © 2026 BeautyCloud · Tous droits réservés
                                    </Typography>
                                    <Box sx={{ display: "flex", justifyContent: "center", gap: 2.5, mt: 1.5 }}>
                                        <Typography
                                            sx={{
                                                fontSize: "0.65rem",
                                                color: "#d1d5db",
                                                cursor: "pointer",
                                                fontWeight: 500,
                                                transition: "color 0.2s ease",
                                                "&:hover": { color: blue.main }
                                            }}
                                        >
                                            Confidentialité
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontSize: "0.65rem",
                                                color: "#d1d5db",
                                                cursor: "pointer",
                                                fontWeight: 500,
                                                transition: "color 0.2s ease",
                                                "&:hover": { color: blue.main }
                                            }}
                                        >
                                            Conditions
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontSize: "0.65rem",
                                                color: "#d1d5db",
                                                cursor: "pointer",
                                                fontWeight: 500,
                                                transition: "color 0.2s ease",
                                                "&:hover": { color: blue.main }
                                            }}
                                        >
                                            Support
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>
                </Fade>
            </Container>

            {/* ============ ANIMATIONS ============ */}
            <style>
                {`
                    @keyframes petalFloat {
                        0% {
                            transform: translateY(0) rotate(0deg) scale(1);
                            opacity: 0.25;
                        }
                        25% {
                            transform: translateY(25vh) rotate(90deg) scale(1.15);
                            opacity: 0.5;
                        }
                        50% {
                            transform: translateY(50vh) rotate(180deg) scale(0.85);
                            opacity: 0.25;
                        }
                        75% {
                            transform: translateY(75vh) rotate(270deg) scale(1.1);
                            opacity: 0.4;
                        }
                        100% {
                            transform: translateY(100vh) rotate(360deg) scale(1);
                            opacity: 0.1;
                        }
                    }

                    @keyframes flowerFloat {
                        0%, 100% {
                            transform: translate(0, 0) rotate(0deg) scale(1);
                            opacity: 0.2;
                        }
                        33% {
                            transform: translate(40px, -30px) rotate(120deg) scale(1.15);
                            opacity: 0.4;
                        }
                        66% {
                            transform: translate(-30px, 25px) rotate(240deg) scale(0.85);
                            opacity: 0.3;
                        }
                    }

                    @keyframes bubbleFloat {
                        0%, 100% {
                            transform: translate(0, 0) scale(1);
                            opacity: 0.4;
                        }
                        25% {
                            transform: translate(35px, -25px) scale(1.15);
                            opacity: 0.7;
                        }
                        50% {
                            transform: translate(-25px, -40px) scale(0.85);
                            opacity: 0.4;
                        }
                        75% {
                            transform: translate(25px, -15px) scale(1.05);
                            opacity: 0.6;
                        }
                    }

                    @keyframes blobFloat {
                        0%, 100% {
                            transform: translate(0, 0) rotate(0deg) scale(1);
                        }
                        33% {
                            transform: translate(45px, -30px) rotate(120deg) scale(1.1);
                        }
                        66% {
                            transform: translate(-35px, 25px) rotate(240deg) scale(0.9);
                        }
                    }

                    @keyframes glowPulse {
                        0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
                        50% { transform: translate(-50%, -50%) scale(1.15); opacity: 0.9; }
                    }

                    @keyframes rippleExpand {
                        0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.4; }
                        50% { transform: translate(-50%, -50%) scale(1.4); opacity: 0.08; }
                    }

                    @keyframes sparkleFloat {
                        0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.2; }
                        50% { transform: translate(20px, -15px) scale(1.8); opacity: 0.6; }
                    }

                    @keyframes pulseWidth {
                        0%, 100% { width: 48px; }
                        50% { width: 64px; }
                    }

                    @keyframes gradientMove {
                        0%, 100% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                    }

                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                `}
            </style>
        </Box>
    );
}