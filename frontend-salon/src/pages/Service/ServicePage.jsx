import React, { useEffect, useMemo, useState } from "react";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  Fade,
} from "@mui/material";

import {
  Add,
  AccessTime,
  AttachMoney,
  Calculate,
  CheckCircle,
  Clear,
  Delete,
  Description,
  Edit,
  Inventory2,
  Search,
  Spa,
  Close,
  TrendingUp,
  Layers,
} from "@mui/icons-material";

import { toast } from "react-toastify";

import { useParams } from "react-router-dom";

import {
  createService,
  deleteService,
  getServicesByCompany,
  updateService,
} from "../../api/serviceApi";

import { getStockByCompany } from "../../api/stockApi";
import { getCompanyTheme } from "../../utils/companyThemes";

const createEmptyForm = () => ({
  name: "",
  duration: "",
  description: "",
  workerFee: "",
  extraFee: "",
  items: [],
});

export default function ServicePage() {
  const { id: companyId } = useParams();

  const [services, setServices] = useState([]);
  const [stockItems, setStockItems] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState(createEmptyForm());
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const theme = getCompanyTheme(companyId || 0);

  // =========================================================
  // DATA
  // =========================================================

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [servicesData, stockData] = await Promise.all([
        getServicesByCompany(companyId),
        getStockByCompany(companyId),
      ]);

      setServices(Array.isArray(servicesData) ? servicesData : []);
      setStockItems(Array.isArray(stockData) ? stockData : []);
    } catch (err) {
      console.error("ÉCHEC DU CHARGEMENT DES SERVICES :", err);

      setError(
        err?.response?.data?.message ||
          "Impossible de charger les services et le stock."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!companyId) return;

    loadData();
  }, [companyId]);

  // =========================================================
  // FILTER
  // =========================================================

  const filteredServices = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return services;

    return services.filter((service) => {
      const name = service.name?.toLowerCase() || "";
      const description = service.description?.toLowerCase() || "";

      return name.includes(value) || description.includes(value);
    });
  }, [services, search]);

  // =========================================================
  // STATS
  // =========================================================

  const totalServices = services.length;

  const availableServices = services.filter(
    (service) => service.available
  ).length;

  const unavailableServices = totalServices - availableServices;

  const averageDuration =
    services.length > 0
      ? Math.round(
          services.reduce(
            (total, service) => total + Number(service.duration || 0),
            0
          ) / services.length
        )
      : 0;

  const averagePrice =
    services.length > 0
      ? Math.round(
          services.reduce(
            (total, service) => total + Number(service.totalPrice || 0),
            0
          ) / services.length
        )
      : 0;

  // =========================================================
  // FORM
  // =========================================================

  const openCreate = () => {
    setEditingId(null);
    setForm(createEmptyForm());
    setError("");
    setOpen(true);
  };

  const openEdit = (service) => {
    setEditingId(service.id);

    setForm({
      name: service.name || "",
      duration: service.duration ?? "",
      description: service.description || "",
      workerFee: service.workerFee ?? "",
      extraFee: service.extraFee ?? "",
      items: Array.isArray(service.items)
        ? service.items.map((item) => ({
            stockItemId:
              item.stockItemId != null ? String(item.stockItemId) : "",
            quantityUsed: item.quantityUsed ?? "",
          }))
        : [],
    });

    setError("");
    setOpen(true);
  };

  const closeDialog = () => {
    if (saving) return;

    setOpen(false);
    setEditingId(null);
    setForm(createEmptyForm());
    setError("");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================================================
  // STOCK ITEMS
  // =========================================================

  const addStockItem = () => {
    setForm((previous) => ({
      ...previous,
      items: [
        ...previous.items,
        {
          stockItemId: "",
          quantityUsed: "",
        },
      ],
    }));
  };

  const removeStockItem = (index) => {
    setForm((previous) => ({
      ...previous,
      items: previous.items.filter((_, i) => i !== index),
    }));
  };

  const updateStockItem = (index, field, value) => {
    setForm((previous) => ({
      ...previous,
      items: previous.items.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      ),
    }));
  };

  const getStockItem = (id) => {
    if (id === "" || id === null || id === undefined) {
      return null;
    }

    return stockItems.find(
      (item) => Number(item.id) === Number(id)
    );
  };

  // =========================================================
  // PRICE CALCULATION
  // =========================================================

  const calculateMaterialCost = () => {
    return form.items.reduce((total, item) => {
      const stock = getStockItem(item.stockItemId);

      if (!stock) return total;

      const packagePrice = Number(stock.price || 0);
      const packageQuantity = Number(stock.quantity || 0);
      const quantityUsed = Number(item.quantityUsed || 0);

      if (packageQuantity <= 0 || quantityUsed <= 0) {
        return total;
      }

      return (
        total +
        packagePrice * (quantityUsed / packageQuantity)
      );
    }, 0);
  };

  const materialCost = calculateMaterialCost();
  const workerFee = Number(form.workerFee || 0);
  const extraFee = Number(form.extraFee || 0);
  const totalPrice = materialCost + workerFee + extraFee;

  // =========================================================
  // VALIDATION
  // =========================================================

  const validateForm = () => {
    if (!form.name.trim()) {
      toast.error("Le nom du service est requis.");
      return false;
    }

    if (!form.duration || Number(form.duration) <= 0) {
      toast.error("La durée doit être supérieure à 0.");
      return false;
    }

    if (Number(form.workerFee || 0) < 0) {
      toast.error("Les frais de main-d'œuvre ne peuvent pas être négatifs.");
      return false;
    }

    if (Number(form.extraFee || 0) < 0) {
      toast.error("Les frais supplémentaires ne peuvent pas être négatifs.");
      return false;
    }

    for (let i = 0; i < form.items.length; i++) {
      const item = form.items[i];

      if (!item.stockItemId) {
        toast.error(
          `Sélectionnez un article de stock pour le matériau #${i + 1}.`
        );
        return false;
      }

      if (!item.quantityUsed || Number(item.quantityUsed) <= 0) {
        toast.error(
          `La quantité utilisée doit être supérieure à 0 pour le matériau #${
            i + 1
          }.`
        );
        return false;
      }
    }

    return true;
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);

      const payload = {
        companyId: Number(companyId),
        name: form.name.trim(),
        duration: Number(form.duration),
        description: form.description.trim(),
        workerFee:
          form.workerFee === "" ? 0 : Number(form.workerFee),
        extraFee:
          form.extraFee === "" ? 0 : Number(form.extraFee),
        items: form.items.map((item) => ({
          stockItemId: Number(item.stockItemId),
          quantityUsed: Number(item.quantityUsed),
        })),
      };

      if (editingId) {
        await updateService(editingId, payload);

        toast.success("Service mis à jour avec succès.");
      } else {
        await createService(payload);

        toast.success("Service créé avec succès.");
      }

      setOpen(false);
      setEditingId(null);
      setForm(createEmptyForm());

      await loadData();
    } catch (err) {
      console.error(
        "ÉCHEC DE L'ENREGISTREMENT DU SERVICE :",
        err
      );

      toast.error(
        err?.response?.data?.message ||
          "Impossible d'enregistrer le service."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // DELETE
  // =========================================================

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce service ?")) return;

    try {
      await deleteService(id);

      toast.success("Service supprimé avec succès.");

      await loadData();
    } catch (err) {
      console.error(
        "ÉCHEC DE LA SUPPRESSION DU SERVICE :",
        err
      );

      toast.error(
        err?.response?.data?.message ||
          "Impossible de supprimer le service."
      );
    }
  };

  // =========================================================
  // INPUT STYLE
  // =========================================================

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2.5,
      backgroundColor: "#fff",
      transition: "all .2s ease",

      "&:hover fieldset": {
        borderColor: theme.main,
      },

      "&.Mui-focused fieldset": {
        borderColor: theme.main,
        boxShadow: `0 0 0 4px ${theme.main}12`,
      },
    },
  };

  return (
    <Fade in timeout={500}>
      <Box
        sx={{
          width: "100%",
          minHeight: "100%",
          pb: 5,
        }}
      >
        {/* =====================================================
            HERO HEADER
        ====================================================== */}

        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 5,
            mb: 3,
            px: { xs: 2.5, md: 4 },
            py: { xs: 3, md: 3.5 },
            background: theme.gradient,
            boxShadow: `0 14px 40px ${theme.shadow}35`,
          }}
        >
          {/* Decorative shapes */}

          <Box
            sx={{
              position: "absolute",
              width: 220,
              height: 220,
              borderRadius: "50%",
              right: -70,
              top: -100,
              background: "rgba(255,255,255,.10)",
            }}
          />

          <Box
            sx={{
              position: "absolute",
              width: 120,
              height: 120,
              borderRadius: "50%",
              right: 100,
              bottom: -80,
              background: "rgba(255,255,255,.07)",
            }}
          />

          <Box
            sx={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", md: "center" },
              flexDirection: { xs: "column", md: "row" },
              gap: 3,
            }}
          >
            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  mb: 1,
                }}
              >
                <Box
                  sx={{
                    width: 46,
                    height: 46,
                    borderRadius: 2.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(255,255,255,.16)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <Spa sx={{ color: "#fff", fontSize: 25 }} />
                </Box>

                <Box>
                  <Typography
                    sx={{
                      color: "rgba(255,255,255,.65)",
                      fontSize: ".7rem",
                      fontWeight: 700,
                      letterSpacing: "1.5px",
                      textTransform: "uppercase",
                    }}
                  >
                    Catalogue
                  </Typography>

                  <Typography
                    sx={{
                      color: "#fff",
                      fontSize: { xs: "1.55rem", md: "1.8rem" },
                      fontWeight: 850,
                      lineHeight: 1.1,
                    }}
                  >
                    Services
                  </Typography>
                </Box>
              </Box>

              <Typography
                sx={{
                  color: "rgba(255,255,255,.78)",
                  maxWidth: 560,
                  fontSize: ".92rem",
                  lineHeight: 1.6,
                }}
              >
                Gérez vos prestations, leurs durées, leurs coûts
                et les matériaux utilisés.
              </Typography>
            </Box>

            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={openCreate}
              sx={{
                minHeight: 48,
                px: 2.5,
                borderRadius: 2.5,
                background: "#fff",
                color: theme.main,
                fontWeight: 800,
                boxShadow: "0 8px 25px rgba(0,0,0,.12)",
                "&:hover": {
                  background: "#fff",
                  transform: "translateY(-2px)",
                  boxShadow: "0 12px 30px rgba(0,0,0,.18)",
                },
                transition: "all .2s ease",
              }}
            >
              Nouveau service
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: 3,
            }}
            onClose={() => setError("")}
          >
            {error}
          </Alert>
        )}

        {/* =====================================================
            KPI STRIP
        ====================================================== */}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr 1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: 2,
            mb: 3,
          }}
        >
          <KpiCard
            label="Services"
            value={totalServices}
            description="au catalogue"
            icon={<Layers />}
            color="#2563eb"
            theme={theme}
          />

          <KpiCard
            label="Disponibles"
            value={availableServices}
            description={
              totalServices
                ? `${Math.round(
                    (availableServices / totalServices) * 100
                  )}% du catalogue`
                : "aucun service"
            }
            icon={<CheckCircle />}
            color="#22c55e"
            theme={theme}
          />

          <KpiCard
            label="Durée moyenne"
            value={`${averageDuration} min`}
            description="par prestation"
            icon={<AccessTime />}
            color="#f59e0b"
            theme={theme}
          />

          <KpiCard
            label="Prix moyen"
            value={`${averagePrice} MAD`}
            description="par prestation"
            icon={<TrendingUp />}
            color="#b76e79"
            theme={theme}
          />
        </Box>

        {/* =====================================================
            SEARCH / TOOLBAR
        ====================================================== */}

        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            border: `1px solid ${theme.border}25`,
            background: "#fff",
            boxShadow: `0 6px 25px ${theme.shadow}18`,
            p: 2,
            mb: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Box
              sx={{
                flex: 1,
                position: "relative",
              }}
            >
              <Search
                sx={{
                  position: "absolute",
                  left: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: theme.textLight,
                  zIndex: 1,
                }}
              />

              <TextField
                fullWidth
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Rechercher un service..."
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2.5,
                    pl: 4.5,
                    background: theme.bg || "#fafafa",

                    "& fieldset": {
                      borderColor: "transparent",
                    },

                    "&:hover fieldset": {
                      borderColor: `${theme.main}40`,
                    },

                    "&.Mui-focused fieldset": {
                      borderColor: theme.main,
                      boxShadow: `0 0 0 4px ${theme.main}10`,
                    },
                  },
                }}
              />
            </Box>

            {search && (
              <Tooltip title="Effacer la recherche">
                <IconButton
                  onClick={() => setSearch("")}
                  sx={{
                    width: 46,
                    height: 46,
                    color: theme.textLight,
                    background: `${theme.main}08`,
                    "&:hover": {
                      color: theme.main,
                      background: `${theme.main}12`,
                    },
                  }}
                >
                  <Clear />
                </IconButton>
              </Tooltip>
            )}
          </Box>

          <Box
            sx={{
              mt: 1.5,
              px: 1,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Typography
              sx={{
                color: theme.textLight,
                fontSize: ".78rem",
              }}
            >
              <strong
                style={{
                  color: theme.text,
                }}
              >
                {filteredServices.length}
              </strong>{" "}
              service{filteredServices.length !== 1 ? "s" : ""} affiché
              {filteredServices.length !== 1 ? "s" : ""}
            </Typography>

            {unavailableServices > 0 && (
              <Chip
                size="small"
                label={`${unavailableServices} indisponible${
                  unavailableServices > 1 ? "s" : ""
                }`}
                sx={{
                  height: 27,
                  borderRadius: 2,
                  fontSize: ".72rem",
                  fontWeight: 700,
                  color: "#ef4444",
                  background: "rgba(239,68,68,.08)",
                }}
              />
            )}
          </Box>
        </Paper>

        {/* =====================================================
            SERVICE TABLE
        ====================================================== */}

        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            border: `1px solid ${theme.border}25`,
            boxShadow: `0 8px 30px ${theme.shadow}18`,
            background: "#fff",
          }}
        >
          <Box
            sx={{
              px: { xs: 2, md: 3 },
              py: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: `1px solid ${theme.border}18`,
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontWeight: 800,
                  color: theme.text,
                  fontSize: "1rem",
                }}
              >
                Catalogue des prestations
              </Typography>

              <Typography
                sx={{
                  color: theme.textLight,
                  fontSize: ".76rem",
                  mt: 0.3,
                }}
              >
                Services proposés par votre salon
              </Typography>
            </Box>

            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: `${theme.main}09`,
                color: theme.main,
              }}
            >
              <Spa fontSize="small" />
            </Box>
          </Box>

          {loading ? (
            <Box
              sx={{
                height: 330,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress
                size={32}
                thickness={4}
                sx={{ color: theme.main }}
              />
            </Box>
          ) : filteredServices.length === 0 ? (
            <EmptyState
              search={search}
              theme={theme}
              onCreate={openCreate}
            />
          ) : (
            <TableContainer
              sx={{
                overflowX: "auto",
              }}
            >
              <Table
                sx={{
                  minWidth: 900,
                }}
              >
                <TableHead>
                  <TableRow
                    sx={{
                      background: `${theme.main}035`,
                    }}
                  >
                    <TableCell
                      sx={headerCell(theme)}
                    >
                      SERVICE
                    </TableCell>

                    <TableCell sx={headerCell(theme)}>
                      DURÉE
                    </TableCell>

                    <TableCell sx={headerCell(theme)}>
                      MATÉRIAUX
                    </TableCell>

                    <TableCell sx={headerCell(theme)}>
                      MAIN-D'ŒUVRE
                    </TableCell>

                    <TableCell sx={headerCell(theme)}>
                      SUPPLÉMENTS
                    </TableCell>

                    <TableCell sx={headerCell(theme)}>
                      PRIX
                    </TableCell>

                    <TableCell sx={headerCell(theme)}>
                      STATUT
                    </TableCell>

                    <TableCell
                      align="right"
                      sx={headerCell(theme)}
                    >
                      ACTIONS
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredServices.map((service) => (
                    <TableRow
                      key={service.id}
                      hover
                      sx={{
                        "& td": {
                          borderColor: `${theme.border}14`,
                        },

                        "&:hover": {
                          backgroundColor: `${theme.main}018`,
                        },

                        transition: "background .2s ease",
                      }}
                    >
                      {/* SERVICE */}

                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            minWidth: 220,
                          }}
                        >
                          <Avatar
                            sx={{
                              width: 42,
                              height: 42,
                              borderRadius: 2.5,
                              background: `${theme.main}10`,
                              color: theme.main,
                            }}
                          >
                            <Spa fontSize="small" />
                          </Avatar>

                          <Box>
                            <Typography
                              sx={{
                                fontWeight: 750,
                                color: theme.text,
                                fontSize: ".9rem",
                              }}
                            >
                              {service.name}
                            </Typography>

                            {service.description ? (
                              <Typography
                                sx={{
                                  mt: 0.3,
                                  color: theme.textLight,
                                  fontSize: ".72rem",
                                  maxWidth: 260,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {service.description}
                              </Typography>
                            ) : (
                              <Typography
                                sx={{
                                  mt: 0.3,
                                  color: theme.textLight,
                                  fontSize: ".72rem",
                                  fontStyle: "italic",
                                }}
                              >
                                Aucune description
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </TableCell>

                      {/* DURATION */}

                      <TableCell>
                        <Box
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 0.7,
                            px: 1.2,
                            py: 0.7,
                            borderRadius: 2,
                            background: `${theme.main}08`,
                            color: theme.main,
                          }}
                        >
                          <AccessTime sx={{ fontSize: 15 }} />

                          <Typography
                            sx={{
                              fontWeight: 700,
                              fontSize: ".78rem",
                            }}
                          >
                            {service.duration} min
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* MATERIAL */}

                      <TableCell>
                        <Typography
                          sx={{
                            color: theme.text,
                            fontWeight: 650,
                            fontSize: ".82rem",
                          }}
                        >
                          {Number(
                            service.materialCost || 0
                          ).toFixed(2)}{" "}
                          MAD
                        </Typography>
                      </TableCell>

                      {/* WORKER */}

                      <TableCell>
                        <Typography
                          sx={{
                            color: theme.text,
                            fontWeight: 650,
                            fontSize: ".82rem",
                          }}
                        >
                          {Number(
                            service.workerFee || 0
                          ).toFixed(2)}{" "}
                          MAD
                        </Typography>
                      </TableCell>

                      {/* EXTRA */}

                      <TableCell>
                        <Typography
                          sx={{
                            color: theme.text,
                            fontWeight: 650,
                            fontSize: ".82rem",
                          }}
                        >
                          {Number(
                            service.extraFee || 0
                          ).toFixed(2)}{" "}
                          MAD
                        </Typography>
                      </TableCell>

                      {/* TOTAL */}

                      <TableCell>
                        <Box>
                          <Typography
                            sx={{
                              fontWeight: 850,
                              color: theme.main,
                              fontSize: ".95rem",
                            }}
                          >
                            {Number(
                              service.totalPrice || 0
                            ).toFixed(2)}{" "}
                            MAD
                          </Typography>

                          <Typography
                            sx={{
                              fontSize: ".65rem",
                              color: theme.textLight,
                              mt: 0.2,
                            }}
                          >
                            prix de vente
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* STATUS */}

                      <TableCell>
                        <Chip
                          size="small"
                          icon={
                            service.available ? (
                              <CheckCircle
                                sx={{ fontSize: "15px !important" }}
                              />
                            ) : undefined
                          }
                          label={
                            service.available
                              ? "Disponible"
                              : "Indisponible"
                          }
                          sx={{
                            height: 28,
                            borderRadius: 2,
                            fontSize: ".7rem",
                            fontWeight: 750,
                            background: service.available
                              ? "rgba(34,197,94,.09)"
                              : "rgba(239,68,68,.08)",
                            color: service.available
                              ? "#16a34a"
                              : "#ef4444",

                            "& .MuiChip-icon": {
                              color: "inherit",
                            },
                          }}
                        />
                      </TableCell>

                      {/* ACTIONS */}

                      <TableCell align="right">
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: 0.5,
                          }}
                        >
                          <Tooltip title="Modifier">
                            <IconButton
                              size="small"
                              onClick={() =>
                                openEdit(service)
                              }
                              sx={{
                                width: 34,
                                height: 34,
                                color: theme.textLight,
                                borderRadius: 2,

                                "&:hover": {
                                  color: theme.main,
                                  background: `${theme.main}09`,
                                },
                              }}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Supprimer">
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleDelete(service.id)
                              }
                              sx={{
                                width: 34,
                                height: 34,
                                color: "#ef4444",
                                borderRadius: 2,

                                "&:hover": {
                                  background:
                                    "rgba(239,68,68,.08)",
                                },
                              }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        {/* =====================================================
            CREATE / EDIT DIALOG
        ====================================================== */}

        <Dialog
          open={open}
          onClose={closeDialog}
          fullWidth
          maxWidth="md"
          scroll="paper"
          PaperProps={{
            sx: {
              borderRadius: 4,
              overflow: "hidden",
              border: `1px solid ${theme.border}20`,
              boxShadow: "0 30px 80px rgba(0,0,0,.18)",
            },
          }}
        >
          {/* DIALOG HEADER */}

          <Box
            sx={{
              position: "relative",
              overflow: "hidden",
              px: { xs: 2.5, md: 3.5 },
              py: 2.8,
              background: theme.gradient,
            }}
          >
            <Box
              sx={{
                position: "absolute",
                width: 180,
                height: 180,
                borderRadius: "50%",
                right: -70,
                top: -100,
                background: "rgba(255,255,255,.09)",
              }}
            />

            <Box
              sx={{
                position: "relative",
                zIndex: 1,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                <Box
                  sx={{
                    width: 46,
                    height: 46,
                    borderRadius: 2.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(255,255,255,.15)",
                  }}
                >
                  <Spa
                    sx={{
                      color: "#fff",
                      fontSize: 24,
                    }}
                  />
                </Box>

                <Box>
                  <Typography
                    sx={{
                      color: "rgba(255,255,255,.65)",
                      fontSize: ".68rem",
                      textTransform: "uppercase",
                      letterSpacing: "1.4px",
                      fontWeight: 700,
                    }}
                  >
                    {editingId
                      ? "Modifier"
                      : "Nouvelle prestation"}
                  </Typography>

                  <Typography
                    sx={{
                      color: "#fff",
                      fontSize: "1.25rem",
                      fontWeight: 850,
                    }}
                  >
                    {editingId
                      ? "Modifier le service"
                      : "Créer un service"}
                  </Typography>
                </Box>
              </Box>

              <IconButton
                onClick={closeDialog}
                sx={{
                  color: "rgba(255,255,255,.7)",
                  "&:hover": {
                    color: "#fff",
                    background: "rgba(255,255,255,.1)",
                  },
                }}
              >
                <Close />
              </IconButton>
            </Box>
          </Box>

          <DialogContent
            sx={{
              p: { xs: 2, md: 3.5 },
              background: "#fafafa",
            }}
          >
            {/* =================================================
                SECTION 1 — BASIC INFO
            ================================================== */}

            <SectionTitle
              number="01"
              title="Informations du service"
              description="Définissez les informations principales de la prestation."
              theme={theme}
            />

            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid item xs={12} md={7}>
                <TextField
                  label="Nom du service *"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  fullWidth
                  placeholder="Ex. Coupe & brushing"
                  InputProps={{
                    startAdornment: (
                      <Spa
                        sx={{
                          color: theme.textLight,
                          mr: 1,
                          fontSize: 20,
                        }}
                      />
                    ),
                  }}
                  sx={inputSx}
                />
              </Grid>

              <Grid item xs={12} md={5}>
                <TextField
                  label="Durée *"
                  name="duration"
                  type="number"
                  value={form.duration}
                  onChange={handleChange}
                  fullWidth
                  placeholder="60"
                  InputProps={{
                    startAdornment: (
                      <AccessTime
                        sx={{
                          color: theme.textLight,
                          mr: 1,
                          fontSize: 20,
                        }}
                      />
                    ),
                    endAdornment: (
                      <Typography
                        sx={{
                          color: theme.textLight,
                          fontSize: ".8rem",
                        }}
                      >
                        minutes
                      </Typography>
                    ),
                  }}
                  inputProps={{
                    min: 1,
                  }}
                  sx={inputSx}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  multiline
                  minRows={3}
                  fullWidth
                  placeholder="Décrivez brièvement ce qui est inclus dans cette prestation..."
                  sx={inputSx}
                />
              </Grid>
            </Grid>

            {/* =================================================
                SECTION 2 — PRICING
            ================================================== */}

            <SectionTitle
              number="02"
              title="Tarification"
              description="Configurez les différents éléments qui composent le prix."
              theme={theme}
            />

            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <PricingInput
                  label="Main-d'œuvre"
                  name="workerFee"
                  value={form.workerFee}
                  onChange={handleChange}
                  icon={<AttachMoney />}
                  theme={theme}
                  helper="Rémunération liée à la prestation"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <PricingInput
                  label="Frais supplémentaires"
                  name="extraFee"
                  value={form.extraFee}
                  onChange={handleChange}
                  icon={<TrendingUp />}
                  theme={theme}
                  helper="Autres frais éventuels"
                />
              </Grid>
            </Grid>

            {/* =================================================
                SECTION 3 — MATERIALS
            ================================================== */}

            <SectionTitle
              number="03"
              title="Matériaux utilisés"
              description="Associez les articles de stock consommés pendant la prestation."
              theme={theme}
              action={
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Add />}
                  onClick={addStockItem}
                  sx={{
                    borderRadius: 2,
                    borderColor: `${theme.main}50`,
                    color: theme.main,
                    fontWeight: 700,
                    "&:hover": {
                      borderColor: theme.main,
                      background: `${theme.main}06`,
                    },
                  }}
                >
                  Ajouter
                </Button>
              }
            />

            {stockItems.length === 0 && (
              <Alert
                severity="warning"
                sx={{
                  mb: 2,
                  borderRadius: 2.5,
                }}
              >
                Aucun article de stock n'est disponible pour
                cette entreprise.
              </Alert>
            )}

            {form.items.length === 0 ? (
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  mb: 4,
                  textAlign: "center",
                  borderRadius: 3,
                  border: `1px dashed ${theme.border}60`,
                  background: "#fff",
                }}
              >
                <Inventory2
                  sx={{
                    color: theme.textLight,
                    fontSize: 34,
                    mb: 1,
                  }}
                />

                <Typography
                  sx={{
                    fontWeight: 700,
                    color: theme.text,
                    fontSize: ".9rem",
                  }}
                >
                  Aucun matériau ajouté
                </Typography>

                <Typography
                  sx={{
                    color: theme.textLight,
                    fontSize: ".75rem",
                    mt: 0.5,
                  }}
                >
                  Ajoutez les produits consommés pour calculer
                  automatiquement le coût.
                </Typography>
              </Paper>
            ) : (
              <Box sx={{ mb: 4 }}>
                {form.items.map((item, index) => {
                  const stock = getStockItem(
                    item.stockItemId
                  );

                  const packagePrice = Number(
                    stock?.price || 0
                  );

                  const packageQuantity = Number(
                    stock?.quantity || 0
                  );

                  const usedQuantity = Number(
                    item.quantityUsed || 0
                  );

                  const itemCost =
                    packageQuantity > 0
                      ? packagePrice *
                        (usedQuantity / packageQuantity)
                      : 0;

                  return (
                    <Paper
                      key={index}
                      elevation={0}
                      sx={{
                        p: 2,
                        mb: 1.5,
                        borderRadius: 3,
                        border: `1px solid ${theme.border}25`,
                        background: "#fff",
                      }}
                    >
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: {
                            xs: "1fr",
                            md: "1fr 180px 44px",
                          },
                          gap: 1.5,
                          alignItems: "center",
                        }}
                      >
                        <FormControl fullWidth>
                          <InputLabel>
                            Article de stock
                          </InputLabel>

                          <Select
                            value={item.stockItemId ?? ""}
                            label="Article de stock"
                            onChange={(event) =>
                              updateStockItem(
                                index,
                                "stockItemId",
                                String(event.target.value)
                              )
                            }
                            sx={{
                              borderRadius: 2.5,
                              background: "#fff",
                              "&:hover .MuiOutlinedInput-notchedOutline":
                                {
                                  borderColor: theme.main,
                                },
                              "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                {
                                  borderColor: theme.main,
                                  boxShadow: `0 0 0 4px ${theme.main}10`,
                                },
                            }}
                          >
                            <MenuItem value="">
                              <em>
                                Sélectionner un article
                              </em>
                            </MenuItem>

                            {stockItems.map((stockItem) => (
                              <MenuItem
                                key={stockItem.id}
                                value={String(stockItem.id)}
                              >
                                {stockItem.name} —{" "}
                                {stockItem.price} MAD /{" "}
                                {stockItem.quantity}{" "}
                                {stockItem.unit}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>

                        <TextField
                          label={`Quantité${
                            stock?.unit
                              ? ` (${stock.unit})`
                              : ""
                          }`}
                          type="number"
                          value={item.quantityUsed ?? ""}
                          onChange={(event) =>
                            updateStockItem(
                              index,
                              "quantityUsed",
                              event.target.value
                            )
                          }
                          inputProps={{
                            min: 0,
                            step: "0.01",
                          }}
                          sx={inputSx}
                        />

                        <Tooltip title="Supprimer">
                          <IconButton
                            onClick={() =>
                              removeStockItem(index)
                            }
                            disabled={saving}
                            sx={{
                              color: "#ef4444",
                              borderRadius: 2,

                              "&:hover": {
                                background:
                                  "rgba(239,68,68,.08)",
                              },
                            }}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Box>

                      {stock && (
                        <Box
                          sx={{
                            mt: 1.5,
                            pt: 1.5,
                            borderTop: `1px solid ${theme.border}18`,
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 2,
                            flexWrap: "wrap",
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: ".7rem",
                              color: theme.textLight,
                            }}
                          >
                            {stock.price} MAD /{" "}
                            {stock.quantity} {stock.unit}
                          </Typography>

                          <Typography
                            sx={{
                              fontSize: ".72rem",
                              color: theme.main,
                              fontWeight: 800,
                            }}
                          >
                            Coût : {itemCost.toFixed(2)} MAD
                          </Typography>
                        </Box>
                      )}
                    </Paper>
                  );
                })}
              </Box>
            )}

            {/* =================================================
                PRICE SUMMARY
            ================================================== */}

            <Paper
              elevation={0}
              sx={{
                position: "relative",
                overflow: "hidden",
                borderRadius: 3.5,
                border: `1px solid ${theme.main}20`,
                background: `${theme.main}05`,
                p: 2.5,
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  right: -35,
                  bottom: -55,
                  width: 130,
                  height: 130,
                  borderRadius: "50%",
                  background: `${theme.main}08`,
                }}
              />

              <Box
                sx={{
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 34,
                      height: 34,
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: `${theme.main}12`,
                      color: theme.main,
                    }}
                  >
                    <Calculate fontSize="small" />
                  </Box>

                  <Typography
                    sx={{
                      fontWeight: 800,
                      color: theme.text,
                    }}
                  >
                    Aperçu du prix
                  </Typography>
                </Box>

                <PriceLine
                  label="Coût des matériaux"
                  value={materialCost}
                  theme={theme}
                />

                <PriceLine
                  label="Main-d'œuvre"
                  value={workerFee}
                  theme={theme}
                />

                <PriceLine
                  label="Frais supplémentaires"
                  value={extraFee}
                  theme={theme}
                />

                <Divider
                  sx={{
                    my: 1.5,
                    borderColor: `${theme.border}30`,
                  }}
                />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        color: theme.text,
                        fontWeight: 800,
                        fontSize: ".95rem",
                      }}
                    >
                      Prix total
                    </Typography>

                    <Typography
                      sx={{
                        color: theme.textLight,
                        fontSize: ".68rem",
                      }}
                    >
                      Calcul automatique
                    </Typography>
                  </Box>

                  <Typography
                    sx={{
                      color: theme.main,
                      fontSize: "1.55rem",
                      fontWeight: 900,
                    }}
                  >
                    {totalPrice.toFixed(2)}{" "}
                    <span
                      style={{
                        fontSize: ".8rem",
                      }}
                    >
                      MAD
                    </span>
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </DialogContent>

          {/* DIALOG ACTIONS */}

          <DialogActions
            sx={{
              px: { xs: 2, md: 3.5 },
              py: 2,
              borderTop: `1px solid ${theme.border}18`,
              background: "#fff",
              gap: 1,
            }}
          >
            <Button
              onClick={closeDialog}
              disabled={saving}
              sx={{
                color: theme.textLight,
                borderRadius: 2.5,
                fontWeight: 700,
                px: 2,
              }}
            >
              Annuler
            </Button>

            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={saving}
              sx={{
                minWidth: 160,
                minHeight: 44,
                borderRadius: 2.5,
                background: theme.gradient,
                fontWeight: 800,
                boxShadow: `0 7px 20px ${theme.shadow}40`,
                "&:hover": {
                  background: theme.gradient,
                  transform: "translateY(-1px)",
                  boxShadow: `0 10px 25px ${theme.shadow}55`,
                },
                transition: "all .2s ease",
              }}
            >
              {saving ? (
                <CircularProgress
                  size={22}
                  sx={{ color: "#fff" }}
                />
              ) : editingId ? (
                "Enregistrer les modifications"
              ) : (
                "Créer le service"
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Fade>
  );
}

