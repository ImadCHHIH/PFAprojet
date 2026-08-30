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
  Typography,
  Fade,
  Tooltip,
  Stepper,
  Step,
  StepLabel,
  Divider,
  Card,
  CardContent,
} from "@mui/material";

import {
  Add,
  Delete,
  Edit,
  Search,
  CalendarToday,
  AccessTime,
  Person,
  LocalOffer,
  CheckCircle,
  Cancel,
  Pending,
  Clear,
  NavigateNext,
  NavigateBefore,
  Check,
  Spa,
  Timer,
  Discount,
  EventNote,
  People,
  AttachMoney,
  Close,
} from "@mui/icons-material";

import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import appointmentsApi from "../../api/appointmentsApi";
import promoCodeApi from "../../api/promocodeApi";
import { getServicesByCompany } from "../../api/serviceApi";
import { getTeamByCompany } from "../../api/teamApi";
import { getCompanyTheme } from "../../utils/companyThemes";

const emptyForm = {
  clientName: "",
  serviceId: "",
  teamMemberId: "",
  appointmentDate: "",
  appointmentTime: "",
  promoCodeId: "",
};

const steps = [
  { label: "Client", icon: <Person /> },
  { label: "Service & Équipe", icon: <Spa /> },
  { label: "Horaire & Promo", icon: <Timer /> },
  { label: "Confirmation", icon: <Check /> },
];

