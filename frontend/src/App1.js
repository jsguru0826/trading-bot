import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [parameters, setParameters] = useState({
        trade_amount: 10,
        time_frame: 60,
        number_of_trades: 5,
        risk_management: 'medium',
        strategy: 'default',
    });

    const [performance, setPerformance] = useState({ wins: 0, losses: 0 });
    const [trades, setTrades] = useState([]);

    const startTrading = () => {
        axios.post('http://localhost:5000/start')
            .then(response => {
                console.log(response.data);
            })
            .catch(error => console.error(error));
    };

    const stopTrading = () => {
        axios.post('http://localhost:5000/stop')
            .then(response => {
                console.log(response.data);
            })
            .catch(error => console.error(error));
    };

    const updateParameters = () => {
        axios.post('http://localhost:5000/update_parameters', parameters)
            .then(response => {
                console.log(response.data);
            })
            .catch(error => console.error(error));
    };

    const fetchPerformance = () => {
        axios.get('http://localhost:5000/performance')
            .then(response => {
                setPerformance(response.data);
            })
            .catch(error => console.error(error));
    };

    const fetchTrades = () => {
        axios.get('http://localhost:5000/trades')
            .then(response => {
                setTrades(response.data);
            })
            .catch(error => console.error(error));
    };

    useEffect(() => {
        const interval = setInterval(() => {
            fetchPerformance();
            fetchTrades();
        }, 5000); // Update performance every 5 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <h1>Trading Bot Control Panel</h1>
            <div>
                <h2>Parameters</h2>
                <label>
                    Trade Amount:
                    <input
                        type="number"
                        value={parameters.trade_amount}
                        onChange={(e) => setParameters({ ...parameters, trade_amount: e.target.value })}
                    />
                </label>
                <label>
                    Time Frame (s):
                    <input
                        type="number"
                        value={parameters.time_frame}
                        onChange={(e) => setParameters({ ...parameters, time_frame: e.target.value })}
                    />
                </label>
                <label>
                    Number of Trades:
                    <input
                        type="number"
                        value={parameters.number_of_trades}
                        onChange={(e) => setParameters({ ...parameters, number_of_trades: e.target.value })}
                    />
                </label>
                <label>
                    Risk Management:
                    <select
                        value={parameters.risk_management}
                        onChange={(e) => setParameters({ ...parameters, risk_management: e.target.value })}
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </label>
                <label>
                    Strategy:
                    <input
                        type="text"
                        value={parameters.strategy}
                        onChange={(e) => setParameters({ ...parameters, strategy: e.target.value })}
                    />
                </label>
                <button onClick={updateParameters}>Update Parameters</button>
            </div>
            <div>
                <h2>Performance</h2>
                <p>Wins: {performance.wins}</p>
                <p>Losses: {performance.losses}</p>
                <button onClick={startTrading}>Start Trading</button>
                <button onClick={stopTrading}>Stop Trading</button>
            </div>
            <div>
                <h2>Trades</h2>
                <ul>
                    {trades.map((trade, index) => (
                        <li key={index}>{trade}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default App;
