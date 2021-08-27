import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import Chart from './Chart';
import CryptoCurrenciesJSON from '../../data/cryptocurrencies.json';
import MonkeyCoin from '../../images/monkey-coin.png';

const CoinDashboard = () => {
    const { symbol } = useParams();

    const upperCaseSymbol = symbol.toUpperCase();
    const productId = `${upperCaseSymbol}-GBP`;

    const [livePrice, setLivePrice] = useState('')
    const [currencyData, setCurrencyData] = useState([])
    const [errorMessage, setErrorMessage] = useState(false)

    const [lineChartData, setLineChartData] = useState(
        {
            labels: [],
            datasets: [
                {
                    type: "line",
                    label: productId,
                    lineTension: 0.35,
                    data: [],
                    backgroundColor: '#A45DF3',
                    borderColor: '#3AC9E3',
                    borderWidth: 0.7,
                    fontColor: 'white',
                    pointBorderWidth: 0.7,
                    pointRadius: 0.7
                }
            ]
        }
    )
    // eslint-disable-next-line no-unused-vars
    const [lineChartOptions, setLineChartOptions] = useState({
        lineChartOptions: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                easing: 'easeInOutQuad',
                duration: 520
            },
            point: {
                backgroundColor: 'white'
            },
            tooltips: {
                enabled: true
            },
            scales: {
                xAxes: [
                    {
                        ticks: {
                            autoSkip: true,
                            maxTicksLimit: 10,
                            fontColor: 'white',
                        }
                    }
                ]
            }
        }
    }
    )


    useEffect(() => {
        const subscribe = {
            type: "subscribe",
            channels: [
                {
                    name: "ticker",
                    product_ids: [productId]
                }
            ]
        };
        const ws = new WebSocket("wss://ws-feed.pro.coinbase.com");

        ws.onopen = () => {
            ws.send(JSON.stringify(subscribe));
        };

        ws.onmessage = e => {
            const value = JSON.parse(e.data);
            if (value.type !== "ticker") {
                return;
            }
            const oldDataSet = lineChartData.datasets[0];
            const newDataSet = { ...oldDataSet };
            newDataSet.data.push(value.price);

            setLivePrice(value.price)

            for (var i = 0; i < CryptoCurrenciesJSON.cryptocurrencies.currency.length; i++) {
                if (CryptoCurrenciesJSON.cryptocurrencies.currency[i].symbol === upperCaseSymbol) {
                    setCurrencyData(CryptoCurrenciesJSON.cryptocurrencies.currency[i]);
                } else {
                    setErrorMessage(true)
                }
            }


            const newChartData = {
                ...lineChartData,
                datasets: [newDataSet],
                labels: lineChartData.labels.concat(
                    new Date().toLocaleTimeString()
                )
            };
            setLineChartData(newChartData);
        };
        return () => {
            ws.close();
        }
    })


    return (
        <div className="dashboard">
            <div className="chart-container">
                <h2>{upperCaseSymbol}</h2>
                <h3>£{livePrice}</h3>
                <Chart
                    className="chart"
                    data={lineChartData}
                    options={lineChartOptions}
                />
            </div>
            { errorMessage ?
                <div className="information-container">
                    <h2 className="information-title">{currencyData.name}</h2>
                    <p>{currencyData.info}</p>
                    <div>
                        <img className="information-img" src={MonkeyCoin} alt="monkey coin" />
                    </div>
                </div>
                :
                <p>There's no information for this cryptocurrency yet! Check back soon!</p>
            }
        </div>
    )
}

export default CoinDashboard;
