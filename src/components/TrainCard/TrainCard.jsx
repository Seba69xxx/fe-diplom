import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';
import { setSelectedTrain } from '../../store/slices/orderSlice';
import {
  formatTime,
  formatDurationColons,
  formatPrice,
} from '../../utils/formatters';
import styles from './TrainCard.module.scss';

import iconWifi from '../../images/icon-wifi.png';
import iconExpress from '../../images/icon-express.png';
import iconFood from '../../images/icon-food.png';
import iconAc from '../../images/icon-ac.png';
import iconTrain from '../../images/icon-train.png';

const ArrowRight = () => (
  <svg
    className={styles.arrowIcon}
    viewBox="0 0 18 12"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.6 6.4L12.6 11.4C12.4 11.6 12.2 11.6 12 11.4C11.8 11.2 11.8 11 12 10.8L16.2 6.6H0.4C0.2 6.6 0 6.4 0 6.2V5.8C0 5.6 0.2 5.4 0.4 5.4H16.2L12 1.2C11.8 1 11.8 0.8 12 0.6C12.2 0.4 12.4 0.4 12.6 0.6L17.6 5.6C17.8 5.8 17.8 6.2 17.6 6.4Z" />
  </svg>
);

const ArrowLeft = () => (
  <svg
    className={styles.arrowIcon}
    viewBox="0 0 18 12"
    xmlns="http://www.w3.org/2000/svg"
    style={{ transform: 'rotate(180deg)' }}
  >
    <path d="M17.6 6.4L12.6 11.4C12.4 11.6 12.2 11.6 12 11.4C11.8 11.2 11.8 11 12 10.8L16.2 6.6H0.4C0.2 6.6 0 6.4 0 6.2V5.8C0 5.6 0.2 5.4 0.4 5.4H16.2L12 1.2C11.8 1 11.8 0.8 12 0.6C12.2 0.4 12.4 0.4 12.6 0.6L17.6 5.6C17.8 5.8 17.8 6.2 17.6 6.4Z" />
  </svg>
);

const formatDate = (timestamp) => {
  if (!timestamp) return '';
  return new Date(timestamp * 1000).toLocaleDateString('ru-RU');
};

