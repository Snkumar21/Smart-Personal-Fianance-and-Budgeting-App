import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login');
        }

        fetch('http://localhost:5000/user', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.name) {
                setUserName(data.name);
            } else {
                navigate('/login');
            }
        })
        .catch(err => {
            console.log(err);
            navigate('/login');
        });
    }, [navigate]);

    // ✅ Logout Function
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div>
            {/* ✅ Navbar */}
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                padding: '15px', 
                backgroundColor: '#1976D2', 
                color: 'white' 
            }}>
                <h3>💸 Smart Personal Finance App</h3>
                <h4>Welcome, {userName}</h4>
                <button 
                    onClick={handleLogout} 
                    style={{
                        backgroundColor: '#fff', 
                        color: 'black', 
                        border: 'none', 
                        padding: '10px 15px',
                        cursor: 'pointer'
                    }}>
                    Logout
                </button>
            </div>

            {/* ✅ Dashboard Body */}
            <div style={{ padding: '20px' }}>
                <h2>Welcome to your Dashboard</h2>
                <p>You can now track your expenses, set budgets, and manage your finances.</p>
            </div>
        </div>
    );
};

export default Dashboard;