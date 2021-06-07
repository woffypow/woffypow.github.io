import React, { useEffect, useState } from 'react';
import ImageMasonry from 'react-image-masonry';
import { Chart } from 'react-google-charts';
import Item from './components/Item';
import './style.css';

const formatter = new Intl.NumberFormat('id', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
});

const pairs = {
  btc_idr: {
    asset: 0,
    name: 'BTC',
    color: '#EBAC1C'
  },
  xrp_idr: {
    asset: 156.46,
    name: 'XRP',
    color: '#5CACDD'
  },
  theta_idr: {
    asset: 146.9453,
    name: 'THETA',
    color: '#5C50DD'
  },
  tfuel_idr: {
    asset: 615.8526,
    name: 'TFUEL',
    color: '#CFE542'
  },
  ada_idr: {
    asset: 760.179809,
    name: 'ADA',
    color: '#1365EA'
  },
  bnb_idr: {
    asset: 0.7497604,
    name: 'BNB',
    color: '#FC5731'
  }
};

const modal = 37221917 ;

let timer;

export default function App() {
  const [grandTotal, setTotal] = useState(0);
  const [summary, setSummary] = useState({});
  const [precent, setPercent] = useState(0);
  const [BTCTotal, setBTCTotal] = useState(0);

  useEffect(() => {
    clearInterval(timer);
    const fetchData = async () => {
      try {
        const res = await fetch(`https://indodax.com/api/summaries`, {
          cache: 'no-cache'
        });
        const data = await res.json();

        const { tickers } = data;
        let total = 0;

        const summaryData = {};

        let keys = Object.keys(pairs);
        for (let i = 0; i < keys.length; i++) {
          let key = keys[i];
          const coin = pairs[key].asset;
          const name = pairs[key].name;
          const color = pairs[key].color;
          const { last: price } = tickers[key];
          const v = coin * Number(price);
          
          if(name === 'BTC') {
            setBTCTotal(v);
          }
          
          summaryData[key] = {
            color,
            name,
            coin,
            price: price,
            total: v
          };
          total += v;
        }

        const growthPercent = ((total - modal) / (modal / 100)).toFixed(1);

        setTotal(total);
        setSummary(summaryData);
        setPercent(growthPercent);
        document.title = `My Gain:  ${formatter.format(
          total - modal
        )} (${growthPercent}%)`;

        timer = setTimeout(() => {
          fetchData();
        }, 3000);
      } catch (e) {
        console.log('error', e);
        fetchData();
      }
    };

    fetchData();
  }, []);

  const isLoss = grandTotal < modal;
  const gain = grandTotal - modal;
  
  const TP = (gain / (grandTotal / 100)).toFixed(1);
  const TPwtBTC = (gain / ((grandTotal - BTCTotal) / 100)).toFixed(1);

  return (
    <div>
      <div className="table-responsive table-striped">
        <table className="table">
          <thead className="thead-dark">
            <tr>
              <th>Asset</th>
              <th>Price</th>
              <th>Total</th>
              <th>TP</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(summary).map(key => {
              const { coin, price, total, name } = summary[key];
              return (
                <Item
                  key={key}
                  coin={coin}
                  price={price}
                  name={name}
                  total={total}
                  isLoss={isLoss}
                  TPwtBTC={TPwtBTC}
                  TP={TP}
                />
              );
            })}
            <Item price="Total:" total={grandTotal} isBold />
          </tbody>
        </table>
      </div>
      <div style={{ padding: 20 }}>
        {grandTotal > 0 && (
          <div className={`alert ${isLoss ? 'alert-danger' : 'alert-success'}`}>
            Gain{' '}
            <strong>
              {formatter.format(gain)} ({precent}%)
            </strong>

            { !isLoss && ` | TP ${TP}% 
            or ${TPwtBTC}% ALTs` }
          </div>
        )}
      </div>
      <div style={{ width: 500, maxWidth: '100%' }}>
        <Chart
          width={'100%'}
          height={'300px'}
          chartType="PieChart"
          loader={<div>Loading Chart</div>}
          data={[
            ['Asset', 'Value'],
            ...Object.keys(summary).map(key => {
              const { coin, price, total, name, color } = summary[key];
              return [name, total];
            })
          ]}
          rootProps={{ 'data-testid': '1' }}
        />
      </div>
      <ImageMasonry
        imageUrls={[
          'https://media.giphy.com/media/XUojAIMYIIOQ9tpx2s/giphy.gif',
          'https://media.giphy.com/media/mz7iww9tCUnJJeZvGN/giphy.gif',
          'https://media.giphy.com/media/sTgTWEcVGK7CW3BQa7/giphy.gif',
          'https://media.giphy.com/media/DxbAro4C39Qi5kJmPb/giphy.gif',
          'https://media.giphy.com/media/qjSxTWJxqH4YDuIrOs/giphy.gif',
          'https://media.giphy.com/media/KI9oNS4JBemyI/giphy.gif',
          'https://media.giphy.com/media/7FBY7h5Psqd20/giphy.gif',
          'https://media.giphy.com/media/Ogak8XuKHLs6PYcqlp/giphy.gif',
          'https://media.giphy.com/media/FknIfejNbViSs/giphy.gif'
        ]}
        numCols={3}
        containerWidth={'100%'}
      />
    </div>
  );
}