export default function TrainCard({ data, hideButton = false, compact = false }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [expandedType, setExpandedType] = useState(null);

  const priceData = useMemo(() => {
    if (!data || !data.departure) return [];
    const { price_info = {} } = data.departure;
    const typeOrder = ['fourth', 'third', 'second', 'first'];
    const labels = {
      fourth: 'Сидячий',
      third: 'Плацкарт',
      second: 'Купе',
      first: 'Люкс',
    };

    const seed = data.departure._id
      ? parseInt(data.departure._id.slice(-4), 16)
      : 1;
    const getPseudoRandom = (offset, min, max) => {
      const x = Math.sin(seed + offset) * 10000;
      return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
    };

    return typeOrder
      .filter((type) => price_info[type])
      .map((type, index) => {
        const info = price_info[type];
        const totalSeats = getPseudoRandom(index, 10, 50);

        const hasSplit = type === 'second' || type === 'third';
        const topPrice = info.top_price;
        const bottomPrice = info.bottom_price;

        const availablePrices = [info.top_price, info.bottom_price, info.price]
          .filter((p) => typeof p === 'number' && p > 0);

        const minPrice =
          availablePrices.length > 0 ? Math.min(...availablePrices) : 0;

        return {
          type,
          label: labels[type],
          minPrice: minPrice,
          topPrice: hasSplit ? topPrice : null,
          bottomPrice: hasSplit ? bottomPrice : null,
          seats: totalSeats,
        };
      })
      .sort((a, b) => a.minPrice - b.minPrice);
  }, [data]);

  if (!data || !data.departure) return null;
  const { departure, arrival } = data;
  const { from, to, train, have_wifi, have_air_conditioning, is_express } =
    departure;

  if (!from || !to) return null;

  let trainName = train?.name || '000';
  if (trainName.includes('undefined')) trainName = '102А';

  const durationCalc =
    departure.duration || departure.to.datetime - departure.from.datetime;
  const returnDuration = arrival
    ? arrival.duration || arrival.to.datetime - arrival.from.datetime
    : 0;

  const togglePrice = (type) => {
    const item = priceData.find((i) => i.type === type);
    if (item && (item.topPrice || item.bottomPrice)) {
      setExpandedType(expandedType === type ? null : type);
    }
  };

  const handleSelect = () => {
    dispatch(
      setSelectedTrain({
        departure: departure,
        arrival: arrival || null,
      })
    );
    navigate(`/order/seats/${departure._id}`);
  };

  return (
    <div className={classNames(styles.card, { [styles.compact]: compact })}>
      <div className={styles.leftSection}>
        <div className={styles.trainIcon}>
          <img src={iconTrain} alt="train" />
        </div>
        <div className={styles.trainName}>{trainName}</div>

        <div className={styles.trainRoute}>
          <div className={styles.routeLine}>
            <span className={styles.city}>{from.city?.name}</span>
            <span className={styles.smallArrow}>→</span>
          </div>
          <div className={styles.routeLine}>
            <span className={styles.city}>{to.city?.name}</span>
          </div>
        </div>
      </div>

      <div
        className={styles.routeSection}
        style={{ justifyContent: arrival ? 'space-between' : 'center' }}
      >
        <div className={styles.routeRow}>
          <div className={styles.timeBlock}>
            <span className={styles.time}>{formatTime(from.datetime)}</span>
            <span className={styles.date}>{formatDate(from.datetime)}</span>
            <span className={styles.cityName}>{from.city?.name}</span>
            <span className={styles.station}>
              {from.railway_station_name} вокзал
            </span>
          </div>

          <div className={styles.durationBlock}>
            <span className={styles.durationTime}>
              {formatDurationColons(durationCalc)}
            </span>
            <ArrowRight />
          </div>

          <div className={`${styles.timeBlock} ${styles.alignRight}`}>
            <span className={styles.time}>{formatTime(to.datetime)}</span>
            <span className={styles.date}>{formatDate(to.datetime)}</span>
            <span className={styles.cityName}>{to.city?.name}</span>
            <span className={styles.station}>
              {to.railway_station_name} вокзал
            </span>
          </div>
        </div>

        {arrival && (
          <div
            className={styles.routeRow}
            style={{
              marginTop: '20px',
              paddingTop: '20px',
              borderTop: '1px solid #E5E5E5',
            }}
          >
            <div className={styles.timeBlock}>
              <span className={styles.time}>
                {formatTime(arrival.to.datetime)}
              </span>
              <span className={styles.date}>
                {formatDate(arrival.to.datetime)}
              </span>
              <span className={styles.cityName}>{arrival.to.city?.name}</span>
              <span className={styles.station}>
                {arrival.to.railway_station_name} вокзал
              </span>
            </div>
            <div className={styles.durationBlock}>
              <span className={styles.durationTime}>
                {formatDurationColons(returnDuration)}
              </span>
              <ArrowLeft />
            </div>
            <div className={`${styles.timeBlock} ${styles.alignRight}`}>
              <span className={styles.time}>
                {formatTime(arrival.from.datetime)}
              </span>
              <span className={styles.date}>
                {formatDate(arrival.from.datetime)}
              </span>
              <span className={styles.cityName}>
                {arrival.from.city?.name}
              </span>
              <span className={styles.station}>
                {arrival.from.railway_station_name} вокзал
              </span>
            </div>
          </div>
        )}
      </div>

      <div className={styles.rightSection}>
        <div className={styles.priceList}>
          {priceData.map((item) => (
            <div key={item.type} className={styles.priceItemWrapper}>
              <div
                className={styles.priceItemHeader}
                onClick={() => togglePrice(item.type)}
                style={{
                  cursor:
                    item.topPrice || item.bottomPrice ? 'pointer' : 'default',
                }}
              >
                <span className={styles.type}>{item.label}</span>
                <span className={styles.count}>{item.seats}</span>
                <div className={styles.priceBlock}>
                  <span className={styles.from}>от</span>
                  <span className={styles.cost}>
                    {formatPrice(item.minPrice)}
                  </span>
                  <span className={styles.rub}>₽</span>
                </div>
              </div>

              {expandedType === item.type &&
                (item.topPrice || item.bottomPrice) && (
                  <div className={styles.priceDropdown}>
                    {item.topPrice && (
                      <div className={styles.subPriceItem}>
                        <span className={styles.subType}>верхние</span>
                        <span className={styles.subCount}>
                          {Math.floor(item.seats / 2)}
                        </span>
                        <span className={styles.subCost}>
                          {formatPrice(item.topPrice)} ₽
                        </span>
                      </div>
                    )}
                    {item.bottomPrice && (
                      <div className={styles.subPriceItem}>
                        <span className={styles.subType}>нижние</span>
                        <span className={styles.subCount}>
                          {Math.ceil(item.seats / 2)}
                        </span>
                        <span className={styles.subCost}>
                          {formatPrice(item.bottomPrice)} ₽
                        </span>
                      </div>
                    )}
                  </div>
                )}
            </div>
          ))}
        </div>

        <div className={styles.facilities}>
          {have_wifi && (
            <img
              src={iconWifi}
              className={styles.icon}
              alt="wifi"
              title="Wi-Fi"
            />
          )}
          {is_express && (
            <img
              src={iconExpress}
              className={styles.icon}
              alt="express"
              title="Экспресс"
            />
          )}
          <img
            src={iconFood}
            className={styles.icon}
            alt="food"
            title="Питание"
          />
          {have_air_conditioning && (
            <img
              src={iconAc}
              className={styles.icon}
              alt="ac"
              title="Кондиционер"
            />
          )}
        </div>

        {!hideButton && (
          <button className={styles.button} onClick={handleSelect}>
            Выбрать места
          </button>
        )}
      </div>
    </div>
  );
}