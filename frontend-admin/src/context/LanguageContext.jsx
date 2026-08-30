import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import axios from "axios";
import { useTranslation } from "react-i18next";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {

    const { i18n } = useTranslation();

    const [language, setLanguage] = useState("en");

    useEffect(() => {

        loadLanguage();

    }, []);

    async function loadLanguage() {

        try {

            const token = localStorage.getItem("token");

            if (!token) return;

            const response = await axios.get(

                "http://localhost:8080/api/settings/language",

                {

                    headers: {

                        Authorization: `Bearer ${token}`

                    }

                }

            );

            const lang =
                response.data.language === "FRENCH"
                    ? "fr"
                    : "en";

            setLanguage(lang);

            i18n.changeLanguage(lang);

        } catch (error) {

            console.error(error);

        }

    }

    async function changeLanguage(lang) {

        try {

            const token = localStorage.getItem("token");

            await axios.put(

                "http://localhost:8080/api/settings/language",

                {

                    language:
                        lang === "fr"
                            ? "FRENCH"
                            : "ENGLISH"

                },

                {

                    headers: {

                        Authorization: `Bearer ${token}`

                    }

                }

            );

            setLanguage(lang);

            i18n.changeLanguage(lang);

        } catch (error) {

            console.error(error);

        }

    }

    return (

        <LanguageContext.Provider
            value={{
                language,
                changeLanguage
            }}
        >

            {children}

        </LanguageContext.Provider>

    );

}

export function useLanguageContext() {

    return useContext(LanguageContext);

}