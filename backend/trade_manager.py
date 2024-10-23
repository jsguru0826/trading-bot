import random
import threading

from services.utils import get_driver

BASE_URL = 'https://pocketoption.com'
        
class TradeManager:
    def __init__(self):
        self.settings = {
            "risk_level": 1,
            "stop_loss": 10,
            "take_profit": 10,
            "max_trades": 3  # default max simultaneous trades
        }
        self.trade_history = []
        self.active_trades = []
        self.lock = threading.Lock()  # for handling simultaneous trades
        self.driver = None
    

    def load_web_driver(self):
        url = f'{BASE_URL}/en/cabinet/demo-quick-high-low/'
        self.driver = get_driver()
        self.driver.get(url)
        while True:
            pass
        
    
            
    def execute_trade(self, amount, asset, duration, strategy):
        """Executes a single trade using the given strategy and settings."""
        
        print(amount, asset, duration, strategy)
        
        self.load_web_driver()
        # with self.lock:
        #     if len(self.active_trades) < self.settings['max_trades']:
        #         outcome = random.choice(['win', 'lose'])
        #         profit_loss = amount if outcome == 'win' else -amount

        #         trade = {
        #             'amount': amount,
        #             'asset': asset,
        #             'outcome': outcome,
        #             'profit_loss': profit_loss,
        #             'strategy': strategy
        #         }
        #         self.active_trades.append(trade)

        #         # Simulate trade time (in seconds) using threading
        #         threading.Timer(duration, self.complete_trade, [trade]).start()
        #         print("xx")
        #         return trade
        #     else:
        #         return {"error": "Max simultaneous trades reached"}

    def complete_trade(self, trade):
        """Handles post-trade completion."""
        self.active_trades.remove(trade)
        self.trade_history.append(trade)

    def set_user_settings(self, settings):
        """Update user-specific trade settings."""
        self.settings.update(settings)

    def get_performance(self):
        """Returns win/loss stats and trade history."""
        print('xx', self)
        total_trades = len(self.trade_history)
        total_wins = sum(1 for trade in self.trade_history if trade['outcome'] == 'win')
        total_losses = total_trades - total_wins
        total_profit = sum(trade['profit_loss'] for trade in self.trade_history)
        
        return {
            'total_trades': total_trades,
            'wins': total_wins,
            'losses': total_losses,
            'profit': total_profit
        }
