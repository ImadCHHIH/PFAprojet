import { useState } from "react";

import {
    Box,
    Toolbar,
    IconButton,
    useMediaQuery,
    useTheme,
    Drawer,
    AppBar,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";

import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";

const drawerWidth = 240;
const collapsedWidth = 72;

export default function MainLayout({ children }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const [mobileOpen, setMobileOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleMouseEnter = () => {
        setIsExpanded(true);
    };

    const handleMouseLeave = () => {
        setIsExpanded(false);
    };

    const handleDrawerToggle = () => {
        setMobileOpen((prev) => !prev);
    };

    const handleDrawerClose = () => {
        setMobileOpen(false);
    };

    const sidebarWidth = isExpanded
        ? drawerWidth
        : collapsedWidth;

    const bgGradient = isDark
        ? "linear-gradient(160deg, #0a0a14 0%, #141428 50%, #0a0a14 100%)"
        : "linear-gradient(160deg, #f0f5ff 0%, #e3ecfa 50%, #d6e3f5 100%)";

    return (
        <Box
            sx={{
                minHeight: "100vh",
                width: "100%",
                overflowX: "hidden",
                bgcolor: isDark ? "#0a0a14" : "#f0f5ff",
            }}
        >
            {/* =====================================================
                DESKTOP SIDEBAR
            ====================================================== */}
            {!isMobile && (
                <Box
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    sx={{
                        position: "fixed",
                        top: 0,
                        left: 0,

                        width: sidebarWidth,
                        height: "100vh",

                        zIndex: 1300,

                        overflow: "hidden",

                        transition:
                            "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",

                        background:
                            "linear-gradient(180deg, #0f2647 0%, #0a1f3d 50%, #091a33 100%)",

                        borderRight:
                            "1px solid rgba(255,255,255,0.04)",

                        boxShadow:
                            "4px 0 40px rgba(0,0,0,0.3)",
                    }}
                >
                    <Box
                        sx={{
                            position: "absolute",
                            right: -1,
                            top: "50%",
                            transform: "translateY(-50%)",

                            width: 3,

                            height: isExpanded
                                ? 80
                                : 40,

                            borderRadius:
                                "0 4px 4px 0",

                            background: isExpanded
                                ? "#60a5fa"
                                : "rgba(255,255,255,0.06)",

                            transition:
                                "all 0.3s ease",

                            boxShadow: isExpanded
                                ? "0 0 24px rgba(96,165,250,0.3)"
                                : "none",
                        }}
                    />

                    <Sidebar
                        isExpanded={isExpanded}
                    />
                </Box>
            )}

            {/* =====================================================
                MOBILE DRAWER
            ====================================================== */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerClose}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    display: {
                        xs: "block",
                        md: "none",
                    },

                    "& .MuiDrawer-paper": {
                        width: drawerWidth,
                        boxSizing: "border-box",

                        background:
                            "linear-gradient(180deg, #0f2647 0%, #0a1f3d 50%, #091a33 100%)",

                        borderRight:
                            "1px solid rgba(255,255,255,0.04)",

                        boxShadow:
                            "4px 0 40px rgba(0,0,0,0.3)",
                    },
                }}
            >
                <Sidebar
                    isExpanded={true}
                    onClose={handleDrawerClose}
                />
            </Drawer>

            {/* =====================================================
                MAIN APPLICATION
            ====================================================== */}
            <Box
                component="main"
                sx={{
                    minHeight: "100vh",
                    minWidth: 0,

                    display: "flex",
                    flexDirection: "column",

                    /*
                     * The main content follows the sidebar exactly.
                     *
                     * 72px when collapsed
                     * 240px when expanded
                     */
                    ml: {
                        xs: 0,
                        md: `${sidebarWidth}px`,
                    },

                    /*
                     * IMPORTANT:
                     *
                     * Do NOT manually calculate width here.
                     * margin-left + width:auto lets the browser
                     * automatically fill the remaining viewport.
                     */
                    width: "auto",

                    transition:
                        "margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
            >
                {/* =================================================
                    NAVBAR
                ================================================== */}
                <AppBar
                    position="fixed"
                    elevation={0}
                    sx={{
                        top: 0,

                        left: {
                            xs: 0,
                            md: `${sidebarWidth}px`,
                        },

                        right: 0,

                        width: "auto",

                        transition:
                            "left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",

                        background: isDark
                            ? "linear-gradient(180deg, #0a0a14 0%, #141428 100%)"
                            : "linear-gradient(180deg, #0f2647 0%, #0a1f3d 50%, #091a33 100%)",

                        backdropFilter: "blur(20px)",

                        borderBottom:
                            "1px solid rgba(255,255,255,0.03)",

                        boxShadow:
                            "0 4px 40px rgba(0,0,0,0.3)",

                        zIndex: 1200,

                        color: "#e8edf5",
                    }}
                >
                    <Toolbar
                        sx={{
                            minHeight: {
                                xs: 64,
                                md: 72,
                            },

                            px: {
                                xs: 2,
                                sm: 3,
                                md: 4,
                            },

                            justifyContent:
                                "space-between",
                        }}
                    >
                        {/* Mobile menu */}
                        <IconButton
                            color="inherit"
                            aria-label="open sidebar"
                            onClick={handleDrawerToggle}
                            edge="start"
                            sx={{
                                display: {
                                    xs: "flex",
                                    md: "none",
                                },

                                color: "#94a3b8",

                                "&:hover": {
                                    backgroundColor:
                                        "rgba(255,255,255,0.06)",

                                    color: "#fff",
                                },
                            }}
                        >
                            <MenuIcon />
                        </IconButton>

                        {/* Desktop spacer */}
                        <Box
                            sx={{
                                display: {
                                    xs: "none",
                                    md: "block",
                                },

                                width: 40,
                            }}
                        />

                        <Navbar showToggle={false} />
                    </Toolbar>
                </AppBar>

                {/* =================================================
                    NAVBAR SPACER
                ================================================== */}
                <Toolbar
                    sx={{
                        minHeight: {
                            xs: 64,
                            md: 72,
                        },
                    }}
                />

                {/* =================================================
                    PAGE CONTENT
                ================================================== */}
                <Box
                    sx={{
                        flex: 1,

                        width: "100%",
                        minWidth: 0,

                        boxSizing: "border-box",

                        background: bgGradient,

                        px: {
                            xs: 2,
                            sm: 3,
                            md: 4,
                        },

                        py: {
                            xs: 2,
                            sm: 3,
                            md: 4,
                        },

                        transition:
                            "background 0.3s ease",
                    }}
                >
                    <Box
                        sx={{
                            width: "100%",
                            minWidth: 0,

                            /*
                             * NO maxWidth
                             * NO margin:auto
                             * NO centering
                             */
                        }}
                    >
                        {children}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}