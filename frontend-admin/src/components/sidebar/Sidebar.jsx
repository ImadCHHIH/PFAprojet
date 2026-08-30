import {
    Box,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    Divider,
    Chip,
    Avatar,
    Tooltip,
    Fade
} from "@mui/material";

import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import SpaIcon from "@mui/icons-material/Spa";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { getMyProfile } from "../../services/profileService";

export default function Sidebar({ isExpanded = true, onClose }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const response = await getMyProfile();
                setUser(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        loadProfile();
    }, []);

    const menuItems = [
        { label: t("dashboard.menu"), path: "/dashboard", icon: <DashboardOutlinedIcon /> },
        { label: t("companies"), path: "/companies", icon: <BusinessOutlinedIcon /> },
        { label: t("Plans"), path: "/plans", icon: <SellOutlinedIcon /> },
        { label: t("subscriptions"), path: "/subscriptions", icon: <ReceiptLongOutlinedIcon /> },
        { label: t("users"), path: "/users", icon: <PeopleOutlineOutlinedIcon /> },
        { label: t("settings"), path: "/settings", icon: <SettingsOutlinedIcon /> }
    ];

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100vh",
                width: "100%",
                overflow: "hidden"
            }}
        >
            {/* Brand */}
            <Box
                sx={{
                    px: isExpanded ? 2.5 : 1.2,
                    py: isExpanded ? 2.5 : 1.8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: isExpanded ? "flex-start" : "center",
                    gap: 1.5,
                    minHeight: 72,
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                    flexShrink: 0
                }}
            >
                <Box
                    sx={{
                        width: 38,
                        height: 38,
                        minWidth: 38,
                        borderRadius: "10px",
                        background: "rgba(255,255,255,0.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#FFFFFF",
                        border: "1px solid rgba(255,255,255,0.06)"
                    }}
                >
                    <SpaIcon sx={{ fontSize: 18 }} />
                </Box>

                <Fade in={isExpanded} timeout={250}>
                    <Box sx={{ whiteSpace: "nowrap", overflow: "hidden" }}>
                        <Typography
                            sx={{
                                fontSize: "0.95rem",
                                fontWeight: 900,
                                letterSpacing: "-0.5px",
                                lineHeight: 1.1,
                                color: "#fff"
                            }}
                        >
                            BeautyCloud
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: "0.4rem",
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: "1.5px",
                                color: "#94a3b8",
                                opacity: 0.3,
                                mt: 0.1
                            }}
                        >
                            by Reachout
                        </Typography>
                    </Box>
                </Fade>
            </Box>

            {/* Navigation */}
            <Box
                sx={{
                    px: isExpanded ? 1.5 : 0.8,
                    py: 2,
                    flex: 1,
                    overflowY: "auto",
                    overflowX: "hidden"
                }}
            >
                {isExpanded && (
                    <Typography
                        sx={{
                            px: 1.5,
                            mb: 1.5,
                            fontSize: "0.5rem",
                            fontWeight: 800,
                            textTransform: "uppercase",
                            letterSpacing: "1.5px",
                            color: "#94a3b8",
                            opacity: 0.25
                        }}
                    >
                        Menu
                    </Typography>
                )}

                <List disablePadding sx={{ display: "flex", flexDirection: "column", gap: 0.3 }}>
                    {menuItems.map((item) => {
                        const isSelected = location.pathname === item.path;

                        const button = (
                            <ListItemButton
                                key={item.path}
                                component={Link}
                                to={item.path}
                                onClick={onClose}
                                selected={isSelected}
                                sx={{
                                    position: "relative",
                                    minHeight: 42,
                                    px: isExpanded ? 1.5 : 1.2,
                                    justifyContent: isExpanded ? "flex-start" : "center",
                                    borderRadius: "10px",
                                    color: isSelected ? "#fff" : "#94a3b8",
                                    transition: "all 0.2s ease",
                                    "& .MuiListItemIcon-root": {
                                        minWidth: isExpanded ? 34 : 38,
                                        justifyContent: "center",
                                        color: isSelected ? "#fff" : "rgba(255,255,255,0.12)",
                                        transition: "all 0.2s ease"
                                    },
                                    "& .MuiListItemText-primary": {
                                        fontSize: "0.78rem",
                                        fontWeight: isSelected ? 700 : 500,
                                        whiteSpace: "nowrap"
                                    },
                                    "&:hover": {
                                        backgroundColor: "rgba(255,255,255,0.06)",
                                        color: "#fff",
                                        "& .MuiListItemIcon-root": { color: "#fff" }
                                    },
                                    "&.Mui-selected": {
                                        backgroundColor: "rgba(255,255,255,0.08)",
                                        color: "#fff",
                                        "& .MuiListItemIcon-root": { color: "#fff" }
                                    },
                                    "&.Mui-selected::before": {
                                        content: '""',
                                        position: "absolute",
                                        left: 0,
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        width: 3,
                                        height: isExpanded ? 22 : 26,
                                        borderRadius: "0 4px 4px 0",
                                        background: "#60a5fa",
                                        boxShadow: "0 4px 16px rgba(96,165,250,0.3)"
                                    }
                                }}
                            >
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                {isExpanded && <ListItemText primary={item.label} />}
                            </ListItemButton>
                        );

                        return isExpanded ? (
                            button
                        ) : (
                            <Tooltip key={item.path} title={item.label} placement="right" arrow>
                                {button}
                            </Tooltip>
                        );
                    })}
                </List>
            </Box>

            {/* Bottom */}
            <Box
                sx={{
                    px: isExpanded ? 1.5 : 0.8,
                    pb: 2,
                    pt: 1,
                    borderTop: "1px solid rgba(255,255,255,0.04)",
                    flexShrink: 0
                }}
            >
                {/* Profil utilisateur */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: isExpanded ? "flex-start" : "center",
                        gap: 1.5,
                        p: isExpanded ? 1.2 : 0.8,
                        borderRadius: "10px",
                        backgroundColor: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.02)",
                        mb: 0.8,
                        transition: "all 0.2s ease",
                        "&:hover": { backgroundColor: "rgba(255,255,255,0.05)" }
                    }}
                >
                    <Tooltip title={user?.email || "Profil"} placement="right" arrow>
                        <Avatar
                            src={user?.profilePicture ? `http://localhost:8080${user.profilePicture}` : ""}
                            sx={{
                                width: 32,
                                height: 32,
                                minWidth: 32,
                                background: "rgba(255,255,255,0.06)",
                                color: "#fff",
                                fontSize: "0.65rem",
                                fontWeight: 700,
                                border: "1px solid rgba(255,255,255,0.06)"
                            }}
                        >
                            {!user?.profilePicture && `${user?.firstName?.[0] || "A"}${user?.lastName?.[0] || ""}`}
                        </Avatar>
                    </Tooltip>

                    <Fade in={isExpanded} timeout={250}>
                        <Box sx={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
                            <Typography
                                sx={{
                                    fontSize: "0.7rem",
                                    fontWeight: 700,
                                    color: "#fff",
                                    lineHeight: 1.2,
                                    whiteSpace: "nowrap"
                                }}
                            >
                                {user ? `${user.firstName} ${user.lastName}` : "Chargement..."}
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: "0.5rem",
                                    color: "#94a3b8",
                                    opacity: 0.4,
                                    whiteSpace: "nowrap"
                                }}
                            >
                                {user?.email}
                            </Typography>
                        </Box>
                    </Fade>

                    {isExpanded && (
                        <Chip
                            label="Admin"
                            size="small"
                            sx={{
                                height: 16,
                                backgroundColor: "rgba(96,165,250,0.1)",
                                color: "#60a5fa",
                                fontSize: "0.45rem",
                                fontWeight: 700,
                                textTransform: "uppercase"
                            }}
                        />
                    )}
                </Box>

                {/* Déconnexion */}
                <Tooltip title="Déconnexion" placement="right" arrow>
                    <ListItemButton
                        onClick={handleLogout}
                        sx={{
                            minHeight: 38,
                            px: isExpanded ? 1.5 : 1.2,
                            justifyContent: isExpanded ? "flex-start" : "center",
                            borderRadius: "10px",
                            color: "#94a3b8",
                            transition: "all 0.2s ease",
                            "& .MuiListItemIcon-root": {
                                minWidth: isExpanded ? 34 : 38,
                                justifyContent: "center",
                                color: "rgba(255,255,255,0.08)",
                                transition: "all 0.2s ease"
                            },
                            "&:hover": {
                                backgroundColor: "rgba(245,87,108,0.08)",
                                color: "#f5576c",
                                "& .MuiListItemIcon-root": { color: "#f5576c" }
                            }
                        }}
                    >
                        <ListItemIcon><LogoutOutlinedIcon sx={{ fontSize: 18 }} /></ListItemIcon>
                        {isExpanded && <ListItemText primary="Déconnexion" sx={{ "& .MuiTypography-root": { fontSize: "0.75rem", fontWeight: 600 } }} />}
                    </ListItemButton>
                </Tooltip>

                {/* Version */}
                {isExpanded && (
                    <Box
                        sx={{
                            mt: 1,
                            mx: 0.5,
                            p: 0.8,
                            borderRadius: "8px",
                            background: "rgba(255,255,255,0.02)",
                            border: "1px solid rgba(255,255,255,0.02)"
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <Typography sx={{ fontSize: "0.4rem", fontWeight: 700, color: "#94a3b8", opacity: 0.3 }}>
                                v2.4.0
                            </Typography>
                            <Chip
                                label="Prod"
                                size="small"
                                sx={{
                                    height: 12,
                                    backgroundColor: "rgba(67,233,123,0.06)",
                                    color: "#43e97b",
                                    fontSize: "0.35rem",
                                    fontWeight: 700,
                                    textTransform: "uppercase"
                                }}
                            />
                        </Box>
                    </Box>
                )}
            </Box>
        </Box>
    );
}