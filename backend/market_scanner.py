import random

class MarketScanner:
    def __init__(self):
        self.assets = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'BTC/USD', 'ETH/USD']

    def scan_market(self):
        """Simulates market scanning to find tradable assets based on random signals."""
        market_opportunities = []
        for asset in self.assets:
            signal_strength = random.uniform(0, 100)  # Signal strength from 0 to 100
            if signal_strength > 70:  # If signal strength is above 70, it's a tradable opportunity
                market_opportunities.append({
                    'asset': asset,
                    'signal_strength': signal_strength,
                    'recommendation': 'buy' if signal_strength > 85 else 'sell'
                })
        return market_opportunities
