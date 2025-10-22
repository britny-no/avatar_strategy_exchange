export const ACCOUNT_SEETINGS = [{}];

// const USER_GUIDES = [
//     {
//         type: 'assert',
//         groupTitle: 'Assert Deposit, Transfer, Withdrawal, Fees',
//         title: "How to solve it when you deposit a coin but you can't see it",
//         writer: 'admin',
//         createdAt: '2021-10-11',
//         contents: (
//             <p>
//                 How to solve it when you deposit a coin but you can&apos;t see it
//                 <br />
//                 <br />
//                 <br />
//                 Basically, all coins have an average amount of time for deposit/withdrawal depending on the network for
//                 each coin.
//                 <br />
//                 <br />
//                 Bitcoin(BTC) : About 30 minutes to 1 hour.
//                 <br />
//                 Tether(USDT : ERC20) : About 15 to 30 minutes.
//                 <br />
//                 (It is not available to Korea Exchange and it can only be deposited/withdrawed to overseas exchanges.)
//                 <br />
//                 <br />
//                 Ripple(XRP) : About 5 to 15 minutes.
//                 <br />
//                 ETH(Ethereum) : About 5 to 15 minutes.
//                 <br />
//                 <br />
//                 If you deposit it to Imcosun on the exchange you use, but the deposit is not confirmed, enter the menu
//                 (My wallet → account information) on the screen below and click the ‘Wallet Update’ button next to ‘My
//                 Asset’ to mark the deposit in My Wallet History.
//                 <br />
//             </p>
//         ),
//     },
//     {
//         type: 'assert',
//         groupTitle: 'Assert Deposit, Transfer, Withdrawal, Fees',
//         title: 'Coin Convert( Fiat and Spot ↔ Futures)',
//         writer: 'admin',
//         createdAt: '2021-10-11',
//         contents: (
//             <p>
//                 Coin Convert( Fiat and Spot ↔ Futures)
//                 <br />
//                 <br />
//                 Imcosun manages fiat and spot wallets and futures wallets separately to protect members&apos; assets.
//                 <br />
//                 If you make a deposit, you have coins in your fiat and spot wallet.
//                 <br />
//                 <br />
//                 You have to exchange the coins you have for USDT and then move them to the futures wallet to trade
//                 futures.
//                 <br />
//                 Conversely, when withdrawing money, you must first make move your coin from the futures wallet to the
//                 spot wallet.
//                 <br />
//                 <br />
//                 In the menu for my wallet, you can go into spot wallet ↔ futures wallet.
//                 <br />
//                 If you want to deposit and trade futures, select the From part as legal currency and spot / To part as a
//                 USD-M futures.
//                 <br />
//                 <br />
//                 Lastly, please fill out the quantity you want to switch and proceed with the conversion.
//                 <br />
//                 When withdrawing, you can replace the From part with the USD-M gift/To part with legal currency and
//                 spot.
//                 <br />
//             </p>
//         ),
//     },
//     {
//         type: 'assert',
//         groupTitle: 'Assert Deposit, Transfer, Withdrawal, Fees',
//         title: 'Coin exchange',
//         writer: 'admin',
//         createdAt: '2021-10-11',
//         contents: (
//             <p>
//                 Coin exchange
//                 <br />
//                 <br />
//                 “Coin exchange” is a function of changing the type of coin you have to another type.
//                 <br />
//                 This function is also a preliminary work to change to USDT for futures trading.
//                 <br />
//                 It is also used as a function to withdraw your coin.
//                 <br />
//                 <br />
//                 <br />
//                 You go to the menu (My wallet- Coin exchange)
//                 <br />
//                 If the coin you have is, for example, BTC, select BTC in the coin type selection of the left column,
//                 specify the amount to be converted, and press Exchange.
//                 <br />
//                 <br />
//                 On the contrary, if you exchange it for withdrawal after completing the futures trading, you can proceed
//                 in reverse order.
//                 <br />
//             </p>
//         ),
//     },
//     {
//         type: 'assert',
//         groupTitle: 'Assert Deposit, Transfer, Withdrawal, Fees',
//         title: 'How to withdraw coins.',
//         writer: 'admin',
//         createdAt: '2021-10-11',
//         contents: (
//             <p>
//                 How to withdraw coins.
//                 <br />
//                 <br />
//                 If you enter my wallet in the menu, you will see a screen below.
//                 <br />
//                 There are four withdrawable coins: Bitcoin (BTC), Tether (USDT), XRP (Ripple), and ETH(Ethereum).
//                 <br />
//                 However, in the case of USDT, withdrawal to the Korea Exchange is not possible because the Korea
//                 Exchange does not support deposit and withdrawal for USDT.
//                 <br />
//                 The screen below is an example of Ripple withdrawal.
//                 <br />
//                 <br />
//                 For example, if you press the withdrawal button to the right of the XRP,
//                 <br />
//                 the Ripple Address field and Destination Tag field to be withdrawn will appear.
//                 <br />
//                 You can accurately copy and fill out the ripple wallet address and destination tag address of the
//                 exchange you will receive coin at the place of entry and then, proceed with the withdrawal processing
//                 application.
//                 <br />
//                 <br />
//                 Basically, the transmission time of all coins varies somewhat depending on the network of each coin.
//                 <br />
//                 Bitcoin(BTC) : About 30 minutes to 1 hour.
//                 <br />
//                 Tether(USDT : ERC20) : About 15 to 30 minutes. (Only available on overseas exchanges.)
//                 <br />
//                 Ripple(XRP) : About 5 to 15 minutes.
//                 <br />
//                 ETH(Ethereum) : About 5 to 15 minutes.
//                 <br />
//             </p>
//         ),
//     },
//     {
//         type: 'assert',
//         groupTitle: 'Assert Deposit, Transfer, Withdrawal, Fees',
//         title: 'How to Deposit coins.',
//         writer: 'admin',
//         createdAt: '2021-10-11',
//         contents: (
//             <p>
//                 How to deposit coins.
//                 <br />
//                 If you enter my wallet in the menu, you will see a screen below.
//                 <br />
//                 There are four depositable coins: Bitcoin (BTC), Tether (USDT), XRP (Ripple), and ETH(Ethereum).
//                 <br />
//                 The screen below is an example of Ripple withdrawal.
//                 <br />
//                 <br />
//                 For example, if you press the deposit button to the right of the XRP,
//                 <br />
//                 the Ripple Address field and Destination Tag field to be withdrawn will appear.
//                 <br />
//                 <br />
//                 You can accurately copy and fill out the ripple wallet address and destination tag address of the
//                 exchange you want to withdraw coin at the place of entry and then, proceed with the deposit processing
//                 application.
//                 <br />
//                 <br />
//                 Basically, the transmission time of all coins varies somewhat depending on the network of each coin.
//                 <br />
//                 <br />
//                 Bitcoin(BTC) : About 30 minutes to 1 hour.
//                 <br />
//                 Tether(USDT : ERC20) : About 15 to 30 minutes. (Only available on overseas exchanges.)
//                 <br />
//                 Ripple(XRP) : About 5 to 15 minutes.
//                 <br />
//                 ETH(Ethereum) : About 5 to 15 minutes.
//                 <br />
//             </p>
//         ),
//     },
//     {
//         type: 'order',
//         groupTitle: 'Order Types',
//         title: 'USDT indefinitely risk limits',
//         writer: 'admin',
//         createdAt: '2021-10-11',
//         contents: (
//             <p>
//                 USDT indefinitely risk limits\n
//                 <br />
//                 <br />
//                 Risk limits uses the concept of Dynamic Leverage.
//                 <br />
//                 The maximum leverage available during the transaction varies depending on the trader&apos;s position
//                 value.
//                 <br />
//                 The larger the position value, the higher the ratio of the required initial margin and the lower the
//                 leverage available.
//                 <br />
//                 <br />
//                 Each transaction has a unique maintenance margin base rate, and the risk of increasing or decreasing the
//                 margin is also adjusted.
//                 <br />
//                 (Reminder: The baseline of the indefinite contract maintenance margin ratio is 0.5% BTC, 1% ETH & XRP,
//                 and it changes according to the risk change.)
//                 <br />
//                 <br />
//                 Risk limits are risk management mechanisms that limit the risk of a trader&apos;s position.
//                 <br />
//                 If the price fluctuations are severe, traders in a single high leverage position can suffer great
//                 losses.
//                 <br />
//                 <br />
//                 By adjusting the risk limit, risk management is optimized to protect all traders from taking separate
//                 risks.
//                 <br />
//                 Each contract has a risk reference value and an increase value.
//                 <br />
//                 <br />
//                 By combining the reference value and the evidence value of the maintenance margin and the initial
//                 margin, the position&apos;s demand for margin can be calculated.
//                 <br />
//                 As the position increases, the demand for maintenance margin and initial margin increases.
//                 <br />
//                 As the user changes the leverage, the required initial and maintenance margin also change.
//                 <br />
//             </p>
//         ),
//     },
//     {
//         type: 'order',
//         group: 'Order Types',
//         title: 'Bankruptcy price calculation formula',
//         writer: 'admin',
//         createdAt: '2021-10-11',
//         contents: (
//             <p>
//                 Bankruptcy price calculation formula
//                 <br />
//                 <br />
//                 “Bankruptcy price&quot; means that you have lost all of the initial margin of your position at that
//                 price.
//                 <br />
//                 <br />
//                 If forced liquidation is triggered, the liquidated position will be included in the margin in advance as
//                 the transaction fee will be calculated at the bankruptcy price.
//                 <br />
//                 <br />
//                 <br />
//                 ※ Bankruptcy price calculation formula\n
//                 <br />
//                 Bankruptcy price = Entry price X quantity X (1-1/leverage) X market price commission rate
//                 <br />
//             </p>
//         ),
//     },
//     {
//         type: 'order',
//         groupTitle: 'Order Types',
//         title: 'Compulsory liquidation isolation/cross calculation formula',
//         writer: 'admin',
//         createdAt: '2021-10-11',
//         contents: (
//             <p>
//                 Compulsory liquidation isolation/cross calculation formula
//                 <br />
//                 <br />
//                 1. Compulsory liquidation calculation formula in isolation mode
//                 <br />
//                 <br />
//                 Long isolated liquidation formula = entry price X (1 - 1/ leverage + maintenance margin rate)
//                 <br />
//                 <br />
//                 Short isolated liquidation formula = entry price X (1 + 1/ leverage - maintenance margin rate)
//                 <br />
//                 <br />
//                 2. Compulsory liquidation calculation formula in cross mode
//                 <br />
//                 <br />
//                 Long cross liquidation formula
//                 <br />
//                 = entry price – [Deposits for future transaction + entry price X quantity X (1/ leverage - maintenance
//                 margin rate)] / quantity
//                 <br />
//                 <br />
//                 - Short cross liquidation formula
//                 <br />
//                 = entry price + [Deposits for future transaction + entry price X quantity X (1/ leverage - maintenance
//                 margin rate)] / quantity
//                 <br />
//             </p>
//         ),
//     },
//     {
//         type: 'order',
//         groupTitle: 'Order Types',
//         title: 'How to calculate the position margin for an indefinite transaction.(USDT)',
//         writer: 'admin',
//         createdAt: '2021-10-11',
//         contents: (
//             <p>
//                 How to calculate the position margin for an indefinite transaction.(USDT)
//                 <br />
//                 <br />
//                 1. Position Margin
//                 <br />
//                 <br />
//                 The position margin is the total margin required to open a new position.
//                 <br />
//                 This is the sum of the estimated initial margin and the estimated fee incurred when opening and closing
//                 the position.
//                 <br />
//                 Traders can see the cost of opening their positions on the transaction screen in advance.
//                 <br />
//                 <br />
//                 2. How to calculate the position margin
//                 <br />
//                 <br />
//                 Initial margin+ bankruptcy price fee (Liquidation fee) + maintenance margin
//                 <br />
//                 <br />
//                 * Initial margin : entry price X quantity / leverage
//                 <br />
//                 * Maintenance margin : entry price X quantity X maintenance margin rate
//                 <br />
//                 * Bankruptcy price fee : : entry price X quantity X (1-1/ leverage) X market price fee
//                 <br />
//             </p>
//         ),
//     },
//     {
//         type: 'order',
//         groupTitle: 'Order Types',
//         title: 'Indefinite transaction profit and loss calculation/yield calculation',
//         writer: 'admin',
//         createdAt: '2021-10-11',
//         contents: (
//             <p>
//                 Indefinite transaction profit and loss calculation/yield(%) calculation
//                 <br />
//                 <br />
//                 1. Unrealized profit and loss calculation formula
//                 <br />
//                 <br />
//                 Long unrealized profit and loss calculation formula = quantity X (current market price – entry price)
//                 <br />
//                 <br />
//                 Short unrealized profit and loss calculation formula = quantity X (entry price - current market price)
//                 <br />
//                 <br />
//                 EX) Traders have entered $10,000 in margin buying(Long) of 50 times leverage and 1 BTC, and the current
//                 market price is $10100.
//                 <br />
//                 <br />
//                 <br />
//                 Long unrealized profit and loss calculation
//                 <br />
//                 <br />
//                 1 BTC X (10100 – 10000) = 100 USDT
//                 <br />
//                 <br />
//                 <br />
//                 2. Unrealized yield(%) calculation formula
//                 <br />
//                 <br />
//                 quantity X (current market price – entry price) / position margin X 100
//                 <br />
//                 <br />
//                 EX) Traders have entered $10,000 in margin buying(Long) of 50 times leverage and 1 BTC, and the current
//                 market price is $10100.
//                 <br />
//                 <br />
//                 Unrealized yield(%) calculation
//                 <br />
//                 <br />
//                 1 BTC X (10100 – 10000) / 200 X 100 = 50% <br />
//             </p>
//         ),
//     },
// ];

// export { USER_GUIDES };

export const NOTICE = [{}];

export const Faq = {
    type: 'Terms and Conditions',
    title: '',
    content: '',
    writer: '',
    createdAt: '',
};
