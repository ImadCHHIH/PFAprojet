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
} from "@mui/material";

import {
  Add,
  Delete,
  Edit,
  Search,
  People,
  FreeBreakfast,
  Work,
  EventAvailable,
  Person,
  Email,
  Phone,
  AttachMoney,
  PhotoCamera,
  Clear,
  Close,
  Groups,
} from "@mui/icons-material";

import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  createTeamMember,
  deleteTeamMember,
  getTeamByCompany,
  updateDutyStatus,
  updateTeamMember,
} from "../../api/teamApi";
import { getCompanyTheme } from "../../utils/companyThemes";

const emptyForm = {
  name: "",
  role: "",
  email: "",
  phone: "",
  salary: "",
  picture: "",
  dutyStatus: "ON_DUTY",
};

export default function TeamPage() {
  const { id: companyId } = useParams();
  const theme = getCompanyTheme(companyId || 0);

  // =========================================================
  // STATE
  // =========================================================

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [dutyFilter, setDutyFilter] = useState("ALL");
  const [availabilityFilter, setAvailabilityFilter] = useState("ALL");

  // =========================================================
  // LOAD TEAM
  // =========================================================

  const loadData = async () => {
    if (!companyId) return;

    try {
      setLoading(true);
      setError("");
      const teamData = await getTeamByCompany(companyId);
      setMembers(Array.isArray(teamData) ? teamData : []);
    } catch (err) {
      console.error("FAILED TO LOAD TEAM:", err);
      setError(err.response?.data?.message || "Impossible de charger l'équipe.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [companyId]);

  // =========================================================
  // STATS
  // =========================================================

  const totalStaff = members.length;
  const onDutyCount = members.filter((m) => m.dutyStatus === "ON_DUTY").length;
  const onBreakCount = members.filter((m) => m.dutyStatus === "ON_BREAK").length;
  const freeCount = members.filter((m) => m.availability === "FREE").length;
  const bookedCount = members.filter((m) => m.availability === "BOOKED").length;

  // =========================================================
  // FILTERS
  // =========================================================

  const filteredMembers = useMemo(() => {
    const searchValue = search.trim().toLowerCase();
    return members.filter((member) => {
      const matchesSearch =
        !searchValue ||
        member.name?.toLowerCase().includes(searchValue) ||
        member.role?.toLowerCase().includes(searchValue) ||
        member.email?.toLowerCase().includes(searchValue) ||
        member.phone?.toLowerCase().includes(searchValue);

      const matchesDuty = dutyFilter === "ALL" || member.dutyStatus === dutyFilter;
      const matchesAvailability = availabilityFilter === "ALL" || member.availability === availabilityFilter;

      return matchesSearch && matchesDuty && matchesAvailability;
    });
  }, [members, search, dutyFilter, availabilityFilter]);

  const clearFilters = () => {
    setSearch("");
    setDutyFilter("ALL");
    setAvailabilityFilter("ALL");
  };

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
    setError("");
  };

  const openCreate = () => {
    resetForm();
    setOpen(true);
  };

  const openEdit = (member) => {
    setEditingId(member.id);
    setForm({
      name: member.name || "",
      role: member.role || "",
      email: member.email || "",
      phone: member.phone || "",
      salary: member.salary ?? "",
      picture: member.picture || "",
      dutyStatus: member.dutyStatus || "ON_DUTY",
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
      toast.error("Le nom est requis.");
      return false;
    }
    if (!form.role.trim()) {
      toast.error("Le rôle est requis.");
      return false;
    }
    if (!form.email.trim()) {
      toast.error("L'email est requis.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
      toast.error("Veuillez saisir une adresse email valide.");
      return false;
    }
    if (!form.phone.trim()) {
      toast.error("Le téléphone est requis.");
      return false;
    }
    if (form.salary === "" || Number(form.salary) < 0) {
      toast.error("Le salaire doit être supérieur ou égal à 0.");
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
      const payload = {
        companyId: Number(companyId),
        name: form.name.trim(),
        role: form.role.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        salary: Number(form.salary),
        picture: form.picture.trim() || null,
        dutyStatus: form.dutyStatus,
      };

      if (editingId) {
        await updateTeamMember(editingId, payload);
        toast.success("Membre mis à jour avec succès.");
      } else {
        await createTeamMember(payload);
        toast.success("Membre créé avec succès.");
      }

      closeDialog();
      await loadData();
    } catch (err) {
      console.error("FAILED TO SAVE:", err);
      toast.error(err.response?.data?.message || "Impossible d'enregistrer le membre.");
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // DELETE
  // =========================================================

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce membre de l'équipe ?")) return;

    try {
      await deleteTeamMember(id);
      toast.success("Membre supprimé avec succès.");
      await loadData();
    } catch (err) {
      console.error("FAILED TO DELETE:", err);
      toast.error(err.response?.data?.message || "Impossible de supprimer le membre.");
    }
  };

  // =========================================================
  // DUTY STATUS
  // =========================================================

  const handleDutyStatusChange = async (member, status) => {
    try {
      await updateDutyStatus(member.id, status);
      toast.success("Statut de service mis à jour.");
      await loadData();
    } catch (err) {
      console.error("FAILED TO UPDATE STATUS:", err);
      toast.error(err.response?.data?.message || "Impossible de mettre à jour le statut.");
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
                  <Groups sx={{ color: "#fff", fontSize: 25 }} />
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
                    Personnel
                  </Typography>
                  <Typography
                    sx={{
                      color: "#fff",
                      fontSize: { xs: "1.55rem", md: "1.8rem" },
                      fontWeight: 850,
                      lineHeight: 1.1,
                    }}
                  >
                    Équipe
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
                Gérez les membres de votre équipe, leurs rôles et leur statut de service.
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
              Ajouter un membre
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
              sm: "repeat(3, 1fr)",
              lg: "repeat(5, 1fr)",
            },
            gap: 2,
            mb: 3,
          }}
        >
          <KpiCard
            label="Total"
            value={totalStaff}
            description="membres"
            icon={<People />}
            color="#2563eb"
            theme={theme}
          />
          <KpiCard
            label="En service"
            value={onDutyCount}
            description={totalStaff ? `${Math.round((onDutyCount / totalStaff) * 100)}%` : "—"}
            icon={<Work />}
            color="#22c55e"
            theme={theme}
          />
          <KpiCard
            label="En pause"
            value={onBreakCount}
            description={totalStaff ? `${Math.round((onBreakCount / totalStaff) * 100)}%` : "—"}
            icon={<FreeBreakfast />}
            color="#f59e0b"
            theme={theme}
          />
          <KpiCard
            label="Disponibles"
            value={freeCount}
            description="libres"
            icon={<EventAvailable />}
            color="#4facfe"
            theme={theme}
          />
          <KpiCard
            label="Réservés"
            value={bookedCount}
            description="occupés"
            icon={<EventAvailable />}
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
                placeholder="Rechercher un membre..."
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
              <InputLabel>Statut de service</InputLabel>
              <Select
                value={dutyFilter}
                label="Statut de service"
                onChange={(e) => setDutyFilter(e.target.value)}
                sx={selectSx}
              >
                <MenuItem value="ALL">Tous les statuts</MenuItem>
                <MenuItem value="ON_DUTY">En service</MenuItem>
                <MenuItem value="ON_BREAK">En pause</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Disponibilité</InputLabel>
              <Select
                value={availabilityFilter}
                label="Disponibilité"
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                sx={selectSx}
              >
                <MenuItem value="ALL">Toutes</MenuItem>
                <MenuItem value="FREE">Disponible</MenuItem>
                <MenuItem value="BOOKED">Réservé</MenuItem>
              </Select>
            </FormControl>
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
              <strong style={{ color: theme.text }}>{filteredMembers.length}</strong> membre
              {filteredMembers.length !== 1 ? "s" : ""} affiché
              {filteredMembers.length !== 1 ? "s" : ""}
            </Typography>

            {(search || dutyFilter !== "ALL" || availabilityFilter !== "ALL") && (
              <Button
                size="small"
                onClick={clearFilters}
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
                Liste des membres
              </Typography>
              <Typography sx={{ color: theme.textLight, fontSize: ".76rem", mt: 0.3 }}>
                Équipe de votre salon
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
              <People fontSize="small" />
            </Box>
          </Box>

          {loading ? (
            <Box sx={{ height: 330, display: "flex", justifyContent: "center", alignItems: "center" }}>
              <CircularProgress size={32} thickness={4} sx={{ color: theme.main }} />
            </Box>
          ) : filteredMembers.length === 0 ? (
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
                {search ? <Search sx={{ fontSize: 32 }} /> : <People sx={{ fontSize: 32 }} />}
              </Box>
              <Typography sx={{ color: theme.text, fontWeight: 800, fontSize: "1rem" }}>
                {search ? "Aucun membre trouvé" : "Aucun membre dans l'équipe"}
              </Typography>
              <Typography sx={{ color: theme.textLight, fontSize: ".76rem", mt: 0.7, maxWidth: 380, mx: "auto", lineHeight: 1.6 }}>
                {search
                  ? "Essayez avec un autre terme de recherche."
                  : "Commencez par ajouter votre premier membre."}
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
                  Ajouter un membre
                </Button>
              )}
            </Box>
          ) : (
            <TableContainer sx={{ overflowX: "auto" }}>
              <Table sx={{ minWidth: 1100 }}>
                <TableHead>
                  <TableRow sx={{ background: `${theme.main}035` }}>
                    <TableCell sx={headerCell(theme)}>NOM</TableCell>
                    <TableCell sx={headerCell(theme)}>RÔLE</TableCell>
                    <TableCell sx={headerCell(theme)}>EMAIL</TableCell>
                    <TableCell sx={headerCell(theme)}>TÉLÉPHONE</TableCell>
                    <TableCell sx={headerCell(theme)}>SALAIRE</TableCell>
                    <TableCell sx={headerCell(theme)}>SERVICE</TableCell>
                    <TableCell sx={headerCell(theme)}>DISPONIBILITÉ</TableCell>
                    <TableCell sx={headerCell(theme)}>RENDEZ-VOUS</TableCell>
                    <TableCell align="right" sx={headerCell(theme)}>ACTIONS</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredMembers.map((member) => (
                    <TableRow
                      key={member.id}
                      hover
                      sx={{
                        "& td": { borderColor: `${theme.border}14` },
                        "&:hover": { backgroundColor: `${theme.main}018` },
                        transition: "background .2s ease",
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 200 }}>
                          <Avatar
                            src={member.picture || undefined}
                            sx={{
                              width: 42,
                              height: 42,
                              borderRadius: 2.5,
                              background: member.picture
                                ? "transparent"
                                : `linear-gradient(135deg, ${theme.main}20, ${theme.light}80)`,
                              color: theme.main,
                              fontWeight: 800,
                              border: `1px solid ${theme.main}15`,
                            }}
                          >
                            {!member.picture && member.name?.charAt(0)?.toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontWeight: 750, color: theme.text, fontSize: ".86rem" }}>
                              {member.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Membre de l'équipe
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={member.role}
                          size="small"
                          sx={{
                            height: 28,
                            borderRadius: 2,
                            fontSize: ".7rem",
                            fontWeight: 700,
                            backgroundColor: `${theme.main}0C`,
                            color: theme.main,
                            border: `1px solid ${theme.main}12`,
                          }}
                        />
                      </TableCell>

                      <TableCell sx={{ color: theme.text, fontSize: ".82rem" }}>
                        {member.email}
                      </TableCell>

                      <TableCell sx={{ color: theme.text, fontSize: ".82rem" }}>
                        {member.phone}
                      </TableCell>

                      <TableCell>
                        <Typography sx={{ fontWeight: 750, color: theme.text, fontSize: ".84rem" }}>
                          {Number(member.salary || 0).toFixed(2)} MAD
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <FormControl size="small" sx={{ minWidth: 130 }}>
                          <Select
                            value={member.dutyStatus || "ON_DUTY"}
                            onChange={(e) => handleDutyStatusChange(member, e.target.value)}
                            sx={{
                              borderRadius: 2,
                              fontSize: ".75rem",
                              fontWeight: 650,
                              "& .MuiOutlinedInput-notchedOutline": { borderColor: `${theme.border}35` },
                              "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: theme.main },
                              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                borderColor: theme.main,
                                boxShadow: `0 0 0 4px ${theme.main}10`,
                              },
                            }}
                          >
                            <MenuItem value="ON_DUTY">
                              <Box sx={{ display: "flex", alignItems: "center", gap: 0.7, color: "#16a34a" }}>
                                <Box sx={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: "#16a34a" }} />
                                En service
                              </Box>
                            </MenuItem>
                            <MenuItem value="ON_BREAK">
                              <Box sx={{ display: "flex", alignItems: "center", gap: 0.7, color: "#f59e0b" }}>
                                <Box sx={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: "#f59e0b" }} />
                                En pause
                              </Box>
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={member.availability === "FREE" ? "Disponible" : "Réservé"}
                          size="small"
                          sx={{
                            height: 28,
                            borderRadius: 2,
                            fontSize: ".7rem",
                            fontWeight: 750,
                            backgroundColor: member.availability === "FREE"
                              ? "rgba(34,197,94,.09)"
                              : "rgba(239,68,68,.08)",
                            color: member.availability === "FREE" ? "#16a34a" : "#ef4444",
                          }}
                        />
                      </TableCell>

                      <TableCell>
                        <Typography sx={{ fontWeight: 800, color: theme.text, fontSize: ".9rem" }}>
                          {member.appointmentCount ?? 0}
                        </Typography>
                      </TableCell>

                      <TableCell align="right">
                        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 0.5 }}>
                          <Tooltip title="Modifier">
                            <IconButton
                              size="small"
                              onClick={() => openEdit(member)}
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
                              onClick={() => handleDelete(member.id)}
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
                  <People sx={{ color: "#fff", fontSize: 24 }} />
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
                    {editingId ? "Modifier" : "Nouveau membre"}
                  </Typography>
                  <Typography sx={{ color: "#fff", fontSize: "1.25rem", fontWeight: 850 }}>
                    {editingId ? "Modifier le membre" : "Ajouter un membre"}
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
            <SectionTitle number="01" title="Informations du membre" description="Définissez les détails du membre de l'équipe." theme={theme} />

            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Nom *"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  fullWidth
                  placeholder="Ex. Jean Dupont"
                  InputProps={{
                    startAdornment: <Person sx={{ color: theme.textLight, mr: 1, fontSize: 20 }} />,
                  }}
                  sx={inputSx}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Rôle *"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  fullWidth
                  placeholder="Ex. Coiffeur"
                  sx={inputSx}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Email *"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  fullWidth
                  placeholder="jean@example.com"
                  InputProps={{
                    startAdornment: <Email sx={{ color: theme.textLight, mr: 1, fontSize: 20 }} />,
                  }}
                  sx={inputSx}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Téléphone *"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  fullWidth
                  placeholder="06 12 34 56 78"
                  InputProps={{
                    startAdornment: <Phone sx={{ color: theme.textLight, mr: 1, fontSize: 20 }} />,
                  }}
                  sx={inputSx}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Salaire (MAD)"
                  name="salary"
                  type="number"
                  value={form.salary}
                  onChange={handleChange}
                  fullWidth
                  placeholder="0.00"
                  InputProps={{
                    startAdornment: <AttachMoney sx={{ color: theme.textLight, mr: 1, fontSize: 20 }} />,
                  }}
                  inputProps={{ min: 0, step: "0.01" }}
                  sx={inputSx}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Statut de service</InputLabel>
                  <Select
                    name="dutyStatus"
                    value={form.dutyStatus}
                    label="Statut de service"
                    onChange={handleChange}
                    sx={selectSx}
                  >
                    <MenuItem value="ON_DUTY">En service</MenuItem>
                    <MenuItem value="ON_BREAK">En pause</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="URL de la photo"
                  name="picture"
                  value={form.picture}
                  onChange={handleChange}
                  fullWidth
                  placeholder="https://example.com/photo.jpg"
                  InputProps={{
                    startAdornment: <PhotoCamera sx={{ color: theme.textLight, mr: 1, fontSize: 20 }} />,
                  }}
                  sx={inputSx}
                />
              </Grid>
            </Grid>

            {/* Photo Preview */}
            {form.picture && (
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  border: `1px solid ${theme.main}20`,
                  background: `${theme.main}05`,
                }}
              >
                <Avatar
                  src={form.picture}
                  sx={{ width: 60, height: 60, border: `2px solid ${theme.main}25` }}
                />
                <Box>
                  <Typography sx={{ fontWeight: 750, color: theme.text, fontSize: ".85rem" }}>
                    Aperçu de la photo
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    La photo apparaîtra dans l'équipe.
                  </Typography>
                </Box>
              </Paper>
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
                "Créer le membre"
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