// =========================================================
// KPI CARD
// =========================================================

function KpiCard({
  label,
  value,
  description,
  icon,
  color,
  theme,
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        position: "relative",
        overflow: "hidden",
        p: 2.2,
        borderRadius: 3.5,
        border: `1px solid ${theme.border}20`,
        background: "#fff",
        boxShadow: `0 5px 22px ${theme.shadow}15`,
        transition: "all .25s ease",

        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: `0 10px 30px ${theme.shadow}25`,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            sx={{
              color: theme.textLight,
              fontSize: ".72rem",
              fontWeight: 700,
              mb: 0.6,
            }}
          >
            {label}
          </Typography>

          <Typography
            sx={{
              color: theme.text,
              fontSize: {
                xs: "1.35rem",
                md: "1.5rem",
              },
              fontWeight: 900,
              lineHeight: 1,
            }}
          >
            {value}
          </Typography>

          <Typography
            sx={{
              color: theme.textLight,
              fontSize: ".65rem",
              mt: 0.8,
            }}
          >
            {description}
          </Typography>
        </Box>

        <Box
          sx={{
            width: 42,
            height: 42,
            flexShrink: 0,
            borderRadius: 2.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: `${color}12`,
            color,
          }}
        >
          {icon}
        </Box>
      </Box>

      <Box
        sx={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width: 45,
          height: 3,
          borderRadius: "0 4px 0 0",
          background: color,
        }}
      />
    </Paper>
  );
}

