import {
    BrowserRouter as Router,
    Route,
    Routes
} from 'react-router-dom';
import Landing from '../pages/landing/landing';
import { SidebarDemo } from '../pages/dashboard/dashboard';

const App = () => {
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/dashboard" element={<SidebarDemo />} />
                </Routes>
            </Router>
        </div>
    );
};

export default App;