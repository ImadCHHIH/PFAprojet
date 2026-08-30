import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    Box,
    Button,
    Chip,
    Typography,
    Alert,
    CircularProgress,
    LinearProgress,
    Stack,
    Fade,
    IconButton,
    Tooltip,
    Paper
} from "@mui/material";

import {
    ArrowBack,
    CalendarToday,
    People,
    Groups,
    Add,
    DesignServices,
    ArrowForward,
    Inventory2,
    MoreHoriz,
    CheckCircle,
    AttachMoney,
    Storefront,
    BarChart as BarChartIcon,
    Spa,
    EventNote,
    LocationOn,
    PointOfSale
} from "@mui/icons-material";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    LineChart,
    Line,
    Tooltip as RechartsTooltip
} from "recharts";

import {
    useAuth
} from "../../context/AuthContext";

import appointmentsApi
    from "../../api/appointmentsApi";

import {
    getServicesByCompany
} from "../../api/serviceApi";

import {
    getTeamByCompany
} from "../../api/teamApi";

import {
    getCompanyTheme
} from "../../utils/companyThemes";


export default function CompanyDashboardPage() {

    const { id: companyId } = useParams();
    const navigate = useNavigate();

    const {
        user,
        companies
    } = useAuth();

    const company = companies?.find(
        company => String(company.id) === String(companyId)
    );

    /*
     * =============================================================
     * COMPANY THEME
     * =============================================================
     *
     * Everything visual below is based on the selected company.
     */
    const theme = getCompanyTheme(company?.id || 0);

    const API_URL = "http://localhost:8080";

    const companyLogo = company?.logo
        ? (
            company.logo.startsWith("http")
                ? company.logo
                : `${API_URL}${company.logo}`
        )
        : null;


    /*
     * =============================================================
     * DATA
     * =============================================================
     */

    const [appointments, setAppointments] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    /*
     * =============================================================
     * LOAD DASHBOARD
     * =============================================================
     */

    useEffect(() => {
        if (!companyId) return;

        const loadDashboard = async () => {
            try {
                setLoading(true);
                setError("");

                const results = await Promise.allSettled([
                    appointmentsApi.getByCompany(companyId),
                    getTeamByCompany(companyId),
                    getServicesByCompany(companyId)
                ]);

                if (results[0].status === "fulfilled") {
                    setAppointments(normalizeArray(results[0].value));
                } else {
                    console.error(
                        "Error loading appointments:",
                        results[0].reason
                    );
                    setAppointments([]);
                }

                if (results[1].status === "fulfilled") {
                    setTeamMembers(normalizeArray(results[1].value));
                } else {
                    console.error(
                        "Error loading team:",
                        results[1].reason
                    );
                    setTeamMembers([]);
                }

                if (results[2].status === "fulfilled") {
                    setServices(normalizeArray(results[2].value));
                } else {
                    console.error(
                        "Error loading services:",
                        results[2].reason
                    );
                    setServices([]);
                }

                if (
                    results.every(
                        result => result.status === "rejected"
                    )
                ) {
                    setError(
                        "Impossible de charger les données du tableau de bord."
                    );
                }

            } catch (err) {
                console.error(
                    "Dashboard loading error:",
                    err
                );

                setError(
                    err.response?.data?.message ||
                    "Impossible de charger les données du tableau de bord."
                );

            } finally {
                setLoading(false);
            }
        };

        loadDashboard();

    }, [companyId]);


    /*
     * =============================================================
     * DATES
     * =============================================================
     */

    const today = useMemo(
        () => formatDateLocal(new Date()),
        []
    );

    const currentMonth = useMemo(() => {
        const date = new Date();

        return `${date.getFullYear()}-${String(
            date.getMonth() + 1
        ).padStart(2, "0")}`;

    }, []);


    /*
     * =============================================================
     * TODAY'S APPOINTMENTS
     * =============================================================
     */

    const todaysAppointments = useMemo(() => {

        return appointments
            .filter(
                appointment =>
                    normalizeDate(
                        appointment.appointmentDate
                    ) === today
            )
            .sort(
                (a, b) =>
                    String(
                        a.appointmentTime || ""
                    ).localeCompare(
                        String(
                            b.appointmentTime || ""
                        )
                    )
            );

    }, [appointments, today]);


    const todayAppointmentCount =
        todaysAppointments.length;


    /*
     * =============================================================
     * UNIQUE CLIENTS
     * =============================================================
     */

    const uniqueClients = useMemo(() => {

        const clients = new Set();

        appointments.forEach(appointment => {

            const clientName =
                appointment.clientName
                    ?.trim()
                    .toLowerCase();

            if (clientName) {
                clients.add(clientName);
            }

        });

        return clients.size;

    }, [appointments]);


    /*
     * =============================================================
     * MONTHLY REVENUE
     * =============================================================
     */

    const monthlyRevenue = useMemo(() => {

        return appointments.reduce(
            (total, appointment) => {

                const date =
                    normalizeDate(
                        appointment.appointmentDate
                    );

                if (
                    !date ||
                    !date.startsWith(currentMonth) ||
                    appointment.status === "CANCELED"
                ) {
                    return total;
                }

                const price =
                    Number(
                        appointment.finalPrice
                    ) ||
                    Number(
                        appointment.servicePrice
                    ) ||
                    0;

                return total + price;

            },
            0
        );

    }, [appointments, currentMonth]);


    /*
     * =============================================================
     * ACTIVE TEAM
     * =============================================================
     */

    const activeTeamCount = useMemo(() => {

        return teamMembers.filter(
            member =>
                member.active === true ||
                member.isActive === true ||
                member.status === "ACTIVE"
        ).length;

    }, [teamMembers]);


    /*
     * =============================================================
     * POPULAR SERVICES
     * =============================================================
     */

    const popularServices = useMemo(() => {

        const serviceCount = {};

        appointments.forEach(appointment => {

            const name =
                appointment.serviceName ||
                "Service inconnu";

            serviceCount[name] =
                (serviceCount[name] || 0) + 1;

        });

        return Object.entries(serviceCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 4)
            .map(([name, count]) => ({
                name,
                count
            }));

    }, [appointments]);


    /*
     * =============================================================
     * CHART COLORS
     *
     * Based on the company theme instead of the old fixed palette.
     * =============================================================
     */

    const chartColors = useMemo(() => {

        return [
            theme.main,
            theme.light,
            theme.lighter,
            `${theme.main}80`,
            `${theme.main}55`
        ];

    }, [theme]);


    /*
     * =============================================================
     * SERVICE DONUT
     * =============================================================
     */

    const serviceDonutData = useMemo(() => {

        return popularServices.map(
            (service, index) => ({
                name: service.name,
                value: service.count,
                color:
                    chartColors[
                        index % chartColors.length
                    ]
            })
        );

    }, [popularServices, chartColors]);


    /*
     * =============================================================
     * WEEKLY ACTIVITY
     * =============================================================
     */

    const weeklyActivity = useMemo(() => {

        const days = [];

        for (let i = 6; i >= 0; i--) {

            const date = new Date();

            date.setDate(
                date.getDate() - i
            );

            const key =
                formatDateLocal(date);

            const label =
                date.toLocaleDateString(
                    "fr-FR",
                    {
                        weekday: "short"
                    }
                );

            const count =
                appointments.filter(
                    appointment =>
                        normalizeDate(
                            appointment.appointmentDate
                        ) === key
                ).length;

            days.push({
                label,
                count
            });
        }

        return days;

    }, [appointments]);


    /*
     * =============================================================
     * MONTHLY APPOINTMENTS
     * =============================================================
     */

    const monthlyAppointments =
        appointments.filter(
            appointment =>
                normalizeDate(
                    appointment.appointmentDate
                )?.startsWith(currentMonth)
        ).length;


    /*
     * =============================================================
     * COMPANY NOT FOUND
     * =============================================================
     */

    if (!company) {

        return (
            <Box sx={{ p: 4 }}>

                <Typography
                    variant="h5"
                    fontWeight={800}
                    mb={1}
                >
                    Entreprise introuvable
                </Typography>

                <Typography
                    color="text.secondary"
                    mb={3}
                >
                    Cette entreprise n'est pas accessible
                    depuis votre compte.
                </Typography>

                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={() => navigate("/")}
                    sx={{
                        textTransform: "none",
                        borderRadius: 2
                    }}
                >
                    Retour aux entreprises
                </Button>

            </Box>
        );
    }


    const statusColor =
        company.status === "ACTIVE"
            ? "success"
            : "error";


    /*
     * =============================================================
     * DASHBOARD
     * =============================================================
     */

    return (
        <Fade in timeout={450}>

            <Box
                sx={{
                    width: "100%",
                    boxSizing: "border-box",
                    pb: 6
                }}
            >

                {/* =================================================
                    TOP BAR
                ================================================= */}

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2.5
                    }}
                >

                    <Button
                        startIcon={<ArrowBack />}
                        onClick={() => navigate("/")}
                        sx={{
                            textTransform: "none",
                            color: theme.textLight,
                            fontWeight: 650,
                            borderRadius: 2,

                            "&:hover": {
                                color: theme.main,
                                backgroundColor:
                                    `${theme.main}08`
                            }
                        }}
                    >
                        Entreprises
                    </Button>


                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1
                        }}
                    >

                        <Chip
                            icon={
                                <CheckCircle
                                    sx={{
                                        fontSize: 15
                                    }}
                                />
                            }
                            label={
                                company.status ||
                                "INCONNU"
                            }
                            color={statusColor}
                            size="small"
                            sx={{
                                fontWeight: 700,
                                borderRadius: 2
                            }}
                        />


                        <Tooltip title="Options">

                            <IconButton
                                size="small"
                                sx={{
                                    border:
                                        `1px solid ${theme.border}30`,
                                    backgroundColor:
                                        theme.card ||
                                        "#fff",

                                    color:
                                        theme.textLight,

                                    "&:hover": {
                                        color:
                                            theme.main,
                                        borderColor:
                                            theme.main,
                                        backgroundColor:
                                            `${theme.main}08`
                                    }
                                }}
                            >
                                <MoreHoriz />
                            </IconButton>

                        </Tooltip>

                    </Box>

                </Box>


                {/* =================================================
                    COMPANY HEADER
                ================================================= */}

                <Box
                    sx={{
                        display: "flex",
                        gap: 2.5,
                        mb: 3,
                        flexWrap: {
                            xs: "wrap",
                            md: "nowrap"
                        }
                    }}
                >

                    {/* COMPANY IDENTITY */}

                    <Paper
                        elevation={0}
                        sx={{
                            flex: "1 1 60%",
                            minWidth: 0,
                            borderRadius: 5,
                            p: 3,
                            display: "flex",
                            alignItems: "center",
                            gap: 2.5,

                            background:
                                `linear-gradient(
                                    135deg,
                                    ${theme.lighter} 0%,
                                    ${theme.bg} 100%
                                )`,

                            border:
                                `1px solid ${theme.border}25`,

                            boxShadow:
                                `0 8px 30px ${theme.shadow}`
                        }}
                    >

                        <Box
                            sx={{
                                width: 72,
                                height: 72,
                                flexShrink: 0,
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                overflow: "hidden",

                                background:
                                    `${theme.main}12`,

                                border:
                                    `2px solid ${theme.main}30`
                            }}
                        >

                            {companyLogo ? (

                                <Box
                                    component="img"
                                    src={companyLogo}
                                    alt={`${company.name} logo`}
                                    onError={e => {
                                        e.currentTarget.style.display =
                                            "none";
                                    }}
                                    sx={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover"
                                    }}
                                />

                            ) : (

                                <Spa
                                    sx={{
                                        color: theme.main,
                                        fontSize: 34
                                    }}
                                />

                            )}

                        </Box>


                        <Box sx={{ minWidth: 0 }}>

                            <Typography
                                variant="overline"
                                sx={{
                                    color: theme.main,
                                    fontWeight: 800,
                                    letterSpacing: 2,
                                    fontSize: ".65rem"
                                }}
                            >
                                ESPACE PROFESSIONNEL
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: {
                                        xs: "1.6rem",
                                        md: "2rem"
                                    },
                                    fontWeight: 900,
                                    lineHeight: 1.1,
                                    letterSpacing: "-1px",
                                    color: theme.text
                                }}
                            >
                                {company.name}
                            </Typography>

                            <Typography
                                sx={{
                                    mt: .4,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                    fontSize: ".85rem",
                                    color: theme.textLight
                                }}
                            >
                                <LocationOn
                                    sx={{
                                        fontSize: 15,
                                        color: theme.main
                                    }}
                                />

                                {[
                                    company.city,
                                    company.country
                                ]
                                    .filter(Boolean)
                                    .join(", ") ||
                                    "Votre établissement"}
                            </Typography>

                        </Box>

                    </Paper>


                    {/* SUBSCRIPTION / GREETING */}

                    <Paper
                        elevation={0}
                        sx={{
                            flex: "1 1 40%",
                            minWidth: 0,
                            borderRadius: 5,
                            p: 3,

                            background:
                                theme.card ||
                                "#FFFFFF",

                            border:
                                `1px solid ${theme.border}25`,

                            boxShadow:
                                `0 8px 30px ${theme.shadow}`,

                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            gap: 1.5
                        }}
                    >

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent:
                                    "space-between",
                                flexWrap: "wrap",
                                gap: 1
                            }}
                        >

                            <Typography
                                variant="caption"
                                sx={{
                                    color:
                                        theme.textLight,
                                    fontWeight: 650
                                }}
                            >
                                ABONNEMENT ACTUEL
                            </Typography>

                            <Chip
                                icon={
                                    <Storefront
                                        sx={{
                                            fontSize: 15
                                        }}
                                    />
                                }
                                label={
                                    company.plan ||
                                    "Essai"
                                }
                                size="small"
                                sx={{
                                    fontWeight: 800,
                                    bgcolor:
                                        `${theme.main}12`,
                                    color:
                                        theme.main
                                }}
                            />

                        </Box>


                        <Box>

                            <Typography
                                sx={{
                                    fontSize: "1.3rem",
                                    fontWeight: 850,
                                    color: theme.text
                                }}
                            >
                                Bonjour,{" "}
                                {user?.firstName ||
                                    "vous"}{" "}
                                👋
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: ".9rem",
                                    color:
                                        theme.textLight
                                }}
                            >
                                Voici votre activité
                                pour aujourd'hui —{" "}
                                {todayAppointmentCount}{" "}
                                rendez-vous
                            </Typography>

                        </Box>

                    </Paper>

                </Box>


                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                    <Alert
                        severity="error"
                        sx={{
                            mb: 3,
                            borderRadius: 3
                        }}
                        onClose={() => setError("")}
                    >
                        {error}
                    </Alert>

                )}


                {/* =================================================
                    LOADING
                ================================================= */}

                {loading ? (

                    <Box
                        sx={{
                            py: 12,
                            display: "flex",
                            justifyContent: "center",
                            textAlign: "center"
                        }}
                    >

                        <Box>

                            <CircularProgress
                                size={42}
                                sx={{
                                    color: theme.main,
                                    mb: 2
                                }}
                            />

                            <Typography
                                sx={{
                                    color:
                                        theme.textLight
                                }}
                            >
                                Préparation de votre
                                espace...
                            </Typography>

                        </Box>

                    </Box>

                ) : (

                    <>

                        {/* =================================================
                            STATS
                        ================================================= */}

                        <Box
                            sx={{
                                display: "flex",
                                gap: 2,
                                mb: 2.5,
                                flexWrap: {
                                    xs: "wrap",
                                    md: "nowrap"
                                }
                            }}
                        >

                            <Box
                                sx={{
                                    flex: 1,
                                    minWidth: {
                                        xs: "45%",
                                        md: 0
                                    }
                                }}
                            >
                                <StatCard
                                    icon={
                                        <People
                                            sx={{
                                                fontSize: 20
                                            }}
                                        />
                                    }
                                    label="Clients"
                                    value={uniqueClients}
                                    subtitle="Clients enregistrés"
                                    theme={theme}
                                />
                            </Box>


                            <Box
                                sx={{
                                    flex: 1,
                                    minWidth: {
                                        xs: "45%",
                                        md: 0
                                    }
                                }}
                            >
                                <StatCard
                                    icon={
                                        <AttachMoney
                                            sx={{
                                                fontSize: 20
                                            }}
                                        />
                                    }
                                    label="Chiffre d'affaires"
                                    value={formatMoney(
                                        monthlyRevenue
                                    )}
                                    subtitle="Ce mois-ci"
                                    theme={theme}
                                />
                            </Box>


                            <Box
                                sx={{
                                    flex: 1,
                                    minWidth: {
                                        xs: "45%",
                                        md: 0
                                    }
                                }}
                            >
                                <StatCard
                                    icon={
                                        <Groups
                                            sx={{
                                                fontSize: 20
                                            }}
                                        />
                                    }
                                    label="Équipe active"
                                    value={activeTeamCount}
                                    subtitle="Membres actifs"
                                    theme={theme}
                                />
                            </Box>


                            <Box
                                sx={{
                                    flex: 1,
                                    minWidth: {
                                        xs: "45%",
                                        md: 0
                                    }
                                }}
                            >
                                <StatCard
                                    icon={
                                        <EventNote
                                            sx={{
                                                fontSize: 20
                                            }}
                                        />
                                    }
                                    label="RDV ce mois"
                                    value={monthlyAppointments}
                                    subtitle="Total programmé"
                                    theme={theme}
                                />
                            </Box>

                        </Box>


                        {/* =================================================
                            APPOINTMENTS + QUICK ACCESS
                        ================================================= */}

                        <Box
                            sx={{
                                display: "flex",
                                gap: 2.5,
                                mb: 2.5,
                                flexWrap: {
                                    xs: "wrap",
                                    md: "nowrap"
                                }
                            }}
                        >

                            {/* APPOINTMENTS */}

                            <Box
                                sx={{
                                    flex: "1 1 50%",
                                    minWidth: 0
                                }}
                            >

                                <DashboardSection
                                    theme={theme}
                                >

                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent:
                                                "space-between",
                                            alignItems:
                                                "flex-start",
                                            mb: 2
                                        }}
                                    >

                                        <Box>

                                            <Typography
                                                variant="overline"
                                                sx={{
                                                    fontWeight: 800,
                                                    color:
                                                        theme.text,
                                                    letterSpacing: 1
                                                }}
                                            >
                                                RENDEZ-VOUS
                                            </Typography>

                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color:
                                                        theme.textLight
                                                }}
                                            >
                                                {
                                                    todayAppointmentCount
                                                }{" "}
                                                rendez-vous
                                                programmés
                                            </Typography>

                                        </Box>

                                        <Button
                                            size="small"
                                            endIcon={
                                                <ArrowForward
                                                    sx={{
                                                        fontSize: 16
                                                    }}
                                                />
                                            }
                                            onClick={() =>
                                                navigate(
                                                    `/company/${companyId}/appointments`
                                                )
                                            }
                                            sx={{
                                                textTransform:
                                                    "none",
                                                color:
                                                    theme.main,
                                                fontWeight: 700
                                            }}
                                        >
                                            Voir tout
                                        </Button>

                                    </Box>


                                    {todaysAppointments.length === 0 ? (

                                        <Box
                                            sx={{
                                                py: 4,
                                                textAlign: "center"
                                            }}
                                        >

                                            <CalendarToday
                                                sx={{
                                                    fontSize: 42,
                                                    color:
                                                        theme.main,
                                                    opacity: 0.18,
                                                    mb: 1
                                                }}
                                            />

                                            <Typography
                                                fontWeight={600}
                                                sx={{
                                                    color:
                                                        theme.text
                                                }}
                                            >
                                                Aucun rendez-vous
                                                aujourd'hui
                                            </Typography>

                                        </Box>

                                    ) : (

                                        <Stack spacing={0.5}>

                                            {todaysAppointments
                                                .slice(0, 4)
                                                .map(
                                                    (
                                                        appointment,
                                                        index
                                                    ) => (

                                                        <AppointmentRow
                                                            key={
                                                                appointment.id ||
                                                                index
                                                            }
                                                            appointment={
                                                                appointment
                                                            }
                                                            index={
                                                                index
                                                            }
                                                            theme={
                                                                theme
                                                            }
                                                            onSeeAll={() =>
                                                                navigate(
                                                                    `/company/${companyId}/appointments`
                                                                )
                                                            }
                                                        />

                                                    )
                                                )}

                                        </Stack>

                                    )}

                                </DashboardSection>

                            </Box>


                            {/* QUICK ACCESS */}

                            <Box
                                sx={{
                                    flex: "1 1 50%",
                                    minWidth: 0
                                }}
                            >

                                <DashboardSection
                                    theme={theme}
                                >

                                    <Typography
                                        variant="overline"
                                        sx={{
                                            fontWeight: 800,
                                            color:
                                                theme.text,
                                            letterSpacing: 1
                                        }}
                                    >
                                        ACCÈS RAPIDE
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        sx={{
                                            mb: 2,
                                            color:
                                                theme.textLight
                                        }}
                                    >
                                        Accédez rapidement
                                        à vos outils
                                    </Typography>


                                    <Box
                                        sx={{
                                            display: "grid",
                                            gridTemplateColumns: {
                                                xs: "repeat(2, 1fr)",
                                                sm: "repeat(3, 1fr)"
                                            },
                                            gap: 1.2
                                        }}
                                    >

                                        {[
                                            {
                                                icon: <Add />,
                                                label:
                                                    "Créer rendez-vous",
                                                path:
                                                    "appointments"
                                            },
                                            {
                                                icon:
                                                    <PointOfSale />,
                                                label:
                                                    "Point de vente",
                                                path: "pos"
                                            },
                                            {
                                                icon:
                                                    <People />,
                                                label:
                                                    "Clients",
                                                path:
                                                    "clients"
                                            },
                                            {
                                                icon:
                                                    <Inventory2 />,
                                                label:
                                                    "Stock",
                                                path:
                                                    "stock"
                                            },
                                            {
                                                icon:
                                                    <DesignServices />,
                                                label:
                                                    "Services",
                                                path:
                                                    "services"
                                            },
                                            {
                                                icon:
                                                    <BarChartIcon />,
                                                label:
                                                    "Rapports",
                                                path:
                                                    "reports"
                                            }
                                        ].map(
                                            (
                                                action,
                                                index
                                            ) => (

                                                <ActionButton
                                                    key={index}
                                                    icon={
                                                        action.icon
                                                    }
                                                    label={
                                                        action.label
                                                    }
                                                    theme={
                                                        theme
                                                    }
                                                    onClick={() =>
                                                        navigate(
                                                            `/company/${companyId}/${action.path}`
                                                        )
                                                    }
                                                />

                                            )
                                        )}

                                    </Box>

                                </DashboardSection>

                            </Box>

                        </Box>


                        {/* =================================================
                            SERVICES + OVERVIEW
                        ================================================= */}

                        <Box
                            sx={{
                                display: "flex",
                                gap: 2.5,
                                flexWrap: {
                                    xs: "wrap",
                                    md: "nowrap"
                                }
                            }}
                        >

                            {/* POPULAR SERVICES */}

                            <Box
                                sx={{
                                    flex: "1 1 50%",
                                    minWidth: 0
                                }}
                            >

                                <DashboardSection
                                    theme={theme}
                                >

                                    <Typography
                                        variant="overline"
                                        sx={{
                                            fontWeight: 800,
                                            color:
                                                theme.text,
                                            letterSpacing: 1
                                        }}
                                    >
                                        SERVICES POPULAIRES
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        sx={{
                                            mb: 2,
                                            color:
                                                theme.textLight
                                        }}
                                    >
                                        Les plus demandés
                                    </Typography>


                                    {popularServices.length === 0 ? (

                                        <Box
                                            sx={{
                                                py: 4,
                                                textAlign: "center"
                                            }}
                                        >

                                            <DesignServices
                                                sx={{
                                                    fontSize: 40,
                                                    color:
                                                        theme.main,
                                                    opacity: 0.18,
                                                    mb: 1
                                                }}
                                            />

                                            <Typography
                                                sx={{
                                                    color:
                                                        theme.textLight
                                                }}
                                            >
                                                Aucun service
                                                enregistré
                                            </Typography>

                                        </Box>

                                    ) : (

                                        <Stack spacing={1.5}>

                                            {popularServices.map(
                                                (
                                                    service,
                                                    index
                                                ) => {

                                                    const max =
                                                        Math.max(
                                                            ...popularServices.map(
                                                                item =>
                                                                    item.count
                                                            )
                                                        );

                                                    const percentage =
                                                        max > 0
                                                            ? (
                                                                service.count /
                                                                max
                                                            ) * 100
                                                            : 0;

                                                    return (

                                                        <Box
                                                            key={index}
                                                            sx={{
                                                                display:
                                                                    "flex",
                                                                alignItems:
                                                                    "center",
                                                                gap: 2
                                                            }}
                                                        >

                                                            <Box
                                                                sx={{
                                                                    width: 30,
                                                                    height: 30,
                                                                    borderRadius: 2,
                                                                    display:
                                                                        "flex",
                                                                    alignItems:
                                                                        "center",
                                                                    justifyContent:
                                                                        "center",
                                                                    bgcolor:
                                                                        `${theme.main}12`,
                                                                    color:
                                                                        theme.main,
                                                                    fontWeight:
                                                                        800,
                                                                    fontSize:
                                                                        ".8rem"
                                                                }}
                                                            >
                                                                {index + 1}
                                                            </Box>


                                                            <Box
                                                                sx={{
                                                                    flex: 1
                                                                }}
                                                            >

                                                                <Box
                                                                    sx={{
                                                                        display:
                                                                            "flex",
                                                                        justifyContent:
                                                                            "space-between",
                                                                        alignItems:
                                                                            "center"
                                                                    }}
                                                                >

                                                                    <Typography
                                                                        fontWeight={
                                                                            700
                                                                        }
                                                                        sx={{
                                                                            color:
                                                                                theme.text
                                                                        }}
                                                                    >
                                                                        {
                                                                            service.name
                                                                        }
                                                                    </Typography>

                                                                    <Typography
                                                                        variant="caption"
                                                                        fontWeight={
                                                                            700
                                                                        }
                                                                        sx={{
                                                                            color:
                                                                                theme.main
                                                                        }}
                                                                    >
                                                                        {
                                                                            service.count
                                                                        }
                                                                    </Typography>

                                                                </Box>


                                                                <LinearProgress
                                                                    variant="determinate"
                                                                    value={
                                                                        percentage
                                                                    }
                                                                    sx={{
                                                                        height: 4,
                                                                        borderRadius: 4,
                                                                        mt: 0.5,
                                                                        background:
                                                                            `${theme.main}12`,

                                                                        "& .MuiLinearProgress-bar":
                                                                        {
                                                                            borderRadius:
                                                                                4,
                                                                            background:
                                                                                theme.gradient ||
                                                                                theme.main
                                                                        }
                                                                    }}
                                                                />

                                                            </Box>

                                                        </Box>

                                                    );
                                                }
                                            )}

                                        </Stack>

                                    )}

                                </DashboardSection>

                            </Box>


                            {/* OVERVIEW */}

                            <Box
                                sx={{
                                    flex: "1 1 50%",
                                    minWidth: 0
                                }}
                            >

                                <DashboardSection
                                    theme={theme}
                                >

                                    <Typography
                                        variant="overline"
                                        sx={{
                                            fontWeight: 800,
                                            color:
                                                theme.text,
                                            letterSpacing: 1
                                        }}
                                    >
                                        VUE D'ENSEMBLE
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        sx={{
                                            mb: 1,
                                            color:
                                                theme.textLight
                                        }}
                                    >
                                        L'activité de votre
                                        établissement
                                    </Typography>


                                    <Box
                                        sx={{
                                            display: "flex",
                                            gap: 2,
                                            flexWrap: "wrap"
                                        }}
                                    >

                                        {/* DONUT */}

                                        <Box
                                            sx={{
                                                flex:
                                                    "1 1 45%",
                                                minWidth: 180
                                            }}
                                        >

                                            <Typography
                                                variant="caption"
                                                fontWeight={700}
                                                sx={{
                                                    color:
                                                        theme.textLight
                                                }}
                                            >
                                                Ventes par services
                                            </Typography>


                                            {serviceDonutData.length === 0 ? (

                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        py: 3,
                                                        textAlign:
                                                            "center",
                                                        color:
                                                            theme.textLight
                                                    }}
                                                >
                                                    Aucune donnée
                                                </Typography>

                                            ) : (

                                                <Box
                                                    sx={{
                                                        display:
                                                            "flex",
                                                        alignItems:
                                                            "center",
                                                        gap: 1.5,
                                                        mt: 1
                                                    }}
                                                >

                                                    <Box
                                                        sx={{
                                                            width: 120,
                                                            height: 120,
                                                            flexShrink: 0
                                                        }}
                                                    >

                                                        <ResponsiveContainer>

                                                            <PieChart>

                                                                <Pie
                                                                    data={
                                                                        serviceDonutData
                                                                    }
                                                                    dataKey="value"
                                                                    nameKey="name"
                                                                    innerRadius={
                                                                        34
                                                                    }
                                                                    outerRadius={
                                                                        55
                                                                    }
                                                                    paddingAngle={
                                                                        2
                                                                    }
                                                                >

                                                                    {serviceDonutData.map(
                                                                        (
                                                                            entry,
                                                                            index
                                                                        ) => (

                                                                            <Cell
                                                                                key={
                                                                                    index
                                                                                }
                                                                                fill={
                                                                                    entry.color
                                                                                }
                                                                            />

                                                                        )
                                                                    )}

                                                                </Pie>

                                                                <RechartsTooltip />

                                                            </PieChart>

                                                        </ResponsiveContainer>

                                                    </Box>


                                                    <Stack spacing={0.5}>

                                                        {serviceDonutData.map(
                                                            (
                                                                entry,
                                                                index
                                                            ) => (

                                                                <Box
                                                                    key={
                                                                        index
                                                                    }
                                                                    sx={{
                                                                        display:
                                                                            "flex",
                                                                        alignItems:
                                                                            "center",
                                                                        gap: 0.7
                                                                    }}
                                                                >

                                                                    <Box
                                                                        sx={{
                                                                            width: 8,
                                                                            height: 8,
                                                                            borderRadius:
                                                                                "50%",
                                                                            bgcolor:
                                                                                entry.color,
                                                                            flexShrink:
                                                                                0
                                                                        }}
                                                                    />

                                                                    <Typography
                                                                        variant="caption"
                                                                        noWrap
                                                                        sx={{
                                                                            maxWidth: 140,
                                                                            color:
                                                                                theme.text
                                                                        }}
                                                                    >
                                                                        {
                                                                            entry.name
                                                                        }
                                                                    </Typography>

                                                                </Box>

                                                            )
                                                        )}

                                                    </Stack>

                                                </Box>

                                            )}

                                        </Box>


                                        {/* ACTIVITY */}

                                        <Box
                                            sx={{
                                                flex:
                                                    "1 1 45%",
                                                minWidth: 180
                                            }}
                                        >

                                            <Typography
                                                variant="caption"
                                                fontWeight={700}
                                                sx={{
                                                    color:
                                                        theme.textLight
                                                }}
                                            >
                                                Activité récente
                                                (7 jours)
                                            </Typography>


                                            <Box
                                                sx={{
                                                    height: 140,
                                                    mt: 1
                                                }}
                                            >

                                                <ResponsiveContainer>

                                                    <LineChart
                                                        data={
                                                            weeklyActivity
                                                        }
                                                    >

                                                        <RechartsTooltip />

                                                        <Line
                                                            type="monotone"
                                                            dataKey="count"
                                                            stroke={
                                                                theme.main
                                                            }
                                                            strokeWidth={
                                                                2.5
                                                            }
                                                            dot={{
                                                                r: 3,
                                                                fill:
                                                                    theme.main
                                                            }}
                                                        />

                                                    </LineChart>

                                                </ResponsiveContainer>

                                            </Box>

                                        </Box>

                                    </Box>

                                </DashboardSection>

                            </Box>

                        </Box>

                    </>

                )}

            </Box>

        </Fade>
    );
}


