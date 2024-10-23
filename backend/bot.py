from flask import Flask, request, jsonify
from flask_cors import CORS
from threading import Thread
import random
from datetime import datetime
import time

app = Flask(__name__)
CORS(app)

# Global variables to manage trading parameters
trading_parameters = {
    'trade_amount': 10,
    'time_frame': 60,
    'number_of_trades': 5,
    'risk_management': 'medium',
    'strategy': 'martingale',  # Trading strategy
    'martingale_coefficient': 2.0  # The multiplier after a loss
}

performance_metrics = {
    'wins': 0,
    'losses': 0
}

trades = []  # For tracking active trades

def execute_trade(trade_amount):
    # Simulate a win or loss (this would be replaced with real market logic)
    trade_result = random.choice(['win', 'loss'])  # 50/50 chance
    return trade_result
  
# Dummy function to simulate trading logic
def trading_bot():
    global performance_metrics, trades
    trade_amount = trading_parameters['trade_amount']  # Start with the initial amount
    martingale_coefficient = trading_parameters['martingale_coefficient']

    # Start trading loop
    for _ in range(trading_parameters['number_of_trades']):
        # Execute a trade and store the result
        trade_result = execute_trade(trade_amount)
        trade_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        # Store the trade result
        trades.append({
            'time': trade_time,
            'amount': trade_amount,
            'result': trade_result
        })
        
        # Update performance metrics
        if trade_result == 'win':
            performance_metrics['wins'] += 1
            print(f"Trade WON at {trade_time} for amount: {trade_amount}")
            trade_amount = trading_parameters['trade_amount']  # Reset to base amount on win
        else:
            performance_metrics['losses'] += 1
            print(f"Trade LOST at {trade_time} for amount: {trade_amount}")
            # Use Martingale strategy: double the amount after a loss
            trade_amount *= martingale_coefficient
        
        # Wait for the specified time frame before executing the next trade
        time.sleep(trading_parameters['time_frame'])

    print("Trading session completed")

@app.route('/start', methods=['POST'])
def start_trading():
    Thread(target=trading_bot).start()
    return jsonify({"message": "Trading started"}), 200

@app.route('/stop', methods=['POST'])
def stop_trading():
    # Implement logic to stop trading if needed
    return jsonify({"message": "Trading stopped"}), 200

@app.route('/update_parameters', methods=['POST'])
def update_parameters():
    global trading_parameters
    trading_parameters.update(request.json)
    return jsonify({"message": "Parameters updated", "parameters": trading_parameters}), 200

@app.route('/performance', methods=['GET'])
def get_performance():
    return jsonify(performance_metrics), 200

@app.route('/trades', methods=['GET'])
def get_trades():
    return jsonify(trades), 200

if __name__ == '__main__':
    app.run(debug=True)
