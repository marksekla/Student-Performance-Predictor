import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();
    
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Select a Questionaire</h1>
            <button
                onClick={() => navigate('/random-forest')}
                style={{ margin: '10px', padding: '10px 20px' }}
                >
                Questionnaire 1
            </button>
            
            <button
                onClick={() => navigate('/linear-regression')}
                style={{ margin: '10px', padding: '10px 20px' }}
                >
                Questionnaire 2
            </button>
        </div>
    );
}

export default Home;
