import {
    Box,
    Divider,
    Typography,
    Avatar,
    Tooltip
} from "@mui/material";

import {
    Dashboard,
    Person,
    Logout,
    Spa
} from "@mui/icons-material";

import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function UserLayout({ children }) {

    const { user, logout } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();

    const [isOpen, setIsOpen] = useState(false);

    const expandedWidth = 260;
    const collapsedWidth = 76;

    function handleLogout() {
        logout();
        navigate("/login");
    }

    const initials =
        `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`
            .toUpperCase();

    // Salon theme colors - same color as sidebar for background animation
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
        gradientDark: "linear-gradient(135deg, #8B5A63 0%, #B76E79 100%)",
        sidebarBg: "linear-gradient(180deg, #2C1810 0%, #1F110A 50%, #140B06 100%)",
        sidebarText: "#E8DDD6",
        sidebarTextLight: "#B8A89C",
        sidebarBorder: "rgba(232, 228, 222, 0.08)"
    };

    // Hover handlers
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
        setIsOpen(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        setIsOpen(false);
    };

    const isExpanded = isOpen || isHovered;
    const currentWidth = isExpanded ? expandedWidth : collapsedWidth;

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: "linear-gradient(160deg, #FAF9F7 0%, #F5F0EC 50%, #EDE6E1 100%)",
                position: "relative",
                overflow: "hidden"
            }}
        >
            {/* =====================================================
                ANIMATED BACKGROUND - SAME COLOR AS SIDEBAR
            ===================================================== */}

            {/* Glowing circles - same color as sidebar accent */}
            <Box
                sx={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 800,
                    height: 800,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(183, 110, 121, 0.06) 0%, transparent 70%)",
                    animation: "glowPulseBg 8s ease-in-out infinite",
                    pointerEvents: "none",
                    zIndex: 0
                }}
            />

            {/* Flowers - matching sidebar dark brown color */}
            {[...Array(8)].map((_, i) => {
                const size = 40 + Math.random() * 55;
                const delay = i * 1.8 + Math.random() * 3;
                const duration = 22 + Math.random() * 14;
                const xPos = 5 + Math.random() * 90;
                const yPos = 5 + Math.random() * 90;

                return (
                    <Box
                        key={`flower-${i}`}
                        sx={{
                            position: "fixed",
                            width: size,
                            height: size,
                            left: `${xPos}%`,
                            top: `${yPos}%`,
                            animation: `flowerFloatBg ${duration}s ease-in-out infinite`,
                            animationDelay: `${delay}s`,
                            pointerEvents: "none",
                            zIndex: 0,
                            opacity: 0.12 + Math.random() * 0.08
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
                                        background: `radial-gradient(ellipse at center, rgba(44, 24, 16, 0.25) 0%, rgba(31, 17, 10, 0.12) 50%, transparent 100%)`,
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
                                background: `radial-gradient(circle, rgba(44, 24, 16, 0.3) 0%, rgba(31, 17, 10, 0.1) 100%)`,
                                left: "50%",
                                top: "50%",
                                transform: "translate(-50%, -50%)"
                            }}
                        />
                    </Box>
                );
            })}

            {/* Confetti - matching sidebar dark brown color */}
            {[...Array(30)].map((_, i) => {
                const width = 5 + Math.random() * 8;
                const height = 3 + Math.random() * 6;
                const delay = Math.random() * 12;
                const duration = 14 + Math.random() * 16;
                const xStart = Math.random() * 100;
                const rotation = Math.random() * 720;
                const colors = [
                    "rgba(44, 24, 16, 0.2)",
                    "rgba(31, 17, 10, 0.15)",
                    "rgba(20, 11, 6, 0.2)",
                    "rgba(44, 24, 16, 0.15)",
                    "rgba(31, 17, 10, 0.2)"
                ];
                const color = colors[Math.floor(Math.random() * colors.length)];
                const shape = Math.random() > 0.5 ? "50% 0 50% 50%" : "0 50% 50% 50%";

                return (
                    <Box
                        key={`confetti-${i}`}
                        sx={{
                            position: "fixed",
                            width: width,
                            height: height,
                            borderRadius: shape,
                            background: color,
                            left: `${xStart}%`,
                            top: "-20px",
                            transform: `rotate(${rotation}deg)`,
                            animation: `confettiFallBg ${duration}s ease-in-out infinite`,
                            animationDelay: `${delay}s`,
                            pointerEvents: "none",
                            zIndex: 0,
                            opacity: 0.5
                        }}
                    />
                );
            })}

            {/* =====================================================
                SIDEBAR - DARK THEME
            ===================================================== */}

            <Box
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                sx={{
                    position: "fixed",
                    top: 0,
                    left: 0,

                    width: currentWidth,
                    height: "100vh",

                    zIndex: 1300,

                    background: salon.sidebarBg,

                    borderRight: `1px solid ${salon.sidebarBorder}`,

                    boxShadow: "4px 0 40px rgba(0,0,0,0.4)",

                    transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",

                    overflow: "hidden",

                    display: { xs: "none", md: "block" }
                }}
            >
                {/* Indicateur de survol */}
                <Box
                    sx={{
                        position: "absolute",
                        right: -3,
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: 3,
                        height: isExpanded ? 60 : 32,
                        borderRadius: "0 4px 4px 0",
                        background: isExpanded ? salon.accent : "rgba(183,110,121,0.15)",
                        transition: "all 0.3s ease",
                        boxShadow: isExpanded ? `0 0 20px ${salon.accent}30` : "none"
                    }}
                />

                <Box
                    sx={{
                        width: "100%",
                        height: "100%",
                        boxSizing: "border-box",

                        display: "flex",
                        flexDirection: "column",

                        px: isExpanded ? 2.5 : 1.5,

                        transition: "padding 0.3s ease"
                    }}
                >

                    {/* =================================================
                        LOGO
                    ================================================= */}

                    <Box
                        sx={{
                            height: 78,

                            display: "flex",
                            alignItems: "center",

                            justifyContent: isExpanded ? "flex-start" : "center",

                            gap: 1.5,

                            flexShrink: 0,

                            transition: "all 0.3s ease"
                        }}
                    >

                        <Box
                            sx={{
                                width: 38,
                                height: 38,
                                minWidth: 38,

                                borderRadius: "12px",

                                background: salon.gradient,

                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",

                                boxShadow: "0 4px 16px rgba(183,110,121,0.25)"
                            }}
                        >
                            <Spa sx={{ color: "#fff", fontSize: 21 }} />
                        </Box>

                        {/* Logo text */}
                        <Box
                            sx={{
                                opacity: isExpanded ? 1 : 0,

                                width: isExpanded ? "auto" : 0,

                                overflow: "hidden",

                                whiteSpace: "nowrap",

                                transition: "opacity 0.2s ease, width 0.3s ease"
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: "1rem",
                                    fontWeight: 800,
                                    color: salon.sidebarText,
                                    letterSpacing: "-0.5px",
                                    lineHeight: 1.2
                                }}
                            >
                                BeautyCloud
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: "0.5rem",
                                    fontWeight: 600,
                                    color: salon.sidebarTextLight,
                                    textTransform: "uppercase",
                                    letterSpacing: "1.2px",
                                    opacity: 0.5
                                }}
                            >
                                Salon Management
                            </Typography>
                        </Box>

                    </Box>

                    {/* =================================================
                        USER PROFILE
                    ================================================= */}

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",

                            justifyContent: isExpanded ? "flex-start" : "center",

                            gap: 1.5,

                            p: isExpanded ? 1.5 : 0.75,

                            mb: 2.5,

                            borderRadius: "14px",

                            background: "rgba(255,255,255,0.04)",

                            border: "1px solid rgba(255,255,255,0.04)",

                            transition: "all 0.3s ease",

                            minHeight: 56,

                            boxSizing: "border-box",

                            "&:hover": {
                                background: "rgba(255,255,255,0.06)"
                            }
                        }}
                    >

                        <Avatar
                            src={user?.profilePicture || undefined}
                            alt={`${user?.firstName || ""} ${user?.lastName || ""}`}
                            sx={{
                                width: 40,
                                height: 40,
                                minWidth: 40,

                                background: salon.gradient,

                                color: "#fff",

                                fontWeight: 700,

                                boxShadow: "0 4px 12px rgba(183,110,121,0.2)"
                            }}
                        >
                            {!user?.profilePicture && initials}
                        </Avatar>

                        {/* User information */}
                        <Box
                            sx={{
                                minWidth: 0,

                                overflow: "hidden",

                                opacity: isExpanded ? 1 : 0,

                                width: isExpanded ? "auto" : 0,

                                transition: "opacity 0.2s ease, width 0.3s ease",

                                whiteSpace: "nowrap"
                            }}
                        >
                            <Typography
                                sx={{
                                    fontWeight: 700,
                                    fontSize: "0.85rem",
                                    color: salon.sidebarText
                                }}
                            >
                                {user?.firstName} {user?.lastName}
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: "0.6rem",
                                    color: salon.sidebarTextLight,
                                    opacity: 0.5
                                }}
                            >
                                Administrateur
                            </Typography>
                        </Box>

                    </Box>

                    {/* =================================================
                        NAVIGATION
                    ================================================= */}

                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 0.7
                        }}
                    >

                        <Tooltip
                            title={!isExpanded ? "Tableau de bord" : ""}
                            placement="right"
                            arrow
                        >
                            <Box>
                                <UserNavItem
                                    icon={<Dashboard />}
                                    label="Tableau de bord"
                                    active={location.pathname === "/"}
                                    onClick={() => navigate("/")}
                                    salon={salon}
                                    isOpen={isExpanded}
                                />
                            </Box>
                        </Tooltip>

                        <Tooltip
                            title={!isExpanded ? "Mon profil" : ""}
                            placement="right"
                            arrow
                        >
                            <Box>
                                <UserNavItem
                                    icon={<Person />}
                                    label="Mon profil"
                                    active={location.pathname === "/profile"}
                                    onClick={() => navigate("/profile")}
                                    salon={salon}
                                    isOpen={isExpanded}
                                />
                            </Box>
                        </Tooltip>

                    </Box>

                    {/* Push logout to bottom */}
                    <Box sx={{ flex: 1 }} />

                    <Divider sx={{ mb: 2, borderColor: "rgba(255,255,255,0.04)" }} />

                    {/* =================================================
                        LOGOUT
                    ================================================= */}

                    <Tooltip
                        title={!isExpanded ? "Déconnexion" : ""}
                        placement="right"
                        arrow
                    >
                        <Box>
                            <UserNavItem
                                icon={<Logout />}
                                label="Déconnexion"
                                onClick={handleLogout}
                                danger
                                salon={salon}
                                isOpen={isExpanded}
                            />
                        </Box>
                    </Tooltip>

                    {/* Bottom spacing */}
                    <Box sx={{ height: 16 }} />

                </Box>
            </Box>

            {/* =====================================================
                MAIN CONTENT
            ===================================================== */}

            <Box
                component="main"
                sx={{
                    width: {
                        xs: "100%",
                        md: `calc(100% - ${currentWidth}px)`
                    },

                    ml: {
                        xs: 0,
                        md: `${currentWidth}px`
                    },

                    minHeight: "100vh",

                    p: {
                        xs: 2,
                        md: 4
                    },

                    boxSizing: "border-box",

                    transition: "margin-left 0.3s cubic-bezier(0.4,0,0.2,1), width 0.3s cubic-bezier(0.4,0,0.2,1)",

                    position: "relative",

                    zIndex: 1
                }}
            >
                {children}
            </Box>

            {/* =====================================================
                ANIMATIONS
            ===================================================== */}

            <style>
                {`
                    @keyframes glowPulseBg {
                        0%, 100% {
                            transform: translate(-50%, -50%) scale(1);
                            opacity: 0.3;
                        }

                        50% {
                            transform: translate(-50%, -50%) scale(1.1);
                            opacity: 0.6;
                        }
                    }

                    @keyframes flowerFloatBg {
                        0%, 100% {
                            transform: translate(0, 0) rotate(0deg) scale(1);
                            opacity: 0.12;
                        }
                        33% {
                            transform: translate(30px, -20px) rotate(120deg) scale(1.1);
                            opacity: 0.2;
                        }
                        66% {
                            transform: translate(-20px, 15px) rotate(240deg) scale(0.9);
                            opacity: 0.15;
                        }
                    }

                    @keyframes confettiFallBg {
                        0% {
                            transform: translateY(0) rotate(0deg) scale(1);
                            opacity: 0.5;
                        }
                        25% {
                            transform: translateY(25vh) rotate(180deg) scale(1.1);
                            opacity: 0.7;
                        }
                        50% {
                            transform: translateY(50vh) rotate(360deg) scale(0.9);
                            opacity: 0.5;
                        }
                        75% {
                            transform: translateY(75vh) rotate(540deg) scale(1.05);
                            opacity: 0.7;
                        }
                        100% {
                            transform: translateY(100vh) rotate(720deg) scale(1);
                            opacity: 0.2;
                        }
                    }
                `}
            </style>

        </Box>
    );
}

