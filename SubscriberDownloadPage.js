import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import '../main_page/CommonStyles.css';

// Icons (redefined locally for isolated component functionality)
const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
);

const ClearIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
);


// --- Guaranteed Report Data Map (Centralized Lookup) ---
const REPORT_DATA_BY_GROUP = {};
const FALLBACK_REPORTS = []; 

// Populate the fallback list with 20 guaranteed records
for (let i = 1; i <= 20; i++) {
    FALLBACK_REPORTS.push({
        id: 9000 + i,
        rname: `Demo File ${i}: Template Metrics`, 
        description: `Static file for demonstration purposes. Date range is 2024-01-01 to 2024-01-20.`,
        date: `2024-01-${String(i).padStart(2, '0')}`,
        status: i % 3 === 0 ? "Pending" : "Processed",
        url: "/reports/demo_3.pdf",
        selected: false
    });
}


const generateAndMapReports = () => {
    const statuses = ['Processed', 'Pending', 'Failed'];
    const descriptions = [
        'Detailed quarterly financial summary for Q1.',
        'Operations efficiency report focused on logistical improvements.',
        'Compliance audit results and recommendation findings.',
        'Market analysis report detailing regional sector performance.',
        'Customer feedback synthesis and service improvement plan.',
        'Risk assessment for Q3 investments and mitigation strategies.'
    ];

    const GROUP_CONFIGS = {
        'Ops_Reports': 100, 'Finance_Reports': 100, 'Compliance_Data': 100,
        'HR_Metrics': 100, 'IT_Security': 100, 'Treasury_Assets': 100,
    };
    
    let runningId = 1; 

    for (const groupName in GROUP_CONFIGS) {
        if (GROUP_CONFIGS.hasOwnProperty(groupName)) {
            const REPORT_COUNT = GROUP_CONFIGS[groupName];
            const formattedGroupName = groupName.replace(/_/g, ' '); 
            const groupReports = [];

            for (let i = 1; i <= REPORT_COUNT; i++) {
                
                const year = 2024;
                const month = '03'; 
                const day = String(i % 28 + 1).padStart(2, '0');
                const dateString = `${year}-${month}-${day}`;

                groupReports.push({
                    id: runningId++,
                    rname: `${formattedGroupName} File ${i}`, 
                    groupName: groupName, 
                    description: descriptions[i % descriptions.length],
                    date: dateString, 
                    status: statuses[i % statuses.length],
                    url: `/reports/file${runningId}.pdf`, 
                    selected: false
                });
            }
            REPORT_DATA_BY_GROUP[groupName] = groupReports;
        }
    }
};
generateAndMapReports();