// =========================================================
// SECTION TITLE
// =========================================================

function SectionTitle({
  number,
  title,
  description,
  theme,
  action,
}) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 2,
        mb: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.3,
        }}
      >
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: `${theme.main}10`,
            color: theme.main,
            fontSize: ".7rem",
            fontWeight: 900,
          }}
        >
          {number}
        </Box>

        <Box>
          <Typography
            sx={{
              color: theme.text,
              fontWeight: 800,
              fontSize: ".92rem",
            }}
          >
            {title}
          </Typography>

          <Typography
            sx={{
              color: theme.textLight,
              fontSize: ".68rem",
              mt: 0.2,
            }}
          >
            {description}
          </Typography>
        </Box>
      </Box>

      {action}
    </Box>
  );
}

// =========================================================
// PRICING INPUT
// =========================================================

function PricingInput({
  label,
  name,
  value,
  onChange,
  icon,
  theme,
  helper,
}) {
  return (
    <Box>
      <TextField
        label={label}
        name={name}
        type="number"
        value={value}
        onChange={onChange}
        fullWidth
        InputProps={{
          startAdornment: (
            <Box
              sx={{
                color: theme.textLight,
                mr: 1,
                display: "flex",
              }}
            >
              {React.cloneElement(icon, {
                sx: {
                  fontSize: 19,
                },
              })}
            </Box>
          ),
          endAdornment: (
            <Typography
              sx={{
                color: theme.textLight,
                fontSize: ".75rem",
              }}
            >
              MAD
            </Typography>
          ),
        }}
        inputProps={{
          min: 0,
          step: "0.01",
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 2.5,
            background: "#fff",

            "&:hover fieldset": {
              borderColor: theme.main,
            },

            "&.Mui-focused fieldset": {
              borderColor: theme.main,
              boxShadow: `0 0 0 4px ${theme.main}10`,
            },
          },
        }}
      />

      <Typography
        sx={{
          color: theme.textLight,
          fontSize: ".64rem",
          mt: 0.6,
          ml: 0.5,
        }}
      >
        {helper}
      </Typography>
    </Box>
  );
}

