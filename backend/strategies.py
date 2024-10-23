def simple_strategy(market_data):
    # A simple example where we "buy" if price rises above a threshold
    if market_data['price'] > 1.2:
        return "buy"
    else:
        return "sell"
