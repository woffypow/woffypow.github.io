import React, { useState, useEffect } from 'react';
import './styles.scss';

const formatter = new Intl.NumberFormat('id', {
  style: 'currency',
  currency: 'IDR',

  // These options are needed to round to whole numbers if that's what you want.
  minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  maximumFractionDigits: 0 // (causes 2500.99 to be printed as $2,501)
});

function Item(props) {
  const { coin, price, total, name, isBold, TP, TPwtBTC } = props;

  const [currentTotal, setCurrentTotal] = useState(total);
  const [className, setClassName] = useState('');

  useEffect(() => {
    if (total < currentTotal) {
      setClassName('loss');
    } else if (total === currentTotal) {
      setClassName('');
    } else {
      setClassName('gain');
    }

    setTimeout(() => {
      setClassName('');
    }, 1000);

    setCurrentTotal(total);
  }, [total]);

  return (
    <tr className={className}>
      <td>
        {coin} {name}
      </td>
      <td>{price > 0 ? formatter.format(price) : price}</td>
      <td className={isBold ? 'bold' : ''}>{formatter.format(total)}</td>
      <td style={{ color: '#155724' }}>
        { price > 0 && name === 'BTC' && `${(coin * TP / 100).toFixed(8)} BTC` }
        { price > 0 && name !== 'BTC' &&  `${(coin * TP / 100).toFixed(4)} ${name} | ${(coin * TPwtBTC / 100).toFixed(4)} ${name}` }
      </td>
    </tr>
  );
}

export default Item;
