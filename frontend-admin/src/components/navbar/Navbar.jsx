import {
    Box,
    Typography,
    Avatar,
    IconButton,
    Badge,
    Button,
    Menu,
    MenuItem,
    Divider,
    Chip,
    Fade
} from "@mui/material";

import {
    getNotifications,
    markAsRead,
    markAllAsRead
} from "../../services/notificationService";

import { useEffect, useState } from "react";
import { getMyProfile } from "../../services/profileService";

import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";

import { useNavigate } from "react-router-dom";

export default function Navbar({ showToggle = true }) {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [profileAnchorEl, setProfileAnchorEl] = useState(null);

    const open = Boolean(anchorEl);
    const profileOpen = Boolean(profileAnchorEl);

    const blue = {
        main: "#2563eb",
        light: "#3b82f6",
        lighter: "#60a5fa",
        dark: "#1d4ed8",
        darker: "#1e3a8a",
        gradient: "linear-gradient(135deg, #2563eb 0%, #60a5fa 100%)",
        text: "#e8edf5",
        textLight: "#94a3b8",
        textDark: "#1e293b"
    };

    const loadProfile = async () => {
        try {
            const response = await getMyProfile();
            setUser(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const loadNotifications = async () => {
        try {
            const res = await getNotifications();
            setNotifications(res.data);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        loadProfile();
        loadNotifications();
        const interval = setInterval(() => loadNotifications(), 5000);
        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
    };

    const unreadCount = notifications.filter((n) => !n.read).length;

    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%", justifyContent: "flex-end" }}>
            <IconButton
                onClick={(e) => setAnchorEl(open ? null : e.currentTarget)}
                sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "12px",
                    color: blue.textLight,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.04)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                        background: "rgba(255,255,255,0.08)",
                        borderColor: "rgba(255,255,255,0.08)",
                        color: blue.text
                    }
                }}
            >
                <Badge
                    badgeContent={unreadCount}
                    max={99}
                    sx={{
                        "& .MuiBadge-badge": {
                            minWidth: 18,
                            height: 18,
                            px: 0.3,
                            borderRadius: "10px",
                            fontSize: "0.55rem",
                            fontWeight: 800,
                            background: "#f5576c",
                            color: "#fff",
                            border: "2px solid #0f2647",
                            boxShadow: "0 4px 16px rgba(245,87,108,0.4)"
                        }
                    }}
                >
                    <NotificationsNoneOutlinedIcon sx={{ fontSize: 20 }} />
                </Badge>
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}
                TransitionComponent={Fade}
                PaperProps={{
                    sx: {
                        mt: 1.5,
                        width: { xs: 320, sm: 380 },
                        maxWidth: "calc(100vw - 32px)",
                        maxHeight: 440,
                        borderRadius: "18px",
                        background: "rgba(9, 26, 51, 0.95)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(255,255,255,0.04)",
                        boxShadow: "0 30px 60px rgba(0,0,0,0.5)",
                        overflow: "hidden"
                    }
                }}
            >
                <Box
                    sx={{
                        px: 3,
                        py: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        background: "rgba(255,255,255,0.02)",
                        borderBottom: "1px solid rgba(255,255,255,0.03)"
                    }}
                >
                    <Box>
                        <Typography sx={{ fontSize: "0.55rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.4px", color: blue.textLight, opacity: 0.5 }}>
                            Notifications
                        </Typography>
                        <Typography sx={{ fontSize: "1rem", fontWeight: 800, color: "#fff" }}>
                            Vos alertes
                        </Typography>
                    </Box>
                    {unreadCount > 0 && (
                        <Chip
                            label={`${unreadCount} non lues`}
                            size="small"
                            sx={{
                                backgroundColor: "rgba(255,255,255,0.06)",
                                color: "#fff",
                                fontWeight: 700,
                                fontSize: "0.65rem",
                                height: 26
                            }}
                        />
                    )}
                </Box>

                {notifications.length === 0 ? (
                    <Box sx={{ px: 4, py: 5, textAlign: "center" }}>
                        <NotificationsNoneOutlinedIcon sx={{ fontSize: 40, color: "rgba(255,255,255,0.04)" }} />
                        <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: blue.text, mt: 1.5 }}>
                            Aucune notification
                        </Typography>
                        <Typography sx={{ mt: 0.5, fontSize: "0.7rem", color: blue.textLight, opacity: 0.4 }}>
                            Vous êtes à jour
                        </Typography>
                    </Box>
                ) : (
                    notifications.slice(0, 5).map((notification) => (
                        <MenuItem
                            key={notification.id}
                            onClick={async () => {
                                if (!notification.read) {
                                    await markAsRead(notification.id);
                                    await loadNotifications();
                                }
                                setAnchorEl(null);
                            }}
                            sx={{
                                px: 3,
                                py: 1.8,
                                whiteSpace: "normal",
                                alignItems: "flex-start",
                                borderBottom: "1px solid rgba(255,255,255,0.02)",
                                backgroundColor: notification.read ? "transparent" : "rgba(255,255,255,0.02)",
                                transition: "all 0.2s ease",
                                "&:hover": { backgroundColor: "rgba(255,255,255,0.04)" }
                            }}
                        >
                            <Box sx={{ display: "flex", width: "100%", gap: 1.5 }}>
                                <Box
                                    sx={{
                                        width: 8,
                                        height: 8,
                                        minWidth: 8,
                                        mt: 0.5,
                                        borderRadius: "50%",
                                        background: notification.read ? "rgba(255,255,255,0.1)" : "#f5576c",
                                        boxShadow: notification.read ? "none" : "0 4px 16px rgba(245,87,108,0.3)"
                                    }}
                                />
                                <Box sx={{ flex: 1 }}>
                                    <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: blue.text, mb: 0.2 }}>
                                        {notification.title}
                                    </Typography>
                                    <Typography sx={{ fontSize: "0.7rem", lineHeight: 1.5, color: blue.textLight, opacity: 0.6 }}>
                                        {notification.message}
                                    </Typography>
                                </Box>
                            </Box>
                        </MenuItem>
                    ))
                )}
            </Menu>

            <Box
                sx={{
                    ml: { xs: 0.5, sm: 1.5 },
                    mr: 1,
                    textAlign: "right",
                    display: { xs: "none", sm: "block" }
                }}
            >
                <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>
                    {user ? `${user.firstName} ${user.lastName}` : "Chargement..."}
                </Typography>
                <Typography sx={{ fontSize: "0.6rem", color: blue.textLight, opacity: 0.5, mt: 0.1 }}>
                    Administrateur
                </Typography>
            </Box>

            <IconButton
                onClick={(e) => setProfileAnchorEl(e.currentTarget)}
                sx={{
                    p: 0.3,
                    borderRadius: "50%",
                    border: "2px solid rgba(255,255,255,0.04)",
                    transition: "all 0.3s ease",
                    "&:hover": { transform: "scale(1.05)", borderColor: "rgba(255,255,255,0.12)" }
                }}
            >
                <Avatar
                    src={user?.profilePicture ? `http://localhost:8080${user.profilePicture}` : ""}
                    sx={{
                        width: 36,
                        height: 36,
                        background: "rgba(255,255,255,0.06)",
                        color: "#fff",
                        fontSize: "0.7rem",
                        fontWeight: 800,
                        border: "1px solid rgba(255,255,255,0.06)"
                    }}
                >
                    {!user?.profilePicture && `${user?.firstName?.[0] || "A"}${user?.lastName?.[0] || ""}`}
                </Avatar>
            </IconButton>

            <Menu
                anchorEl={profileAnchorEl}
                open={profileOpen}
                onClose={() => setProfileAnchorEl(null)}
                TransitionComponent={Fade}
                PaperProps={{
                    sx: {
                        mt: 1.5,
                        width: 220,
                        borderRadius: "16px",
                        background: "rgba(255,255,255,0.95)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(255,255,255,0.3)",
                        boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                        overflow: "hidden"
                    }
                }}
            >
                <Box
                    sx={{
                        px: 2.5,
                        py: 2,
                        background: blue.gradient,
                        color: "#fff",
                        textAlign: "center"
                    }}
                >
                    <Avatar
                        src={user?.profilePicture ? `http://localhost:8080${user.profilePicture}` : ""}
                        sx={{
                            width: 48,
                            height: 48,
                            margin: "0 auto 8px",
                            background: "rgba(255,255,255,0.15)",
                            color: "#fff",
                            fontSize: "1rem",
                            fontWeight: 800,
                            border: "2px solid rgba(255,255,255,0.15)"
                        }}
                    >
                        {!user?.profilePicture && `${user?.firstName?.[0] || "A"}${user?.lastName?.[0] || ""}`}
                    </Avatar>
                    <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "#fff" }}>
                        {user ? `${user.firstName} ${user.lastName}` : "Utilisateur"}
                    </Typography>
                    <Typography sx={{ fontSize: "0.65rem", opacity: 0.6, mt: 0.2, color: "#fff" }}>
                        {user?.email}
                    </Typography>
                </Box>

                <MenuItem
                    onClick={() => { setProfileAnchorEl(null); navigate("/profile"); }}
                    sx={{
                        py: 1.2,
                        px: 2.5,
                        gap: 2,
                        color: "#1e293b",
                        "&:hover": { backgroundColor: "rgba(37,99,235,0.06)" }
                    }}
                >
                    <PersonIcon sx={{ fontSize: 18, color: "#2563eb" }} />
                    <Typography sx={{ fontWeight: 600, fontSize: "0.8rem", color: "#1e293b" }}>
                        Mon Profil
                    </Typography>
                </MenuItem>

                <MenuItem
                    onClick={() => { setProfileAnchorEl(null); navigate("/settings"); }}
                    sx={{
                        py: 1.2,
                        px: 2.5,
                        gap: 2,
                        color: "#1e293b",
                        "&:hover": { backgroundColor: "rgba(37,99,235,0.06)" }
                    }}
                >
                    <SettingsIcon sx={{ fontSize: 18, color: "#2563eb" }} />
                    <Typography sx={{ fontWeight: 600, fontSize: "0.8rem", color: "#1e293b" }}>
                        Paramètres
                    </Typography>
                </MenuItem>

                <Divider sx={{ borderColor: "rgba(0,0,0,0.06)", my: 0.5 }} />

                <MenuItem
                    onClick={handleLogout}
                    sx={{
                        py: 1.2,
                        px: 2.5,
                        gap: 2,
                        color: "#f5576c",
                        "&:hover": { backgroundColor: "rgba(245,87,108,0.08)" }
                    }}
                >
                    <LogoutOutlinedIcon sx={{ fontSize: 18 }} />
                    <Typography sx={{ fontWeight: 700, fontSize: "0.8rem", color: "#f5576c" }}>
                        Déconnexion
                    </Typography>
                </MenuItem>
            </Menu>
        </Box>
    );
}