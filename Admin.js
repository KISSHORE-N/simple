import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../main_page/CommonStyles.css';

// --- Static User Info for the Header ---
const adminUser = {
    name: 'Admin User',
    email: 'admin@sc.com',
};

// --- Icon Components (Locally defined) ---
const LogOutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
);
const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
);
const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);
const UndoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
);
const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
);


// --- Mock Data Generation ---
const generateRequests = () => {
    const users = ['Alice', 'Bob', 'Charlie', 'Dana', 'Eve'];
    const groups = ['Finance_Reports', 'Ops_Reports', 'HR_Metrics', 'Compliance_Data'];
    const folders = ['Client_Data_A', 'Regulatory_Audit', 'Internal_Finance'];
    const reports = ['Q3-Report-2024', 'Daily-P&L-Summary', 'Audit-Log-2024'];

    const requests = [];

    for (let i = 1; i <= 15; i++) {
        requests.push({
            id: i,
            userName: users[i % 5],
            adGroup: groups[i % 4],
            folder: folders[i % 3],
            reportName: reports[i % 3],
            dateRequested: `2024-05-${String(i).padStart(2, '0')}`,
            status: i < 5 ? 'Pending' : (i < 10 ? 'Approved' : 'Denied'),
        });
    }
    return requests;
};


function AdminPage() {
    const navigate = useNavigate();
    const initialRequests = useMemo(generateRequests, []);
    const [requests, setRequests] = useState(initialRequests);
    const [searchTerm, setSearchTerm] = useState(''); // State for search

    // --- Filtering Logic ---
    const filteredRequests = requests.filter(req => 
        req.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.adGroup.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.reportName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const pendingRequests = filteredRequests.filter(r => r.status === 'Pending');
    const approvedRequests = filteredRequests.filter(r => r.status === 'Approved');

    const handleAction = (id, action) => {
        setRequests(prev => prev.map(req => {
            if (req.id === id) {
                const newStatus = action === 'approve' ? 'Approved' : (action === 'deny' ? 'Denied' : 'Pending');
                console.log(`Request ${id} status changed to ${newStatus}.`);
                return { ...req, status: newStatus };
            }
            return req;
        }));
    };

    const handleLogout = () => {
        console.log("Admin Logged out.");
        navigate('/');
    };

    return (
        <div className="app-container">
            {/* --- NAVBAR / HEADER --- */}
            <header className="main-header" style={{ justifyContent: 'space-between' }}>
                
                <div className="header-left-content">
                    <div className="logo-section" onClick={() => navigate('/')}>
                        <img src="/path/to/standard-chartered-logo.svg" alt="Standard Chartered Logo" className="sc-logo" />
                    </div>
                    <div className="user-profile">
                        <h1 className="user-name">Admin Approval</h1>
                        <p className="user-email">{adminUser.email}</p>
                    </div>
                </div>
                
                <div className="header-actions">
                    <button 
                        className="action-button logout-button"
                        onClick={handleLogout}
                        title="Logout Admin"
                    >
                        <LogOutIcon />
                        Logout
                    </button>
                </div>
            </header>
            
            {/* --- MAIN DASHBOARD CONTENT AREA --- */}
            <div className="dashboard-content admin-page-container">
                
                <h1 className="report-title">Subscription Request Management</h1>

                {/* --- Search Bar --- */}
                <div className="search-bar-container">
                    <div className="search-input-group">
                        <SearchIcon />
                        <input 
                            type="text"
                            placeholder="Search by User, Group, or Report Name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="sc-search-input"
                        />
                    </div>
                </div>

                {/* --- PENDING REQUESTS TABLE --- */}
                <div className="reports-area admin-table-card pending-requests-area">
                    <h2 className="table-subtitle">Pending Requests ({pendingRequests.length} pending)</h2>
                    
                    <div className="table-responsive">
                        <table className="data-table admin-request-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '15%' }}>User Name</th>
                                    <th style={{ width: '15%' }}>AD Group</th>
                                    <th style={{ width: '15%' }}>Folder</th>
                                    <th style={{ width: '25%' }}>Report Name</th>
                                    <th style={{ width: '10%' }}>Date</th>
                                    <th style={{ width: '20%' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingRequests.length > 0 ? (
                                    pendingRequests.map((req) => (
                                        <tr key={req.id} className="status-row">
                                            <td>{req.userName}</td>
                                            <td>{req.adGroup}</td>
                                            <td><span className="destination-tag">{req.folder}</span></td>
                                            <td><p className="report-description">{req.reportName}</p></td>
                                            <td>{req.dateRequested}</td>
                                            {/* FIX: Apply INLINE STYLES for horizontal display */}
                                            <td className="admin-action-group" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                <button 
                                                    className="action-button admin-approve-button"
                                                    onClick={() => handleAction(req.id, 'approve')}
                                                    style={{backgroundColor:'green',color:'white'}}
                                                >
                                                    <CheckIcon /> Approve
                                                </button>
                                                <button 
                                                    className="action-button admin-deny-button"
                                                    onClick={() => handleAction(req.id, 'deny')}
                                                    style={{backgroundColor:"red",color:'white'}}
                                                >
                                                    <XIcon /> Deny
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="no-reports">No pending requests require action.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                {/* --- APPROVED REQUESTS TABLE (With Revoke Option) --- */}
                <div className="reports-area admin-table-card approved-requests-area">
                    <h2 className="table-subtitle">Approved Subscriptions ({approvedRequests.length} active)</h2>
                    
                    <div className="table-responsive">
                        <table className="data-table admin-request-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '15%' }}>User Name</th>
                                    <th style={{ width: '15%' }}>AD Group</th>
                                    <th style={{ width: '15%' }}>Folder</th>
                                    <th style={{ width: '25%' }}>Report Name</th>
                                    <th style={{ width: '10%' }}>Date</th>
                                    <th style={{ width: '20%' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {approvedRequests.length > 0 ? (
                                    approvedRequests.map((req) => (
                                        <tr key={req.id} className="status-row">
                                            <td>{req.userName}</td>
                                            <td>{req.adGroup}</td>
                                            <td><span className="destination-tag">{req.folder}</span></td>
                                            <td><p className="report-description">{req.reportName}</p></td>
                                            <td>{req.dateRequested}</td>
                                            <td className="admin-action-group">
                                                <button 
                                                    className="action-button admin-revoke-button"
                                                    onClick={() => handleAction(req.id, 'deny')}
                                                    style={{backgroundColor:"#0072CE",color:"white"}}
                                                >
                                                    <UndoIcon /> Revoke
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="no-reports">No currently approved subscriptions.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminPage;
