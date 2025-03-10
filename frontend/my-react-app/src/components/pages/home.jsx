import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();
    
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Select a Model</h1>
            <button
                onClick={() => navigate('/random-forest')}
                style={{ margin: '10px', padding: '10px 20px' }}
                >
                Random Forest
            </button>
            
            <button
                onClick={() => navigate('/linear-regression')}
                style={{ margin: '10px', padding: '10px 20px' }}
                >
                Linear Regression
            </button>
        </div>
    );
}

export default Home;
