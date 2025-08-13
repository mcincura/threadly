import {
    BrowserRouter as Router,
    Route,
    Routes,
    useLocation
} from 'react-router-dom';
import { useEffect } from 'react';
import { UserProvider } from './context/userContext';
import Landing from '../pages/landing/landing';
import Dashboard from '../pages/dashboard/dashboard';
import Login from '../components/login/login';

const App = () => {

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const ref = params.get('ref');
        if (ref) {
            console.log('Affiliate ref:', ref);
            // Optionally store in localStorage or context here
        }
    }, []); // Empty dependency array: runs only once on mount

    return (
        <div className="App">
            <UserProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<Landing />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/login" element={<Login />} />
                    </Routes>
                </Router>
            </UserProvider>
        </div>
    );
};

export default App;