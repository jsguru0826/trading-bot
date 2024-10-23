from flask import Flask, jsonify, request
from flask_cors import CORS
from trade_manager import TradeManager
from market_scanner import MarketScanner
from services.bot_manager import BotManager

app = Flask(__name__)
CORS(app)

trade_manager = TradeManager()
market_scanner = MarketScanner()
bot_manager = BotManager()

@app.route('/start_trade', methods=['POST'])
def start_trade():
    """Start a new trade with the provided user settings."""
    data = request.json
    amount = data.get('amount', 1)
    asset = data.get('asset', 'EUR/USD')
    duration = data.get('duration', 60)
    
    data = {
        "amount": int(amount),
        "asset": asset,
        "duration": duration
    }
    bot_manager.load_web_driver(data)
    return jsonify({"message": "Trade executed"})

@app.route('/set_settings', methods=['POST'])
def set_settings():
    """Allows user to set risk management and trade settings."""
    data = request.json
    trade_manager.set_user_settings(data)
    return jsonify({"message": "Settings updated successfully"})

@app.route('/scan_market', methods=['GET'])
def scan_market():
    """Scans the market for potential trades."""
    stack = bot_manager.get_stack()
    return jsonify(stack)

@app.route('/get_performance', methods=['GET'])
def get_performance():
    """Returns performance stats of the bot."""
    performance_data = trade_manager.get_performance()
    return jsonify(performance_data)

if __name__ == '__main__':
    app.run(debug=True)
