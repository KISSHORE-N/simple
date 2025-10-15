import React, { useMemo, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import './CommonStyles.css';

// --- Data Generation (Expanded) ---
const initialSubscriber = {
    name: 'Lucifer',
    email: 'lucifer@gmail.com',
};

const groupTemplates = [
    { name: "Ops_Reports", desc: "Operations and performance reports" },
    { name: "Finance_Reports", desc: "Financial insights and expense summaries" },
    { name: "Compliance_Data", desc: "Compliance and audit data access" },
    { name: "HR_Metrics", desc: "HR workforce planning and attrition metrics" },
    { name: "IT_Security", desc: "IT infrastructure uptime and incident logs" },
    { name: "Treasury_Assets", desc: "Monthly treasury management and liquidity forecasts" },
    { name: "Retail_Sales", desc: "Retail banking customer acquisition and churn reports" },
    { name: "Wholesale_Credit", desc: "Global commodity market analysis and hedging strategy papers" }
];

const generateGroupData = (isSubscribed, startId, count) => {
    const groups = [];
    const statuses = isSubscribed ? ['Active', 'Active', 'Active', 'Inactive'] : ['Available'];
    
    for (let i = 0; i < count; i++) {
        const id = startId + i;
        const template = groupTemplates[id % groupTemplates.length];
        
        const day = String(id % 28 + 1).padStart(2, '0');
        const month = String((id % 12) + 1).padStart(2, '0');
        const year = 2024;
        
        groups.push({
            id: id,
            addgroup: `${template.name}_G${id}`,
            description: isSubscribed ? `[Batch ${id}] ${template.desc}` : template.desc,
            subscribedOn: isSubscribed ? `${year}-${month}-${day}` : null,
            status: isSubscribed ? statuses[i % statuses.length] : statuses[0],
            url: `/reports/unsubscribed_sample_${id}.pdf`
        });
    }
    return groups;
};

// Initial lists - Exported for use in Layout.js for badge count
export const initialSubscribedGroups = generateGroupData(true, 1, 15); 
export const initialUnsubscribedGroups = generateGroupData(false, 16, 10); 
export const initialNotifications = [
    { report: "Ops_Reports", message: "New operations report uploaded on 2025-10-09" },
    { report: "Finance_Reports", message: "Monthly finance report summary available" },
    { report: "Compliance_Data", message: "Compliance audit access restored" }
];

// --- Minimal Icon Components ---
const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
);
const NotificationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
);
const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);
const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z"/></svg>
);
const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
);


