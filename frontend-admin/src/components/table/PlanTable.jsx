import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";

import {
    Paper,
    Chip,
    IconButton,
    Stack,
    Tooltip,
    Typography,
    Box,
    Avatar,
    TextField,
    InputAdornment,
    MenuItem,
    Select,
    FormControl,
    InputLabel
} from "@mui/material";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import DiamondIcon from "@mui/icons-material/Diamond";
import StorefrontIcon from "@mui/icons-material/Storefront";
import PeopleIcon from "@mui/icons-material/People";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SearchIcon from "@mui/icons-material/Search";
import SellIcon from "@mui/icons-material/Sell";

export default function PlanTable({
    rows,
    onEdit,
    onDelete,
    loading
}) {
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    const blue = {
        main: "#2563eb",
        light: "#3b82f6",
        lighter: "#60a5fa",
        lightest: "#93c5fd",
        dark: "#1d4ed8",
        bg: "rgba(37, 99, 235, 0.06)",
        bgHover: "rgba(37, 99, 235, 0.08)",
        bgSelected: "rgba(37, 99, 235, 0.12)",
        border: "rgba(37, 99, 235, 0.15)",
        gradient: "linear-gradient(135deg, #2563eb 0%, #60a5fa 100%)",
        text: "#1e293b",
        textLight: "#64748b",
        textMuted: "rgba(30, 41, 59, 0.25)"
    };

    const filteredRows = rows.filter((plan) => {
        const searchValue = search.toLowerCase().trim();
        const matchesSearch = 
            plan.name?.toLowerCase().includes(searchValue) ||
            plan.type?.toLowerCase().includes(searchValue);

        const matchesType = typeFilter === "all" || plan.type === typeFilter;
        const matchesStatus = statusFilter === "all" || 
            (statusFilter === "active" && plan.active) ||
            (statusFilter === "inactive" && !plan.active);

        return matchesSearch && matchesType && matchesStatus;
    });

    const getPlanTypeConfig = (type) => {
        switch (type) {
            case "BASIC":
                return {
                    label: "Basique",
                    icon: <StarIcon sx={{ fontSize: 14 }} />,
                    bgColor: "rgba(79, 172, 254, 0.12)",
                    color: "#4facfe",
                    borderColor: "rgba(79, 172, 254, 0.2)"
                };
            case "PREMIUM":
                return {
                    label: "Premium",
                    icon: <DiamondIcon sx={{ fontSize: 14 }} />,
                    bgColor: "rgba(240, 147, 251, 0.12)",
                    color: "#f093fb",
                    borderColor: "rgba(240, 147, 251, 0.2)"
                };
            case "ENTERPRISE":
                return {
                    label: "Entreprise",
                    icon: <StorefrontIcon sx={{ fontSize: 14 }} />,
                    bgColor: "rgba(67, 233, 123, 0.12)",
                    color: "#43e97b",
                    borderColor: "rgba(67, 233, 123, 0.2)"
                };
            default:
                return {
                    label: type || "Standard",
                    icon: <SellIcon sx={{ fontSize: 14 }} />,
                    bgColor: "rgba(255,255,255,0.04)",
                    color: blue.textLight,
                    borderColor: "rgba(255,255,255,0.06)"
                };
        }
    };

    const getInitials = (name) => {
        if (!name) return "P";
        return name.charAt(0).toUpperCase();
    };

    const columns = [
        {
            field: "name",
            headerName: "Plan",
            flex: 1.4,
            minWidth: 180,

            renderCell: (params) => (
                <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                    sx={{ height: "100%" }}
                >
                    <Avatar
                        sx={{
                            width: 38,
                            height: 38,
                            borderRadius: "12px",
                            background: blue.gradient,
                            color: "#fff",
                            fontSize: "0.8rem",
                            fontWeight: 700,
                            boxShadow: `0 4px 12px rgba(37,99,235,0.2)`
                        }}
                    >
                        {getInitials(params.value)}
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
                </Stack>
            )
        },

        {
            field: "type",
            headerName: "Type",
            flex: 1,
            minWidth: 140,

            renderCell: (params) => {
                const config = getPlanTypeConfig(params.value);
                return (
                    <Chip
                        icon={config.icon}
                        label={config.label}
                        size="small"
                        sx={{
                            height: 28,
                            borderRadius: "10px",
                            fontSize: "0.7rem",
                            fontWeight: 700,
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
            field: "monthlyPrice",
            headerName: "Prix mensuel",
            flex: 1,
            minWidth: 150,

            renderCell: (params) => (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: 0.5
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: "1rem",
                            fontWeight: 800,
                            color: blue.text
                        }}
                    >
                        {params.value} MAD
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: "0.65rem",
                            color: blue.textLight,
                            fontWeight: 600
                        }}
                    >
                        / mois
                    </Typography>
                </Box>
            )
        },

        {
            field: "maxEmployees",
            headerName: "Employés",
            flex: 0.8,
            minWidth: 120,

            renderCell: (params) => (
                <Stack direction="row" spacing={0.8} alignItems="center">
                    <PeopleIcon sx={{ fontSize: 16, color: blue.textLight }} />
                    <Typography
                        sx={{
                            fontSize: "0.8rem",
                            color: blue.text,
                            fontWeight: 600
                        }}
                    >
                        {params.value || "Illimité"}
                    </Typography>
                </Stack>
            )
        },

        {
            field: "maxServices",
            headerName: "Services",
            flex: 0.8,
            minWidth: 120,

            renderCell: (params) => (
                <Stack direction="row" spacing={0.8} alignItems="center">
                    <DesignServicesIcon sx={{ fontSize: 16, color: blue.textLight }} />
                    <Typography
                        sx={{
                            fontSize: "0.8rem",
                            color: blue.text,
                            fontWeight: 600
                        }}
                    >
                        {params.value || "Illimité"}
                    </Typography>
                </Stack>
            )
        },

        {
            field: "maxAppointmentsPerMonth",
            headerName: "Rendez-vous",
            flex: 1.2,
            minWidth: 150,

            renderCell: (params) => (
                <Stack direction="row" spacing={0.8} alignItems="center">
                    <CalendarMonthIcon sx={{ fontSize: 16, color: blue.textLight }} />
                    <Typography
                        sx={{
                            fontSize: "0.8rem",
                            color: blue.text,
                            fontWeight: 600
                        }}
                    >
                        {params.value || "Illimité"}
                    </Typography>
                </Stack>
            )
        },

        {
            field: "active",
            headerName: "Statut",
            flex: 0.8,
            minWidth: 120,

            renderCell: (params) => {
                const active = params.value;
                return (
                    <Chip
                        label={active ? "Actif" : "Inactif"}
                        size="small"
                        sx={{
                            height: 28,
                            borderRadius: "10px",
                            px: 0.5,
                            fontSize: "0.65rem",
                            fontWeight: 700,
                            letterSpacing: "0.3px",
                            backgroundColor: active
                                ? "rgba(67, 233, 123, 0.12)"
                                : "rgba(245, 87, 108, 0.12)",
                            color: active
                                ? "#43e97b"
                                : "#f5576c",
                            border: `1px solid ${
                                active
                                    ? "rgba(67, 233, 123, 0.2)"
                                    : "rgba(245, 87, 108, 0.2)"
                            }`
                        }}
                    />
                );
            }
        },

        {
            field: "actions",
            headerName: "Actions",
            width: 130,
            sortable: false,
            filterable: false,

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
                                borderRadius: "10px",
                                color: blue.textLight,
                                transition: "all 0.2s ease",
                                "&:hover": {
                                    backgroundColor: blue.bg,
                                    color: blue.main,
                                    transform: "scale(1.05)"
                                }
                            }}
                        >
                            <EditOutlinedIcon sx={{ fontSize: 19 }} />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Supprimer" arrow>
                        <IconButton
                            onClick={() => onDelete(params.row.id)}
                            sx={{
                                width: 36,
                                height: 36,
                                borderRadius: "10px",
                                color: blue.textLight,
                                transition: "all 0.2s ease",
                                "&:hover": {
                                    backgroundColor: "rgba(245,87,108,0.08)",
                                    color: "#f5576c",
                                    transform: "scale(1.05)"
                                }
                            }}
                        >
                            <DeleteIcon sx={{ fontSize: 19 }} />
                        </IconButton>
                    </Tooltip>
                </Stack>
            )
        }
    ];

    return (
        <Paper
            elevation={0}
            sx={{
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
            <Box
                sx={{
                    px: 3,
                    py: 2.5,
                    display: "flex",
                    flexDirection: {
                        xs: "column",
                        sm: "row"
                    },
                    alignItems: {
                        xs: "flex-start",
                        sm: "center"
                    },
                    justifyContent: "space-between",
                    gap: 2,
                    background: "rgba(37,99,235,0.02)",
                    borderBottom: "1px solid rgba(0,0,0,0.04)",
                    borderRadius: "20px 20px 0 0"
                }}
            >
                <Box>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.2,
                            mb: 0.5
                        }}
                    >
                        <SellIcon sx={{ color: blue.main, fontSize: 24 }} />
                        <Typography
                            sx={{
                                fontSize: "1.1rem",
                                fontWeight: 800,
                                color: blue.text
                            }}
                        >
                            Plans
                        </Typography>
                        <Chip
                            label={`${filteredRows.length} total`}
                            size="small"
                            sx={{
                                height: 22,
                                backgroundColor: blue.bg,
                                color: blue.main,
                                fontWeight: 700,
                                fontSize: "0.65rem"
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
                        Gérez vos plans d'abonnement
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        gap: 1.5,
                        flexDirection: { xs: "column", sm: "row" },
                        width: { xs: "100%", sm: "auto" }
                    }}
                >
                    <FormControl
                        size="small"
                        sx={{
                            minWidth: 130,
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "12px",
                                backgroundColor: "rgba(255,255,255,0.03)",
                                color: blue.text,
                                "& fieldset": {
                                    borderColor: "rgba(0,0,0,0.08)"
                                },
                                "&:hover fieldset": {
                                    borderColor: blue.border
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: blue.main
                                }
                            },
                            "& .MuiInputLabel-root": {
                                color: blue.textLight,
                                "&.Mui-focused": {
                                    color: blue.main
                                }
                            }
                        }}
                    >
                        <InputLabel>Type</InputLabel>
                        <Select
                            value={typeFilter}
                            label="Type"
                            onChange={(e) => setTypeFilter(e.target.value)}
                        >
                            <MenuItem value="all">Tous</MenuItem>
                            <MenuItem value="BASIC">Basique</MenuItem>
                            <MenuItem value="PREMIUM">Premium</MenuItem>
                            <MenuItem value="ENTERPRISE">Entreprise</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl
                        size="small"
                        sx={{
                            minWidth: 130,
                            "& .MuiOutlinedInput-root": {
                                borderRadius: "12px",
                                backgroundColor: "rgba(255,255,255,0.03)",
                                color: blue.text,
                                "& fieldset": {
                                    borderColor: "rgba(0,0,0,0.08)"
                                },
                                "&:hover fieldset": {
                                    borderColor: blue.border
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: blue.main
                                }
                            },
                            "& .MuiInputLabel-root": {
                                color: blue.textLight,
                                "&.Mui-focused": {
                                    color: blue.main
                                }
                            }
                        }}
                    >
                        <InputLabel>Statut</InputLabel>
                        <Select
                            value={statusFilter}
                            label="Statut"
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <MenuItem value="all">Tous</MenuItem>
                            <MenuItem value="active">Actif</MenuItem>
                            <MenuItem value="inactive">Inactif</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        size="small"
                        placeholder="Rechercher..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={{
                            width: { xs: "100%", sm: 200 },
                            "& .MuiOutlinedInput-root": {
                                height: 42,
                                borderRadius: "12px",
                                backgroundColor: "rgba(255,255,255,0.03)",
                                fontSize: "0.8rem",
                                transition: "all 0.3s ease",
                                color: blue.text,
                                "& fieldset": {
                                    borderColor: "rgba(0,0,0,0.08)"
                                },
                                "&:hover fieldset": {
                                    borderColor: blue.border
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: blue.main,
                                    borderWidth: "2px"
                                }
                            },
                            "& .MuiInputBase-input": {
                                color: blue.text
                            }
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon
                                        sx={{
                                            fontSize: 20,
                                            color: blue.textLight
                                        }}
                                    />
                                </InputAdornment>
                            )
                        }}
                    />
                </Box>
            </Box>

            <DataGrid
                rows={filteredRows}
                columns={columns}
                autoHeight
                loading={loading}
                pageSizeOptions={[5, 10, 20, 50]}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 10
                        }
                    }
                }}
                disableRowSelectionOnClick
                disableColumnMenu
                sx={{
                    border: "none",
                    fontFamily: "inherit",
                    color: blue.text,

                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: "rgba(37,99,235,0.02)",
                        borderBottom: "1px solid rgba(0,0,0,0.04)",
                        minHeight: "54px !important",
                        maxHeight: "54px !important"
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
                        px: 2,
                        py: 1.5,
                        color: blue.text
                    },

                    "& .MuiDataGrid-row": {
                        transition: "all 0.2s ease"
                    },

                    "& .MuiDataGrid-row:hover": {
                        backgroundColor: "rgba(37,99,235,0.02)"
                    },

                    "& .MuiDataGrid-row.Mui-selected": {
                        backgroundColor: "rgba(37,99,235,0.06)"
                    },

                    "& .MuiDataGrid-footerContainer": {
                        borderTop: "1px solid rgba(0,0,0,0.04)",
                        backgroundColor: "rgba(248,250,252,0.5)",
                        minHeight: 58,
                        borderRadius: "0 0 20px 20px",
                        color: blue.textLight
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
                            backgroundColor: "rgba(0,0,0,0.02)",
                            borderRadius: 10
                        },
                        "&::-webkit-scrollbar-thumb": {
                            backgroundColor: "rgba(0,0,0,0.1)",
                            borderRadius: 10,
                            "&:hover": {
                                backgroundColor: "rgba(0,0,0,0.2)"
                            }
                        }
                    },

                    "& .MuiDataGrid-overlay": {
                        backgroundColor: "transparent",
                        color: blue.textLight
                    },

                    "& .MuiDataGrid-loadingOverlay": {
                        backgroundColor: "rgba(255,255,255,0.8)",
                        color: blue.text
                    }
                }}
            />
        </Paper>
    );
}