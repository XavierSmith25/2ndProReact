import React, { useEffect } from 'react';
import Index from './pages/Index/Index';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import useAuthStore from '../src/store/useAuthStore';
import RouteFilter from './Components/filters/RouteFilter';


const App = () => {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, []);

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path='/' element={<Index />}></Route>
          
          <Route element={<RouteFilter/>}>
            {/* <Route path='/mainpage' element={<Mainpage/>}></Route> */}
    


          </Route>
        </Routes>
      </div>
    </Router>
    // <Routes>

    //     <Route path="/" element={<Index />}></Route>
    //     {/* <Route path="/mainpage" element={<Mainpage />}></Route> */}
    //   </div>
    // </Routes>
  );
};

export default App;