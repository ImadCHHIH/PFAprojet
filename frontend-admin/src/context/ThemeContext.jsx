import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState
} from "react";

import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import axios from "axios";

import getTheme from "../theme";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {

    const [mode, setMode] = useState("light");

    useEffect(() => {

        loadTheme();

    }, []);

    async function loadTheme() {

        try {

            const token = localStorage.getItem("token");

            if (!token) return;

            const response = await axios.get(
                "http://localhost:8080/api/settings/theme",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMode(response.data.theme.toLowerCase());

        } catch (error) {

            console.error("Failed to load theme", error);

        }

    }

    async function changeTheme(newMode) {

        try {

            const token = localStorage.getItem("token");

            await axios.put(
                "http://localhost:8080/api/settings/theme",
                {
                    theme: newMode.toUpperCase()
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMode(newMode);

        } catch (error) {

            console.error("Failed to update theme", error);

        }

    }

    const muiTheme = useMemo(() => getTheme(mode), [mode]);

    return (

        <ThemeContext.Provider
            value={{
                mode,
                changeTheme
            }}
        >

            <MuiThemeProvider theme={muiTheme}>

                <CssBaseline />

                {children}

            </MuiThemeProvider>

        </ThemeContext.Provider>

    );

}

export function useThemeContext() {

    return useContext(ThemeContext);

}