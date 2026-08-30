import { Card, CardContent, Typography, Box } from "@mui/material";

export default function InfoCard({
    title,
    value,
    icon,
    color,
    gradient
}) {
    // Palette de bleus pour chaque carte
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

    const finalGradient = gradient || getGradient(color);

    return (
        <Card
            elevation={0}
            sx={{
                position: "relative",
                overflow: "hidden",
                height: "100%",
                borderRadius: "20px",
                background: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.8)",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.04)",

                "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: "20px",
                    padding: "2px",
                    background: finalGradient,
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                    opacity: 0,
                    transition: "opacity 0.4s ease",
                    pointerEvents: "none"
                },

                "&:hover": {
                    transform: "translateY(-8px) scale(1.01)",
                    boxShadow: "0 20px 50px rgba(0,0,0,0.12)"
                },

                "&:hover::before": {
                    opacity: 1
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
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    gap={2}
                >
                    <Box sx={{ minWidth: 0 }}>
                        <Typography
                            sx={{
                                fontSize: "0.7rem",
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: "1.5px",
                                color: "#9ca3af",
                                mb: 1.5,
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5
                            }}
                        >
                            <span
                                style={{
                                    display: "inline-block",
                                    width: 6,
                                    height: 6,
                                    borderRadius: "50%",
                                    background: finalGradient,
                                    marginRight: 4
                                }}
                            />
                            {title}
                        </Typography>

                        {/* Valeur en noir */}
                        <Typography
                            sx={{
                                fontSize: {
                                    xs: "2rem",
                                    sm: "2.5rem"
                                },
                                lineHeight: 1,
                                fontWeight: 800,
                                letterSpacing: "-2px",
                                color: "#1e293b",
                                mb: 0.5
                            }}
                        >
                            {value}
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            width: 56,
                            height: 56,
                            minWidth: 56,
                            borderRadius: "16px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            background: finalGradient,
                            boxShadow: `0 12px 28px rgba(37,99,235,0.25)`,
                            fontSize: 28,
                            transition: "all 0.4s ease",
                            position: "relative",

                            "&::after": {
                                content: '""',
                                position: "absolute",
                                inset: -3,
                                borderRadius: "19px",
                                background: finalGradient,
                                opacity: 0.15,
                                zIndex: -1,
                                transition: "all 0.4s ease"
                            },

                            ".MuiCard-root:hover &": {
                                transform: "scale(1.1) rotate(-5deg)"
                            },

                            ".MuiCard-root:hover &::after": {
                                transform: "scale(1.2)",
                                opacity: 0.25
                            }
                        }}
                    >
                        {icon}
                    </Box>
                </Box>

                {/* Barre de progression décorative */}
                <Box
                    sx={{
                        mt: 3,
                        width: "100%",
                        height: 4,
                        borderRadius: "10px",
                        background: "rgba(0,0,0,0.05)",
                        overflow: "hidden",
                        position: "relative"
                    }}
                >
                    <Box
                        sx={{
                            width: "65%",
                            height: "100%",
                            borderRadius: "10px",
                            background: finalGradient,
                            animation: "progressPulse 2s ease-in-out infinite",
                            "@keyframes progressPulse": {
                                "0%, 100%": { opacity: 0.6 },
                                "50%": { opacity: 1 }
                            }
                        }}
                    />
                </Box>
            </CardContent>
        </Card>
    );
}