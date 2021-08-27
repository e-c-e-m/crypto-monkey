import React from 'react'
import { Link } from 'react-router-dom'

const Coin = ({ name, image, symbol, price, priceChange, marketCap }) => {
    return (
        <div className="coin-container">
            <div className="coin-row">
                <div className="coin">
                    <img src={image} alt="crypto logo" />
                    <Link className="coin-name" to={`/${symbol}`}>{name}</Link>
                    <p className="coin-symbol">{symbol}</p>
                </div>
                <div className="coin-data">
                    <p className="coin-price">£{price.toLocaleString()}</p>
                    {priceChange < 0 ? (
                        <p className="coin-percent red">{priceChange.toFixed(2)}%</p>
                    ) : (<p className="coin-percent green">{priceChange.toFixed(2)}%</p>)
                    }
                    <p className="coin-marketcap">Market Cap: £{marketCap.toLocaleString()}</p>
                </div>
            </div>
        </div>
    )
}

export default Coin;
