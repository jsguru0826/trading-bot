from flask import Flask, jsonify, request, Blueprint
from flask_cors import CORS
from services.bot_manager import BotManager

app = Flask(__name__)
CORS(app)

bot_manager = BotManager()

api = Blueprint('api', __name__, url_prefix='/api/v1')

@api.route('/start_trade', methods=['POST'])
def start_trade():
    """Start a new trade with the provided user settings."""
    data = request.json
    amount = data.get('amount', 1)
    asset = data.get('asset', 'EUR/USD')
    duration = data.get('duration', 60)
    is_live = data.get('is_live', False)
    
    data = {
        "amount": int(amount),
        "asset": asset,
        "duration": duration,
        "is_live": is_live,
    }
    bot_manager.load_web_driver(data)
    
    return jsonify({"message": "Trade started!"})

@api.route('/set_settings', methods=['POST'])
def set_settings():
    """Allows user to set risk management and trade settings."""
    data = request.json
    return jsonify({"message": "Settings updated successfully"})

@api.route('/scan_market', methods=['GET'])
def scan_market():
    """Scans the market for potential trades."""
    stack = bot_manager.get_stack()
    return jsonify(stack)

@api.route('/get_performance', methods=['GET'])
def get_performance():
    """Returns performance stats of the bot."""
    performance_data = bot_manager.get_performance()
    return jsonify(performance_data)

@api.route('/trading_stop', methods=['GET'])
def trading_stop():
    res = bot_manager.trading_stop()
    return jsonify({ "result": res })

# Register the API blueprint with the Flask app
app.register_blueprint(api)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
