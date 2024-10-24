import base64
import json
import random
import time
from datetime import datetime, timedelta

from selenium.webdriver.common.by import By

from services.utils import companies, get_driver

BASE_URL = 'https://pocketoption.com'  # change if PO is blocked in your country
LENGTH_STACK_MIN = 460
LENGTH_STACK_MAX = 1000  # 4000
PERIOD = 60  # PERIOD on the graph
TIME = 1  # quotes
SMA_LONG = 50
SMA_SHORT = 8
PERCENTAGE = 0.91  # create orders more than PERCENTAGE
STACK = {}  # {1687021970: 0.87, 1687021971: 0.88}
ACTIONS = {}  # dict of {datetime: value} when an action has been made
MAX_ACTIONS = 1
ACTIONS_SECONDS = PERIOD - 1  # how long action still in ACTIONS
LAST_REFRESH = datetime.now()
CURRENCY = None
CURRENCY_CHANGE = False
CURRENCY_CHANGE_DATE = datetime.now()
HISTORY_TAKEN = False  # becomes True when history is taken. History length is 900-1800
CLOSED_TRADES_LENGTH = 3
MODEL = None
SCALER = None
PREVIOUS = 1200
MAX_DEPOSIT = 0
MIN_DEPOSIT = 0
INIT_DEPOSIT = None
NUMBERS = {
    '0': '11',
    '1': '7',
    '2': '8',
    '3': '9',
    '4': '4',
    '5': '5',
    '6': '6',
    '7': '1',
    '8': '2',
    '9': '3',
}
IS_AMOUNT_SET = True
AMOUNTS = []  # 1, 3, 8, 18, 39, 82, 172
EARNINGS = 15  # euros.
MARTINGALE_COEFFICIENT = 2.0  # everything < 2 have worse profitability
TRADE_AMOUNT= 1
TIME_NUMBERS = {
    "5": "1",
    "15": "2",
    "30": "3",
    "60": "4",
    "180": "5",
    "300": "6",
    "1800": "7",
    "3600": "8",
    "14400": "9"
}
TIME_FRAME = None

