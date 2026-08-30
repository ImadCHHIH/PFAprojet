import {
    Card,
    CardContent,
    Typography,
    Box,
    useTheme
} from "@mui/material";

export default function StatCard({ title, value, subtitle, icon, color }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const getGradient = (baseColor) => {
        const gradients = {
            "#2563eb": "linear-gradient(135deg, #2563eb 0%, #60a5fa 100%)",
            "#3b82f6": "linear-gradient(135deg, #3b82f6 0%, #93c5fd 100%)",
            "#1d4ed8": "linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)",
            "#60a5fa": "linear-gradient(135deg, #60a5fa 0%, #93c5fd 100%)",
            "#1e3a8a": "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
            "#93c5fd": "linear-gradient(135deg, #93c5fd 0%, #bfdbfe 100%)",
        };
        return gradients[baseColor] || `linear-gradient(135deg, ${baseColor || "#2563eb"} 0%, ${baseColor || "#60a5fa"} 100%)`;
    };

    const finalGradient = getGradient(color);

    const bgColor = isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.9)";
    const borderColor = isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(255,255,255,0.8)";
    const textColor = isDark ? "#e8edf5" : "#1e293b";
    const textLightColor = isDark ? "#94a3b8" : "#64748b";

    return (
        <Card
            elevation={0}
            sx={{
                position: "relative",
                overflow: "hidden",
                height: "100%",
                minHeight: 160,
                borderRadius: "24px",
                background: bgColor,
                backdropFilter: "blur(10px)",
                border: borderColor,
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: isDark 
                    ? "0 8px 24px rgba(0,0,0,0.15)" 
                    : "0 8px 24px rgba(0,0,0,0.04)",

                "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    background: finalGradient,
                    borderRadius: "24px 24px 0 0",
                },

                "&::after": {
                    content: '""',
                    position: "absolute",
                    width: 150,
                    height: 150,
                    borderRadius: "50%",
                    right: -60,
                    bottom: -70,
                    background: color || "#2563eb",
                    opacity: isDark ? 0.03 : 0.04,
                    pointerEvents: "none",
                    transition: "all 0.4s ease"
                },

                "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: isDark 
                        ? "0 24px 60px rgba(0,0,0,0.3)" 
                        : "0 24px 60px rgba(0,0,0,0.12)",
                    "&::after": {
                        opacity: isDark ? 0.06 : 0.08,
                        transform: "scale(1.2)"
                    }
                }
            }}
        >
            <CardContent
                sx={{
                    p: 3.5,
                    "&:last-child": {
                        pb: 3.5
                    }
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                        justifyContent: "space-between",
                        gap: 1
                    }}
                >
                    <Box>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                            <Typography
                                sx={{
                                    fontSize: "0.7rem",
                                    fontWeight: 700,
                                    textTransform: "uppercase",
                                    letterSpacing: "1.5px",
                                    color: textLightColor,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.8
                                }}
                            >
                                <span
                                    style={{
                                        display: "inline-block",
                                        width: 6,
                                        height: 6,
                                        borderRadius: "50%",
                                        background: finalGradient
                                    }}
                                />
                                {title}
                            </Typography>

                            <Box
                                sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: "12px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: color || "#2563eb",
                                    backgroundColor: isDark 
                                        ? `${color || "#2563eb"}20` 
                                        : `${color || "#2563eb"}10`,
                                    border: `1px solid ${isDark ? `${color || "#2563eb"}30` : `${color || "#2563eb"}18`}`,
                                    transition: "all 0.3s ease",
                                    ".MuiCard-root:hover &": {
                                        transform: "scale(1.08) rotate(-3deg)"
                                    }
                                }}
                            >
                                {icon}
                            </Box>
                        </Box>

                        <Typography
                            sx={{
                                fontSize: {
                                    xs: "2.2rem",
                                    sm: "2.6rem"
                                },
                                lineHeight: 1,
                                fontWeight: 800,
                                letterSpacing: "-1.5px",
                                color: textColor,
                                mb: 0.5
                            }}
                        >
                            {value}
                        </Typography>

                        {subtitle && (
                            <Typography
                                sx={{
                                    fontSize: "0.8rem",
                                    color: textLightColor,
                                    fontWeight: 500
                                }}
                            >
                                {subtitle}
                            </Typography>
                        )}
                    </Box>

                    <Box
                        sx={{
                            width: 32,
                            height: 3,
                            borderRadius: "10px",
                            background: finalGradient,
                            opacity: 0.5,
                            transition: "all 0.3s ease",
                            ".MuiCard-root:hover &": {
                                width: 48,
                                opacity: 0.8
                            }
                        }}
                    />
                </Box>
            </CardContent>
        </Card>
    );
}