# trading-bot

# how to make the excutable file

pyinstaller --onefile --add-data 'services:services' --add-data 'venv/Lib/site-packages/stock_indicators/_cslib/lib/Skender.Stock.Indicators.dll:stock_indicators/_cslib/lib' app.py