function SubscriberDownloadPage() {
    const [searchParams] = useSearchParams(); 

    const activeGroup = searchParams.get('group'); 
    
    // --- Lookup Reports (Guaranteed List) ---
    const reportsForGroup = useMemo(() => {
        return REPORT_DATA_BY_GROUP[activeGroup] || FALLBACK_REPORTS;
    }, [activeGroup]);


    // --- State Management ---
    const [selections, setSelections] = useState({}); // New State: Selection map
    
    // Filter input states
    const [inputFromDate, setInputFromDate] = useState('');
    const [inputToDate, setInputToDate] = useState('');
    
    // Active filter states
    const [filterFromDate, setFilterFromDate] = useState('');
    const [filterToDate, setFilterToDate] = useState('');
    
    
    // Sync selections state when the group changes
    useEffect(() => {
        // Reset selections when the group changes
        const initialSelections = {};
        reportsForGroup.forEach(report => {
            initialSelections[report.id] = false;
        });
        setSelections(initialSelections);

        // Also clear any filter dates to show the full list immediately
        setInputFromDate('');
        setInputToDate('');
        setFilterFromDate('');
        setFilterToDate('');
    }, [reportsForGroup]);


    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name === 'from') { setInputFromDate(value); } 
        else if (name === 'to') { setInputToDate(value); }
    };

    const handleSearch = () => {
        setFilterFromDate(inputFromDate);
        setFilterToDate(inputToDate);
    };

    const handleClearFilters = () => {
        setInputFromDate(''); setInputToDate('');
        setFilterFromDate(''); setFilterToDate('');
    };

    const handleSelect = (id) => {
        setSelections(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };
    
    // --- Core Filtering Logic (Memoized calculation based on stable data and filter state) ---
    const filteredReports = useMemo(() => {
        const from = filterFromDate ? new Date(filterFromDate) : null;
        const to = filterToDate ? new Date(filterToDate) : null;

        if (to) { to.setHours(23, 59, 59, 999); }

        return reportsForGroup.filter(function(report) {
            if (!from && !to) return true; 

            const reportDate = new Date(report.date);
            
            if (isNaN(reportDate.getTime())) return false; 
            
            const isAfterFrom = from ? reportDate >= from : true;
            const isBeforeTo = to ? reportDate <= to : true;
            
            return isAfterFrom && isBeforeTo;
        });
    }, [reportsForGroup, filterFromDate, filterToDate]);


    // --- Selection Calculation for Download Button and Checkboxes ---
    const selectedForDownload = reportsForGroup.filter(r => selections[r.id]); // <-- FIX: Define outside loop
    
    const selectedCount = filteredReports.filter(r => selections[r.id]).length;
    const allFilteredSelected = selectedCount === filteredReports.length && filteredReports.length > 0;
    const isIndeterminate = selectedCount > 0 && selectedCount < filteredReports.length;

    const handleSelectAll = (event) => {
        const checked = event.target.checked;
        const newSelections = { ...selections };

        filteredReports.forEach(report => {
            newSelections[report.id] = checked;
        });
        setSelections(newSelections);
    };
    
    const handleDownloadZip = () => {
        const count = selectedForDownload.length; // Use the already calculated array

        if (count > 0) {
            console.log(`Downloading ${count} selected files in ZIP format...`);
            alert(`Initiating download for ${count} selected reports.`);
        } else {
            alert("Please select reports to download.");
        }
    };

    // Dynamic Report Title (Uses activeGroup from URL)
    const pageTitle = activeGroup 
        ? `${activeGroup.replace(/_/g, ' ')} Reports` 
        : "All Available Reports (Demo)";

    return (
        <div className="download-page-wrapper">
            <div className="dashboard-content">
                
                {/* --- TOP FILTER BAR --- */}
                <div className="top-filter-bar">
                    <div className="filter-card-content">
                        
                        <div className="form-group">
                            <label htmlFor="from">Select from date</label>
                            <input type="date" name="from" id="from" value={inputFromDate} onChange={handleInputChange} className="date-input" />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="to">Select to date</label>
                            <input type="date" name="to" id="to" value={inputToDate} onChange={handleInputChange} className="date-input" />
                        </div>
                        
                        <button className="action-button filter-search-button" onClick={handleSearch}>
                            Search Files
                        </button>

                        <button className="action-button clear-filter-button" onClick={handleClearFilters} disabled={!inputFromDate && !inputToDate && !filterFromDate && !filterToDate}>
                            <ClearIcon />
                            Clear Filters
                        </button>
                    </div>

                    <div className="download-action-content">
                        <button 
                            className="action-button secondary-button" 
                            onClick={handleDownloadZip} 
                            disabled={selectedForDownload.length === 0} // <-- FIX: Correct variable usage
                        >
                            <DownloadIcon />
                            Download Selected Files (ZIP) ({selectedForDownload.length}) {/* <-- FIX: Correct variable usage */}
                        </button>
                    </div>
                </div>

                {/* --- REPORTS TABLE AREA --- */}
                <div className="main-reports-area reports-area">
                    {/* --- DYNAMIC REPORT TITLE --- */}
                    <h2 className="report-title">{pageTitle} ({filteredReports.length} found)</h2> 
                    
                    <div className="table-responsive">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '4%' }}>
                                        <input type="checkbox" className="select-checkbox" checked={allFilteredSelected}
                                            ref={input => { if (input) { input.indeterminate = isIndeterminate; } }}
                                            onChange={handleSelectAll} disabled={filteredReports.length === 0}
                                        />
                                    </th>
                                    <th style={{ width: '15%' }}>Report Name</th>
                                    <th style={{ width: '35%' }}>Description</th>
                                    <th style={{ width: '10%' }}>Report Date</th>
                                    <th style={{ width: '10%' }}>Status</th>
                                    <th style={{ width: '10%' }}>Download</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredReports.length > 0 ? (
                                    filteredReports.map((report) => (
                                        <tr key={report.id}>
                                            <td>
                                                <input 
                                                    type="checkbox" 
                                                    className="select-checkbox" 
                                                    checked={selections[report.id] || false} // Use selection map
                                                    onChange={() => handleSelect(report.id)} 
                                                />
                                            </td>
                                            <td>{report.rname}</td>
                                            <td>
                                                <p className="report-description">{report.description}</p>
                                            </td>
                                            <td>{report.date}</td>
                                            <td>
                                                <span className={`status-tag status-${report.status.toLowerCase()}`}>
                                                    {report.status}
                                                </span>
                                            </td>
                                            <td>
                                                <a href={report.url} download={`Report-${report.id}.pdf`} className="action-link">
                                                    Download PDF
                                                </a>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    // Fallback text when filtering yields zero results
                                    <tr>
                                        <td colSpan="6" className="no-reports">
                                            No reports found matching the criteria. Please clear your filters.
                                        </td>
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

export default SubscriberDownloadPage;