class BotManager:
    def __init__(self):
        self.driver = None
    

    def load_web_driver(self, data):
        global STACK, PERIOD, TRADE_AMOUNT
        
        # we can get parameters from data
        # PERIOD = data['duration']
        TRADE_AMOUNT = data['amount']
        TIME_FRAME = data['duration']
        
        url = f'{BASE_URL}/en/cabinet/demo-quick-high-low/'
        self.driver = get_driver()
        self.driver.get(url)
        
        return
        
        # ---------time frame--------------
        amount = self.driver.find_element(by=By.CSS_SELECTOR, value='#put-call-buttons-chart-1 > div > div.blocks-wrap > div.block.block--expiration-inputs > div.block__control.control > div.control__value.value.value--several-items > div')
        amount.click()
        self.hand_delay()
        
        base = '#modal-root > div > div > div > div.trading-panel-modal__dops.dops > div.dops__timeframes > div:nth-child(%s)'
        self.driver.find_element(by=By.CSS_SELECTOR, value=base % TIME_NUMBERS[TIME_FRAME]).click()
        self.hand_delay()

        self.close_setting_modal()
        # ---------time frame--------------
        
        # ---------setting amount--------------
        amount = self.driver.find_element(by=By.CSS_SELECTOR, value='#put-call-buttons-chart-1 > div > div.blocks-wrap > div.block.block--bet-amount > div.block__control.control > div.control__value.value.value--several-items > div > input[type=text]')
        amount.click()
        self.hand_delay()
        
        base = '#modal-root > div > div > div > div > div.trading-panel-modal__in > div.virtual-keyboard > div > div:nth-child(%s) > div'
        for number in str(TRADE_AMOUNT):
            self.driver.find_element(by=By.CSS_SELECTOR, value=base % NUMBERS[number]).click()
            self.hand_delay()
            
        self.close_setting_modal()
        # ---------setting amount--------------
            
        # while True:
        #     STACK = self.websocket_log(STACK)

    def close_setting_modal(self):
        closed_tab = self.driver.find_element(by=By.CSS_SELECTOR, value='#bar-chart > div > div > div.right-widget-container > div > div.widget-slot__header > div.divider > ul > li:nth-child(2) > a')
        closed_tab_parent = closed_tab.find_element(by=By.XPATH, value='..')
        closed_tab_parent.click()

    def change_currency(self):
        current_symbol = self.driver.find_element(by=By.CLASS_NAME, value='current-symbol')
        current_symbol.click()
        # time.sleep(random.random())  # 0-1 sec
        currencies = self.driver.find_elements(By.XPATH, "//li[contains(., '92%')]")
        if currencies:
            # click random currency
            while True:
                currency = random.choice(currencies)
                if CURRENCY not in currency.text:
                    break  # avoid repeats
            currency.click()
        else:
            pass


    def do_action(self, signal):
        action = True
        try:
            last_value = list(STACK.values())[-1]
        except:
            return

        global ACTIONS, IS_AMOUNT_SET
        for dat in list(ACTIONS.keys()):
            if dat < datetime.now() - timedelta(seconds=ACTIONS_SECONDS):
                del ACTIONS[dat]

        if action:
            if len(ACTIONS) >= MAX_ACTIONS:
                # print(f"Max actions reached, don't do a {signal} action")
                action = False

        if action:
            if ACTIONS:
                if signal == 'call' and last_value >= min(list(ACTIONS.values())):
                    action = False
                elif signal == 'put' and last_value <= max(list(ACTIONS.values())):
                    action = False

        if action:
            try:
                print(f"{datetime.now().strftime('%Y-%m-%d %H:%M:%S')} {signal.upper()}, currency: {CURRENCY} last_value: {last_value}")
                self.driver.find_element(by=By.CLASS_NAME, value=f'btn-{signal}').click()
                ACTIONS[datetime.now()] = last_value
                IS_AMOUNT_SET = False
            except Exception as e:
                print(e)


    def hand_delay(self):
        time.sleep(random.choice([0.2, 0.3, 0.4, 0.5, 0.6]))
        pass


    # martingale straregic
    def get_amounts(self, amount):
        print(amount, "amount")
        if amount > 20000:
            amount = 20000
        amounts = []
        while True:
            amount = int(amount / MARTINGALE_COEFFICIENT)
            amounts.insert(0, amount)
            if amounts[0] <= 1:
                amounts[0] = 1
                print('Martingale stack:', amounts, 'init deposit:', INIT_DEPOSIT)
                return amounts


    def get_deposit_value(self, deposit):
        return float(deposit.text.replace(',', ''))


    def check_values(self, stack):
        # This part retrieves the current balance (deposit) from the web page using Selenium. If there’s an issue with finding the element, it catches the exception and prints it.
        try:
            deposit = self.driver.find_element(by=By.CSS_SELECTOR, value='body > div.wrapper > div.wrapper__top > header > div.right-block.js-right-block > div.right-block__item.js-drop-down-modal-open > div > div.balance-info-block__data > div.balance-info-block__balance > span')
        except Exception as e:
            print(e)

        # The time_style element controls how the expiration time of the trade is displayed. If it’s not in the correct format (exp-mode-2.svg), the code clicks the button to switch it.
        time_style = self.driver.find_element(by=By.CSS_SELECTOR, value='#put-call-buttons-chart-1 > div > div.blocks-wrap > div.block.block--expiration-inputs > div.block__control.control > div.control-buttons__wrapper > div > a > div > div > svg')
        if 'exp-mode-2.svg' in time_style.get_attribute('data-src'):  # should be 'exp-mode-2.svg'
            time_style.click()  # switch time style

        global IS_AMOUNT_SET, AMOUNTS, INIT_DEPOSIT

        #  If this is the first time running, the initial deposit is set using the get_deposit_value function, which converts the deposit into a numeric value.
        if not INIT_DEPOSIT:
            INIT_DEPOSIT = self.get_deposit_value(deposit)


        if not AMOUNTS:  # only for init purpose
            AMOUNTS = self.get_amounts(self.get_deposit_value(deposit))

        if not IS_AMOUNT_SET:
            if ACTIONS and list(ACTIONS.keys())[-1] + timedelta(seconds=PERIOD + 5) > datetime.now():
                return

            try:
                closed_tab = self.driver.find_element(by=By.CSS_SELECTOR, value='#bar-chart > div > div > div.right-widget-container > div > div.widget-slot__header > div.divider > ul > li:nth-child(2) > a')
                closed_tab_parent = closed_tab.find_element(by=By.XPATH, value='..')
                if closed_tab_parent.get_attribute('class') == '':
                    closed_tab_parent.click()
            except:
                pass

            closed_trades = self.driver.find_elements(by=By.CLASS_NAME, value='deals-list__item')
            if closed_trades:
                last_split = closed_trades[0].text.split('\n')
                try:
                    amount = self.driver.find_element(by=By.CSS_SELECTOR, value='#put-call-buttons-chart-1 > div > div.blocks-wrap > div.block.block--bet-amount > div.block__control.control > div.control__value.value.value--several-items > div > input[type=text]')
                    amount_value = int(amount.get_attribute('value'))
                    base = '#modal-root > div > div > div > div > div.trading-panel-modal__in > div.virtual-keyboard > div > div:nth-child(%s) > div'
                    if '$0' != last_split[4]:  # win
                        if amount_value > 1:
                            amount.click()
                            self.hand_delay()
                            self.driver.find_element(by=By.CSS_SELECTOR, value=base % NUMBERS['1']).click()
                            AMOUNTS = self.get_amounts(self.get_deposit_value(deposit))  # refresh amounts
                    elif '$0' != last_split[3]:  # draw
                        pass
                    else:  # lose
                        amount.click()
                        time.sleep(random.choice([0.6, 0.7, 0.8, 0.9, 1.0, 1.1]))
                        if amount_value in AMOUNTS and AMOUNTS.index(amount_value) + 1 < len(AMOUNTS):
                            next_amount = AMOUNTS[AMOUNTS.index(amount_value) + 1]
                            for number in str(next_amount):
                                self.driver.find_element(by=By.CSS_SELECTOR, value=base % NUMBERS[number]).click()
                                self.hand_delay()
                        else:  # reset to 1
                            self.driver.find_element(by=By.CSS_SELECTOR, value=base % NUMBERS['1']).click()
                            self.hand_delay()
                    closed_tab_parent.click()
                except Exception as e:
                    print(e)
            IS_AMOUNT_SET = True

        if IS_AMOUNT_SET and datetime.now().second % 10 == 0:

            if list(stack.values())[-1] < list(stack.values())[-1 - PERIOD] < list(stack.values())[-1 - PERIOD * 2]:
                self.do_action('put')
            if list(stack.values())[-1] > list(stack.values())[-1 - PERIOD] > list(stack.values())[-1 - PERIOD * 2]:
                self.do_action('call')


    def websocket_log(self, stack):
        global CURRENCY, CURRENCY_CHANGE, CURRENCY_CHANGE_DATE, LAST_REFRESH, HISTORY_TAKEN, MODEL, INIT_DEPOSIT
        try:
            current_symbol = self.driver.find_element(by=By.CLASS_NAME, value='current-symbol').text
            if current_symbol != CURRENCY:
                CURRENCY = current_symbol
                CURRENCY_CHANGE = True
                CURRENCY_CHANGE_DATE = datetime.now()
        except:
            pass

        if CURRENCY_CHANGE and CURRENCY_CHANGE_DATE < datetime.now() - timedelta(seconds=5):
            stack = {}  # drop stack when currency changed
            HISTORY_TAKEN = False  # take history again
            self.driver.refresh()  # refresh page to cut off unwanted signals
            CURRENCY_CHANGE = False
            MODEL = None
            INIT_DEPOSIT = None

        for wsData in self.driver.get_log('performance'):
            message = json.loads(wsData['message'])['message']
            response = message.get('params', {}).get('response', {})
            if response.get('opcode', 0) == 2 and not CURRENCY_CHANGE:
                payload_str = base64.b64decode(response['payloadData']).decode('utf-8')
                data = json.loads(payload_str)
                if not HISTORY_TAKEN:
                    if 'history' in data:
                        stack = {int(d[0]): d[1] for d in data['history']}
                        print(f"History taken for asset: {data['asset']}, period: {data['period']}, len_history: {len(data['history'])}, len_stack: {len(stack)}")
                try:
                    current_symbol = self.driver.find_element(by=By.CLASS_NAME, value='current-symbol').text
                    symbol, timestamp, value = data[0]
                except:
                    continue
                try:
                    if current_symbol.replace('/', '').replace(' ', '') != symbol.replace('_', '').upper() and companies.get(current_symbol) != symbol:
                        continue
                except:
                    pass

                if len(stack) == LENGTH_STACK_MAX:
                    first_element = next(iter(stack))
                    del stack[first_element]
                if len(stack) < LENGTH_STACK_MAX:
                    if int(timestamp) in stack:
                        return stack
                    else:
                        stack[int(timestamp)] = value
                elif len(stack) > LENGTH_STACK_MAX:
                    print(f"Len > {LENGTH_STACK_MAX}!!")
                    stack = {}  # refresh then
                if len(stack) >= LENGTH_STACK_MIN:
                    self.check_values(stack)
        return stack

    def get_stack(self):
        global STACK, CURRENCY
        return { "stack": STACK, "currency": CURRENCY }
