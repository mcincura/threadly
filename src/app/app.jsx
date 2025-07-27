import {
    BrowserRouter as Router,
    Route,
    Routes
} from 'react-router-dom';
import Landing from '../pages/landing/landing';

const App = () => {
    return (
        <div className="App">
            <Router basename='threadly'>
                <Routes>
                    <Route path="/" element={<Landing />} />
                </Routes>
            </Router>
        </div>
    );
};

export default App;