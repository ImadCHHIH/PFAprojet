import {
    Box,
    Divider,
    Typography,
    Avatar,
    Tooltip
} from "@mui/material";

import {
    Dashboard,
    CalendarToday,
    Groups,
    Inventory2,
    ArrowBack,
    DesignServices,
    LocalOffer,
    Spa,
    Person
} from "@mui/icons-material";

import {
    useNavigate,
    useLocation,
    useParams
} from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getCompanyTheme } from "../../utils/companyThemes";

export default function CompanyLayout({ children }) {

    const {
        companies,
        user
    } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();

    const { id } = useParams();

    const company = companies?.find(
        company => String(company.id) === String(id)
    );

    const [isOpen, setIsOpen] = useState(false);

    const expandedWidth = 260;
    const collapsedWidth = 76;

    const theme = getCompanyTheme(company?.id || 0);

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

    const companyLogo = company?.logo
        ? (
            company.logo.startsWith("http")
                ? company.logo
                : `http://localhost:8080${company.logo}`
        )
        : null;

    const userInitials =
        `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`
            .toUpperCase();

    if (!company) {
        return null;
    }

    const navItems = [
        { path: `/company/${id}`, label: "Tableau de bord", icon: <Dashboard /> },
        { path: `/company/${id}/appointments`, label: "Rendez-vous", icon: <CalendarToday /> },
        { path: `/company/${id}/team`, label: "Équipe", icon: <Groups /> },
        { path: `/company/${id}/services`, label: "Services", icon: <DesignServices /> },
        { path: `/company/${id}/promo-codes`, label: "Codes promo", icon: <LocalOffer /> },
        { path: `/company/${id}/stock`, label: "Stock", icon: <Inventory2 /> },
    ];

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                background: `linear-gradient(160deg, ${theme.lighter} 0%, ${theme.light} 50%, #FAF9F7 100%)`,
                position: "relative",
                overflow: "hidden"
            }}
        >
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

                    background: theme.sidebarBg,

                    borderRight: `1px solid rgba(255,255,255,0.04)`,

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
                        background: isExpanded ? theme.main : "rgba(183,110,121,0.15)",
                        transition: "all 0.3s ease",
                        boxShadow: isExpanded ? `0 0 20px ${theme.shadow}` : "none"
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
                        USER PROFILE (TOP)
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

                        <Avatar
                            src={user?.profilePicture || undefined}
                            alt={`${user?.firstName || ""} ${user?.lastName || ""}`}
                            sx={{
                                width: 38,
                                height: 38,
                                minWidth: 38,

                                borderRadius: "12px",

                                background: theme.gradient,

                                color: "#fff",

                                fontWeight: 700,

                                boxShadow: `0 4px 16px ${theme.shadow}`
                            }}
                        >
                            {!user?.profilePicture && userInitials}
                        </Avatar>

                        {/* User name */}
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
                                    color: theme.sidebarText,
                                    letterSpacing: "-0.5px",
                                    lineHeight: 1.2
                                }}
                            >
                                {user?.firstName} {user?.lastName}
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: "0.5rem",
                                    fontWeight: 600,
                                    color: theme.sidebarTextLight,
                                    textTransform: "uppercase",
                                    letterSpacing: "1.2px",
                                    opacity: 0.5
                                }}
                            >
                                Administrateur
                            </Typography>
                        </Box>

                    </Box>

                    {/* =================================================
                        COMPANY PROFILE
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
                            src={companyLogo || undefined}
                            alt={`${company.name} logo`}
                            imgProps={{
                                onError: (event) => {
                                    event.currentTarget.style.display = "none";
                                }
                            }}
                            sx={{
                                width: 40,
                                height: 40,
                                minWidth: 40,

                                background: companyLogo ? "#ffffff" : theme.gradient,

                                color: companyLogo ? theme.main : "#fff",

                                fontWeight: 700,

                                border: companyLogo ? `1px solid ${theme.border}30` : "none",

                                boxShadow: `0 4px 12px ${theme.shadow}`
                            }}
                        >
                            {!companyLogo && company.name?.[0]?.toUpperCase()}
                        </Avatar>

                        {/* Company information */}
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
                                    color: theme.sidebarText
                                }}
                            >
                                {company.name}
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: "0.6rem",
                                    color: theme.sidebarTextLight,
                                    opacity: 0.5
                                }}
                            >
                                {company.city || "Salon"}
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

                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Tooltip
                                    key={item.path}
                                    title={!isExpanded ? item.label : ""}
                                    placement="right"
                                    arrow
                                >
                                    <Box>
                                        <CompanyNavItem
                                            icon={item.icon}
                                            label={item.label}
                                            active={isActive}
                                            onClick={() => navigate(item.path)}
                                            theme={theme}
                                            isOpen={isExpanded}
                                        />
                                    </Box>
                                </Tooltip>
                            );
                        })}

                    </Box>

                    {/* Push to bottom */}
                    <Box sx={{ flex: 1 }} />

                    <Divider sx={{ mb: 2, borderColor: "rgba(255,255,255,0.04)" }} />

                    {/* =================================================
                        RETURN TO DASHBOARD
                    ================================================= */}

                    <Tooltip
                        title={!isExpanded ? "Retour" : ""}
                        placement="right"
                        arrow
                    >
                        <Box>
                            <CompanyNavItem
                                icon={<ArrowBack />}
                                label="Retour"
                                onClick={() => navigate("/")}
                                theme={theme}
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
        </Box>
    );
}

// =============================================================
// NAV ITEM
// =============================================================

function CompanyNavItem({
    icon,
    label,
    active,
    onClick,
    theme,
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

                backgroundColor: active ? theme.sidebarActive : "transparent",

                color: active ? theme.main : theme.sidebarTextLight,

                "&:hover": {
                    backgroundColor: active ? theme.sidebarActive : theme.sidebarHover,
                    color: active ? theme.main : theme.sidebarText
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

                    color: active ? theme.main : theme.sidebarTextLight,

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