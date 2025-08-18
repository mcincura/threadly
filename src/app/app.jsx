import {
    BrowserRouter as Router,
    Route,
    Routes,
    useLocation
} from 'react-router-dom';
import { useEffect, useContext } from 'react';
import { UserProvider, UserContext } from './context/userContext';
import Landing from '../pages/landing/landing';
import Dashboard from '../pages/dashboard/dashboard';
import Login from '../components/login/login';

const AppContent = () => {
    const { user } = useContext(UserContext);

    useEffect(() => {
        // Helper to get cookie by name
        function getCookie(name) {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
        }

        const params = new URLSearchParams(window.location.search);
        const ref = params.get('ref');
        //log the ref from the link in the console
        console.log('Affiliate ref from URL:', ref);
        const refCookie = getCookie('ref');
        const tokenCookie = getCookie('token');

        // Only set ref cookie if:
        // - ref param exists
        // - user is not logged in (no user)
        // - no ref cookie exists
        // - no token cookie exists
        if (ref && !user && !refCookie && !tokenCookie) {
            // Set cookie for 7 days
            const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
            document.cookie = `ref=${ref}; expires=${expires}; path=/`;
            console.log('Affiliate ref cookie set:', ref);
        }
    }, [user]); // Re-run if user changes

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </Router>
    );
};

const App = () => (
    <div className="App">
        <UserProvider>
            <AppContent />
        </UserProvider>
    </div>
);

export default App;