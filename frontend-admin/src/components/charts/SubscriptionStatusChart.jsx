import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip
} from "recharts";

import { Box, Typography, Chip, useTheme } from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import WarningIcon from "@mui/icons-material/Warning";

export default function SubscriptionStatusChart({ dashboard }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const blue = {
        main: "#2563eb",
        text: isDark ? "#e8edf5" : "#1e293b",
        textLight: isDark ? "#94a3b8" : "#64748b"
    };

    const activeSubscriptions = dashboard?.activeSubscriptions || 0;
    const canceledSubscriptions = dashboard?.canceledSubscriptions || 0;
    const expiredSubscriptions = dashboard?.expiredSubscriptions || 0;

    const data = [
        { name: "Actifs", value: activeSubscriptions, icon: <CheckCircleIcon />, color: "#43e97b" },
        { name: "Annulés", value: canceledSubscriptions, icon: <CancelIcon />, color: "#f5576c" },
        { name: "Expirés", value: expiredSubscriptions, icon: <WarningIcon />, color: "#f093fb" }
    ];

    const total = data.reduce((sum, item) => sum + (item.value || 0), 0);

    const tooltipBg = isDark ? "rgba(15, 15, 26, 0.95)" : "rgba(255,255,255,0.95)";
    const tooltipBorder = isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(255,255,255,0.8)";

    return (
        <Box sx={{ height: "100%" }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                <Box>
                    <Typography
                        sx={{
                            fontSize: "0.6rem",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "1.2px",
                            color: blue.textLight,
                            display: "flex",
                            alignItems: "center",
                            gap: 0.8
                        }}
                    >
                        <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "linear-gradient(135deg, #43e97b, #f093fb)" }} />
                        Statut des abonnements
                    </Typography>
                    <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: blue.text }}>
                        Répartition
                    </Typography>
                </Box>

                <Chip
                    label={`${total} total`}
                    size="small"
                    sx={{
                        backgroundColor: isDark ? "rgba(37,99,235,0.12)" : "rgba(37,99,235,0.06)",
                        color: blue.main,
                        fontWeight: 600,
                        fontSize: "0.7rem",
                        height: 26
                    }}
                />
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, height: "calc(100% - 60px)" }}>
                <Box sx={{ width: "50%", height: "100%", position: "relative" }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                innerRadius={35}
                                outerRadius={55}
                                paddingAngle={3}
                                cornerRadius={4}
                                stroke={isDark ? "rgba(15, 15, 26, 0.95)" : "#fff"}
                                strokeWidth={2}
                            >
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.color}
                                        style={{
                                            filter: `drop-shadow(0 2px 8px ${entry.color}30)`,
                                            transition: "all 0.3s ease"
                                        }}
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    borderRadius: "10px",
                                    border: tooltipBorder,
                                    background: tooltipBg,
                                    backdropFilter: "blur(10px)",
                                    padding: "8px 12px",
                                    color: blue.text
                                }}
                                formatter={(value) => [`${value} abonnements`, ""]}
                            />
                        </PieChart>
                    </ResponsiveContainer>

                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            textAlign: "center",
                            pointerEvents: "none"
                        }}
                    >
                        <Typography sx={{ fontSize: "1.3rem", fontWeight: 800, color: blue.text }}>
                            {total}
                        </Typography>
                        <Typography sx={{ fontSize: "0.5rem", fontWeight: 600, color: blue.textLight, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                            Total
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ flex: 1 }}>
                    {data.map((item, index) => {
                        const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0;
                        return (
                            <Box
                                key={index}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1.5,
                                    py: 0.8,
                                    borderBottom: index < data.length - 1 
                                        ? (isDark ? "1px solid rgba(255,255,255,0.04)" : "1px solid rgba(0,0,0,0.04)") 
                                        : "none"
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: "4px",
                                        background: item.color,
                                        flexShrink: 0
                                    }}
                                />
                                <Typography sx={{ fontSize: "0.75rem", color: blue.text, flex: 1 }}>
                                    {item.name}
                                </Typography>
                                <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: blue.text }}>
                                    {item.value}
                                </Typography>
                                <Typography sx={{ fontSize: "0.6rem", color: blue.textLight, minWidth: 32, textAlign: "right" }}>
                                    {percentage}%
                                </Typography>
                            </Box>
                        );
                    })}
                </Box>
            </Box>
        </Box>
    );
}