import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Login from './Component/Login'
import { AdminHome } from './Component/AdminHome';
import { UserHome } from './Component/UserHome';
function App() {
  return (
    <>
 <Router>
  <Routes>
    <Route path='/' element={<Login />}/>
    <Route path='/userhome' element={<UserHome />}/>
    <Route path='/adminhome' element={<AdminHome />} />

  </Routes>
 </Router>

    </>
  );
}

export default App;