function SubscriberDashboard() {
    const navigate = useNavigate(); 
    const { showNotifications, toggleNotifications } = useOutletContext(); 
    
    const initialSubscribedGroupsMemo = useMemo(() => initialSubscribedGroups, []);
    const initialUnsubscribedGroupsMemo = useMemo(() => initialUnsubscribedGroups, []);

    const [searchTerm, setSearchTerm] = useState('');
    const [activeTable, setActiveTable] = useState('subscribed'); 
    
    const [subscribedGroups, setSubscribedGroups] = useState(initialSubscribedGroupsMemo);
    const [unsubscribedGroups, setUnsubscribedGroups] = useState(initialUnsubscribedGroupsMemo);
    const [pendingGroups, setPendingGroups] = useState([]);
    const [notifications] = useState(initialNotifications);

    // --- UPDATED NAVIGATION LOGIC ---
    const handleNavigateClick = (groupName) => {
        console.log(`Navigating to Reports page for group: ${groupName}`);
        navigate(`/reports?group=${groupName}`); 
    };

    const handleNotificationClick = (groupName) => {
        console.log(`Notification for group ${groupName} clicked.`);
        navigate('/reports');
    };
    // --------------------------------

    const handleSubscriptionRequest = (group) => {
        setUnsubscribedGroups(prev => prev.filter(g => g.id !== group.id));
        const newGroup = { ...group, status: 'Pending', };
        setPendingGroups(prev => [newGroup, ...prev]);
        setActiveTable('pending'); 

        console.log(`Subscription request sent for: ${newGroup.addgroup}`);
        alert(`Subscription request sent for ${newGroup.addgroup}. Awaiting Admin approval.`);
    };
    
    const simulateAdminApproval = (groupToApprove) => {
        setPendingGroups(prev => prev.filter(g => g.id !== groupToApprove.id));
        const today = new Date().toISOString().split('T')[0];
        const approvedGroup = { ...groupToApprove, status: 'Active', subscribedOn: today };
        setSubscribedGroups(prev => [approvedGroup, ...prev]); 
        console.log(`Admin approved: ${approvedGroup.addgroup}`);
    };


    const filterGroups = (groups) => {
        if (!searchTerm) return groups;
        const term = searchTerm.toLowerCase();
        return groups.filter(group => 
            group.addgroup.toLowerCase().includes(term) ||
            group.description.toLowerCase().includes(term)
        );
    };
    
    const filteredSubscribedGroups = useMemo(() => filterGroups(subscribedGroups), [subscribedGroups, searchTerm]);
    const filteredUnsubscribedGroups = useMemo(() => filterGroups(unsubscribedGroups), [unsubscribedGroups, searchTerm]);
    const filteredPendingGroups = useMemo(() => filterGroups(pendingGroups), [pendingGroups, searchTerm]);

    const filteredNotifications = useMemo(() => {
        if (!searchTerm) return notifications;
        const term = searchTerm.toLowerCase();
        return notifications.filter(note => 
            note.report.toLowerCase().includes(term) ||
            note.message.toLowerCase().includes(term)
        );
    }, [notifications, searchTerm]);

    // --- Component for the Pending Requests Table (remains the same) ---
    const PendingRequestsTable = () => (
        <div className="reports-area primary-table-card">
            <h2 className="report-title">Pending Subscription Requests ({filteredPendingGroups.length} items)</h2>
            <div className="table-responsive">
                <table className="data-table subscriber-table">
                    <thead>
                        <tr>
                            <th style={{ width: '30%' }}>Group Name</th>
                            <th style={{ width: '30%' }}>Description</th>
                            <th style={{ width: '20%' }}>Status</th>
                            <th style={{ width: '20%' }}>Admin Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPendingGroups.length > 0 ? (
                            filteredPendingGroups.map(group => (
                                <tr key={group.id}>
                                    <td>{group.addgroup}</td>
                                    <td><p className="report-description">{group.description}</p></td>
                                    <td>
                                        <span className={`status-tag status-${group.status.toLowerCase()}`}>{group.status}</span>
                                    </td>
                                    <td>
                                        <button 
                                            className="action-button admin-approval-button"
                                            onClick={() => simulateAdminApproval(group)}
                                        >
                                            <CheckIcon/> Test Approval
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="no-reports">No pending subscription requests.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    // --- Main Content Renderer (Renders the active tab) ---
    const MainContentTable = () => {
        if (activeTable === 'subscribed') {
            return (
                <div className="reports-area primary-table-card">
                    <h2 className="report-title">Subscribed Groups ({filteredSubscribedGroups.length} items)</h2>
                    <div className="table-responsive">
                        <table className="data-table subscriber-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '30%' }}>Group Name</th>
                                    <th style={{ width: '40%' }}>Description</th>
                                    <th style={{ width: '15%' }}>Date</th>
                                    <th style={{ width: '15%' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSubscribedGroups.length > 0 ? (
                                    filteredSubscribedGroups.map((group) => (
                                        <tr key={group.id} onClick={() => handleNavigateClick(group.addgroup)}>
                                            <td>
                                                <a href="#" onClick={(e) => { e.preventDefault(); handleNavigateClick(group.addgroup); }} className="action-link">{group.addgroup}</a>
                                            </td>
                                            <td>
                                                <p className="report-description">{group.description}</p>
                                            </td>
                                            <td>{group.subscribedOn}</td>
                                            <td>
                                                <span className={`status-tag status-${group.status.toLowerCase()}`}>
                                                    {group.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="no-reports">No subscribed groups found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        }

        if (activeTable === 'unsubscribed') {
            return (
                <div className="reports-area primary-table-card">
                    <h2 className="report-title">New Groups Available ({filteredUnsubscribedGroups.length} items)</h2>
                    <div className="table-responsive">
                        <table className="data-table subscriber-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '30%' }}>Group</th>
                                    <th style={{ width: '45%' }}>Description</th>
                                    <th style={{ width: '25%' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUnsubscribedGroups.length > 0 ? (
                                    filteredUnsubscribedGroups.map((group) => (
                                        <tr key={group.id}>
                                            <td>{group.addgroup}</td>
                                            <td>
                                                <p className="report-description">{group.description}</p>
                                            </td>
                                            <td>
                                                <button 
                                                    className="action-button subscribe-button" 
                                                    onClick={() => handleSubscriptionRequest(group)}
                                                >
                                                    <SendIcon /> Send Request
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="no-reports">No new groups available.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        }
        
        if (activeTable === 'pending') {
            return <PendingRequestsTable />;
        }
        
        return null;
    };


    return (
        <div className="dashboard-content">

            {/* --- Search Bar --- */}
            <div className="search-bar-container">
                <div className="search-input-group">
                    <SearchIcon />
                    <input 
                        type="text"
                        placeholder="Search all Reports by Name or Description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="sc-search-input"
                    />
                </div>
            </div>

            {/* --- Tab Switcher (Controls Main Table) --- */}
            <div className="tab-switcher">
                <button
                    className={`tab-button ${activeTable === 'subscribed' ? 'active' : ''}`}
                    onClick={() => setActiveTable('subscribed')}
                >
                    Subscribed Groups ({filteredSubscribedGroups.length})
                </button>
                <button
                    className={`tab-button ${activeTable === 'unsubscribed' ? 'active' : ''}`}
                    onClick={() => setActiveTable('unsubscribed')}
                >
                    Unsubscribed Groups ({filteredUnsubscribedGroups.length})
                </button>
                <button
                    className={`tab-button ${activeTable === 'pending' ? 'active' : ''}`}
                    onClick={() => setActiveTable('pending')}
                >
                    Pending Requests ({filteredPendingGroups.length})
                </button>
            </div>

            {/* --- Content Grid: Dynamic Layout --- */}
            <div 
                className="main-content-grid permanent-split" 
                // Uses the communicated showNotifications state
                style={{ 
                    gridTemplateColumns: showNotifications ? '60% 1fr' : '1fr', 
                    gap: showNotifications ? '30px' : '0' 
                }}
            >
                
                {/* --- LEFT/MAIN COLUMN: Active Tab Table --- */}
                <MainContentTable />

                {/* --- RIGHT COLUMN: Notifications (Conditionally rendered based on communicated state) --- */}
                {showNotifications && (
                    <div className="notification-panel">
                        <div className="notification-header">
                            <NotificationIcon />
                            <h3 className="notification-title">Notifications ({filteredNotifications.length})</h3>
                        </div>
                        <div className="notification-content-nk">
                            {filteredNotifications.length > 0 ? (
                                <ul>
                                    {filteredNotifications.map((note, index) => (
                                        <li key={index} className="notification-item" onClick={() => handleNotificationClick(note.report)}>
                                            <strong className="notification-report-name">{note.report}:</strong> <span className="notification-message">{note.message}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="no-reports">No recent notifications.</p>
                            )}
                        </div>
                    </div>
                )}

            </div> {/* End main-content-grid */}
        </div>
    );
}

export default SubscriberDashboard;