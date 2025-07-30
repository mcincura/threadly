import {
    BrowserRouter as Router,
    Route,
    Routes
} from 'react-router-dom';
import Landing from '../pages/landing/landing';
import Section2 from '../components/section2/section2';

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