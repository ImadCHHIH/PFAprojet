import { createTheme } from "@mui/material/styles";

const getTheme = (mode = "light") =>
    createTheme({
        palette: {
            mode,

            primary: {
                main: "#667eea",
                light: "#818cf8",
                dark: "#5a67d8",
                contrastText: "#FFFFFF"
            },

            secondary: {
                main: "#764ba2",
                light: "#8b5cf6",
                dark: "#6d28d9",
                contrastText: "#FFFFFF"
            },

            error: {
                main: "#f5576c",
                light: "#fb7185",
                dark: "#e11d48"
            },

            warning: {
                main: "#f093fb",
                light: "#f5a8fd",
                dark: "#e879f6"
            },

            info: {
                main: "#4facfe",
                light: "#7fc9ff",
                dark: "#1a8cf8"
            },

            success: {
                main: "#43e97b",
                light: "#72f09a",
                dark: "#2dc962"
            },

            background: {
                default: mode === "light" ? "#f5f7fa" : "#0f0f1a",
                paper: mode === "light" ? "rgba(255, 255, 255, 0.85)" : "rgba(255, 255, 255, 0.05)"
            },

            text: {
                primary: mode === "light" ? "#1a1a2e" : "#f3f4f6",
                secondary: mode === "light" ? "#6b7280" : "#9ca3af",
                disabled: mode === "light" ? "#d1d5db" : "#4b5563"
            },

            divider: mode === "light" ? "rgba(0, 0, 0, 0.06)" : "rgba(255, 255, 255, 0.06)"
        },

        typography: {
            fontFamily: "'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",

            h1: {
                fontWeight: 800,
                letterSpacing: "-0.04em",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 40%, #f093fb 70%, #f5576c 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
            },

            h2: {
                fontWeight: 800,
                letterSpacing: "-0.035em"
            },

            h3: {
                fontWeight: 700,
                letterSpacing: "-0.03em"
            },

            h4: {
                fontWeight: 700,
                letterSpacing: "-0.025em"
            },

            h5: {
                fontWeight: 700,
                letterSpacing: "-0.02em"
            },

            h6: {
                fontWeight: 700,
                letterSpacing: "-0.015em"
            },

            button: {
                fontWeight: 700,
                textTransform: "none",
                letterSpacing: "0"
            },

            subtitle1: {
                fontWeight: 500,
                color: mode === "light" ? "#6b7280" : "#9ca3af"
            },

            subtitle2: {
                fontWeight: 500,
                color: mode === "light" ? "#6b7280" : "#9ca3af"
            }
        },

        shape: {
            borderRadius: 14
        },

        shadows: [
            "none",
            "0 4px 12px rgba(0,0,0,0.04)",
            "0 8px 24px rgba(0,0,0,0.06)",
            "0 12px 32px rgba(0,0,0,0.08)",
            "0 16px 40px rgba(0,0,0,0.08)",
            "0 20px 50px rgba(0,0,0,0.1)",
            "0 24px 60px rgba(0,0,0,0.12)",
            "0 30px 70px rgba(0,0,0,0.14)",
            "0 40px 80px rgba(0,0,0,0.16)",
            "0 50px 100px rgba(0,0,0,0.18)",
            "0 4px 12px rgba(102,126,234,0.15)",
            "0 8px 24px rgba(102,126,234,0.2)",
            "0 12px 32px rgba(102,126,234,0.25)",
            "0 16px 40px rgba(102,126,234,0.3)",
            "0 20px 50px rgba(102,126,234,0.35)",
            "0 24px 60px rgba(102,126,234,0.4)",
            "0 4px 12px rgba(245,87,108,0.15)",
            "0 8px 24px rgba(245,87,108,0.2)",
            "0 12px 32px rgba(245,87,108,0.25)",
            "0 16px 40px rgba(245,87,108,0.3)",
            "0 20px 50px rgba(245,87,108,0.35)",
            "0 24px 60px rgba(245,87,108,0.4)",
            "0 40px 80px rgba(0,0,0,0.12)",
            "0 50px 100px rgba(0,0,0,0.16)",
            "0 60px 120px rgba(0,0,0,0.2)"
        ],

        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    body: {
                        background: mode === "light" 
                            ? "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)"
                            : "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%)",
                        minHeight: "100vh",
                        transition: "background 0.3s ease"
                    }
                }
            },

            MuiPaper: {
                styleOverrides: {
                    root: {
                        backgroundImage: "none",
                        background: mode === "light" 
                            ? "rgba(255, 255, 255, 0.85)"
                            : "rgba(255, 255, 255, 0.05)",
                        backdropFilter: "blur(20px)",
                        WebkitBackdropFilter: "blur(20px)",
                        border: "1px solid",
                        borderColor: mode === "light" 
                            ? "rgba(255, 255, 255, 0.3)"
                            : "rgba(255, 255, 255, 0.06)",
                        boxShadow: mode === "light"
                            ? "0 8px 30px rgba(0,0,0,0.04)"
                            : "0 8px 30px rgba(0,0,0,0.2)",
                        transition: "all 0.3s ease",

                        "&:hover": {
                            boxShadow: mode === "light"
                                ? "0 20px 50px rgba(0,0,0,0.08)"
                                : "0 20px 50px rgba(0,0,0,0.3)"
                        }
                    }
                }
            },

            MuiCard: {
                styleOverrides: {
                    root: {
                        backgroundImage: "none",
                        background: mode === "light"
                            ? "rgba(255, 255, 255, 0.9)"
                            : "rgba(255, 255, 255, 0.05)",
                        backdropFilter: "blur(10px)",
                        WebkitBackdropFilter: "blur(10px)",
                        border: "1px solid",
                        borderColor: mode === "light"
                            ? "rgba(255, 255, 255, 0.8)"
                            : "rgba(255, 255, 255, 0.06)",
                        boxShadow: mode === "light"
                            ? "0 8px 24px rgba(0,0,0,0.04)"
                            : "0 8px 24px rgba(0,0,0,0.15)",
                        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                        borderRadius: 20,

                        "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: mode === "light"
                                ? "0 24px 60px rgba(0,0,0,0.08)"
                                : "0 24px 60px rgba(0,0,0,0.25)"
                        }
                    }
                }
            },

            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 12,
                        padding: "10px 22px",
                        boxShadow: "none",
                        fontWeight: 700,
                        transition: "all 0.3s ease",

                        "&:hover": {
                            boxShadow: "none",
                            transform: "translateY(-2px)"
                        },

                        "&:active": {
                            transform: "translateY(0px)"
                        }
                    },

                    containedPrimary: {
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        boxShadow: "0 8px 24px rgba(102, 126, 234, 0.3)",
                        color: "#FFFFFF",

                        "&:hover": {
                            background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                            boxShadow: "0 12px 32px rgba(102, 126, 234, 0.45)"
                        }
                    },

                    containedSecondary: {
                        background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                        boxShadow: "0 8px 24px rgba(245, 87, 108, 0.3)",
                        color: "#FFFFFF",

                        "&:hover": {
                            background: "linear-gradient(135deg, #f5576c 0%, #f093fb 100%)",
                            boxShadow: "0 12px 32px rgba(245, 87, 108, 0.45)"
                        }
                    },

                    containedSuccess: {
                        background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
                        boxShadow: "0 8px 24px rgba(67, 233, 123, 0.3)",
                        color: "#1a1a2e",

                        "&:hover": {
                            background: "linear-gradient(135deg, #38f9d7 0%, #43e97b 100%)",
                            boxShadow: "0 12px 32px rgba(67, 233, 123, 0.45)"
                        }
                    },

                    outlined: {
                        borderColor: mode === "light" 
                            ? "rgba(0,0,0,0.1)"
                            : "rgba(255,255,255,0.1)",
                        
                        "&:hover": {
                            borderColor: mode === "light"
                                ? "rgba(102,126,234,0.4)"
                                : "rgba(102,126,234,0.4)",
                            backgroundColor: mode === "light"
                                ? "rgba(102,126,234,0.04)"
                                : "rgba(102,126,234,0.08)"
                        }
                    }
                }
            },

            MuiTextField: {
                defaultProps: {
                    variant: "outlined"
                },
                styleOverrides: {
                    root: {
                        "& .MuiOutlinedInput-root": {
                            borderRadius: 14,
                            backgroundColor: mode === "light"
                                ? "#f9fafb"
                                : "rgba(255,255,255,0.03)",
                            transition: "all 0.2s ease",

                            "& fieldset": {
                                borderColor: mode === "light"
                                    ? "#e5e7eb"
                                    : "rgba(255,255,255,0.1)",
                                borderWidth: "2px"
                            },

                            "&:hover fieldset": {
                                borderColor: mode === "light"
                                    ? "#667eea"
                                    : "#667eea"
                            },

                            "&.Mui-focused fieldset": {
                                borderColor: "#667eea",
                                borderWidth: "2px",
                                boxShadow: "0 0 0 4px rgba(102, 126, 234, 0.1)"
                            }
                        },

                        "& .MuiInputLabel-root": {
                            color: mode === "light" ? "#6b7280" : "#9ca3af",
                            fontWeight: 500,

                            "&.Mui-focused": {
                                color: "#667eea"
                            }
                        }
                    }
                }
            },

            MuiChip: {
                styleOverrides: {
                    root: {
                        borderRadius: 10,
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        transition: "all 0.2s ease",

                        "&:hover": {
                            transform: "scale(1.02)"
                        }
                    },

                    colorPrimary: {
                        backgroundColor: mode === "light"
                            ? "rgba(102,126,234,0.1)"
                            : "rgba(102,126,234,0.15)",
                        color: "#667eea"
                    },

                    colorSuccess: {
                        backgroundColor: "rgba(67,233,123,0.12)",
                        color: "#43e97b"
                    },

                    colorError: {
                        backgroundColor: "rgba(245,87,108,0.12)",
                        color: "#f5576c"
                    }
                }
            },

            MuiTableHead: {
                styleOverrides: {
                    root: {
                        "& .MuiTableCell-head": {
                            fontWeight: 700,
                            fontSize: "0.65rem",
                            textTransform: "uppercase",
                            letterSpacing: "1.2px",
                            color: mode === "light" ? "#6b7280" : "#9ca3af",
                            backgroundColor: mode === "light"
                                ? "rgba(248,250,252,0.5)"
                                : "rgba(255,255,255,0.02)",
                            borderBottom: "1px solid",
                            borderColor: mode === "light"
                                ? "rgba(0,0,0,0.04)"
                                : "rgba(255,255,255,0.04)"
                        }
                    }
                }
            },

            MuiTableRow: {
                styleOverrides: {
                    root: {
                        transition: "all 0.2s ease",

                        "&:hover": {
                            backgroundColor: mode === "light"
                                ? "rgba(102,126,234,0.03)"
                                : "rgba(255,255,255,0.02)"
                        },

                        "&:last-child td": {
                            borderBottom: 0
                        }
                    }
                }
            },

            MuiTableCell: {
                styleOverrides: {
                    root: {
                        borderBottom: "1px solid",
                        borderColor: mode === "light"
                            ? "rgba(0,0,0,0.04)"
                            : "rgba(255,255,255,0.04)",
                        padding: "16px 20px"
                    }
                }
            },

            MuiDialog: {
                styleOverrides: {
                    paper: {
                        borderRadius: 28,
                        background: mode === "light"
                            ? "rgba(255,255,255,0.95)"
                            : "rgba(255,255,255,0.05)",
                        backdropFilter: "blur(20px)",
                        WebkitBackdropFilter: "blur(20px)",
                        border: "1px solid",
                        borderColor: mode === "light"
                            ? "rgba(255,255,255,0.3)"
                            : "rgba(255,255,255,0.06)",
                        boxShadow: mode === "light"
                            ? "0 40px 80px rgba(0,0,0,0.12)"
                            : "0 40px 80px rgba(0,0,0,0.4)",
                        overflow: "hidden"
                    }
                }
            },

            MuiDrawer: {
                styleOverrides: {
                    paper: {
                        backgroundImage: "none",
                        background: mode === "light"
                            ? "rgba(255,255,255,0.85)"
                            : "rgba(255,255,255,0.05)",
                        backdropFilter: "blur(20px)",
                        WebkitBackdropFilter: "blur(20px)",
                        border: "none",
                        borderRight: "1px solid",
                        borderColor: mode === "light"
                            ? "rgba(255,255,255,0.3)"
                            : "rgba(255,255,255,0.06)",
                        boxShadow: mode === "light"
                            ? "4px 0 30px rgba(0,0,0,0.04)"
                            : "4px 0 30px rgba(0,0,0,0.15)"
                    }
                }
            },

            MuiTooltip: {
                styleOverrides: {
                    tooltip: {
                        borderRadius: 12,
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        padding: "8px 14px",
                        background: mode === "light"
                            ? "rgba(0,0,0,0.85)"
                            : "rgba(255,255,255,0.9)",
                        color: mode === "light" ? "#fff" : "#1a1a2e",
                        backdropFilter: "blur(10px)",
                        WebkitBackdropFilter: "blur(10px)",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.15)"
                    },
                    arrow: {
                        color: mode === "light" ? "rgba(0,0,0,0.85)" : "rgba(255,255,255,0.9)"
                    }
                }
            },

            MuiAppBar: {
                styleOverrides: {
                    root: {
                        background: mode === "light"
                            ? "rgba(255,255,255,0.85)"
                            : "rgba(255,255,255,0.05)",
                        backdropFilter: "blur(20px)",
                        WebkitBackdropFilter: "blur(20px)",
                        borderBottom: "1px solid",
                        borderColor: mode === "light"
                            ? "rgba(255,255,255,0.3)"
                            : "rgba(255,255,255,0.06)",
                        boxShadow: mode === "light"
                            ? "0 4px 30px rgba(0,0,0,0.04)"
                            : "0 4px 30px rgba(0,0,0,0.1)"
                    }
                }
            },

            MuiListItemButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 12,
                        transition: "all 0.2s ease",

                        "&:hover": {
                            backgroundColor: mode === "light"
                                ? "rgba(102,126,234,0.06)"
                                : "rgba(255,255,255,0.04)"
                        },

                        "&.Mui-selected": {
                            backgroundColor: mode === "light"
                                ? "rgba(102,126,234,0.1)"
                                : "rgba(255,255,255,0.06)",
                            color: "#667eea",

                            "&:hover": {
                                backgroundColor: mode === "light"
                                    ? "rgba(102,126,234,0.15)"
                                    : "rgba(255,255,255,0.08)"
                            },

                            "& .MuiListItemIcon-root": {
                                color: "#667eea"
                            }
                        }
                    }
                }
            },

            MuiSwitch: {
                styleOverrides: {
                    root: {
                        "& .MuiSwitch-switchBase.Mui-checked": {
                            color: "#43e97b"
                        },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                            backgroundColor: "#43e97b",
                            opacity: 1
                        },
                        "& .MuiSwitch-switchBase": {
                            color: mode === "light" ? "#d1d5db" : "#4b5563"
                        },
                        "& .MuiSwitch-switchBase + .MuiSwitch-track": {
                            backgroundColor: mode === "light" ? "#d1d5db" : "#4b5563",
                            opacity: 1
                        }
                    }
                }
            },

            MuiAvatar: {
                styleOverrides: {
                    root: {
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        color: "#fff",
                        fontWeight: 700
                    }
                }
            },

            MuiBadge: {
                styleOverrides: {
                    badge: {
                        background: "linear-gradient(135deg, #f5576c 0%, #f093fb 100%)",
                        color: "#fff",
                        fontWeight: 700
                    }
                }
            }
        }
    });

export default getTheme;