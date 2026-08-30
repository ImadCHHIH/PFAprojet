import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Typography,
    Box,
    Avatar,
    Stack,
    useTheme
} from "@mui/material";

import { useTranslation } from "react-i18next";
import BusinessIcon from "@mui/icons-material/Business";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import BlockIcon from "@mui/icons-material/Block";
import PendingIcon from "@mui/icons-material/Pending";
import StorefrontIcon from "@mui/icons-material/Storefront";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";

export default function RecentCompaniesTable({ companies }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const { t } = useTranslation();

    const blue = {
        main: "#2563eb",
        light: "#3b82f6",
        lighter: "#60a5fa",
        lightest: "#93c5fd",
        dark: "#1d4ed8",
        bg: isDark ? "rgba(37, 99, 235, 0.08)" : "rgba(37, 99, 235, 0.04)",
        border: isDark ? "rgba(37, 99, 235, 0.12)" : "rgba(37, 99, 235, 0.08)",
        text: isDark ? "#e8edf5" : "#1e293b",
        textLight: isDark ? "#94a3b8" : "#64748b"
    };

    const companiesList = companies || [];

    const getStatusConfig = (status) => {
        switch (status) {
            case "ACTIVE":
                return {
                    label: "Actif",
                    icon: <CheckCircleIcon sx={{ fontSize: 14 }} />,
                    bgColor: "rgba(67, 233, 123, 0.12)",
                    color: "#43e97b",
                    borderColor: "rgba(67, 233, 123, 0.2)"
                };
            case "TRIAL":
                return {
                    label: "Essai",
                    icon: <PendingIcon sx={{ fontSize: 14 }} />,
                    bgColor: "rgba(79, 172, 254, 0.12)",
                    color: "#4facfe",
                    borderColor: "rgba(79, 172, 254, 0.2)"
                };
            case "SUSPENDED":
                return {
                    label: "Suspendu",
                    icon: <WarningIcon sx={{ fontSize: 14 }} />,
                    bgColor: "rgba(245, 87, 108, 0.12)",
                    color: "#f5576c",
                    borderColor: "rgba(245, 87, 108, 0.2)"
                };
            case "EXPIRED":
                return {
                    label: "Expiré",
                    icon: <BlockIcon sx={{ fontSize: 14 }} />,
                    bgColor: "rgba(156, 163, 175, 0.12)",
                    color: "#9ca3af",
                    borderColor: "rgba(156, 163, 175, 0.2)"
                };
            default:
                return {
                    label: status || "Inconnu",
                    icon: null,
                    bgColor: isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.05)",
                    color: blue.textLight,
                    borderColor: isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.05)"
                };
        }
    };

    const getInitials = (name) => {
        if (!name) return "C";
        return name.charAt(0).toUpperCase();
    };

    const paperBg = isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.6)";
    const borderColor = isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(255,255,255,0.8)";
    const tableBg = isDark ? "rgba(255,255,255,0.02)" : "rgba(37,99,235,0.03)";

    return (
        <Box>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2.5,
                    flexDirection: { xs: "column", sm: "row" },
                    gap: { xs: 1.5, sm: 0 }
                }}
            >
                <Box>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.2,
                            mb: 0.3
                        }}
                    >
                        <StorefrontIcon sx={{ color: blue.main, fontSize: 22 }} />
                        <Typography
                            sx={{
                                fontSize: "1rem",
                                fontWeight: 700,
                                color: blue.text
                            }}
                        >
                            Liste des entreprises
                        </Typography>
                        <Chip
                            label={`${companiesList.length} entreprises`}
                            size="small"
                            sx={{
                                height: 20,
                                backgroundColor: blue.bg,
                                color: blue.main,
                                fontWeight: 600,
                                fontSize: "0.6rem"
                            }}
                        />
                    </Box>
                    <Typography
                        sx={{
                            fontSize: "0.7rem",
                            color: blue.textLight,
                            ml: 4.5
                        }}
                    >
                        Entreprises récemment enregistrées
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        px: 2,
                        py: 0.5,
                        borderRadius: "10px",
                        background: blue.bg,
                        border: `1px solid ${blue.border}`
                    }}
                >
                    <BusinessIcon sx={{ fontSize: 14, color: blue.main }} />
                    <Typography sx={{ fontSize: "0.65rem", fontWeight: 600, color: blue.main }}>
                        Total: {companiesList.length}
                    </Typography>
                </Box>
            </Box>

            <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                    borderRadius: "16px",
                    background: paperBg,
                    backdropFilter: "blur(10px)",
                    border: borderColor,
                    overflow: "hidden",
                    boxShadow: isDark 
                        ? "0 2px 12px rgba(0,0,0,0.2)" 
                        : "0 2px 12px rgba(0,0,0,0.04)",
                    "&:hover": {
                        boxShadow: isDark 
                            ? "0 8px 30px rgba(0,0,0,0.3)" 
                            : "0 8px 30px rgba(37,99,235,0.06)"
                    }
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow sx={{ background: tableBg }}>
                            <TableCell
                                sx={{
                                    py: 2,
                                    px: 3,
                                    fontSize: "0.6rem",
                                    fontWeight: 700,
                                    color: blue.textLight,
                                    textTransform: "uppercase",
                                    letterSpacing: "1px",
                                    borderBottom: isDark ? "1px solid rgba(255,255,255,0.04)" : "1px solid rgba(0,0,0,0.04)"
                                }}
                            >
                                NOM
                            </TableCell>
                            <TableCell
                                sx={{
                                    py: 2,
                                    px: 3,
                                    fontSize: "0.6rem",
                                    fontWeight: 700,
                                    color: blue.textLight,
                                    textTransform: "uppercase",
                                    letterSpacing: "1px",
                                    borderBottom: isDark ? "1px solid rgba(255,255,255,0.04)" : "1px solid rgba(0,0,0,0.04)"
                                }}
                            >
                                EMAIL
                            </TableCell>
                            <TableCell
                                sx={{
                                    py: 2,
                                    px: 3,
                                    fontSize: "0.6rem",
                                    fontWeight: 700,
                                    color: blue.textLight,
                                    textTransform: "uppercase",
                                    letterSpacing: "1px",
                                    borderBottom: isDark ? "1px solid rgba(255,255,255,0.04)" : "1px solid rgba(0,0,0,0.04)"
                                }}
                            >
                                CITY
                            </TableCell>
                            <TableCell
                                sx={{
                                    py: 2,
                                    px: 3,
                                    fontSize: "0.6rem",
                                    fontWeight: 700,
                                    color: blue.textLight,
                                    textTransform: "uppercase",
                                    letterSpacing: "1px",
                                    borderBottom: isDark ? "1px solid rgba(255,255,255,0.04)" : "1px solid rgba(0,0,0,0.04)"
                                }}
                            >
                                STATUS
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {companiesList.length > 0 ? (
                            companiesList.map((company, index) => {
                                const statusConfig = getStatusConfig(company.status);
                                return (
                                    <TableRow
                                        key={company.id || index}
                                        sx={{
                                            transition: "all 0.2s ease",
                                            animation: `fadeInRow 0.3s ease ${Math.min(index * 0.05, 0.5)}s both`,
                                            "&:hover": {
                                                backgroundColor: isDark 
                                                    ? "rgba(255,255,255,0.02)" 
                                                    : "rgba(37,99,235,0.02)"
                                            },
                                            "&:last-child td": {
                                                borderBottom: 0
                                            }
                                        }}
                                    >
                                        <TableCell
                                            sx={{
                                                py: 2,
                                                px: 3,
                                                borderBottom: isDark 
                                                    ? "1px solid rgba(255,255,255,0.04)" 
                                                    : "1px solid rgba(0,0,0,0.04)"
                                            }}
                                        >
                                            <Stack direction="row" spacing={1.5} alignItems="center">
                                                <Avatar
                                                    sx={{
                                                        width: 34,
                                                        height: 34,
                                                        borderRadius: "10px",
                                                        background: isDark 
                                                            ? "rgba(255,255,255,0.08)" 
                                                            : `linear-gradient(135deg, ${blue.main} 0%, ${blue.light} 100%)`,
                                                        color: isDark ? blue.text : "#fff",
                                                        fontSize: "0.7rem",
                                                        fontWeight: 700,
                                                        boxShadow: isDark 
                                                            ? "none" 
                                                            : "0 4px 12px rgba(37,99,235,0.15)"
                                                    }}
                                                >
                                                    {getInitials(company.name)}
                                                </Avatar>
                                                <Typography
                                                    sx={{
                                                        fontSize: "0.8rem",
                                                        fontWeight: 600,
                                                        color: blue.text
                                                    }}
                                                >
                                                    {company.name}
                                                </Typography>
                                            </Stack>
                                        </TableCell>

                                        <TableCell
                                            sx={{
                                                py: 2,
                                                px: 3,
                                                borderBottom: isDark 
                                                    ? "1px solid rgba(255,255,255,0.04)" 
                                                    : "1px solid rgba(0,0,0,0.04)"
                                            }}
                                        >
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <EmailIcon sx={{ fontSize: 14, color: blue.textLight }} />
                                                <Typography sx={{ fontSize: "0.75rem", color: blue.textLight }}>
                                                    {company.email}
                                                </Typography>
                                            </Stack>
                                        </TableCell>

                                        <TableCell
                                            sx={{
                                                py: 2,
                                                px: 3,
                                                borderBottom: isDark 
                                                    ? "1px solid rgba(255,255,255,0.04)" 
                                                    : "1px solid rgba(0,0,0,0.04)"
                                            }}
                                        >
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <LocationOnIcon sx={{ fontSize: 14, color: blue.textLight }} />
                                                <Typography sx={{ fontSize: "0.75rem", color: blue.textLight }}>
                                                    {company.city || "—"}
                                                </Typography>
                                            </Stack>
                                        </TableCell>

                                        <TableCell
                                            sx={{
                                                py: 2,
                                                px: 3,
                                                borderBottom: isDark 
                                                    ? "1px solid rgba(255,255,255,0.04)" 
                                                    : "1px solid rgba(0,0,0,0.04)"
                                            }}
                                        >
                                            <Chip
                                                icon={statusConfig.icon}
                                                label={statusConfig.label}
                                                size="small"
                                                sx={{
                                                    height: 26,
                                                    px: 0.5,
                                                    borderRadius: "8px",
                                                    fontSize: "0.65rem",
                                                    fontWeight: 600,
                                                    backgroundColor: statusConfig.bgColor,
                                                    color: statusConfig.color,
                                                    border: `1px solid ${statusConfig.borderColor}`,
                                                    "& .MuiChip-icon": {
                                                        color: statusConfig.color,
                                                        fontSize: "1rem"
                                                    }
                                                }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} sx={{ py: 6, textAlign: "center" }}>
                                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                                        <BusinessIcon sx={{ fontSize: 40, color: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }} />
                                        <Typography sx={{ fontSize: "0.85rem", fontWeight: 500, color: blue.textLight }}>
                                            Aucune entreprise trouvée
                                        </Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <style>
                {`
                    @keyframes fadeInRow {
                        0% { opacity: 0; transform: translateY(8px); }
                        100% { opacity: 1; transform: translateY(0); }
                    }
                `}
            </style>
        </Box>
    );
}