/*
 * =============================================================
 * DASHBOARD SECTION
 * =============================================================
 */

function DashboardSection({ children, theme }) {

    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: 4,
                p: 2.5,

                border:
                    `1px solid ${theme.border}25`,

                background:
                    theme.card ||
                    "#FFFFFF",

                boxShadow:
                    `0 6px 24px ${theme.shadow}`,

                height: "100%",

                transition:
                    "all 0.25s ease",

                "&:hover": {
                    boxShadow:
                        `0 10px 32px ${theme.shadow}50`
                }
            }}
        >
            {children}
        </Paper>
    );
}


/*
 * =============================================================
 * STAT CARD
 * =============================================================
 */

function StatCard({
    icon,
    label,
    value,
    subtitle,
    theme
}) {

    return (
        <Paper
            elevation={0}
            sx={{
                p: 2,
                borderRadius: 3,

                border:
                    `1px solid ${theme.border}25`,

                background:
                    theme.card ||
                    "#FFFFFF",

                height: "100%",

                display: "flex",
                alignItems: "center",
                gap: 1.8,

                boxShadow:
                    `0 5px 20px ${theme.shadow}`,

                transition:
                    "all 0.25s ease",

                "&:hover": {
                    transform:
                        "translateY(-3px)",
                    boxShadow:
                        `0 10px 28px ${theme.shadow}50`
                }
            }}
        >

            <Box
                sx={{
                    width: 42,
                    height: 42,
                    flexShrink: 0,
                    borderRadius: 2.5,

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                    color: theme.main,

                    background:
                        `${theme.main}12`
                }}
            >
                {icon}
            </Box>


            <Box sx={{ minWidth: 0 }}>

                <Typography
                    sx={{
                        fontSize: "1.4rem",
                        fontWeight: 900,
                        lineHeight: 1.15,
                        color: theme.text
                    }}
                >
                    {value}
                </Typography>

                <Typography
                    variant="caption"
                    sx={{
                        color: theme.textLight,
                        fontWeight: 650,
                        display: "block"
                    }}
                    noWrap
                >
                    {label}
                </Typography>

                <Typography
                    variant="caption"
                    sx={{
                        color:
                            theme.textLight,
                        opacity: 0.65
                    }}
                    noWrap
                >
                    {subtitle}
                </Typography>

            </Box>

        </Paper>
    );
}


