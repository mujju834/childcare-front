import AdminDashboard from "./Full-Front/AdminDashboard/AdminDashboard";
import ChildEnrollmentForm from "./Full-Front/ChildEnrollmentForm/ChildEnrollmentForm";
import FacilityCreationForm from "./Full-Front/ChildEnrollmentForm/FacilityCreationForm";
import TeacherHiringForm from "./Full-Front/ChildEnrollmentForm/TeacherHiringForm";
import FacilityAdminDashboard from "./Full-Front/FacilityAdminDashboard/FacilityAdmin";
import LoginPage from "./Full-Front/Login&Register/LoginPage";
import RegisterPage from "./Full-Front/Login&Register/RegisterPage";
import NotificationComponent from "./Full-Front/NotificationComponent/NotificationComponent";
import ParentDashboard from "./Full-Front/ParentDashboard/ParentDashboard";
import ProfileModal from "./Full-Front/ProfileModal/ProfileModal";
import ReportingSection from "./Full-Front/ReportingSection/ReportingSection";
import TeacherDashboard from "./Full-Front/TeacherDashboard/TeacherDashboard";
import Landingpage from "./Full-Front/LandingPage/Landingpage";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ForgotPassword from "./Full-Front/Login&Register/Forgotpassword";
import AddStaffForm from "./Full-Front/ParentDashboard/AddStaffForm";
import { StaffProvider } from "./contexts/StaffContext";
import { UserProvider } from './contexts/UserContext';


function App() {
  return (
    <UserProvider>
    <StaffProvider>
    <Router>
    <div >
    {/* <Landingpage/> */}
    {/* <LoginPage/> */}
    {/* <RegisterPage/> */}

    {/* <FacilityAdminDashboard/> */}
    {/* <TeacherDashboard/> */}
    {/* <ParentDashboard/> */}

    {/* work on this code not working */}
    {/* <ProfileModal/>   */}

    {/* child enrollment form */}
    {/* <ChildEnrollmentForm/>
    <FacilityCreationForm/>
    <TeacherHiringForm/> */}
    {/* this all are forms */}

{/* this is reporting section */}
{/* <ReportingSection/> */}

{/* this is notification component this is also not working */}
{/* <NotificationComponent/> */}


{/* sample for routes */}
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
