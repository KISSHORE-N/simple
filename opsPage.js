import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../main_page/CommonStyles.css';

// --- Static User Info for the Header ---
const opsUser = {
    name: 'Welcome Ops',
    email: 'admin@standardchartered.com',
};

// --- Icon Components (Locally defined for this file) ---
const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
);

const TransferIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><line x1="3" y1="5" x2="21" y2="5"/><polyline points="17 15 21 19 17 23"/><line x1="3" y1="19" x2="21" y2="19"/></svg>
);

const CompleteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
);

const NotificationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);

const AddIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
);

const LogOutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
);


// --- Mock Data Generation (Remains the same) ---
const destinations = ['Client_Folder_A', 'Client_Folder_B', 'Compliance_Review', 'Archive_Backup'];
const typeOptions = ['Quarterly', 'Daily', 'Audit', 'Summary'];

const generateRemoteFiles = (count) => {
    const files = [];
    for (let i = 1; i <= count; i++) {
        files.push({
            id: `FILE-${1000 + i}`,
            fileName: `Report_${typeOptions[i % 4]}_${i}.pdf`,
            destinationFolder: destinations[i % 4],
            status: 'Ready to Transfer', 
            isTransferred: false,
        });
    }
    return files;
};

// Static Data for New File Notifications (FIXED TO PDF EXTENSION)
const newFileNotifications = [
    { id: 'NEW-1', fileName: 'Q4_Financial_Summary.pdf', destinationFolder: destinations[0] },
    { id: 'NEW-2', fileName: 'Daily_Risk_Log_T+1.pdf', destinationFolder: destinations[1] }, 
    { id: 'NEW-3', fileName: 'Compliance_Check_Oct.pdf', destinationFolder: destinations[2] }, 
];

