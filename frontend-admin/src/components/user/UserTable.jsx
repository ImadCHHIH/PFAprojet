import {
    Chip,
    IconButton,
    Tooltip,
    Box,
    Avatar,
    Typography,
    Stack
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import LockPersonIcon from "@mui/icons-material/LockPerson";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";

import { DataGrid } from "@mui/x-data-grid";
import { Paper } from "@mui/material";

export default function UserTable({
    rows,
    onEdit,
    onToggle
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

    const columns = [
        {
            field: "firstName",
            headerName: "Utilisateur",
            flex: 1.5,
            minWidth: 200,

            renderCell: (params) => (
                <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                    sx={{ height: "100%" }}
                >
                    <Avatar
                        sx={{
                            width: 36,
                            height: 36,
                            background: `linear-gradient(135deg, ${blue.main} 0%, ${blue.light} 100%)`,
                            color: "#fff",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            boxShadow: `0 4px 12px rgba(37,99,235,0.2)`
                        }}
                    >
                        {params.row.firstName?.charAt(0)}
                        {params.row.lastName?.charAt(0)}
                    </Avatar>

                    <Box>
                        <Typography
                            sx={{
                                fontSize: "0.85rem",
                                fontWeight: 700,
                                color: blue.text
                            }}
                        >
                            {params.row.firstName} {params.row.lastName}
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: "0.7rem",
                                color: blue.textLight,
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5
                            }}
                        >
                            <EmailIcon sx={{ fontSize: 12 }} />
                            {params.row.email}
                        </Typography>
                    </Box>
                </Stack>
            )
        },

        {
            field: "phone",
            headerName: "Téléphone",
            flex: 0.8,
            minWidth: 130,

            renderCell: (params) => (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.8
                    }}
                >
                    <PhoneIcon sx={{ fontSize: 16, color: blue.textLight }} />
                    <Typography
                        sx={{
                            fontSize: "0.8rem",
                            color: blue.textLight
                        }}
                    >
                        {params.value || "—"}
                    </Typography>
                </Box>
            )
        },

        {
            field: "active",
            headerName: "Statut",
            width: 140,
            renderCell: (params) => (
                <Chip
                    label={params.value ? "Actif" : "Inactif"}
                    size="small"
                    sx={{
                        height: 28,
                        borderRadius: "10px",
                        px: 0.5,
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        letterSpacing: "0.3px",
                        backgroundColor: params.value
                            ? "rgba(67, 233, 123, 0.12)"
                            : "rgba(245, 87, 108, 0.12)",
                        color: params.value
                            ? "#43e97b"
                            : "#f5576c",
                        border: `1px solid ${
                            params.value
                                ? "rgba(67, 233, 123, 0.2)"
                                : "rgba(245, 87, 108, 0.2)"
                        }`
                    }}
                />
            )
        },

        {
            field: "role",
            headerName: "Rôle",
            width: 130,
            renderCell: (params) => (
                <Chip
                    label={params.value || "Utilisateur"}
                    size="small"
                    sx={{
                        height: 26,
                        borderRadius: "8px",
                        backgroundColor: blue.bg,
                        color: blue.main,
                        fontWeight: 700,
                        fontSize: "0.7rem"
                    }}
                />
            )
        },

        {
            field: "actions",
            headerName: "Actions",
            width: 140,
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
                            <EditIcon sx={{ fontSize: 19 }} />
                        </IconButton>
                    </Tooltip>

                    <Tooltip
                        title={params.row.active ? "Désactiver" : "Activer"}
                        arrow
                    >
                        <IconButton
                            onClick={() => onToggle(params.row.id)}
                            sx={{
                                width: 36,
                                height: 36,
                                borderRadius: "10px",
                                transition: "all 0.2s ease",
                                color: params.row.active ? "#f5576c" : "#43e97b",
                                "&:hover": {
                                    backgroundColor: params.row.active
                                        ? "rgba(245, 87, 108, 0.08)"
                                        : "rgba(67, 233, 123, 0.08)",
                                    transform: "scale(1.05)"
                                }
                            }}
                        >
                            {params.row.active
                                ? <LockPersonIcon sx={{ fontSize: 19 }} />
                                : <LockOpenIcon sx={{ fontSize: 19 }} />
                            }
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
            <DataGrid
                rows={rows}
                columns={columns}
                autoHeight
                pageSizeOptions={[10, 25, 50]}
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

                    "& .MuiDataGrid-columnHeaders": {
                        background: "linear-gradient(135deg, #f8fafc 0%, #eef2f7 100%)",
                        borderBottom: "1px solid rgba(0,0,0,0.04)",
                        minHeight: "54px !important",
                        maxHeight: "54px !important",
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
                        px: 2,
                        py: 1.5
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
                        minHeight: 58,
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