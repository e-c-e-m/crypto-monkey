import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Coin from './Coin';
import Skeleton from '@material-ui/lab/Skeleton';


function CoinList() {

    const [coins, setCoins] = useState([])
    const [search, setSearch] = useState('')
    const [isLoading, setIsLoading] = useState(true)


    const [livePrice, setLivePrice] = useState('')


    useEffect(() => {
        axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=gbp&order=market_cap_desc&per_page=100&page=1&sparkline=false')
            .then(res => {
                setCoins(res.data)
                setIsLoading(false)
            }).catch(error => console.log(error))
    }, []);

    const handleChange = e => {
        setSearch(e.target.value)
    }

    const filteredCoins = coins.filter(coin =>
        coin.name.toLowerCase().includes(search.toLowerCase())
    )

    useEffect(() => {
        filteredCoins.map(coin => {
            const upperCaseSymbol = coin.symbol.toUpperCase();
            const productId = `${upperCaseSymbol}-GBP`;

            const subscribe = {
                type: "subscribe",
                channels: [
                    {
                        name: "ticker",
                        product_ids: [productId]
                    }
                ]
            };
            const ws = new WebSocket("wss://ws-feed.gdax.com");

            ws.onopen = () => {
                ws.send(JSON.stringify(subscribe));
            };

            ws.onmessage = e => {
                const value = JSON.parse(e.data);
                if (value.type !== "ticker") {
                    return;
                }
                // const oldDataSet = lineChartData.datasets[0];
                // const newDataSet = { ...oldDataSet };
                // newDataSet.data.push(value.price);

                setLivePrice(value.price)
                console.log(value);
            };

            return () => {
                ws.close();

            }
        })
    })

    return (
        <div className="coin-app">
            <div className="coin-search">
                <form>
                    <input type="text" placeholder="Search cryptocurrencies" className="coin-input" onChange={handleChange} />
                </form>
            </div>
            { isLoading ?
                <div className="skeleton-container">
                    <Skeleton />
                    <Skeleton animation="pulse" />
                    <Skeleton animation="pulse" />
                    <Skeleton animation="pulse" />
                    <Skeleton animation="pulse" />
                </div>
                :
                <div>
                    {filteredCoins.map(coin => {
                        return (
                            <Coin key={coin.id} name={coin.name} image={coin.image}
                                symbol={coin.symbol} price={coin.current_price}
                                priceChange={coin.price_change_percentage_24h} marketCap={coin.market_cap} />
                        )
                    })}
                </div>
            }
        </div>
    );
}

export default CoinList;
