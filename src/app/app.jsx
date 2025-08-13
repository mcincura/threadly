import {
    BrowserRouter as Router,
    Route,
    Routes
} from 'react-router-dom';
import { UserProvider } from './context/userContext';
import Landing from '../pages/landing/landing';
import Dashboard from '../pages/dashboard/dashboard';
import Login from '../components/login/login';

const App = () => {
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