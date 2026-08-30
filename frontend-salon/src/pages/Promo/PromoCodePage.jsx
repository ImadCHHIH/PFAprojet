import React, { useEffect, useMemo, useState } from "react";

import {
  Alert,
  Box,
  Avatar,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
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
  Typography,
  Fade,
  Tooltip,
  Grid,
  Divider,
} from "@mui/material";

import {
  Add,
  LocalOffer,
  Search,
  Clear,
  Discount,
  CalendarToday,
  Percent,
  CheckCircle,
  Cancel,
  Schedule,
  Edit,
  Delete,
  Close,
  TrendingUp,
} from "@mui/icons-material";

import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import promoCodeApi from "../../api/promocodeApi";
import { getCompanyTheme } from "../../utils/companyThemes";

const createEmptyForm = () => ({
  name: "",
  code: "",
  startDate: "",
  endDate: "",
  discountPercentage: "",
});

export default function PromoCodePage() {
  const { id: companyId } = useParams();
  const theme = getCompanyTheme(companyId || 0);

  // =========================================================
  // DATA
  // =========================================================

  const [promoCodes, setPromoCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // =========================================================
  // DIALOG
  // =========================================================

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // =========================================================
  // SEARCH / FILTER
  // =========================================================

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // =========================================================
  // FORM
  // =========================================================

  const [form, setForm] = useState(createEmptyForm());

  // =========================================================
  // LOAD PROMO CODES
  // =========================================================

  const loadPromoCodes = async () => {
    if (!companyId) return;
    
    try {
      setLoading(true);
      setError("");
      
      // Check if the API method exists and handle different response formats
      let data;
      if (typeof promoCodeApi.getByCompany === 'function') {
        data = await promoCodeApi.getByCompany(companyId);
      } else if (typeof promoCodeApi.getAll === 'function') {
        data = await promoCodeApi.getAll(companyId);
      } else {
        // Fallback - try to find the right method
        const allMethods = Object.keys(promoCodeApi);
        console.warn("Available promoCodeApi methods:", allMethods);
        // Try to find a method that might work
        if (typeof promoCodeApi.get === 'function') {
          data = await promoCodeApi.get(companyId);
        } else if (typeof promoCodeApi.list === 'function') {
          data = await promoCodeApi.list(companyId);
        } else {
          throw new Error("No suitable API method found for fetching promo codes");
        }
      }
      
      // Handle different response formats
      if (Array.isArray(data)) {
        setPromoCodes(data);
      } else if (data && typeof data === 'object' && data.data && Array.isArray(data.data)) {
        setPromoCodes(data.data);
      } else if (data && typeof data === 'object' && data.content && Array.isArray(data.content)) {
        setPromoCodes(data.content);
      } else {
        setPromoCodes([]);
      }
    } catch (err) {
      console.error("Error loading promo codes:", err);
      setError(err.response?.data?.message || err.message || "Impossible de charger les codes promo.");
      setPromoCodes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPromoCodes();
  }, [companyId]);

  // =========================================================
  // GET STATUS
  // =========================================================

  const getPromoStatus = (promo) => {
    if (!promo) return { label: "Inconnu", color: "#9ca3af", bg: "rgba(156,163,175,0.12)", icon: null, active: false };
    
    const today = new Date().toISOString().split("T")[0];

    if (promo.startDate && today < promo.startDate) {
      return {
        label: "À venir",
        color: "#4facfe",
        bg: "rgba(79,172,254,0.12)",
        icon: <Schedule fontSize="small" />,
        active: false,
      };
    }

    if (promo.endDate && today > promo.endDate) {
      return {
        label: "Expiré",
        color: "#9ca3af",
        bg: "rgba(156,163,175,0.12)",
        icon: <Cancel fontSize="small" />,
        active: false,
      };
    }

    return {
      label: "Actif",
      color: "#16a34a",
      bg: "rgba(34,197,94,0.09)",
      icon: <CheckCircle fontSize="small" />,
      active: true,
    };
  };

  // =========================================================
  // FILTERED PROMO CODES
  // =========================================================

  const filteredPromoCodes = useMemo(() => {
    const searchValue = search.trim().toLowerCase();
    return promoCodes.filter((promo) => {
      const matchesSearch =
        !searchValue ||
        (promo.name?.toLowerCase() || "").includes(searchValue) ||
        (promo.code?.toLowerCase() || "").includes(searchValue);

      const status = getPromoStatus(promo);
      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && status.active) ||
        (statusFilter === "INACTIVE" && !status.active);

      return matchesSearch && matchesStatus;
    });
  }, [promoCodes, search, statusFilter]);

  // =========================================================
  // STATS
  // =========================================================

  const totalCodes = promoCodes.length || 0;
  const activeCount = promoCodes.filter((p) => getPromoStatus(p).active).length || 0;
  const expiredCount = promoCodes.filter((p) => getPromoStatus(p).label === "Expiré").length || 0;
  const upcomingCount = promoCodes.filter((p) => getPromoStatus(p).label === "À venir").length || 0;

  // =========================================================
  // FORM HANDLERS
  // =========================================================

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(createEmptyForm());
    setEditingId(null);
    setError("");
  };

  const openCreate = () => {
    resetForm();
    setOpen(true);
  };

  const openEdit = (promo) => {
    if (!promo) return;
    setEditingId(promo.id);
    setForm({
      name: promo.name || "",
      code: promo.code || "",
      startDate: promo.startDate || "",
      endDate: promo.endDate || "",
      discountPercentage: promo.discountPercentage !== undefined && promo.discountPercentage !== null ? String(promo.discountPercentage) : "",
    });
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
      toast.error("Le nom de la promotion est obligatoire.");
      return false;
    }
    if (!form.code.trim()) {
      toast.error("Le code promo est obligatoire.");
      return false;
    }
    if (!form.startDate) {
      toast.error("La date de début est obligatoire.");
      return false;
    }
    if (!form.endDate) {
      toast.error("La date de fin est obligatoire.");
      return false;
    }
    const discount = Number(form.discountPercentage);
    if (isNaN(discount) || discount < 0 || discount > 100) {
      toast.error("La réduction doit être comprise entre 0 et 100%.");
      return false;
    }
    if (form.endDate < form.startDate) {
      toast.error("La date de fin doit être postérieure à la date de début.");
      return false;
    }
    return true;
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async () => {
    if (!validateForm()) return;
    if (!companyId) {
      toast.error("Entreprise non trouvée.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        companyId: Number(companyId),
        name: form.name.trim(),
        code: form.code.trim().toUpperCase(),
        startDate: form.startDate,
        endDate: form.endDate,
        discountPercentage: Number(form.discountPercentage),
      };

      if (editingId) {
        // Try different update methods
        if (typeof promoCodeApi.update === 'function') {
          await promoCodeApi.update(editingId, payload);
        } else if (typeof promoCodeApi.edit === 'function') {
          await promoCodeApi.edit(editingId, payload);
        } else if (typeof promoCodeApi.put === 'function') {
          await promoCodeApi.put(editingId, payload);
        } else {
          throw new Error("No update method available");
        }
        toast.success("Code promo mis à jour avec succès.");
      } else {
        // Try different create methods
        if (typeof promoCodeApi.create === 'function') {
          await promoCodeApi.create(payload);
        } else if (typeof promoCodeApi.add === 'function') {
          await promoCodeApi.add(payload);
        } else if (typeof promoCodeApi.post === 'function') {
          await promoCodeApi.post(payload);
        } else {
          throw new Error("No create method available");
        }
        toast.success("Code promo créé avec succès.");
      }

      closeDialog();
      await loadPromoCodes();
    } catch (err) {
      console.error("Error saving promo code:", err);
      const errorMsg = err.response?.data?.message || err.message || "Erreur lors de l'enregistrement.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // DELETE
  // =========================================================

  const handleDelete = async (promoId) => {
    if (!promoId) return;
    if (!window.confirm("Voulez-vous vraiment supprimer ce code promo ?")) return;

    try {
      // Try different delete methods
      if (typeof promoCodeApi.delete === 'function') {
        await promoCodeApi.delete(promoId);
      } else if (typeof promoCodeApi.remove === 'function') {
        await promoCodeApi.remove(promoId);
      } else {
        throw new Error("No delete method available");
      }
      toast.success("Code promo supprimé avec succès.");
      await loadPromoCodes();
    } catch (err) {
      console.error("Error deleting promo code:", err);
      toast.error(err.response?.data?.message || err.message || "Erreur lors de la suppression.");
    }
  };

  // =========================================================
  // RESET FILTERS
  // =========================================================

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
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

  const selectSx = {
    borderRadius: 2.5,
    backgroundColor: "#fff",
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: theme.main },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.main,
      boxShadow: `0 0 0 4px ${theme.main}12`,
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
                  <LocalOffer sx={{ color: "#fff", fontSize: 25 }} />
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
                    Promotions
                  </Typography>
                  <Typography
                    sx={{
                      color: "#fff",
                      fontSize: { xs: "1.55rem", md: "1.8rem" },
                      fontWeight: 850,
                      lineHeight: 1.1,
                    }}
                  >
                    Codes promo
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
                Gérez les codes promotionnels, leurs réductions et leurs périodes de validité.
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
              Nouveau code
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3, borderRadius: 3 }}
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
            label="Total"
            value={totalCodes}
            description="codes promo"
            icon={<LocalOffer />}
            color="#2563eb"
            theme={theme}
          />
          <KpiCard
            label="Actifs"
            value={activeCount}
            description={totalCodes ? `${Math.round((activeCount / totalCodes) * 100)}% du total` : "aucun code"}
            icon={<CheckCircle />}
            color="#22c55e"
            theme={theme}
          />
          <KpiCard
            label="À venir"
            value={upcomingCount}
            description="programmés"
            icon={<Schedule />}
            color="#4facfe"
            theme={theme}
          />
          <KpiCard
            label="Expirés"
            value={expiredCount}
            description="hors validité"
            icon={<Cancel />}
            color="#ef4444"
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
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
            <Box sx={{ flex: 1, position: "relative", minWidth: 200 }}>
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
                placeholder="Rechercher un code promo..."
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

            <FormControl sx={{ minWidth: 180 }}>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                displayEmpty
                sx={selectSx}
              >
                <MenuItem value="ALL">Tous les statuts</MenuItem>
                <MenuItem value="ACTIVE">Actifs</MenuItem>
                <MenuItem value="INACTIVE">Non actifs</MenuItem>
              </Select>
            </FormControl>

            {(search || statusFilter !== "ALL") && (
              <Tooltip title="Effacer les filtres">
                <IconButton
                  onClick={resetFilters}
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
              <strong style={{ color: theme.text }}>{filteredPromoCodes.length}</strong> code
              {filteredPromoCodes.length !== 1 ? "s" : ""} affiché
              {filteredPromoCodes.length !== 1 ? "s" : ""}
            </Typography>

            {expiredCount > 0 && (
              <Chip
                size="small"
                label={`${expiredCount} expiré${expiredCount > 1 ? "s" : ""}`}
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
            TABLE
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
              <Typography sx={{ fontWeight: 800, color: theme.text, fontSize: "1rem" }}>
                Codes promotionnels
              </Typography>
              <Typography sx={{ color: theme.textLight, fontSize: ".76rem", mt: 0.3 }}>
                Promotions disponibles pour vos clients
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
              <LocalOffer fontSize="small" />
            </Box>
          </Box>

          {loading ? (
            <Box sx={{ height: 330, display: "flex", justifyContent: "center", alignItems: "center" }}>
              <CircularProgress size={32} thickness={4} sx={{ color: theme.main }} />
            </Box>
          ) : filteredPromoCodes.length === 0 ? (
            <Box sx={{ py: 8, px: 3, textAlign: "center" }}>
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
                {search ? <Search sx={{ fontSize: 32 }} /> : <LocalOffer sx={{ fontSize: 32 }} />}
              </Box>
              <Typography sx={{ color: theme.text, fontWeight: 800, fontSize: "1rem" }}>
                {search ? "Aucun code promo trouvé" : "Aucun code promo"}
              </Typography>
              <Typography sx={{ color: theme.textLight, fontSize: ".76rem", mt: 0.7, maxWidth: 380, mx: "auto", lineHeight: 1.6 }}>
                {search
                  ? "Essayez avec un autre terme de recherche."
                  : "Commencez par créer votre premier code promotionnel."}
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
                  Créer un code promo
                </Button>
              )}
            </Box>
          ) : (
            <TableContainer sx={{ overflowX: "auto" }}>
              <Table sx={{ minWidth: 900 }}>
                <TableHead>
                  <TableRow sx={{ background: `${theme.main}035` }}>
                    <TableCell sx={headerCell(theme)}>NOM</TableCell>
                    <TableCell sx={headerCell(theme)}>CODE</TableCell>
                    <TableCell sx={headerCell(theme)}>RÉDUCTION</TableCell>
                    <TableCell sx={headerCell(theme)}>PÉRIODE</TableCell>
                    <TableCell sx={headerCell(theme)}>STATUT</TableCell>
                    <TableCell align="right" sx={headerCell(theme)}>ACTIONS</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredPromoCodes.map((promo) => {
                    const status = getPromoStatus(promo);
                    const daysRemaining = promo.endDate
                      ? Math.ceil((new Date(promo.endDate) - new Date()) / (1000 * 60 * 60 * 24))
                      : null;

                    return (
                      <TableRow
                        key={promo.id || Math.random()}
                        hover
                        sx={{
                          "& td": { borderColor: `${theme.border}14` },
                          "&:hover": { backgroundColor: `${theme.main}018` },
                          transition: "background .2s ease",
                          opacity: status.label === "Expiré" ? 0.6 : 1,
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 180 }}>
                            <Avatar
                              sx={{
                                width: 42,
                                height: 42,
                                borderRadius: 2.5,
                                background: `${theme.main}10`,
                                color: theme.main,
                              }}
                            >
                              <Discount fontSize="small" />
                            </Avatar>
                            <Box>
                              <Typography sx={{ fontWeight: 750, color: theme.text, fontSize: ".9rem" }}>
                                {promo.name || "Sans nom"}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Chip
                            label={promo.code || "—"}
                            sx={{
                              backgroundColor: status.active ? `${theme.main}08` : theme.border,
                              color: status.active ? theme.main : theme.textLight,
                              fontWeight: 700,
                              fontFamily: "monospace",
                              letterSpacing: "0.5px",
                              borderRadius: 2,
                            }}
                            size="small"
                          />
                        </TableCell>

                        <TableCell>
                          <Typography sx={{ fontWeight: 850, color: theme.main, fontSize: "1.1rem" }}>
                            {promo.discountPercentage ?? 0}%
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.3 }}>
                            <Typography variant="caption" color="text.secondary">
                              Du {promo.startDate || "—"}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Au {promo.endDate || "—"}
                            </Typography>
                            {status.active && daysRemaining !== null && daysRemaining > 0 && (
                              <Chip
                                icon={<CalendarToday sx={{ fontSize: 14 }} />}
                                label={`${daysRemaining} jours restants`}
                                size="small"
                                sx={{
                                  mt: 0.5,
                                  height: 20,
                                  borderRadius: 2,
                                  fontSize: ".6rem",
                                  fontWeight: 700,
                                  backgroundColor: daysRemaining > 30 ? "rgba(34,197,94,.09)" : "rgba(255,169,77,.12)",
                                  color: daysRemaining > 30 ? "#16a34a" : "#f59e0b",
                                }}
                              />
                            )}
                          </Box>
                        </TableCell>

                        <TableCell>
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
                              "& .MuiChip-icon": { color: status.color },
                            }}
                          />
                        </TableCell>

                        <TableCell align="right">
                          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 0.5 }}>
                            <Tooltip title="Modifier">
                              <IconButton
                                size="small"
                                onClick={() => openEdit(promo)}
                                sx={{
                                  width: 34,
                                  height: 34,
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
                                onClick={() => handleDelete(promo.id)}
                                sx={{
                                  width: 34,
                                  height: 34,
                                  color: "#ef4444",
                                  borderRadius: 2,
                                  "&:hover": { background: "rgba(239,68,68,.08)" },
                                }}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
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
                  <LocalOffer sx={{ color: "#fff", fontSize: 24 }} />
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
                    {editingId ? "Modifier" : "Nouveau code"}
                  </Typography>
                  <Typography sx={{ color: "#fff", fontSize: "1.25rem", fontWeight: 850 }}>
                    {editingId ? "Modifier le code promo" : "Créer un code promo"}
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
            <SectionTitle number="01" title="Informations du code promo" description="Définissez les détails de la promotion." theme={theme} />

            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid item xs={12} md={8}>
                <TextField
                  label="Nom de la promotion *"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  fullWidth
                  placeholder="Ex. Soldes d'été"
                  InputProps={{
                    startAdornment: <LocalOffer sx={{ color: theme.textLight, mr: 1, fontSize: 20 }} />,
                  }}
                  sx={inputSx}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  label="Code promo *"
                  name="code"
                  value={form.code}
                  onChange={handleChange}
                  fullWidth
                  placeholder="ETE2026"
                  InputProps={{
                    startAdornment: <Discount sx={{ color: theme.textLight, mr: 1, fontSize: 20 }} />,
                  }}
                  helperText="Sera automatiquement converti en majuscules"
                  sx={inputSx}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Date de début *"
                  name="startDate"
                  type="date"
                  value={form.startDate}
                  onChange={handleChange}
                  fullWidth
                  InputProps={{
                    startAdornment: <CalendarToday sx={{ color: theme.textLight, mr: 1, fontSize: 20 }} />,
                  }}
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={inputSx}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Date de fin *"
                  name="endDate"
                  type="date"
                  value={form.endDate}
                  onChange={handleChange}
                  fullWidth
                  InputProps={{
                    startAdornment: <CalendarToday sx={{ color: theme.textLight, mr: 1, fontSize: 20 }} />,
                  }}
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={inputSx}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Réduction (%) *"
                  name="discountPercentage"
                  type="number"
                  value={form.discountPercentage}
                  onChange={handleChange}
                  fullWidth
                  placeholder="20"
                  InputProps={{
                    startAdornment: <Percent sx={{ color: theme.textLight, mr: 1, fontSize: 20 }} />,
                    endAdornment: <Typography sx={{ color: theme.textLight, fontSize: ".8rem" }}>%</Typography>,
                  }}
                  inputProps={{ min: 0, max: 100 }}
                  sx={inputSx}
                />
              </Grid>
            </Grid>

            {/* PRICE SUMMARY */}
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
                  <Box sx={{ width: 34, height: 34, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", background: `${theme.main}12`, color: theme.main }}>
                    <TrendingUp fontSize="small" />
                  </Box>
                  <Typography sx={{ fontWeight: 800, color: theme.text }}>Résumé de la promotion</Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                  <Typography sx={{ color: theme.textLight, fontSize: ".75rem" }}>Code promo</Typography>
                  <Typography sx={{ color: theme.text, fontSize: ".78rem", fontWeight: 700, fontFamily: "monospace" }}>
                    {form.code.trim() || "—"}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                  <Typography sx={{ color: theme.textLight, fontSize: ".75rem" }}>Réduction</Typography>
                  <Typography sx={{ color: theme.text, fontSize: ".78rem", fontWeight: 700 }}>
                    {form.discountPercentage || "0"}%
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography sx={{ color: theme.textLight, fontSize: ".75rem" }}>Période</Typography>
                  <Typography sx={{ color: theme.text, fontSize: ".78rem", fontWeight: 700 }}>
                    {form.startDate && form.endDate ? `${form.startDate} → ${form.endDate}` : "—"}
                  </Typography>
                </Box>

                <Divider sx={{ my: 1.5, borderColor: `${theme.border}30` }} />

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box>
                    <Typography sx={{ color: theme.text, fontWeight: 800, fontSize: ".95rem" }}>Statut</Typography>
                    <Typography sx={{ color: theme.textLight, fontSize: ".68rem" }}>Validité automatique</Typography>
                  </Box>
                  <Chip
                    label={
                      form.startDate && form.endDate
                        ? new Date().toISOString().split("T")[0] < form.startDate
                          ? "À venir"
                          : new Date().toISOString().split("T")[0] > form.endDate
                          ? "Expiré"
                          : "Actif"
                        : "Non défini"
                    }
                    sx={{
                      height: 28,
                      borderRadius: 2,
                      fontSize: ".7rem",
                      fontWeight: 750,
                      backgroundColor:
                        form.startDate && form.endDate
                          ? new Date().toISOString().split("T")[0] < form.startDate
                            ? "rgba(79,172,254,.12)"
                            : new Date().toISOString().split("T")[0] > form.endDate
                            ? "rgba(239,68,68,.08)"
                            : "rgba(34,197,94,.09)"
                          : "rgba(156,163,175,.12)",
                      color:
                        form.startDate && form.endDate
                          ? new Date().toISOString().split("T")[0] < form.startDate
                            ? "#4facfe"
                            : new Date().toISOString().split("T")[0] > form.endDate
                            ? "#ef4444"
                            : "#16a34a"
                          : "#9ca3af",
                    }}
                  />
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
              ) : editingId ? (
                "Enregistrer"
              ) : (
                "Créer le code"
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