import {
    BrowserRouter as Router,
    Route,
    Routes
} from 'react-router-dom';
import Landing from '../pages/landing/landing';
import Dashboard from '../pages/dashboard/dashboard';
import Login from '../pages/login/login';

const App = () => {
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/dash" element={<Dashboard />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </Router>
        </div>
    );
};

export default App;