import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import SubscriberDownloadPage from './components/download_page/SubscriberDownloadPage';
import Layout from './components/main_page/Layout';
import SubscriberDashboard from './components/main_page/SubscriberDashboard';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    {/* Default route: Subscriber Group Management */}
                    <Route index element={<SubscriberDashboard />} />
                    
                    {/* New route for the Reports/Download Page */}
                    <Route path="reports" element={<SubscriberDownloadPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;