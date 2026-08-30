import {
    Box,
    Card,
    CardContent,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Stack,
    Paper,
    Fade,
    Chip,
    Divider,
    useTheme
} from "@mui/material";

import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import NumbersOutlinedIcon from "@mui/icons-material/NumbersOutlined";
import CurrencyExchangeOutlinedIcon from "@mui/icons-material/CurrencyExchangeOutlined";
import SettingsIcon from "@mui/icons-material/Settings";
import TuneIcon from "@mui/icons-material/Tune";

import { useThemeContext } from "../../context/ThemeContext";
import { useLanguageContext } from "../../context/LanguageContext";
import { useSettingsContext } from "../../context/SettingsContext";

import { useTranslation } from "react-i18next";

export default function SettingsPage() {

    const theme = useTheme();
    const { mode, changeTheme } = useThemeContext();
    const { language, changeLanguage } = useLanguageContext();
    const {
        dateFormat,
        numberFormat,
        currency,
        changeDateFormat,
        changeNumberFormat,
        changeCurrency
    } = useSettingsContext();

    const { t } = useTranslation();

    const isDark = mode === "dark";

    const settingCardSx = {
        borderRadius: "20px",
        boxShadow: isDark 
            ? "0 10px 30px rgba(0,0,0,0.3)" 
            : "0 10px 30px rgba(0,0,0,0.04)",
        border: isDark 
            ? "1px solid rgba(255,255,255,0.06)" 
            : "1px solid rgba(255,255,255,0.8)",
        backdropFilter: "blur(10px)",
        backgroundColor: isDark 
            ? "rgba(255,255,255,0.05)" 
            : "rgba(255,255,255,0.85)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease",
        overflow: "hidden",
        "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: isDark 
                ? "0 20px 40px rgba(0,0,0,0.4)" 
                : "0 20px 40px rgba(0,0,0,0.08)"
        }
    };

    const cardContentSx = {
        p: {
            xs: 3,
            md: 3.5
        },
        "&:last-child": {
            pb: {
                xs: 3,
                md: 3.5
            }
        }
    };

    const iconBoxSx = (gradient) => ({
        width: 48,
        height: 48,
        borderRadius: "14px",
        background: gradient,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        boxShadow: isDark 
            ? "0 8px 20px rgba(0,0,0,0.3)" 
            : "0 8px 20px rgba(0,0,0,0.08)"
    });

    const selectSx = {
        borderRadius: "12px",
        backgroundColor: isDark 
            ? "rgba(255,255,255,0.05)" 
            : "#f9fafb",
        transition: "all 0.2s ease",
        color: isDark ? "#e8edf5" : "#1e293b",
        "& .MuiOutlinedInput-notchedOutline": {
            borderColor: isDark 
                ? "rgba(255,255,255,0.1)" 
                : "#e5e7eb",
            borderWidth: "2px"
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#2563eb"
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#2563eb",
            borderWidth: "2px",
            boxShadow: "0 0 0 4px rgba(37, 99, 235, 0.1)"
        },
        "& .MuiSelect-select": {
            fontWeight: 500
        },
        "& .MuiSvgIcon-root": {
            color: isDark ? "#94a3b8" : "#64748b"
        }
    };

    const labelSx = {
        color: isDark ? "#94a3b8" : "#64748b",
        "&.Mui-focused": {
            color: "#2563eb"
        }
    };

    const textColor = isDark ? "#e8edf5" : "#1e293b";
    const textLightColor = isDark ? "#94a3b8" : "#64748b";
    const bgColor = isDark ? "linear-gradient(160deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%)" : "linear-gradient(160deg, #f0f5ff 0%, #e3ecfa 50%, #d6e3f5 100%)";

    return (
        <Fade in={true} timeout={500}>
            <Box
                sx={{
                    minHeight: "calc(100vh - 64px)",
                    background: bgColor,
                    px: { xs: 2, sm: 3, md: 4 },
                    py: { xs: 3, md: 4 },
                    position: "relative",
                    overflow: "hidden",
                    transition: "background 0.3s ease"
                }}
            >
                {/* Éléments décoratifs - adaptés au mode */}
                {!isDark && (
                    <>
                        {[...Array(12)].map((_, i) => {
                            const size = 14 + Math.random() * 25;
                            const delay = Math.random() * 12;
                            const duration = 14 + Math.random() * 18;
                            const xStart = Math.random() * 100;
                            const rotate = Math.random() * 360;
                            const opacity = 0.08 + Math.random() * 0.12;

                            return (
                                <Box
                                    key={`petal-${i}`}
                                    sx={{
                                        position: "absolute",
                                        width: size,
                                        height: size * 1.5,
                                        borderRadius: "50% 0 50% 50%",
                                        background: `radial-gradient(ellipse at center, rgba(37,99,235,${opacity}) 0%, rgba(96,165,250,${opacity * 0.5}) 40%, transparent 100%)`,
                                        left: `${xStart}%`,
                                        top: "-30px",
                                        transform: `rotate(${rotate}deg)`,
                                        animation: `petalFloat ${duration}s ease-in-out infinite`,
                                        animationDelay: `${delay}s`,
                                        pointerEvents: "none",
                                        zIndex: 0
                                    }}
                                />
                            );
                        })}

                        {[...Array(8)].map((_, i) => {
                            const size = 20 + Math.random() * 50;
                            const delay = Math.random() * 10;
                            const duration = 15 + Math.random() * 15;
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
                                        background: `radial-gradient(circle at 30% 30%, rgba(37,99,235,0.06) 0%, rgba(96,165,250,0.03) 60%, transparent 100%)`,
                                        border: `1px solid rgba(37,99,235,${0.03 + Math.random() * 0.05})`,
                                        left: `${xPos}%`,
                                        top: `${yPos}%`,
                                        animation: `bubbleFloat ${duration}s ease-in-out infinite`,
                                        animationDelay: `${delay}s`,
                                        pointerEvents: "none",
                                        zIndex: 0
                                    }}
                                />
                            );
                        })}

                        <Box
                            sx={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: "150px",
                                background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%232563eb' fill-opacity='0.03' d='M0,192L48,176C96,160,192,128,288,138.7C384,149,480,203,576,213.3C672,224,768,192,864,181.3C960,171,1056,181,1152,197.3C1248,213,1344,235,1392,245.3L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'/%3E%3C/svg%3E")`,
                                backgroundSize: "cover",
                                backgroundRepeat: "no-repeat",
                                pointerEvents: "none",
                                zIndex: 0
                            }}
                        />
                    </>
                )}

                <Box
                    sx={{
                        maxWidth: 850,
                        mx: "auto",
                        position: "relative",
                        zIndex: 1
                    }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3.5,
                            mb: 4,
                            borderRadius: "24px",
                            background: isDark 
                                ? "rgba(255,255,255,0.05)" 
                                : "linear-gradient(135deg, #2563eb 0%, #60a5fa 100%)",
                            color: isDark ? "#e8edf5" : "#fff",
                            position: "relative",
                            overflow: "hidden",
                            boxShadow: isDark 
                                ? "0 20px 40px rgba(0,0,0,0.3)" 
                                : "0 20px 40px rgba(37,99,235,0.3)",
                            border: isDark ? "1px solid rgba(255,255,255,0.06)" : "none",
                            transition: "all 0.3s ease"
                        }}
                    >
                        <Box
                            sx={{
                                position: "absolute",
                                top: -50,
                                right: -50,
                                width: 200,
                                height: 200,
                                borderRadius: "50%",
                                background: isDark 
                                    ? "rgba(255,255,255,0.02)" 
                                    : "rgba(255,255,255,0.06)",
                                animation: "pulse 6s ease-in-out infinite"
                            }}
                        />
                        <Box
                            sx={{
                                position: "absolute",
                                bottom: -30,
                                left: -30,
                                width: 120,
                                height: 120,
                                borderRadius: "50%",
                                background: isDark 
                                    ? "rgba(255,255,255,0.01)" 
                                    : "rgba(255,255,255,0.04)"
                            }}
                        />

                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: { xs: "column", sm: "row" },
                                alignItems: { xs: "flex-start", sm: "center" },
                                justifyContent: "space-between",
                                position: "relative",
                                zIndex: 1,
                                gap: 2
                            }}
                        >
                            <Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1.5,
                                        mb: 1
                                    }}
                                >
                                    <TuneIcon sx={{ fontSize: "2rem", opacity: 0.9 }} />
                                    <Typography
                                        sx={{
                                            fontSize: { xs: "1.6rem", md: "2rem" },
                                            fontWeight: 800,
                                            letterSpacing: "-0.8px",
                                            lineHeight: 1.2,
                                            color: isDark ? "#e8edf5" : "#fff"
                                        }}
                                    >
                                        {t("settings")}
                                    </Typography>
                                </Box>

                                <Typography
                                    sx={{
                                        fontSize: "0.85rem",
                                        opacity: 0.85,
                                        fontWeight: 400,
                                        color: isDark ? "#94a3b8" : "rgba(255,255,255,0.8)"
                                    }}
                                >
                                    Personnalisez votre expérience BeautyCloud
                                </Typography>
                            </Box>

                            <Chip
                                icon={<SettingsIcon />}
                                label="Préférences"
                                sx={{
                                    backgroundColor: isDark 
                                        ? "rgba(255,255,255,0.08)" 
                                        : "rgba(255,255,255,0.15)",
                                    color: isDark ? "#e8edf5" : "#fff",
                                    fontWeight: 600,
                                    "& .MuiChip-icon": { 
                                        color: isDark ? "#e8edf5" : "#fff" 
                                    }
                                }}
                            />
                        </Box>
                    </Paper>

                    <Stack spacing={3}>
                        <Card sx={settingCardSx}>
                            <CardContent sx={cardContentSx}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 2,
                                        mb: 3
                                    }}
                                >
                                    <Box sx={iconBoxSx("linear-gradient(135deg, #f093fb 0%, #f5576c 100%)")}>
                                        <PaletteOutlinedIcon sx={{ fontSize: 22, color: "#fff" }} />
                                    </Box>
                                    <Box>
                                        <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: textColor }}>
                                            {t("appearance")}
                                        </Typography>
                                        <Typography sx={{ fontSize: "0.78rem", color: textLightColor, mt: 0.2 }}>
                                            Choisissez l'apparence du tableau de bord
                                        </Typography>
                                    </Box>
                                </Box>

                                <FormControl fullWidth>
                                    <InputLabel sx={labelSx}>{t("theme")}</InputLabel>
                                    <Select
                                        value={mode}
                                        label={t("theme")}
                                        onChange={(e) => changeTheme(e.target.value)}
                                        sx={selectSx}
                                    >
                                        <MenuItem value="light" sx={{ color: textColor }}>☀️ {t("light")}</MenuItem>
                                        <MenuItem value="dark" sx={{ color: textColor }}>🌙 {t("dark")}</MenuItem>
                                    </Select>
                                </FormControl>
                            </CardContent>
                        </Card>

                        <Card sx={settingCardSx}>
                            <CardContent sx={cardContentSx}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 2,
                                        mb: 3
                                    }}
                                >
                                    <Box sx={iconBoxSx("linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)")}>
                                        <LanguageOutlinedIcon sx={{ fontSize: 22, color: "#fff" }} />
                                    </Box>
                                    <Box>
                                        <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: textColor }}>
                                            {t("language")}
                                        </Typography>
                                        <Typography sx={{ fontSize: "0.78rem", color: textLightColor, mt: 0.2 }}>
                                            Sélectionnez votre langue préférée
                                        </Typography>
                                    </Box>
                                </Box>

                                <FormControl fullWidth>
                                    <InputLabel sx={labelSx}>{t("language")}</InputLabel>
                                    <Select
                                        value={language}
                                        label={t("language")}
                                        onChange={(e) => changeLanguage(e.target.value)}
                                        sx={selectSx}
                                    >
                                        <MenuItem value="en" sx={{ color: textColor }}>🇬🇧 {t("english")}</MenuItem>
                                        <MenuItem value="fr" sx={{ color: textColor }}>🇫🇷 {t("french")}</MenuItem>
                                    </Select>
                                </FormControl>
                            </CardContent>
                        </Card>

                        <Card sx={settingCardSx}>
                            <CardContent sx={cardContentSx}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 2,
                                        mb: 3
                                    }}
                                >
                                    <Box sx={iconBoxSx("linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)")}>
                                        <NumbersOutlinedIcon sx={{ fontSize: 22, color: isDark ? "#fff" : "#1a1a2e" }} />
                                    </Box>
                                    <Box>
                                        <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: textColor }}>
                                            {t("numberFormat")}
                                        </Typography>
                                        <Typography sx={{ fontSize: "0.78rem", color: textLightColor, mt: 0.2 }}>
                                            Choisissez le format des nombres
                                        </Typography>
                                    </Box>
                                </Box>

                                <FormControl fullWidth>
                                    <InputLabel sx={labelSx}>{t("numberFormat")}</InputLabel>
                                    <Select
                                        value={numberFormat}
                                        label={t("numberFormat")}
                                        onChange={(e) => changeNumberFormat(e.target.value)}
                                        sx={selectSx}
                                    >
                                        <MenuItem value="1 234,56" sx={{ color: textColor }}>1 234,56 (FR)</MenuItem>
                                        <MenuItem value="1,234.56" sx={{ color: textColor }}>1,234.56 (EN)</MenuItem>
                                    </Select>
                                </FormControl>
                            </CardContent>
                        </Card>

                        <Card sx={settingCardSx}>
                            <CardContent sx={cardContentSx}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 2,
                                        mb: 3
                                    }}
                                >
                                    <Box sx={iconBoxSx("linear-gradient(135deg, #fa709a 0%, #fee140 100%)")}>
                                        <CurrencyExchangeOutlinedIcon sx={{ fontSize: 22, color: isDark ? "#fff" : "#1a1a2e" }} />
                                    </Box>
                                    <Box>
                                        <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: textColor }}>
                                            {t("currency") || "Devise"}
                                        </Typography>
                                        <Typography sx={{ fontSize: "0.78rem", color: textLightColor, mt: 0.2 }}>
                                            Sélectionnez votre devise préférée
                                        </Typography>
                                    </Box>
                                </Box>

                                <FormControl fullWidth>
                                    <InputLabel sx={labelSx}>{t("currency") || "Devise"}</InputLabel>
                                    <Select
                                        value={currency}
                                        label={t("currency") || "Devise"}
                                        onChange={(e) => changeCurrency(e.target.value)}
                                        sx={selectSx}
                                    >
                                        <MenuItem value="MAD" sx={{ color: textColor }}>🇲🇦 MAD - Dirham Marocain</MenuItem>
                                        <MenuItem value="EUR" sx={{ color: textColor }}>🇪🇺 € - Euro</MenuItem>
                                        <MenuItem value="USD" sx={{ color: textColor }}>🇺🇸 $ - Dollar US</MenuItem>
                                        <MenuItem value="CNY" sx={{ color: textColor }}>🇨🇳 ¥ - Yuan Chinois</MenuItem>
                                    </Select>
                                </FormControl>
                            </CardContent>
                        </Card>

                        <Card sx={settingCardSx}>
                            <CardContent sx={cardContentSx}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 2,
                                        mb: 3
                                    }}
                                >
                                    <Box sx={iconBoxSx("linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)")}>
                                        <SettingsIcon sx={{ fontSize: 22, color: isDark ? "#fff" : "#1a1a2e" }} />
                                    </Box>
                                    <Box>
                                        <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: textColor }}>
                                            {t("dateFormat") || "Format de Date"}
                                        </Typography>
                                        <Typography sx={{ fontSize: "0.78rem", color: textLightColor, mt: 0.2 }}>
                                            Choisissez le format des dates
                                        </Typography>
                                    </Box>
                                </Box>

                                <FormControl fullWidth>
                                    <InputLabel sx={labelSx}>{t("dateFormat") || "Format de Date"}</InputLabel>
                                    <Select
                                        value={dateFormat}
                                        label={t("dateFormat") || "Format de Date"}
                                        onChange={(e) => changeDateFormat(e.target.value)}
                                        sx={selectSx}
                                    >
                                        <MenuItem value="DD/MM/YYYY" sx={{ color: textColor }}>DD/MM/YYYY (25/12/2024)</MenuItem>
                                        <MenuItem value="MM/DD/YYYY" sx={{ color: textColor }}>MM/DD/YYYY (12/25/2024)</MenuItem>
                                        <MenuItem value="YYYY-MM-DD" sx={{ color: textColor }}>YYYY-MM-DD (2024-12-25)</MenuItem>
                                    </Select>
                                </FormControl>
                            </CardContent>
                        </Card>
                    </Stack>
                </Box>

                <style>
                    {`
                        @keyframes petalFloat {
                            0% { transform: translateY(0) rotate(0deg) scale(1); opacity: 0.08; }
                            25% { transform: translateY(25vh) rotate(90deg) scale(1.1); opacity: 0.18; }
                            50% { transform: translateY(50vh) rotate(180deg) scale(0.9); opacity: 0.08; }
                            75% { transform: translateY(75vh) rotate(270deg) scale(1.05); opacity: 0.15; }
                            100% { transform: translateY(100vh) rotate(360deg) scale(1); opacity: 0.03; }
                        }
                        @keyframes bubbleFloat {
                            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
                            25% { transform: translate(30px, -20px) scale(1.1); opacity: 0.5; }
                            50% { transform: translate(-20px, -35px) scale(0.9); opacity: 0.3; }
                            75% { transform: translate(20px, -10px) scale(1.05); opacity: 0.4; }
                        }
                        @keyframes pulse {
                            0%, 100% { transform: scale(1); opacity: 0.6; }
                            50% { transform: scale(1.05); opacity: 1; }
                        }
                    `}
                </style>
            </Box>
        </Fade>
    );
}