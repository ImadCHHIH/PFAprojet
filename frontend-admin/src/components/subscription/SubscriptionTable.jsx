import { DataGrid } from "@mui/x-data-grid";

import {
    Paper,
    Chip,
    IconButton,
    Stack,
    Tooltip,
    Typography,
    Box,
    Avatar
} from "@mui/material";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import BlockIcon from "@mui/icons-material/Block";

export default function SubscriptionTable({
    rows,
    onEdit,
    onCancel,
    onRenew
}) {
    const blue = {
        main: "#2563eb",
        light: "#3b82f6",
        lighter: "#60a5fa",
        lightest: "#93c5fd",
        dark: "#1d4ed8",
        bg: "rgba(37, 99, 235, 0.06)",
        text: "#1e293b",
        textLight: "#64748b"
    };

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
            case "EXPIRED":
                return {
                    label: "Expiré",
                    icon: <WarningIcon sx={{ fontSize: 14 }} />,
                    bgColor: "rgba(245, 87, 108, 0.12)",
                    color: "#f5576c",
                    borderColor: "rgba(245, 87, 108, 0.2)"
                };
            case "CANCELLED":
                return {
                    label: "Annulé",
                    icon: <BlockIcon sx={{ fontSize: 14 }} />,
                    bgColor: "rgba(156, 163, 175, 0.12)",
                    color: "#9ca3af",
                    borderColor: "rgba(156, 163, 175, 0.2)"
                };
            default:
                return {
                    label: status,
                    icon: null,
                    bgColor: "#f3f4f6",
                    color: "#6b7280",
                    borderColor: "#e5e7eb"
                };
        }
    };

    const columns = [
        {
            field: "company",
            headerName: "Entreprise",
            flex: 1.5,
            minWidth: 180,
            renderCell: (params) => (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5
                    }}
                >
                    <Avatar
                        sx={{
                            width: 32,
                            height: 32,
                            borderRadius: "8px",
                            background: `linear-gradient(135deg, ${blue.main} 0%, ${blue.light} 100%)`,
                            color: "#fff",
                            fontSize: "0.7rem",
                            fontWeight: 700
                        }}
                    >
                        {params.value?.charAt(0) || "C"}
                    </Avatar>
                    <Typography
                        sx={{
                            fontSize: "0.85rem",
                            fontWeight: 700,
                            color: blue.text
                        }}
                    >
                        {params.value}
                    </Typography>
                </Box>
            )
        },
        {
            field: "plan",
            headerName: "Plan",
            flex: 1,
            minWidth: 130,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    size="small"
                    sx={{
                        backgroundColor: blue.bg,
                        color: blue.main,
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        height: 28,
                        borderRadius: "8px"
                    }}
                />
            )
        },
        {
            field: "durationMonths",
            headerName: "Durée",
            flex: 0.8,
            minWidth: 100,
            renderCell: (params) => (
                <Typography
                    sx={{
                        fontSize: "0.8rem",
                        color: blue.text,
                        fontWeight: 600
                    }}
                >
                    {params.value} {params.value > 1 ? "mois" : "mois"}
                </Typography>
            )
        },
        {
            field: "startDate",
            headerName: "Date de début",
            flex: 1,
            minWidth: 130,
            renderCell: (params) => (
                <Typography
                    sx={{
                        fontSize: "0.8rem",
                        color: blue.textLight
                    }}
                >
                    {params.value}
                </Typography>
            )
        },
        {
            field: "endDate",
            headerName: "Date de fin",
            flex: 1,
            minWidth: 130,
            renderCell: (params) => (
                <Typography
                    sx={{
                        fontSize: "0.8rem",
                        color: blue.textLight
                    }}
                >
                    {params.value}
                </Typography>
            )
        },
        {
            field: "status",
            headerName: "Statut",
            flex: 1,
            minWidth: 130,
            renderCell: (params) => {
                const config = getStatusConfig(params.value);
                return (
                    <Chip
                        icon={config.icon}
                        label={config.label}
                        size="small"
                        sx={{
                            height: 30,
                            px: 0.5,
                            borderRadius: "10px",
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            letterSpacing: "0.3px",
                            backgroundColor: config.bgColor,
                            color: config.color,
                            border: `1px solid ${config.borderColor}`,
                            "& .MuiChip-icon": {
                                color: config.color,
                                fontSize: "1rem"
                            }
                        }}
                    />
                );
            }
        },
        {
            field: "actions",
            headerName: "Actions",
            sortable: false,
            filterable: false,
            width: 170,
            renderCell: (params) => (
                <Stack
                    direction="row"
                    spacing={0.5}
                    alignItems="center"
                >
                    <Tooltip title="Modifier" arrow>
                        <IconButton
                            onClick={() => onEdit(params.row)}
                            sx={{
                                width: 36,
                                height: 36,
                                color: blue.textLight,
                                borderRadius: "10px",
                                transition: "all 0.2s ease",
                                "&:hover": {
                                    backgroundColor: blue.bg,
                                    color: blue.main,
                                    transform: "scale(1.05)"
                                }
                            }}
                        >
                            <EditOutlinedIcon sx={{ fontSize: 20 }} />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Renouveler" arrow>
                        <span>
                            <IconButton
                                onClick={() => onRenew(params.row)}
                                disabled={params.row.status === "CANCELLED"}
                                sx={{
                                    width: 36,
                                    height: 36,
                                    color: "#43e97b",
                                    borderRadius: "10px",
                                    transition: "all 0.2s ease",
                                    "&:hover": {
                                        backgroundColor: "rgba(67, 233, 123, 0.1)",
                                        color: "#2d9d66",
                                        transform: "scale(1.05)"
                                    },
                                    "&.Mui-disabled": {
                                        color: "#d1d5db"
                                    }
                                }}
                            >
                                <AutorenewOutlinedIcon sx={{ fontSize: 20 }} />
                            </IconButton>
                        </span>
                    </Tooltip>

                    <Tooltip title="Annuler" arrow>
                        <span>
                            <IconButton
                                onClick={() => onCancel(params.row.id)}
                                disabled={params.row.status !== "ACTIVE"}
                                sx={{
                                    width: 36,
                                    height: 36,
                                    color: "#f5576c",
                                    borderRadius: "10px",
                                    transition: "all 0.2s ease",
                                    "&:hover": {
                                        backgroundColor: "rgba(245, 87, 108, 0.08)",
                                        color: "#d32f2f",
                                        transform: "scale(1.05)"
                                    },
                                    "&.Mui-disabled": {
                                        color: "#d1d5db"
                                    }
                                }}
                            >
                                <CancelOutlinedIcon sx={{ fontSize: 20 }} />
                            </IconButton>
                        </span>
                    </Tooltip>
                </Stack>
            )
        }
    ];

    return (
        <Paper
            elevation={0}
            sx={{
                height: 550,
                width: "100%",
                overflow: "hidden",
                borderRadius: "20px",
                background: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.8)",
                boxShadow: "0 8px 30px rgba(0,0,0,0.04)",
                transition: "all 0.3s ease",
                "&:hover": {
                    boxShadow: "0 20px 50px rgba(0,0,0,0.08)"
                }
            }}
        >
            <DataGrid
                rows={rows}
                columns={columns}
                pageSizeOptions={[5, 10, 20, 50]}
                disableRowSelectionOnClick
                disableColumnMenu
                sx={{
                    border: "none",
                    fontFamily: "inherit",

                    "& .MuiDataGrid-columnHeaders": {
                        background: "linear-gradient(135deg, #f8fafc 0%, #eef2f7 100%)",
                        borderBottom: "1px solid rgba(0,0,0,0.04)",
                        minHeight: "56px !important",
                        maxHeight: "56px !important",
                        borderRadius: "20px 20px 0 0"
                    },

                    "& .MuiDataGrid-columnHeader": {
                        outline: "none !important",
                        px: 2
                    },

                    "& .MuiDataGrid-columnHeaderTitle": {
                        fontSize: "0.65rem",
                        fontWeight: 800,
                        color: blue.textLight,
                        textTransform: "uppercase",
                        letterSpacing: "1.2px"
                    },

                    "& .MuiDataGrid-cell": {
                        borderBottom: "1px solid rgba(0,0,0,0.04)",
                        outline: "none !important",
                        px: 2
                    },

                    "& .MuiDataGrid-row": {
                        transition: "all 0.2s ease"
                    },

                    "& .MuiDataGrid-row:hover": {
                        backgroundColor: blue.bg
                    },

                    "& .MuiDataGrid-row.Mui-selected": {
                        backgroundColor: "rgba(37, 99, 235, 0.06)"
                    },

                    "& .MuiDataGrid-footerContainer": {
                        borderTop: "1px solid rgba(0,0,0,0.04)",
                        backgroundColor: "rgba(248, 250, 252, 0.5)",
                        minHeight: 60,
                        borderRadius: "0 0 20px 20px"
                    },

                    "& .MuiTablePagination-root": {
                        color: blue.textLight
                    },

                    "& .MuiTablePagination-actions button": {
                        color: blue.textLight,
                        "&:hover": {
                            backgroundColor: blue.bg
                        }
                    },

                    "& .MuiDataGrid-virtualScroller": {
                        "&::-webkit-scrollbar": {
                            width: 6,
                            height: 6
                        },
                        "&::-webkit-scrollbar-track": {
                            backgroundColor: "#f3f4f6",
                            borderRadius: 10
                        },
                        "&::-webkit-scrollbar-thumb": {
                            backgroundColor: "#d1d5db",
                            borderRadius: 10,
                            "&:hover": {
                                backgroundColor: "#9ca3af"
                            }
                        }
                    }
                }}
            />
        </Paper>
    );
}