// =========================================================
// PRICE LINE
// =========================================================

function PriceLine({ label, value, theme }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 1,
      }}
    >
      <Typography
        sx={{
          color: theme.textLight,
          fontSize: ".75rem",
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          color: theme.text,
          fontSize: ".78rem",
          fontWeight: 700,
        }}
      >
        {Number(value || 0).toFixed(2)} MAD
      </Typography>
    </Box>
  );
}

// =========================================================
// EMPTY STATE
// =========================================================

function EmptyState({ search, theme, onCreate }) {
  return (
    <Box
      sx={{
        py: 8,
        px: 3,
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          width: 70,
          height: 70,
          borderRadius: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mx: "auto",
          mb: 2,
          background: `${theme.main}09`,
          color: theme.main,
        }}
      >
        {search ? (
          <Search sx={{ fontSize: 32 }} />
        ) : (
          <Spa sx={{ fontSize: 32 }} />
        )}
      </Box>

      <Typography
        sx={{
          color: theme.text,
          fontWeight: 800,
          fontSize: "1rem",
        }}
      >
        {search
          ? "Aucun service trouvé"
          : "Votre catalogue est vide"}
      </Typography>

      <Typography
        sx={{
          color: theme.textLight,
          fontSize: ".76rem",
          mt: 0.7,
          maxWidth: 380,
          mx: "auto",
          lineHeight: 1.6,
        }}
      >
        {search
          ? "Essayez avec un autre nom ou une autre description."
          : "Commencez par ajouter les prestations proposées par votre salon."}
      </Typography>

      {!search && (
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={onCreate}
          sx={{
            mt: 2.5,
            borderRadius: 2.5,
            background: theme.gradient,
            fontWeight: 800,
          }}
        >
          Ajouter le premier service
        </Button>
      )}
    </Box>
  );
}

// =========================================================
// TABLE HEADER STYLE
// =========================================================

function headerCell(theme) {
  return {
    color: theme.textLight,
    fontSize: ".65rem",
    fontWeight: 850,
    letterSpacing: ".6px",
    borderBottom: `1px solid ${theme.border}20`,
    py: 1.7,
    whiteSpace: "nowrap",
  };
}