// =============================================================
// NAV ITEM
// =============================================================

function UserNavItem({
    icon,
    label,
    active,
    onClick,
    danger,
    salon,
    isOpen
}) {
    return (
        <Box
            onClick={onClick}
            sx={{
                display: "flex",
                alignItems: "center",

                justifyContent: isOpen ? "flex-start" : "center",

                gap: 1.8,

                px: isOpen ? 1.8 : 0,

                py: 1.25,

                minHeight: 44,

                borderRadius: "12px",

                cursor: "pointer",

                transition: "all 0.25s ease",

                backgroundColor: active ? "rgba(255,255,255,0.06)" : "transparent",

                color: danger
                    ? "#f5576c"
                    : active
                        ? salon.sidebarText
                        : salon.sidebarTextLight,

                "&:hover": {
                    backgroundColor: danger
                        ? "rgba(245,87,108,0.08)"
                        : active
                            ? "rgba(255,255,255,0.08)"
                            : "rgba(255,255,255,0.04)"
                },

                "& svg": {
                    fontSize: 21,

                    minWidth: 21
                }
            }}
        >

            {icon}

            {/* Label */}
            <Typography
                sx={{
                    fontWeight: active ? 700 : 500,

                    fontSize: "0.85rem",

                    color: danger
                        ? "#f5576c"
                        : active
                            ? salon.sidebarText
                            : salon.sidebarTextLight,

                    whiteSpace: "nowrap",

                    opacity: isOpen ? 1 : 0,

                    width: isOpen ? "auto" : 0,

                    overflow: "hidden",

                    transition: "opacity 0.2s ease, width 0.3s ease"
                }}
            >
                {label}
            </Typography>

        </Box>
    );
}