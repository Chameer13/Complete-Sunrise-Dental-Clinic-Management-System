import {
    createContext,
    useContext,
    useState
} from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

    const [user, setUser] = useState(() => {

        try {

            const savedUser =
                localStorage.getItem(
                    "sunrise_user"
                );

            if (!savedUser) {
                return null;
            }

            return JSON.parse(savedUser);

        } catch (error) {

            console.error(
                "Unable to load saved user:",
                error
            );

            localStorage.removeItem(
                "sunrise_user"
            );

            localStorage.removeItem(
                "sunrise_token"
            );

            return null;
        }
    });


    const login = (response) => {

        if (!response?.token) {
            throw new Error(
                "Login response does not contain a token."
            );
        }

        localStorage.setItem(
            "sunrise_token",
            response.token
        );

        localStorage.setItem(
            "sunrise_user",
            JSON.stringify(response)
        );

        setUser(response);
    };


    const logout = () => {

        localStorage.removeItem(
            "sunrise_token"
        );

        localStorage.removeItem(
            "sunrise_user"
        );

        setUser(null);
    };


    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}


export function useAuth() {

    return useContext(AuthContext);
}