function OpsPage() {
    const navigate = useNavigate();
    const initialFiles = useMemo(() => generateRemoteFiles(50), []);
    const [files, setFiles] = useState(initialFiles);
    const [searchTerm, setSearchTerm] = useState('');
    
    const [notifications, setNotifications] = useState(newFileNotifications);
    const [showNotifications, setShowNotifications] = useState(false);

    const toggleNotifications = () => {
        setShowNotifications(prev => !prev);
    };

    const handleLogout = () => {
        console.log("Operator Logged out.");
        navigate('/');
    };

    const handleTransfer = (fileId) => {
        setFiles(prevFiles => prevFiles.map(file => {
            if (file.id === fileId && file.status !== 'Transferred' && file.status !== 'Processing') {
                
                const processingFile = { ...file, status: 'Processing' };

                setTimeout(() => {
                    setFiles(currentFiles => currentFiles.map(currentFile => 
                        currentFile.id === fileId ? { ...currentFile, status: 'Transferred', isTransferred: true } : currentFile
                    ));
                }, 1000);

                return processingFile;
            }
            return file;
        }));
    };
    
    const handleGetFile = (notification) => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id));

        const newFileEntry = {
            id: notification.id,
            fileName: notification.fileName,
            destinationFolder: notification.destinationFolder,
            status: 'Ready to Transfer',
            isTransferred: false,
        };
        setFiles(prev => [newFileEntry, ...prev]);
    };

    const filteredFiles = files.filter(file => 
        file.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="app-container">

            {/* --- NAVBAR / HEADER (Implemented locally as requested) --- */}
            <header className="main-header" style={{ justifyContent: 'space-between' }}>
                
                {/* --- LEFT SIDE: Logo and Profile (Group 1) --- */}
                <div className="header-left-content">
                    <div className="logo-section" onClick={() => navigate('/')}>
                        <img src="/path/to/standard-chartered-logo.svg" alt="Standard Chartered Logo" className="sc-logo" />
                    </div>
                    <div className="user-profile">
                        <h1 className="user-name">{opsUser.name}</h1>
                        <p className="user-email">{opsUser.email}</p>
                    </div>
                </div>
                
                {/* --- RIGHT SIDE: Notification Toggle & Logout (Group 2) --- */}
                <div className="header-actions"> {/* Standardized class usage */}
                    {/* Notification Toggle */}
                    <button 
                        className={`notification-toggle-button ${showNotifications ? 'active' : ''}`}
                        onClick={toggleNotifications}
                        title={showNotifications ? "Hide Notifications" : "Show Notifications"}
                    >
                        {showNotifications ? <CloseIcon /> : <NotificationIcon />}
                        {notifications.length > 0 && (
                            <span className="notification-badge">{notifications.length}</span>
                        )}
                    </button>

                    {/* Logout Button (Styled with secondary SC Blue color) */}
                    <button 
                        className="action-button logout-button"
                        onClick={handleLogout}
                        title="Logout Operator"
                    >
                        <LogOutIcon />
                        Logout
                    </button>
                </div>
            </header>
            
            {/* --- MAIN DASHBOARD CONTENT AREA --- */}
            <div className="dashboard-content ops-page-container">

                <h1 className="main-page-title report-title">Remote File Transfer Operations</h1>

                {/* --- Content Grid (Standard 1fr) --- */}
                <div 
                    className="ops-main-grid"
                    style={{ gridTemplateColumns: showNotifications ? '3fr 1fr' : '1fr' }}
                >
                    
                    {/* --- MAIN CONTENT: Search and Table (Takes 100% width) --- */}
                    <div className="ops-main-content">
                        
                        {/* Search Bar */}
                        <div className="search-bar-container">
                            <div className="search-input-group">
                                <SearchIcon /> 
                                <input 
                                    type="text"
                                    placeholder="Search File ID or Name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="sc-search-input"
                                />
                            </div>
                        </div>

                        {/* Transfer Table */}
                        <div className="reports-area transfer-table-card">
                            <h2 className="table-subtitle">Files Ready for Action ({filteredFiles.length} found)</h2>
                            
                            <div className="table-responsive">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th style={{ width: '15%' }}>File ID</th>
                                            <th style={{ width: '35%' }}>File Name</th>
                                            <th style={{ width: '25%' }}>Destination Folder</th>
                                            <th style={{ width: '15%' }}>Status</th>
                                            <th style={{ width: '10%' }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredFiles.length > 0 ? (
                                            filteredFiles.map((file) => (
                                                <tr key={file.id}>
                                                    <td>{file.id}</td>
                                                    <td><p className="report-description">{file.fileName}</p></td>
                                                    <td>
                                                        <span className="destination-tag">{file.destinationFolder}</span>
                                                    </td>
                                                    <td>
                                                        <span className={`status-tag status-${file.status.toLowerCase().replace(/\s/g, '-')}`}>
                                                            {file.status}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <button 
                                                            className="action-button transfer-button"
                                                            onClick={() => handleTransfer(file.id)}
                                                            disabled={file.isTransferred || file.status === 'Processing'}
                                                        >
                                                            {file.status === 'Transferred' ? <CompleteIcon /> : <TransferIcon />}
                                                            {file.status === 'Processing' ? 'Moving...' : 
                                                             file.status === 'Transferred' ? 'Completed' : 'Transfer'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="no-reports">No files found matching the criteria.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* --- RIGHT SIDEBAR: Notification Panel (Fixed Position, Controlled by JS) --- */}
            <div className={`ops-notification-sidebar ${showNotifications ? 'visible' : ''}`}>
                <div className="ops-notification-panel">
                    
                    <div className="notification-panel-header">
                        <h3 className="notification-title">New File Arrivals ({notifications.length})</h3>
                        <button className="action-button close-sidebar-button" onClick={toggleNotifications}>
                            <CloseIcon />
                        </button>
                    </div>

                    <div className="notification-list-scroll">
                        {notifications.length > 0 ? (
                            notifications.map(n => (
                                <div key={n.id} className="ops-notification-item">
                                    <div className="item-details">
                                        <strong className="item-file-name">{n.fileName}</strong>
                                        <span className="item-file-id">ID: {n.id}</span>
                                        <span className="item-destination">To: {n.destinationFolder}</span>
                                    </div>
                                    <button 
                                        className="action-button get-file-button"
                                        onClick={() => handleGetFile(n)}
                                    >
                                        <AddIcon /> Get File
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="no-reports">No new files waiting.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OpsPage;
