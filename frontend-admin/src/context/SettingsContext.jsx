import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import axios from "axios";

const SettingsContext = createContext();

export function SettingsProvider({ children }) {

    const [dateFormat, setDateFormat] = useState(
        "DD/MM/YYYY"
    );

    const [numberFormat, setNumberFormat] = useState(
        "1 234,56"
    );

    const [currency, setCurrency] = useState(
        "MAD"
    );

    useEffect(() => {

        loadSettings();

    }, []);

    async function loadSettings() {

        try {

            const token = localStorage.getItem("token");

            if (!token) return;

            const response = await axios.get(
                "http://localhost:8080/api/settings",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const settings = response.data;

            if (settings.dateFormat) {
                setDateFormat(settings.dateFormat);
            }

            if (settings.numberFormat) {
                setNumberFormat(settings.numberFormat);
            }

            if (settings.currency) {
                setCurrency(settings.currency);
            }

        } catch (error) {

            console.error(
                "Failed to load settings",
                error
            );

        }

    }

    async function changeDateFormat(newFormat) {

        try {

            const token = localStorage.getItem("token");

            await axios.put(
                "http://localhost:8080/api/settings/date-format",
                {
                    dateFormat: newFormat
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setDateFormat(newFormat);

        } catch (error) {

            console.error(
                "Failed to update date format",
                error
            );

        }

    }

    async function changeNumberFormat(newFormat) {

        try {

            const token = localStorage.getItem("token");

            await axios.put(
                "http://localhost:8080/api/settings/number-format",
                {
                    numberFormat: newFormat
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setNumberFormat(newFormat);

        } catch (error) {

            console.error(
                "Failed to update number format",
                error
            );

        }

    }

    async function changeCurrency(newCurrency) {

        try {

            const token = localStorage.getItem("token");

            await axios.put(
                "http://localhost:8080/api/settings/currency",
                {
                    currency: newCurrency
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setCurrency(newCurrency);

        } catch (error) {

            console.error(
                "Failed to update currency",
                error
            );

        }

    }

    return (

        <SettingsContext.Provider
            value={{
                dateFormat,
                numberFormat,
                currency,
                changeDateFormat,
                changeNumberFormat,
                changeCurrency
            }}
        >

            {children}

        </SettingsContext.Provider>

    );

}

export function useSettingsContext() {

    return useContext(SettingsContext);

}
