import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import axios from "axios";

const AuthContext = createContext(null);

const API_URL = "http://localhost:8080";

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {

        async function restoreSession() {

            const token =
                localStorage.getItem("salonToken");

            const savedUser =
                localStorage.getItem("salonUser");


            if (!token || !savedUser) {

                setLoading(false);

                return;
            }


            try {

                const parsedUser =
                    JSON.parse(savedUser);

                setUser(parsedUser);

                await loadUserCompanies(token);


            } catch (error) {

                console.error(
                    "Failed to restore session:",
                    error
                );

                localStorage.removeItem(
                    "salonToken"
                );

                localStorage.removeItem(
                    "salonUser"
                );

                setUser(null);
                setCompanies([]);


            } finally {

                setLoading(false);

            }

        }


        restoreSession();

    }, []);


    async function loadUserCompanies(token) {

        try {

            const response =
                await axios.get(
                    `${API_URL}/companies/my-companies`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );


            setCompanies(
                response.data
            );


            return response.data;


        } catch (error) {

            console.error(
                "Failed to load companies:",
                error
            );

            console.error(
                "STATUS:",
                error.response?.status
            );

            console.error(
                "RESPONSE:",
                error.response?.data
            );


            setCompanies([]);


            return [];

        }

    }


    async function login(
        email,
        password
    ) {

        const response =
            await axios.post(
                `${API_URL}/auth/salon/login`,
                {
                    email,
                    password
                }
            );


        const data =
            response.data;


        if (
            data.user?.role !==
            "SALON_ADMIN"
        ) {

            throw new Error(
                "This account is not a salon administrator."
            );

        }


        localStorage.setItem(
            "salonToken",
            data.token
        );


        localStorage.setItem(
            "salonUser",
            JSON.stringify(
                data.user
            )
        );


        setUser(
            data.user
        );


        await loadUserCompanies(
            data.token
        );


        return data;

    }


    /*
     * Update the current user everywhere.
     * This is used by ProfilePage after
     * changing the profile picture.
     */

    function updateUser(updatedUser) {

        setUser(
            updatedUser
        );


        localStorage.setItem(
            "salonUser",
            JSON.stringify(
                updatedUser
            )
        );

    }


    function logout() {

        localStorage.removeItem(
            "salonToken"
        );

        localStorage.removeItem(
            "salonUser"
        );


        setUser(null);
        setCompanies([]);

    }


    return (

        <AuthContext.Provider
            value={{
                user,
                companies,
                loading,
                login,
                logout,
                loadUserCompanies,
                updateUser
            }}
        >

            {children}

        </AuthContext.Provider>

    );

}


export function useAuth() {

    return useContext(
        AuthContext
    );

}
