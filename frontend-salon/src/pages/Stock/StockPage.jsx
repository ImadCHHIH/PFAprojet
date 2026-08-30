import React, { useEffect, useMemo, useState } from "react";

import {
  Alert,
  Box,
  Avatar,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  Fade,
  Tooltip,
  InputAdornment,
  Divider,
  LinearProgress,
} from "@mui/material";

import {
  Add,
  Search,
  Clear,
  Inventory2,
  WarningAmber,
  Error,
  CheckCircle,
  Edit,
  Delete,
  Close,
  Image,
  AttachMoney,
  Category,
  TrendingUp,
  TrendingDown,
} from "@mui/icons-material";

import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { getCompanyTheme } from "../../utils/companyThemes";

const API_URL = "http://localhost:8080";

const emptyForm = {
  name: "",
  quantity: "",
  unit: "ML",
  price: "",
};

export default function StockPage() {
  const { id: companyId } = useParams();
  const theme = getCompanyTheme(companyId || 0);

  // =========================================================
  // STATE
  // =========================================================

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const token = localStorage.getItem("salonToken");

  // =========================================================
  // LOAD STOCK
  // =========================================================

  const loadStock = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(`${API_URL}/stock/company/${companyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("FAILED TO LOAD STOCK:", err);
      setError(err.response?.data?.message || "Impossible de charger le stock.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (companyId) loadStock();
  }, [companyId]);

  // =========================================================
  // STATS
  // =========================================================

  const totalItems = items.length;
  const lowStockCount = items.filter((item) => item.availability === "LOW_STOCK").length;
  const outOfStockCount = items.filter((item) => item.availability === "OUT_OF_STOCK").length;
  const totalStockValue = items.reduce(
    (sum, item) => sum + (Number(item.price || 0) * Number(item.quantity || 0)),
    0
  );

  // =========================================================
  // FILTER
  // =========================================================

  const filteredItems = useMemo(() => {
    const value = search.toLowerCase().trim();
    if (!value) return items;
    return items.filter((item) => item.name?.toLowerCase().includes(value));
  }, [items, search]);

  // =========================================================
  // STATUS
  // =========================================================

  const getStatus = (item) => {
    switch (item.availability) {
      case "LOW_STOCK":
        return { label: "Stock faible", bg: "#fef3c7", color: "#92400e", icon: <WarningAmber fontSize="small" /> };
      case "OUT_OF_STOCK":
        return { label: "Rupture", bg: "#fee2e2", color: "#991b1b", icon: <Error fontSize="small" /> };
      default:
        return { label: "Disponible", bg: "#d1fae5", color: "#065f46", icon: <CheckCircle fontSize="small" /> };
    }
  };

  const getStockPercentage = (item) => {
    if (item.availability === "OUT_OF_STOCK") return 0;
    if (item.availability === "LOW_STOCK") return 25;
    return 75;
  };

  const getStockColor = (item) => {
    if (item.availability === "OUT_OF_STOCK") return "#ef4444";
    if (item.availability === "LOW_STOCK") return "#f59e0b";
    return "#22c55e";
  };

  const formatQuantity = (item) => {
    const qty = Number(item.quantity);
    if (isNaN(qty)) return "—";
    return `${qty.toLocaleString("fr-FR")} ${item.unit || ""}`;
  };

  const getImageUrl = (item) => {
    if (!item.image) return "";
    if (item.image.startsWith("http://") || item.image.startsWith("https://")) {
      return item.image;
    }
    return `${API_URL}${item.image.startsWith("/") ? "" : "/"}${item.image}`;
  };

  // =========================================================
  // FORM HANDLERS
  // =========================================================

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner une image valide.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("L'image ne doit pas dépasser 5 MB.");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingItem(null);
    setImageFile(null);
    setImagePreview("");
    setError("");
  };

  const openCreate = () => {
    resetForm();
    setOpen(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setForm({
      name: item.name || "",
      quantity: item.quantity ?? "",
      unit: item.unit || "ML",
      price: item.price ?? "",
    });
    setImageFile(null);
    setImagePreview(item.image ? getImageUrl(item) : "");
    setError("");
    setOpen(true);
  };

  const closeDialog = () => {
    if (saving) return;
    setOpen(false);
    resetForm();
  };

  // =========================================================
  // VALIDATION
  // =========================================================

  const validateForm = () => {
    if (!form.name.trim()) {
      toast.error("Le nom est obligatoire.");
      return false;
    }
    const quantity = Number(form.quantity);
    const price = Number(form.price);
    if (isNaN(quantity) || quantity < 0) {
      toast.error("La quantité doit être valide.");
      return false;
    }
    if (isNaN(price) || price < 0) {
      toast.error("Le prix doit être valide.");
      return false;
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
      setError("");

      const formData = new FormData();
      formData.append("companyId", String(companyId));
      formData.append("name", form.name.trim());
      formData.append("quantity", String(Number(form.quantity)));
      formData.append("unit", form.unit);
      formData.append("price", String(Number(form.price)));
      if (imageFile) formData.append("image", imageFile);

      if (editingItem) {
        await axios.put(`${API_URL}/stock/${editingItem.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Article mis à jour avec succès.");
      } else {
        await axios.post(`${API_URL}/stock`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Article créé avec succès.");
      }

      closeDialog();
      await loadStock();
    } catch (err) {
      console.error("FAILED TO SAVE STOCK ITEM:", err);
      toast.error(err.response?.data?.message || "Impossible d'enregistrer l'article.");
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // DELETE
  // =========================================================

  const handleDelete = async (item) => {
    if (!window.confirm(`Supprimer "${item.name}" du stock ?`)) return;

    try {
      await axios.delete(`${API_URL}/stock/${item.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Article supprimé avec succès.");
      await loadStock();
    } catch (err) {
      console.error("FAILED TO DELETE STOCK ITEM:", err);
      toast.error(err.response?.data?.message || "Impossible de supprimer cet article.");
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
      "&:hover fieldset": { borderColor: theme.main },
      "&.Mui-focused fieldset": {
        borderColor: theme.main,
        boxShadow: `0 0 0 4px ${theme.main}12`,
      },
    },
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <Fade in timeout={500}>
      <Box sx={{ width: "100%", minHeight: "100%", pb: 5 }}>
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
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
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
                  <Inventory2 sx={{ color: "#fff", fontSize: 25 }} />
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
                    Inventaire
                  </Typography>
                  <Typography
                    sx={{
                      color: "#fff",
                      fontSize: { xs: "1.55rem", md: "1.8rem" },
                      fontWeight: 850,
                      lineHeight: 1.1,
                    }}
                  >
                    Stock
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
                Gérez vos produits, leurs quantités et leurs niveaux de stock.
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
              Ajouter un article
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }} onClose={() => setError("")}>
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
            label="Articles"
            value={totalItems}
            description="en stock"
            icon={<Inventory2 />}
            color="#2563eb"
            theme={theme}
          />
          <KpiCard
            label="Stock faible"
            value={lowStockCount}
            description={totalItems ? `${Math.round((lowStockCount / totalItems) * 100)}% du stock` : "aucun"}
            icon={<WarningAmber />}
            color="#f59e0b"
            theme={theme}
          />
          <KpiCard
            label="Ruptures"
            value={outOfStockCount}
            description="articles épuisés"
            icon={<Error />}
            color="#ef4444"
            theme={theme}
          />
          <KpiCard
            label="Valeur totale"
            value={`${totalStockValue.toFixed(2)} MAD`}
            description="du stock"
            icon={<AttachMoney />}
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
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box sx={{ flex: 1, position: "relative" }}>
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
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un article..."
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2.5,
                    pl: 4.5,
                    background: theme.bg || "#fafafa",
                    "& fieldset": { borderColor: "transparent" },
                    "&:hover fieldset": { borderColor: `${theme.main}40` },
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
                    "&:hover": { color: theme.main, background: `${theme.main}12` },
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
            <Typography sx={{ color: theme.textLight, fontSize: ".78rem" }}>
              <strong style={{ color: theme.text }}>{filteredItems.length}</strong> article
              {filteredItems.length !== 1 ? "s" : ""} affiché
              {filteredItems.length !== 1 ? "s" : ""}
            </Typography>

            {outOfStockCount > 0 && (
              <Chip
                size="small"
                label={`${outOfStockCount} en rupture`}
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
            GRID
        ====================================================== */}

        {loading ? (
          <Box sx={{ height: 330, display: "flex", justifyContent: "center", alignItems: "center" }}>
            <CircularProgress size={32} thickness={4} sx={{ color: theme.main }} />
          </Box>
        ) : filteredItems.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              borderRadius: 4,
              p: 6,
              textAlign: "center",
              border: `1px solid ${theme.border}25`,
              boxShadow: `0 8px 30px ${theme.shadow}18`,
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
              {search ? <Search sx={{ fontSize: 32 }} /> : <Inventory2 sx={{ fontSize: 32 }} />}
            </Box>
            <Typography sx={{ color: theme.text, fontWeight: 800, fontSize: "1rem" }}>
              {search ? "Aucun article trouvé" : "Votre stock est vide"}
            </Typography>
            <Typography sx={{ color: theme.textLight, fontSize: ".76rem", mt: 0.7, maxWidth: 380, mx: "auto", lineHeight: 1.6 }}>
              {search
                ? "Essayez avec un autre nom."
                : "Commencez par ajouter vos produits et matériaux."}
            </Typography>
            {!search && (
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={openCreate}
                sx={{
                  mt: 2.5,
                  borderRadius: 2.5,
                  background: theme.gradient,
                  fontWeight: 800,
                }}
              >
                Ajouter un article
              </Button>
            )}
          </Paper>
        ) : (
          <Grid container spacing={2.5}>
            {filteredItems.map((item) => {
              const status = getStatus(item);
              const stockPercentage = getStockPercentage(item);
              const stockColor = getStockColor(item);
              const imageUrl = getImageUrl(item);

              return (
                <Grid item xs={12} sm={6} lg={4} key={item.id}>
                  <Card
                    sx={{
                      height: "100%",
                      borderRadius: 4,
                      border: `1px solid ${theme.border}25`,
                      boxShadow: `0 6px 25px ${theme.shadow}18`,
                      overflow: "hidden",
                      transition: "all .25s ease",
                      position: "relative",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: `0 12px 35px ${theme.shadow}30`,
                      },
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "4px",
                        background:
                          item.availability === "OUT_OF_STOCK"
                            ? "#ef4444"
                            : item.availability === "LOW_STOCK"
                            ? "#f59e0b"
                            : theme.gradient,
                        borderRadius: "4px 4px 0 0",
                      },
                    }}
                  >
                    {/* Image Section */}
                    <Box
                      sx={{
                        height: 200,
                        backgroundColor: theme.bg || "#fafafa",
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                      }}
                    >
                      {imageUrl ? (
                        <Box
                          component="img"
                          src={imageUrl}
                          alt={item.name}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition: "transform 0.3s ease",
                            "&:hover": { transform: "scale(1.05)" },
                          }}
                          onError={(e) => (e.currentTarget.style.display = "none")}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: 80,
                            height: 80,
                            borderRadius: "50%",
                            backgroundColor: `${theme.main}10`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Inventory2 sx={{ fontSize: 40, color: theme.main }} />
                        </Box>
                      )}

                      {/* Status Badge */}
                      <Box sx={{ position: "absolute", top: 12, right: 12 }}>
                        <Chip
                          icon={status.icon}
                          label={status.label}
                          size="small"
                          sx={{
                            height: 28,
                            borderRadius: 2,
                            fontSize: ".7rem",
                            fontWeight: 750,
                            backgroundColor: status.bg,
                            color: status.color,
                            boxShadow: "0 2px 8px rgba(0,0,0,.08)",
                            "& .MuiChip-icon": { color: status.color },
                          }}
                        />
                      </Box>

                      {/* Stock Level Bar */}
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: 4,
                          background: `${theme.border}30`,
                        }}
                      >
                        <Box
                          sx={{
                            height: "100%",
                            width: `${stockPercentage}%`,
                            background: stockColor,
                            transition: "width 0.8s ease",
                          }}
                        />
                      </Box>
                    </Box>

                    <CardContent sx={{ p: 3 }}>
                      {/* Name and Actions */}
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1 }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{ fontWeight: 750, color: theme.text, fontSize: ".95rem", mb: 0.3 }}>
                            {item.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Ref: #{String(item.id).padStart(4, "0")}
                          </Typography>
                        </Box>

                        <Box sx={{ display: "flex", gap: 0.5 }}>
                          <Tooltip title="Modifier">
                            <IconButton
                              size="small"
                              onClick={() => openEdit(item)}
                              sx={{
                                color: theme.textLight,
                                borderRadius: 2,
                                "&:hover": { color: theme.main, background: `${theme.main}09` },
                              }}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Supprimer">
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(item)}
                              sx={{
                                color: theme.textLight,
                                borderRadius: 2,
                                "&:hover": { color: "#ef4444", background: "rgba(239,68,68,.08)" },
                              }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>

                      <Divider sx={{ my: 2, borderColor: theme.border }} />

                      {/* Details Grid */}
                      <Grid container spacing={1.5}>
                        <Grid item xs={6}>
                          <Box
                            sx={{
                              p: 1.5,
                              borderRadius: 2,
                              backgroundColor: `${theme.bg || "#fafafa"}`,
                              textAlign: "center",
                            }}
                          >
                            <Typography variant="caption" color="text.secondary" fontWeight={600}>
                              Quantité
                            </Typography>
                            <Typography sx={{ fontWeight: 700, color: theme.text, fontSize: "1.1rem" }}>
                              {formatQuantity(item)}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box
                            sx={{
                              p: 1.5,
                              borderRadius: 2,
                              backgroundColor: `${theme.bg || "#fafafa"}`,
                              textAlign: "center",
                            }}
                          >
                            <Typography variant="caption" color="text.secondary" fontWeight={600}>
                              Prix unitaire
                            </Typography>
                            <Typography sx={{ fontWeight: 700, color: theme.main, fontSize: "1.1rem" }}>
                              {Number(item.price || 0).toFixed(2)} MAD
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>

                      {/* Stock Progress */}
                      <Box sx={{ mt: 2 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                          <Typography variant="caption" color="text.secondary" fontWeight={600}>
                            Niveau de stock
                          </Typography>
                          <Typography variant="caption" fontWeight={700} sx={{ color: stockColor }}>
                            {stockPercentage}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={stockPercentage}
                          sx={{
                            height: 6,
                            borderRadius: 4,
                            backgroundColor: `${theme.border}30`,
                            "& .MuiLinearProgress-bar": { backgroundColor: stockColor, borderRadius: 4 },
                          }}
                        />
                      </Box>

                      {/* Quick Tags */}
                      <Box sx={{ display: "flex", gap: 1, mt: 2, flexWrap: "wrap" }}>
                        <Chip
                          label={item.unit}
                          size="small"
                          sx={{
                            height: 24,
                            borderRadius: 2,
                            fontSize: ".65rem",
                            fontWeight: 700,
                            backgroundColor: `${theme.main}08`,
                            color: theme.main,
                          }}
                        />
                        {Number(item.quantity) > 100 && (
                          <Chip
                            icon={<TrendingUp sx={{ fontSize: 14 }} />}
                            label="Stock élevé"
                            size="small"
                            sx={{
                              height: 24,
                              borderRadius: 2,
                              fontSize: ".65rem",
                              fontWeight: 700,
                              backgroundColor: "rgba(34,197,94,.09)",
                              color: "#16a34a",
                            }}
                          />
                        )}
                        {Number(item.quantity) < 20 && Number(item.quantity) > 0 && (
                          <Chip
                            icon={<TrendingDown sx={{ fontSize: 14 }} />}
                            label="Stock faible"
                            size="small"
                            sx={{
                              height: 24,
                              borderRadius: 2,
                              fontSize: ".65rem",
                              fontWeight: 700,
                              backgroundColor: "rgba(245,158,11,.09)",
                              color: "#d97706",
                            }}
                          />
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}

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

            <Box sx={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
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
                  <Inventory2 sx={{ color: "#fff", fontSize: 24 }} />
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
                    {editingItem ? "Modifier" : "Nouvel article"}
                  </Typography>
                  <Typography sx={{ color: "#fff", fontSize: "1.25rem", fontWeight: 850 }}>
                    {editingItem ? "Modifier l'article" : "Ajouter un article"}
                  </Typography>
                </Box>
              </Box>
              <IconButton
                onClick={closeDialog}
                sx={{
                  color: "rgba(255,255,255,.7)",
                  "&:hover": { color: "#fff", background: "rgba(255,255,255,.1)" },
                }}
              >
                <Close />
              </IconButton>
            </Box>
          </Box>

          <DialogContent sx={{ p: { xs: 2, md: 3.5 }, background: "#fafafa" }}>
            <SectionTitle number="01" title="Informations de l'article" description="Définissez les détails du produit." theme={theme} />

            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid item xs={12}>
                <TextField
                  label="Nom de l'article *"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  fullWidth
                  placeholder="Ex. Shampoing professionnel"
                  InputProps={{
                    startAdornment: <Category sx={{ color: theme.textLight, mr: 1, fontSize: 20 }} />,
                  }}
                  sx={inputSx}
                />
              </Grid>

              <Grid item xs={12} md={5}>
                <TextField
                  label="Quantité *"
                  name="quantity"
                  type="number"
                  value={form.quantity}
                  onChange={handleChange}
                  fullWidth
                  placeholder="0"
                  inputProps={{ min: 0, step: "0.01" }}
                  sx={inputSx}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Unité</InputLabel>
                  <Select
                    name="unit"
                    value={form.unit}
                    label="Unité"
                    onChange={handleChange}
                    sx={{
                      borderRadius: 2.5,
                      backgroundColor: "#fff",
                      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: theme.main },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: theme.main,
                        boxShadow: `0 0 0 4px ${theme.main}12`,
                      },
                    }}
                  >
                    <MenuItem value="ML">Millilitre (ML)</MenuItem>
                    <MenuItem value="L">Litre (L)</MenuItem>
                    <MenuItem value="KG">Kilogramme (KG)</MenuItem>
                    <MenuItem value="PIECE">Pièce</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  label="Prix *"
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  fullWidth
                  placeholder="0.00"
                  InputProps={{
                    startAdornment: <AttachMoney sx={{ color: theme.textLight, mr: 1, fontSize: 20 }} />,
                    endAdornment: <Typography sx={{ color: theme.textLight, fontSize: ".8rem" }}>MAD</Typography>,
                  }}
                  inputProps={{ min: 0, step: "0.01" }}
                  sx={inputSx}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography sx={{ fontWeight: 700, color: theme.text, fontSize: ".85rem", mb: 1 }}>
                  Image de l'article
                </Typography>
                <Button
                  component="label"
                  variant="outlined"
                  fullWidth
                  startIcon={<Image />}
                  sx={{
                    minHeight: 48,
                    borderRadius: 2.5,
                    textTransform: "none",
                    borderStyle: "dashed",
                    borderColor: theme.border,
                    color: theme.textLight,
                    "&:hover": {
                      borderColor: theme.main,
                      color: theme.main,
                      backgroundColor: `${theme.main}04`,
                    },
                  }}
                >
                  {imageFile ? imageFile.name : "Choisir une image"}
                  <input hidden type="file" accept="image/*" onChange={handleImageChange} />
                </Button>

                {imagePreview && (
                  <Box
                    sx={{
                      mt: 2,
                      position: "relative",
                      width: "100%",
                      height: 180,
                      borderRadius: 3,
                      overflow: "hidden",
                      backgroundColor: theme.bg || "#fafafa",
                    }}
                  >
                    <Box
                      component="img"
                      src={imagePreview}
                      alt="Aperçu"
                      sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </Box>
                )}
              </Grid>
            </Grid>

            {/* Price Summary */}
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
              <Box sx={{ position: "absolute", right: -35, bottom: -55, width: 130, height: 130, borderRadius: "50%", background: `${theme.main}08` }} />
              <Box sx={{ position: "relative", zIndex: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
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
                    <AttachMoney fontSize="small" />
                  </Box>
                  <Typography sx={{ fontWeight: 800, color: theme.text }}>Résumé de l'article</Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                  <Typography sx={{ color: theme.textLight, fontSize: ".75rem" }}>Quantité</Typography>
                  <Typography sx={{ color: theme.text, fontSize: ".78rem", fontWeight: 700 }}>
                    {form.quantity || "0"} {form.unit}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                  <Typography sx={{ color: theme.textLight, fontSize: ".75rem" }}>Prix unitaire</Typography>
                  <Typography sx={{ color: theme.text, fontSize: ".78rem", fontWeight: 700 }}>
                    {Number(form.price || 0).toFixed(2)} MAD
                  </Typography>
                </Box>

                <Divider sx={{ my: 1.5, borderColor: `${theme.border}30` }} />

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box>
                    <Typography sx={{ color: theme.text, fontWeight: 800, fontSize: ".95rem" }}>Valeur totale</Typography>
                    <Typography sx={{ color: theme.textLight, fontSize: ".68rem" }}>Prix × Quantité</Typography>
                  </Box>
                  <Typography sx={{ color: theme.main, fontSize: "1.55rem", fontWeight: 900 }}>
                    {(Number(form.price || 0) * Number(form.quantity || 0)).toFixed(2)}{" "}
                    <span style={{ fontSize: ".8rem" }}>MAD</span>
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
              sx={{ color: theme.textLight, borderRadius: 2.5, fontWeight: 700, px: 2 }}
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
                <CircularProgress size={22} sx={{ color: "#fff" }} />
              ) : editingItem ? (
                "Enregistrer"
              ) : (
                "Ajouter l'article"
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

function KpiCard({ label, value, description, icon, color, theme }) {
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
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2 }}>
        <Box>
          <Typography sx={{ color: theme.textLight, fontSize: ".72rem", fontWeight: 700, mb: 0.6 }}>
            {label}
          </Typography>
          <Typography sx={{ color: theme.text, fontSize: { xs: "1.35rem", md: "1.5rem" }, fontWeight: 900, lineHeight: 1 }}>
            {value}
          </Typography>
          <Typography sx={{ color: theme.textLight, fontSize: ".65rem", mt: 0.8 }}>
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

function SectionTitle({ number, title, description, theme, action }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, mb: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.3 }}>
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
          <Typography sx={{ color: theme.text, fontWeight: 800, fontSize: ".92rem" }}>
            {title}
          </Typography>
          <Typography sx={{ color: theme.textLight, fontSize: ".68rem", mt: 0.2 }}>
            {description}
          </Typography>
        </Box>
      </Box>
      {action}
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