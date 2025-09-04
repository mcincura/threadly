import {
    BrowserRouter as Router,
    Route,
    Routes,
    useLocation
} from 'react-router-dom';
import { useEffect, useContext } from 'react';
import axios from 'axios';
import { UserProvider, UserContext } from './context/userContext';
import Landing from '../pages/landing/landing';
import Dashboard from '../pages/dashboard/dashboard';
import Login from '../components/login/login';
import Checkout from '../pages/checkout/checkout';

const AppContent = () => {
    const { user } = useContext(UserContext);

    useEffect(() => {
        function getCookie(name) {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
        }

        const params = new URLSearchParams(window.location.search);
        const ref = params.get('ref');
        const refCookie = getCookie('ref');
        const tokenCookie = getCookie('token');

        // Only set ref cookie and send event if:
        // - ref param exists
        // - user is not logged in (no user)
        // - no ref cookie exists
        // - no token cookie exists
        if (ref && !user && !refCookie && !tokenCookie) {
            // Set cookie for 7 days
            const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
            document.cookie = `ref=${ref}; expires=${expires}; path=/`;
            console.log('Affiliate ref cookie set:', ref);

            // After cookie is set, send event to backend using axios
            axios.post('http://localhost:3001/event/click', { ref_link: ref })
                .then(res => {
                    console.log('Affiliate click event sent:', res.data);
                })
                .catch(err => {
                    console.error('Failed to send affiliate click event:', err);
                });
        }
    }, [user]);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path='/checkout' element={<Checkout />} />
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