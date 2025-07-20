import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import Landing from '../pages/landing/landing';
import Dash from '../pages/dashboard/dashboard';
import Payment from '../components/payment/payment';

const App = () => {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/test" element={<Payment />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
