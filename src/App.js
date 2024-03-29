import AdminDashboard from "./Full-Front/AdminDashboard/AdminDashboard";
import FacilityAdminDashboard from "./Full-Front/FacilityAdminDashboard/FacilityAdmin";
import LoginPage from "./Full-Front/Login&Register/LoginPage";
import RegisterPage from "./Full-Front/Login&Register/RegisterPage";
import ParentDashboard from "./Full-Front/ParentDashboard/ParentDashboard";
import TeacherDashboard from "./Full-Front/TeacherDashboard/TeacherDashboard";
import Landingpage from "./Full-Front/LandingPage/Landingpage";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ForgotPassword from "./Full-Front/Login&Register/Forgotpassword";
import { StaffProvider } from "./contexts/StaffContext";
import { UserProvider } from './contexts/UserContext';


function App() {
  return (
    <UserProvider>
    <StaffProvider>
    <Router>
    <div >
   
<Routes>

<Route path="/" element={<Landingpage />} />
<Route path="/register" element={<RegisterPage />} />
<Route path="/login" element={<LoginPage />} />
<Route path="/admindashboard" element={<AdminDashboard />} />
<Route path="/teacherdashboard" element={<TeacherDashboard />} />
<Route path="/parentdashboard" element={<ParentDashboard />} />
<Route path="/forgotpassword" element={<ForgotPassword />} />
{/* facility admin */}
<Route path="/facilityadmindashboard" element={<FacilityAdminDashboard />} />


{/* <Route path="/addstaffform" element={<AddStaffForm />} /> */}



 </Routes>
  
    </div>
    </Router>
    </StaffProvider>
    </UserProvider>
  );
}

export default App;
