import { useNavigate } from "react-router-dom";
import CreateIssueReportForm from "../actions/CreateIssueReportForm";
import GetStudentIssueReports from "../actions/GetStudentIssueReports";
import CreateNote from "../actions/CreateNote";
import GetUserNotes from "../actions/GetUserNotes";
const StudentDashBoard: React.FC = () => {
    const navigate = useNavigate();
  
    const handleLogout = () => {
      localStorage.removeItem("token");
      navigate("/login");
    };
   return (<div>
      <h2>Dashboard</h2>
      <button onClick={handleLogout}>Kijelentkezés</button>

       <p>IssueReports</p>
       <CreateIssueReportForm />
       <GetStudentIssueReports />

      <p>Note</p>
      
       <CreateNote />
       <GetUserNotes />
      
     
      
    
     
    </div>);
};

export default StudentDashBoard;