export default function AppointmentPage() {
  const { id: companyId } = useParams();
  const theme = getCompanyTheme(companyId || 0);

  // =========================================================
  // DATA
  // =========================================================

  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [promoCodes, setPromoCodes] = useState([]);

  // =========================================================
  // STATE
  // =========================================================

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeStep, setActiveStep] = useState(0);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("");

  const [form, setForm] = useState(emptyForm);

  // =========================================================
  // CHECK EXPIRED PROMO
  // =========================================================

  const isPromoExpired = (promo) => {
    if (!promo || !promo.endDate) return false;
    const today = new Date();
    const endDate = new Date(promo.endDate);
    endDate.setHours(23, 59, 59, 999);
    return endDate < today;
  };

  // =========================================================
  // LOAD DATA
  // =========================================================

  const loadAppointments = async () => {
    try {
      const data = await appointmentsApi.getByCompany(companyId);
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading appointments:", err);
      setError(err.response?.data?.message || "Impossible de charger les rendez-vous.");
    }
  };

  const loadServices = async () => {
    try {
      const data = await getServicesByCompany(companyId);
      setServices(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading services:", err);
      setServices([]);
    }
  };

  const loadTeam = async () => {
    try {
      const data = await getTeamByCompany(companyId);
      setTeamMembers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading team:", err);
      setTeamMembers([]);
    }
  };

  const loadPromoCodes = async () => {
    try {
      const data = await promoCodeApi.getByCompany(companyId);
      setPromoCodes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading promo codes:", err);
      setPromoCodes([]);
    }
  };

  useEffect(() => {
    if (!companyId) return;

    const load = async () => {
      try {
        setLoading(true);
        setError("");
        await Promise.all([loadAppointments(), loadServices(), loadTeam(), loadPromoCodes()]);
      } catch (err) {
        console.error("Error during initial loading:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [companyId]);

  // =========================================================
  // STATS
  // =========================================================

  const totalAppointments = appointments.length;
  const pendingCount = appointments.filter((a) => a.status === "PENDING").length;
  const completedCount = appointments.filter((a) => a.status === "COMPLETED").length;
  const canceledCount = appointments.filter((a) => a.status === "CANCELED").length;
  const totalRevenue = appointments.reduce((sum, app) => sum + (app.finalPrice || 0), 0);

  // =========================================================
  // FILTER
  // =========================================================

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      const searchValue = search.trim().toLowerCase();
      const matchesSearch =
        !searchValue ||
        appointment.clientName?.toLowerCase().includes(searchValue) ||
        appointment.serviceName?.toLowerCase().includes(searchValue) ||
        appointment.teamMemberName?.toLowerCase().includes(searchValue);

      const matchesStatus = statusFilter === "ALL" || appointment.status === statusFilter;
      const matchesDate = !dateFilter || appointment.appointmentDate === dateFilter;

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [appointments, search, statusFilter, dateFilter]);

  // =========================================================
  // FORM HANDLERS
  // =========================================================

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setActiveStep(0);
    setError("");
  };

  const openCreate = async () => {
    resetForm();
    try {
      if (services.length === 0 || teamMembers.length === 0) {
        await Promise.all([loadServices(), loadTeam()]);
      }
    } catch (err) {
      console.error("Error loading form data:", err);
    }
    setOpen(true);
  };

  const openEdit = async (appointment) => {
    try {
      const requests = [];
      if (services.length === 0) requests.push(loadServices());
      if (teamMembers.length === 0) requests.push(loadTeam());
      if (promoCodes.length === 0) requests.push(loadPromoCodes());
      if (requests.length > 0) await Promise.all(requests);
    } catch (err) {
      console.error("Error loading appointment form data:", err);
    }

    setEditingId(appointment.id);
    setForm({
      clientName: appointment.clientName || "",
      serviceId: appointment.serviceId != null ? String(appointment.serviceId) : "",
      teamMemberId: appointment.teamMemberId != null ? String(appointment.teamMemberId) : "",
      appointmentDate: appointment.appointmentDate || "",
      appointmentTime: appointment.appointmentTime || "",
      promoCodeId: appointment.promoCodeId != null ? String(appointment.promoCodeId) : "",
    });
    setActiveStep(0);
    setError("");
    setOpen(true);
  };

  const closeDialog = () => {
    if (saving) return;
    setOpen(false);
    resetForm();
  };

  const handleNext = () => {
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const isStepValid = () => {
    switch (activeStep) {
      case 0:
        return form.clientName.trim().length > 0;
      case 1:
        return form.serviceId && form.teamMemberId;
      case 2:
        return form.appointmentDate && form.appointmentTime;
      default:
        return true;
    }
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async () => {
    try {
      setError("");
      setSaving(true);

      if (!form.clientName.trim()) {
        toast.error("Le nom du client est obligatoire.");
        return;
      }
      if (!form.serviceId) {
        toast.error("Veuillez sélectionner un service.");
        return;
      }
      if (!form.teamMemberId) {
        toast.error("Veuillez sélectionner un membre de l'équipe.");
        return;
      }
      if (!form.appointmentDate) {
        toast.error("Veuillez sélectionner une date.");
        return;
      }
      if (!form.appointmentTime) {
        toast.error("Veuillez sélectionner une heure.");
        return;
      }

      if (form.promoCodeId) {
        const selectedPromo = promoCodes.find((p) => String(p.id) === form.promoCodeId);
        if (selectedPromo && isPromoExpired(selectedPromo)) {
          toast.error("Ce code promo a expiré. Veuillez en sélectionner un autre.");
          return;
        }
      }

      const data = {
        companyId: Number(companyId),
        clientName: form.clientName.trim(),
        serviceId: Number(form.serviceId),
        teamMemberId: Number(form.teamMemberId),
        appointmentDate: form.appointmentDate,
        appointmentTime: form.appointmentTime,
        promoCodeId: form.promoCodeId ? Number(form.promoCodeId) : null,
      };

      if (editingId) {
        await appointmentsApi.update(editingId, data);
        toast.success("Rendez-vous mis à jour avec succès.");
      } else {
        await appointmentsApi.create(data);
        toast.success("Rendez-vous créé avec succès.");
      }

      closeDialog();
      await loadAppointments();
    } catch (err) {
      console.error("Error saving appointment:", err);
      toast.error(err.response?.data?.message || "Erreur lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // STATUS ACTIONS
  // =========================================================

  const changeStatus = async (appointmentId, status) => {
    try {
      await appointmentsApi.updateStatus(appointmentId, status);
      toast.success("Statut mis à jour.");
      await loadAppointments();
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error(err.response?.data?.message || "Impossible de modifier le statut.");
    }
  };

  const deleteAppointment = async (appointmentId) => {
    if (!window.confirm("Voulez-vous supprimer ce rendez-vous ?")) return;
    try {
      await appointmentsApi.remove(appointmentId);
      toast.success("Rendez-vous supprimé.");
      await loadAppointments();
    } catch (err) {
      console.error("Error deleting appointment:", err);
      toast.error(err.response?.data?.message || "Impossible de supprimer le rendez-vous.");
    }
  };

  // =========================================================
  // HELPERS
  // =========================================================

  const renderStatusChip = (status) => {
    switch (status) {
      case "COMPLETED":
        return <Chip icon={<CheckCircle />} label="Terminé" color="success" size="small" sx={{ fontWeight: 600 }} />;
      case "CANCELED":
        return <Chip icon={<Cancel />} label="Annulé" color="error" size="small" sx={{ fontWeight: 600 }} />;
      case "PENDING":
        return <Chip icon={<Pending />} label="En attente" color="warning" size="small" sx={{ fontWeight: 600 }} />;
      default:
        return <Chip label={status || "Inconnu"} size="small" />;
    }
  };

  const selectedService = services.find((s) => String(s.id) === form.serviceId);
  const selectedTeamMember = teamMembers.find((t) => String(t.id) === form.teamMemberId);
  const selectedPromo = promoCodes.find((p) => String(p.id) === form.promoCodeId);
  const isSelectedPromoExpired = selectedPromo && isPromoExpired(selectedPromo);

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
                  <CalendarToday sx={{ color: "#fff", fontSize: 25 }} />
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
                    Planification
                  </Typography>
                  <Typography
                    sx={{
                      color: "#fff",
                      fontSize: { xs: "1.55rem", md: "1.8rem" },
                      fontWeight: 850,
                      lineHeight: 1.1,
                    }}
                  >
                    Rendez-vous
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
                Gérez les rendez-vous de votre salon, leurs statuts et leurs clients.
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
              Nouveau rendez-vous
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
            label="Total"
            value={totalAppointments}
            description="rendez-vous"
            icon={<EventNote />}
            color="#2563eb"
            theme={theme}
          />
          <KpiCard
            label="En attente"
            value={pendingCount}
            description={totalAppointments ? `${Math.round((pendingCount / totalAppointments) * 100)}%` : "—"}
            icon={<Pending />}
            color="#f59e0b"
            theme={theme}
          />
          <KpiCard
            label="Terminés"
            value={completedCount}
            description={totalAppointments ? `${Math.round((completedCount / totalAppointments) * 100)}%` : "—"}
            icon={<CheckCircle />}
            color="#22c55e"
            theme={theme}
          />
          <KpiCard
            label="Chiffre d'affaires"
            value={`${totalRevenue.toFixed(2)} DH`}
            description="total"
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
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "2fr 1fr 1fr" },
              gap: 1.5,
            }}
          >
            <Box sx={{ position: "relative" }}>
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
                placeholder="Rechercher un rendez-vous..."
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

            <FormControl fullWidth>
              <InputLabel>Statut</InputLabel>
              <Select
                value={statusFilter}
                label="Statut"
                onChange={(e) => setStatusFilter(e.target.value)}
                sx={selectSx}
              >
                <MenuItem value="ALL">Tous</MenuItem>
                <MenuItem value="PENDING">En attente</MenuItem>
                <MenuItem value="COMPLETED">Terminés</MenuItem>
                <MenuItem value="CANCELED">Annulés</MenuItem>
              </Select>
            </FormControl>

            <TextField
              type="date"
              label="Date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              sx={inputSx}
            />
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
              <strong style={{ color: theme.text }}>{filteredAppointments.length}</strong> rendez-vous
              {filteredAppointments.length !== 1 ? "s" : ""} affiché
              {filteredAppointments.length !== 1 ? "s" : ""}
            </Typography>

            {(search || statusFilter !== "ALL" || dateFilter) && (
              <Button
                size="small"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("ALL");
                  setDateFilter("");
                }}
                startIcon={<Clear />}
                sx={{
                  textTransform: "none",
                  color: theme.textLight,
                  fontWeight: 650,
                  "&:hover": { color: theme.main, background: `${theme.main}08` },
                }}
              >
                Effacer les filtres
              </Button>
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
                Liste des rendez-vous
              </Typography>
              <Typography sx={{ color: theme.textLight, fontSize: ".76rem", mt: 0.3 }}>
                Tous les rendez-vous de votre salon
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
              <CalendarToday fontSize="small" />
            </Box>
          </Box>

          {loading ? (
            <Box sx={{ height: 330, display: "flex", justifyContent: "center", alignItems: "center" }}>
              <CircularProgress size={32} thickness={4} sx={{ color: theme.main }} />
            </Box>
          ) : filteredAppointments.length === 0 ? (
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
                {search ? <Search sx={{ fontSize: 32 }} /> : <CalendarToday sx={{ fontSize: 32 }} />}
              </Box>
              <Typography sx={{ color: theme.text, fontWeight: 800, fontSize: "1rem" }}>
                {search ? "Aucun rendez-vous trouvé" : "Aucun rendez-vous"}
              </Typography>
              <Typography sx={{ color: theme.textLight, fontSize: ".76rem", mt: 0.7, maxWidth: 380, mx: "auto", lineHeight: 1.6 }}>
                {search
                  ? "Essayez avec un autre terme de recherche."
                  : "Commencez par créer votre premier rendez-vous."}
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
                  Créer un rendez-vous
                </Button>
              )}
            </Box>
          ) : (
            <TableContainer sx={{ overflowX: "auto" }}>
              <Table sx={{ minWidth: 1100 }}>
                <TableHead>
                  <TableRow sx={{ background: `${theme.main}035` }}>
                    <TableCell sx={headerCell(theme)}>CLIENT</TableCell>
                    <TableCell sx={headerCell(theme)}>SERVICE</TableCell>
                    <TableCell sx={headerCell(theme)}>ÉQUIPE</TableCell>
                    <TableCell sx={headerCell(theme)}>DATE</TableCell>
                    <TableCell sx={headerCell(theme)}>HEURE</TableCell>
                    <TableCell sx={headerCell(theme)}>PRIX</TableCell>
                    <TableCell sx={headerCell(theme)}>STATUT</TableCell>
                    <TableCell align="right" sx={headerCell(theme)}>ACTIONS</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredAppointments.map((appointment) => (
                    <TableRow
                      key={appointment.id}
                      hover
                      sx={{
                        "& td": { borderColor: `${theme.border}14` },
                        "&:hover": { backgroundColor: `${theme.main}018` },
                        transition: "background .2s ease",
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 160 }}>
                          <Avatar
                            sx={{
                              width: 36,
                              height: 36,
                              borderRadius: 2,
                              background: `linear-gradient(135deg, ${theme.main}20, ${theme.light}80)`,
                              color: theme.main,
                              fontSize: ".8rem",
                              fontWeight: 700,
                            }}
                          >
                            {appointment.clientName?.charAt(0) || "C"}
                          </Avatar>
                          <Typography sx={{ fontWeight: 600, color: theme.text, fontSize: ".85rem" }}>
                            {appointment.clientName}
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell sx={{ color: theme.text, fontSize: ".85rem" }}>
                        {appointment.serviceName || "-"}
                      </TableCell>

                      <TableCell sx={{ color: theme.text, fontSize: ".85rem" }}>
                        {appointment.teamMemberName || "-"}
                      </TableCell>

                      <TableCell sx={{ color: theme.text, fontSize: ".85rem" }}>
                        {appointment.appointmentDate}
                      </TableCell>

                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <AccessTime sx={{ fontSize: 14, color: theme.textLight }} />
                          <Typography sx={{ color: theme.text, fontSize: ".85rem" }}>
                            {appointment.appointmentTime}
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Typography sx={{ fontWeight: 750, color: theme.text, fontSize: ".85rem" }}>
                          {appointment.finalPrice ?? 0} DH
                        </Typography>
                      </TableCell>

                      <TableCell>{renderStatusChip(appointment.status)}</TableCell>

                      <TableCell align="right">
                        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 0.5 }}>
                          {appointment.status === "PENDING" && (
                            <>
                              <Tooltip title="Terminer">
                                <IconButton
                                  size="small"
                                  onClick={() => changeStatus(appointment.id, "COMPLETED")}
                                  sx={{ color: "#22c55e", borderRadius: 2 }}
                                >
                                  <CheckCircle fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Annuler">
                                <IconButton
                                  size="small"
                                  onClick={() => changeStatus(appointment.id, "CANCELED")}
                                  sx={{ color: "#ef4444", borderRadius: 2 }}
                                >
                                  <Cancel fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                          <Tooltip title="Modifier">
                            <IconButton
                              size="small"
                              onClick={() => openEdit(appointment)}
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
                              onClick={() => deleteAppointment(appointment.id)}
                              sx={{
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
              maxHeight: "90vh",
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
                  <CalendarToday sx={{ color: "#fff", fontSize: 24 }} />
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
                    {editingId ? "Modifier" : "Nouveau rendez-vous"}
                  </Typography>
                  <Typography sx={{ color: "#fff", fontSize: "1.25rem", fontWeight: 850 }}>
                    {editingId ? "Modifier le rendez-vous" : "Créer un rendez-vous"}
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

          {/* STEPPER */}
          <Box sx={{ px: { xs: 2.5, md: 4 }, pt: 3 }}>
            <Stepper
              activeStep={activeStep}
              sx={{
                "& .MuiStepLabel-iconContainer": { color: theme.main },
                "& .Mui-active": { color: theme.main },
                "& .Mui-completed": { color: theme.main },
              }}
            >
              {steps.map((step, index) => (
                <Step key={index}>
                  <StepLabel>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: ".7rem",
                        color: activeStep >= index ? theme.text : theme.textLight,
                      }}
                    >
                      {step.label}
                    </Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          <DialogContent sx={{ p: { xs: 2, md: 3.5 }, background: "#fafafa" }}>
            {/* STEP 0: CLIENT */}
            {activeStep === 0 && (
              <Fade in timeout={300}>
                <Box>
                  <Typography sx={{ fontWeight: 700, color: theme.text, fontSize: "1rem", mb: 2 }}>
                    Informations du client
                  </Typography>
                  <TextField
                    fullWidth
                    label="Nom complet *"
                    name="clientName"
                    value={form.clientName}
                    onChange={handleChange}
                    placeholder="Ex. Jean Dupont"
                    InputProps={{
                      startAdornment: <Person sx={{ color: theme.textLight, mr: 1, fontSize: 20 }} />,
                    }}
                    sx={inputSx}
                  />
                </Box>
              </Fade>
            )}

            {/* STEP 1: SERVICE & TEAM */}
            {activeStep === 1 && (
              <Fade in timeout={300}>
                <Box>
                  <Typography sx={{ fontWeight: 700, color: theme.text, fontSize: "1rem", mb: 2 }}>
                    Service & Équipe
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Service *</InputLabel>
                        <Select
                          name="serviceId"
                          value={form.serviceId}
                          label="Service *"
                          onChange={handleChange}
                          sx={selectSx}
                        >
                          <MenuItem value="">
                            <Typography sx={{ color: theme.textLight }}>Sélectionner un service</Typography>
                          </MenuItem>
                          {services.map((service) => (
                            <MenuItem key={service.id} value={String(service.id)}>
                              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                                <span>{service.name}</span>
                                {service.price != null && (
                                  <Chip
                                    label={`${service.price} DH`}
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
                                )}
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Membre de l'équipe *</InputLabel>
                        <Select
                          name="teamMemberId"
                          value={form.teamMemberId}
                          label="Membre de l'équipe *"
                          onChange={handleChange}
                          sx={selectSx}
                        >
                          <MenuItem value="">
                            <Typography sx={{ color: theme.textLight }}>Sélectionner un membre</Typography>
                          </MenuItem>
                          {teamMembers.map((member) => (
                            <MenuItem key={member.id} value={String(member.id)}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                <Avatar
                                  sx={{
                                    width: 28,
                                    height: 28,
                                    borderRadius: 2,
                                    background: `linear-gradient(135deg, ${theme.main}20, ${theme.light}80)`,
                                    color: theme.main,
                                    fontSize: ".7rem",
                                    fontWeight: 700,
                                  }}
                                >
                                  {member.name?.charAt(0) || "T"}
                                </Avatar>
                                {member.name}
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Box>
              </Fade>
            )}

            {/* STEP 2: DATE & PROMO */}
            {activeStep === 2 && (
              <Fade in timeout={300}>
                <Box>
                  <Typography sx={{ fontWeight: 700, color: theme.text, fontSize: "1rem", mb: 2 }}>
                    Horaire & Code promo
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Date *"
                        name="appointmentDate"
                        type="date"
                        value={form.appointmentDate}
                        onChange={handleChange}
                        slotProps={{ inputLabel: { shrink: true } }}
                        sx={inputSx}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Heure *"
                        name="appointmentTime"
                        type="time"
                        value={form.appointmentTime}
                        onChange={handleChange}
                        slotProps={{ inputLabel: { shrink: true } }}
                        sx={inputSx}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel>Code promo</InputLabel>
                        <Select
                          name="promoCodeId"
                          value={form.promoCodeId}
                          label="Code promo"
                          onChange={handleChange}
                          sx={selectSx}
                        >
                          <MenuItem value="">Aucun</MenuItem>
                          {promoCodes.map((promo) => {
                            const expired = isPromoExpired(promo);
                            return (
                              <MenuItem
                                key={promo.id}
                                value={String(promo.id)}
                                disabled={expired}
                                sx={{ opacity: expired ? 0.5 : 1 }}
                              >
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                    <Discount sx={{ color: expired ? theme.textLight : theme.main, fontSize: 18 }} />
                                    <span style={{ textDecoration: expired ? "line-through" : "none" }}>
                                      {promo.code}
                                    </span>
                                    <Chip
                                      label={`-${promo.discountPercentage}%`}
                                      size="small"
                                      sx={{
                                        height: 24,
                                        borderRadius: 2,
                                        fontSize: ".65rem",
                                        fontWeight: 700,
                                        backgroundColor: expired
                                          ? "rgba(156,163,175,.12)"
                                          : "rgba(34,197,94,.09)",
                                        color: expired ? "#9ca3af" : "#16a34a",
                                      }}
                                    />
                                  </Box>
                                  {expired && (
                                    <Chip
                                      label="Expiré"
                                      size="small"
                                      sx={{
                                        height: 24,
                                        borderRadius: 2,
                                        fontSize: ".65rem",
                                        fontWeight: 700,
                                        backgroundColor: "rgba(239,68,68,.08)",
                                        color: "#ef4444",
                                      }}
                                    />
                                  )}
                                </Box>
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>

                      {form.promoCodeId && selectedPromo && isSelectedPromoExpired && (
                        <Alert
                          severity="error"
                          sx={{
                            mt: 2,
                            borderRadius: 2.5,
                            "& .MuiAlert-icon": { color: "#ef4444" },
                          }}
                        >
                          Ce code promo a expiré le{" "}
                          {new Date(selectedPromo.endDate).toLocaleDateString("fr-FR")}. Veuillez en sélectionner un autre.
                        </Alert>
                      )}
                    </Grid>
                  </Grid>
                </Box>
              </Fade>
            )}

            {/* STEP 3: CONFIRMATION */}
            {activeStep === 3 && (
              <Fade in timeout={300}>
                <Box>
                  <Typography sx={{ fontWeight: 700, color: theme.text, fontSize: "1rem", mb: 2 }}>
                    Confirmation
                  </Typography>
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: 3,
                      border: `1px solid ${theme.border}20`,
                      background: `${theme.bg || "#fafafa"}`,
                    }}
                  >
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <Person sx={{ color: theme.main }} />
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Client
                              </Typography>
                              <Typography sx={{ fontWeight: 600, color: theme.text }}>
                                {form.clientName || "—"}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <Spa sx={{ color: theme.main }} />
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Service
                              </Typography>
                              <Typography sx={{ fontWeight: 600, color: theme.text }}>
                                {selectedService?.name || "—"}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <People sx={{ color: theme.main }} />
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Équipe
                              </Typography>
                              <Typography sx={{ fontWeight: 600, color: theme.text }}>
                                {selectedTeamMember?.name || "—"}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <Timer sx={{ color: theme.main }} />
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Horaire
                              </Typography>
                              <Typography sx={{ fontWeight: 600, color: theme.text }}>
                                {form.appointmentDate} à {form.appointmentTime}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={12}>
                          <Divider sx={{ my: 1 }} />
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Prix
                              </Typography>
                              <Typography sx={{ fontWeight: 800, color: theme.main, fontSize: "1.1rem" }}>
                                {selectedService?.price != null ? `${selectedService.price} DH` : "—"}
                              </Typography>
                            </Box>
                            {selectedPromo && !isSelectedPromoExpired && (
                              <Alert
                                severity="success"
                                sx={{
                                  borderRadius: 2,
                                  "& .MuiAlert-icon": { color: "#22c55e" },
                                }}
                              >
                                Code promo "{selectedPromo.code}" appliqué - {selectedPromo.discountPercentage}%
                              </Alert>
                            )}
                            {selectedPromo && isSelectedPromoExpired && (
                              <Alert
                                severity="error"
                                sx={{
                                  borderRadius: 2,
                                  "& .MuiAlert-icon": { color: "#ef4444" },
                                }}
                              >
                                ⚠️ Code promo "{selectedPromo.code}" expiré
                              </Alert>
                            )}
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Box>
              </Fade>
            )}
          </DialogContent>

          {/* DIALOG ACTIONS */}
          <DialogActions
            sx={{
              px: { xs: 2, md: 3.5 },
              py: 2,
              borderTop: `1px solid ${theme.border}18`,
              background: "#fff",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <Button
              onClick={closeDialog}
              disabled={saving}
              sx={{ color: theme.textLight, borderRadius: 2.5, fontWeight: 700, px: 2 }}
            >
              Annuler
            </Button>

            <Box sx={{ display: "flex", gap: 1, flex: 1, justifyContent: "flex-end" }}>
              <Button
                variant="outlined"
                onClick={handleBack}
                disabled={activeStep === 0}
                startIcon={<NavigateBefore />}
                sx={{
                  borderRadius: 2.5,
                  borderColor: theme.border,
                  color: theme.textLight,
                  fontWeight: 700,
                  "&:hover": { borderColor: theme.main, color: theme.main },
                }}
              >
                Précédent
              </Button>

              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={saving}
                  startIcon={<Check />}
                  sx={{
                    minWidth: 120,
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
                    "Créer"
                  )}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  endIcon={<NavigateNext />}
                  sx={{
                    minWidth: 120,
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
                    "&.Mui-disabled": {
                      background: `${theme.border}50`,
                      color: theme.textLight,
                      boxShadow: "none",
                      transform: "none",
                    },
                    transition: "all .2s ease",
                  }}
                >
                  Suivant
                </Button>
              )}
            </Box>
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