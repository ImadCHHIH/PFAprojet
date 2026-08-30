import { useState } from "react";

import {
    Box,
    Chip,
    IconButton,
    Paper,
    TextField,
    InputAdornment,
    Tooltip,
    Avatar,
    Stack,
    Typography,
    Fade,
    MenuItem,
    Select,
    FormControl,
    InputLabel
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import StorefrontIcon from "@mui/icons-material/Storefront";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";

import { DataGrid } from "@mui/x-data-grid";

export default function CompanyTable({
    rows,
    onEdit,
    onDelete,
    loading
}) {
    const [search, setSearch] = useState("");
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

    const filteredRows = rows.filter((company) => {
        const searchValue = search.toLowerCase().trim();
        const matchesSearch = 
            company.name?.toLowerCase().includes(searchValue) ||
            company.email?.toLowerCase().includes(searchValue) ||
            company.city?.toLowerCase().includes(searchValue) ||
            company.ownerName?.toLowerCase().includes(searchValue);

        const matchesStatus = statusFilter === "all" || company.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getInitials = (name) => {
        if (!name) return "C";
        return name.charAt(0).toUpperCase();
    };

    const getStatusColors = (status) => {
        switch (status) {
            case "ACTIVE":
                return {
                    bg: "rgba(67, 233, 123, 0.12)",
                    color: "#43e97b",
                    border: "rgba(67, 233, 123, 0.2)",
                    label: "Actif"
                };
            case "INACTIVE":
                return {
                    bg: "rgba(245, 87, 108, 0.12)",
                    color: "#f5576c",
                    border: "rgba(245, 87, 108, 0.2)",
                    label: "Inactif"
                };
            case "TRIAL":
                return {
                    bg: "rgba(79, 172, 254, 0.12)",
                    color: "#4facfe",
                    border: "rgba(79, 172, 254, 0.2)",
                    label: "Essai"
                };
            default:
                return {
                    bg: "rgba(255,255,255,0.05)",
                    color: blue.textLight,
                    border: "rgba(255,255,255,0.05)",
                    label: status || "Inconnu"
                };
        }
    };

    const columns = [
        {
            field: "name",
            headerName: "Entreprise",
            flex: 1.8,
            minWidth: 220,

            renderCell: (params) => (
                <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                    sx={{ height: "100%" }}
                >
                    <Avatar
                        src={
                            params.row.logo
                                ? `http://localhost:8080${params.row.logo}`
                                : undefined
                        }
                        alt={params.row.name}
                        sx={{
                            width: 42,
                            height: 42,
                            borderRadius: "12px",
                            background: blue.gradient,
                            color: "#FFFFFF",
                            fontSize: "0.9rem",
                            fontWeight: 800,
                            boxShadow: `0 4px 12px rgba(37,99,235,0.2)`
                        }}
                    >
                        {!params.row.logo && getInitials(params.row.name)}
                    </Avatar>

                    <Box>
                        <Typography
                            sx={{
                                fontSize: "0.85rem",
                                fontWeight: 700,
                                color: blue.text,
                                lineHeight: 1.3
                            }}
                        >
                            {params.row.name}
                        </Typography>

                        {params.row.city && (
                            <Typography
                                sx={{
                                    fontSize: "0.7rem",
                                    color: blue.textLight,
                                    mt: 0.2,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5
                                }}
                            >
                                <LocationOnIcon sx={{ fontSize: 12 }} />
                                {params.row.city}
                            </Typography>
                        )}
                    </Box>
                </Stack>
            )
        },

        {
            field: "email",
            headerName: "Email",
            flex: 1.5,
            minWidth: 200,

            renderCell: (params) => (
                <Stack direction="row" spacing={1} alignItems="center">
                    <EmailIcon sx={{ fontSize: 16, color: blue.textLight }} />
                    <Typography
                        sx={{
                            fontSize: "0.8rem",
                            color: blue.textLight,
                            fontWeight: 500
                        }}
                    >
                        {params.value}
                    </Typography>
                </Stack>
            )
        },

        {
            field: "ownerName",
            headerName: "Propriétaire",
            flex: 1.6,
            minWidth: 200,

            renderCell: (params) =>
                params.row.ownerName ? (
                    <Stack
                        direction="row"
                        spacing={1.2}
                        alignItems="center"
                        sx={{ height: "100%" }}
                    >
                        <Avatar
                            sx={{
                                width: 32,
                                height: 32,
                                borderRadius: "8px",
                                background: blue.bg,
                                color: blue.main,
                                fontSize: "0.7rem",
                                fontWeight: 700
                            }}
                        >
                            {params.row.ownerName?.charAt(0) || "O"}
                        </Avatar>

                        <Box>
                            <Typography
                                sx={{
                                    fontSize: "0.8rem",
                                    fontWeight: 700,
                                    color: blue.text
                                }}
                            >
                                {params.row.ownerName}
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: "0.65rem",
                                    color: blue.textLight
                                }}
                            >
                                {params.row.ownerEmail}
                            </Typography>
                        </Box>
                    </Stack>
                ) : (
                    <Chip
                        label="Sans propriétaire"
                        size="small"
                        sx={{
                            height: 26,
                            borderRadius: "8px",
                            backgroundColor: "rgba(255,255,255,0.04)",
                            color: blue.textLight,
                            border: `1px solid rgba(255,255,255,0.06)`,
                            fontSize: "0.65rem",
                            fontWeight: 700
                        }}
                    />
                )
        },

        {
            field: "phone",
            headerName: "Téléphone",
            flex: 1,
            minWidth: 130,

            renderCell: (params) => (
                <Stack direction="row" spacing={1} alignItems="center">
                    <PhoneIcon sx={{ fontSize: 14, color: blue.textLight }} />
                    <Typography
                        sx={{
                            fontSize: "0.78rem",
                            color: blue.textLight
                        }}
                    >
                        {params.value || "—"}
                    </Typography>
                </Stack>
            )
        },

        {
            field: "city",
            headerName: "Ville",
            flex: 0.8,
            minWidth: 110,

            renderCell: (params) => (
                <Typography
                    sx={{
                        fontSize: "0.78rem",
                        color: blue.textLight
                    }}
                >
                    {params.value || "—"}
                </Typography>
            )
        },

        {
            field: "status",
            headerName: "Statut",
            flex: 0.8,
            minWidth: 120,

            renderCell: (params) => {
                const status = getStatusColors(params.value);
                return (
                    <Chip
                        label={status.label}
                        size="small"
                        sx={{
                            height: 28,
                            borderRadius: "10px",
                            px: 0.5,
                            fontSize: "0.65rem",
                            fontWeight: 700,
                            letterSpacing: "0.3px",
                            backgroundColor: status.bg,
                            color: status.color,
                            border: `1px solid ${status.border}`
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
                        <BusinessIcon sx={{ color: blue.main, fontSize: 24 }} />
                        <Typography
                            sx={{
                                fontSize: "1.1rem",
                                fontWeight: 800,
                                color: blue.text
                            }}
                        >
                            Entreprises
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
                        Gérez vos entreprises enregistrées
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
                        <InputLabel>Statut</InputLabel>
                        <Select
                            value={statusFilter}
                            label="Statut"
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <MenuItem value="all">Tous</MenuItem>
                            <MenuItem value="ACTIVE">Actif</MenuItem>
                            <MenuItem value="INACTIVE">Inactif</MenuItem>
                            <MenuItem value="TRIAL">Essai</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        size="small"
                        placeholder="Rechercher..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={{
                            width: { xs: "100%", sm: 220 },
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