/*
 * =============================================================
 * APPOINTMENT ROW
 * =============================================================
 */

function AppointmentRow({
    appointment,
    index,
    onSeeAll,
    theme
}) {

    return (
        <Fade
            in
            timeout={300}
            style={{
                transitionDelay:
                    `${index * 45}ms`
            }}
        >

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    py: 1,

                    borderBottom:
                        `1px solid ${theme.border}15`
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

                        bgcolor:
                            `${theme.main}12`,

                        color:
                            theme.main
                    }}
                >
                    <EventNote
                        sx={{
                            fontSize: 18
                        }}
                    />
                </Box>


                <Box
                    sx={{
                        flex: 1,
                        minWidth: 0
                    }}
                >

                    <Typography
                        fontWeight={700}
                        noWrap
                        sx={{
                            color: theme.text,
                            fontSize: ".9rem"
                        }}
                    >
                        {
                            appointment.serviceName ||
                            appointment.clientName ||
                            "Rendez-vous"
                        }
                    </Typography>

                    <Typography
                        variant="caption"
                        noWrap
                        sx={{
                            color:
                                theme.textLight
                        }}
                    >
                        {
                            appointment.clientName ||
                            "Client inconnu"
                        }
                    </Typography>

                </Box>


                <Button
                    size="small"
                    onClick={onSeeAll}
                    sx={{
                        textTransform: "none",
                        color: theme.main,
                        fontWeight: 700,
                        fontSize: ".75rem",

                        "&:hover": {
                            backgroundColor:
                                `${theme.main}08`
                        }
                    }}
                >
                    Voir tout
                </Button>

            </Box>

        </Fade>
    );
}


