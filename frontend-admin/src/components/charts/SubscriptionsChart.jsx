import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Area,
    AreaChart,
} from "recharts";

import { Box, Typography, Chip, Stack } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

const data = [
    { month: "Jan", subscriptions: 2 },
    { month: "Fév", subscriptions: 3 },
    { month: "Mar", subscriptions: 5 },
    { month: "Avr", subscriptions: 7 },
    { month: "Mai", subscriptions: 9 },
    { month: "Juin", subscriptions: 12 },
    { month: "Juil", subscriptions: 14 },
    { month: "Aoû", subscriptions: 16 },
];

export default function SubscriptionsChart() {
    const blue = {
        main: "#2563eb",
        light: "#3b82f6",
        lightest: "#93c5fd",
        dark: "#1d4ed8",
        gradient: "linear-gradient(135deg, #2563eb 0%, #60a5fa 100%)",
        text: "#1e293b",
        textLight: "#64748b"
    };

    return (
        <Box>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
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
                        <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: blue.gradient }} />
                        Évolution des abonnements
                    </Typography>
                    <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: blue.text }}>
                        Abonnements Mensuels
                    </Typography>
                </Box>
            </Stack>

            <Box sx={{ width: "100%", height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="subscriptionGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#2563eb" stopOpacity={0.2} />
                                <stop offset="50%" stopColor="#3b82f6" stopOpacity={0.06} />
                                <stop offset="100%" stopColor="#60a5fa" stopOpacity={0} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid stroke="rgba(0,0,0,0.04)" strokeDasharray="4 4" vertical={false} />

                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 500 }}
                            dy={6}
                        />

                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 500 }}
                            allowDecimals={false}
                        />

                        <Tooltip
                            cursor={{ stroke: "rgba(37,99,235,0.1)", strokeWidth: 2 }}
                            contentStyle={{
                                borderRadius: "12px",
                                border: "1px solid rgba(255,255,255,0.8)",
                                background: "rgba(255,255,255,0.95)",
                                backdropFilter: "blur(10px)",
                                boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                                padding: "10px 14px"
                            }}
                            labelStyle={{ color: "#64748b", fontSize: "10px", fontWeight: 600 }}
                            itemStyle={{ color: "#1e293b", fontSize: "12px", fontWeight: 700 }}
                            formatter={(value) => [`${value} abonnements`, ""]}
                        />

                        <Area
                            type="monotone"
                            dataKey="subscriptions"
                            stroke="none"
                            fill="url(#subscriptionGradient)"
                        />

                        <Line
                            type="monotone"
                            dataKey="subscriptions"
                            stroke="#2563eb"
                            strokeWidth={2.5}
                            dot={{
                                r: 3,
                                fill: "#fff",
                                stroke: "#2563eb",
                                strokeWidth: 2
                            }}
                            activeDot={{
                                r: 5,
                                fill: "#2563eb",
                                stroke: "#fff",
                                strokeWidth: 2
                            }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </Box>

            <Stack direction="row" spacing={3} sx={{ mt: 1, pt: 1, borderTop: "1px solid rgba(0,0,0,0.04)" }}>
                <Box>
                    <Typography sx={{ fontSize: "0.55rem", fontWeight: 600, color: blue.textLight, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        Total
                    </Typography>
                    <Typography sx={{ fontSize: "1rem", fontWeight: 800, color: blue.text }}>
                        {data.reduce((sum, item) => sum + item.subscriptions, 0)}
                    </Typography>
                </Box>
                <Box>
                    <Typography sx={{ fontSize: "0.55rem", fontWeight: 600, color: blue.textLight, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        Moyenne
                    </Typography>
                    <Typography sx={{ fontSize: "1rem", fontWeight: 800, color: blue.text }}>
                        {Math.round(data.reduce((sum, item) => sum + item.subscriptions, 0) / data.length)}
                    </Typography>
                </Box>
                <Box>
                    <Typography sx={{ fontSize: "0.55rem", fontWeight: 600, color: blue.textLight, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        Meilleur mois
                    </Typography>
                    <Typography sx={{ fontSize: "1rem", fontWeight: 800, color: blue.main }}>
                        {data.reduce((max, item) => item.subscriptions > max.subscriptions ? item : max).month}
                    </Typography>
                </Box>
            </Stack>
        </Box>
    );
}