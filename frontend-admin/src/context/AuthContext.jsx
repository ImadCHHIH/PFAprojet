import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import { getMyProfile } from "../services/profileService";

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadUser();

    }, []);

    const loadUser = async () => {

        try {

            const token = localStorage.getItem("token");

            if (!token) {

                setLoading(false);

                return;

            }

            const response = await getMyProfile();

            setUser(response.data);

        }

        catch (error) {

            console.error(error);

            localStorage.removeItem("token");

            setUser(null);

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <AuthContext.Provider
            value={{
                user,
                setUser,
                loadUser
            }}
        >

            {!loading && children}

        </AuthContext.Provider>

    );

}

export function useAuth() {

    return useContext(AuthContext);

}