/*
 * =============================================================
 * ACTION BUTTON
 * =============================================================
 */

function ActionButton({
    icon,
    label,
    onClick,
    theme
}) {

    return (
        <Button
            fullWidth
            onClick={onClick}
            sx={{
                flexDirection: "column",
                gap: 0.6,
                py: 1.5,
                minHeight: 82,

                borderRadius: 2.5,
                textTransform: "none",

                border:
                    `1px solid ${theme.border}25`,

                color: theme.text,

                background:
                    `linear-gradient(
                        145deg,
                        ${theme.lighter} 0%,
                        ${theme.bg} 100%
                    )`,

                transition:
                    "all 0.25s ease",

                "&:hover": {
                    color: theme.main,

                    background:
                        `${theme.main}10`,

                    borderColor:
                        `${theme.main}35`,

                    transform:
                        "translateY(-2px)"
                }
            }}
        >

            <Box
                sx={{
                    color: theme.main,

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                    width: 34,
                    height: 34,
                    borderRadius: 2,

                    background:
                        `${theme.main}12`
                }}
            >
                {icon}
            </Box>


            <Typography
                fontWeight={700}
                fontSize=".75rem"
                textAlign="center"
                sx={{
                    color: "inherit"
                }}
            >
                {label}
            </Typography>

        </Button>
    );
}


/*
 * =============================================================
 * HELPERS
 * =============================================================
 */

function normalizeArray(data) {

    if (Array.isArray(data)) {
        return data;
    }

    if (
        data &&
        Array.isArray(data.content)
    ) {
        return data.content;
    }

    if (
        data &&
        Array.isArray(data.data)
    ) {
        return data.data;
    }

    return [];
}


function normalizeDate(value) {

    if (!value) {
        return "";
    }

    if (
        typeof value === "string" &&
        value.length >= 10
    ) {
        return value.substring(0, 10);
    }

    if (value instanceof Date) {
        return formatDateLocal(value);
    }

    return String(value);
}


function formatDateLocal(date) {

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function formatMoney(value) {

    return `${Number(
        value || 0
    ).toLocaleString(
        "fr-FR",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    )} MAD`;
}
