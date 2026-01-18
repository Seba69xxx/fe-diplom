import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { formatPrice } from '../../utils/formatters';
import styles from './TripDetails.module.scss';
import iconPassenger from '../../images/icon-passenger.png';

const formatTime = (ts) => {
  if (!ts) return '00:00';
  const date = new Date(ts * 1000);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatDate = (ts) => {
  if (!ts) return '';
  const date = new Date(ts * 1000);
  return date.toLocaleDateString();
};

const formatDuration = (seconds) => {
  if (!seconds) return '';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h} : ${m < 10 ? '0' + m : m}`;
};

export default function TripDetails() {
  const {
    selectedTrain,
    selectedSeatsDeparture,
    selectedSeatsArrival,
    passengerCount,
  } = useSelector((state) => state.order);

  const [isDepOpen, setIsDepOpen] = useState(true);
  const [isArrOpen, setIsArrOpen] = useState(true);
  const [isPassOpen, setIsPassOpen] = useState(true);

  const depTrain = selectedTrain.departure;
  const arrTrain = selectedTrain.arrival;

  const getTrainName = (train) => {
    let name = train?.name || 'Поезд';
    if (typeof name === 'string' && name.includes('undefined')) {
      return '116С';
    }
    return name;
  };

  const calculateTotal = () => {
    let total = 0;
    selectedSeatsDeparture.forEach((s) => (total += s.price));
    selectedSeatsArrival.forEach((s) => (total += s.price));
    return total;
  };
  const totalPrice = calculateTotal();

  const calculatePriceByDirection = (seats, adultsCount, childrenCount) => {
    const sortedSeats = [...seats].sort((a, b) => b.price - a.price);
    let adultSum = 0;
    let childSum = 0;
    sortedSeats.forEach((seat, index) => {
      if (index < adultsCount) adultSum += seat.price;
      else if (index < adultsCount + childrenCount)
        childSum += seat.price * 0.5;
    });
    return { adultSum, childSum };
  };

  const depPrices = calculatePriceByDirection(
    selectedSeatsDeparture,
    passengerCount.adults,
    passengerCount.children
  );
  const arrPrices = calculatePriceByDirection(
    selectedSeatsArrival,
    passengerCount.adults,
    passengerCount.children
  );

  const totalAdultPrice = depPrices.adultSum + arrPrices.adultSum;
  const totalChildPrice = depPrices.childSum + arrPrices.childSum;
  const finalTotal = totalAdultPrice + totalChildPrice;
  const totalChildCount =
    passengerCount.children + passengerCount.childrenNoSeat;

  return (
    <div className={styles.detailsWrapper}>
      <div className={styles.headerTitle}>ДЕТАЛИ ПОЕЗДКИ</div>

      {depTrain && (
        <div className={styles.section}>
          <div
            className={styles.sectionHeader}
            onClick={() => setIsDepOpen(!isDepOpen)}
          >
            <div className={styles.headerLeft}>
              <div className={styles.iconBox}>
                <span
                  className={classNames(styles.arrowIcon, styles.arrowRight)}
                ></span>
              </div>
              <span className={styles.directionTitle}>Туда</span>
              <span className={styles.headerDate}>
                {formatDate(depTrain.from.datetime)}
              </span>
            </div>
            <div className={styles.toggleBtn}>{isDepOpen ? '-' : '+'}</div>
          </div>

          {isDepOpen && (
            <div className={styles.content}>
              <div className={styles.infoRow}>
                <span className={styles.labelGrey}>№ Поезда</span>
                <span className={styles.valueWhite}>
                  {getTrainName(depTrain.train)}
                </span>
              </div>

              <div className={styles.infoRow}>
                <span className={styles.labelGrey}>Название</span>
                <div className={styles.routeNames}>
                  <span>{depTrain.from.city.name}</span>
                  <span>{depTrain.to.city.name}</span>
                </div>
              </div>

              <div className={styles.timeGrid}>
                <div className={styles.colLeft}>
                  <div className={styles.timeBig}>
                    {formatTime(depTrain.from.datetime)}
                  </div>
                  <div className={styles.dateSmall}>
                    {formatDate(depTrain.from.datetime)}
                  </div>
                  <div className={styles.cityWhite}>
                    {depTrain.from.city.name}
                  </div>
                  <div className={styles.stationGrey}>
                    {depTrain.from.railway_station_name} <br /> вокзал
                  </div>
                </div>

                <div className={styles.colCenter}>
                  <div className={styles.durationText}>
                    {formatDuration(depTrain.duration)}
                  </div>
                  <div className={styles.arrowOrangeRight}></div>
                </div>

                <div className={styles.colRight}>
                  <div className={styles.timeBig}>
                    {formatTime(depTrain.to.datetime)}
                  </div>
                  <div className={styles.dateSmall}>
                    {formatDate(depTrain.to.datetime)}
                  </div>
                  <div className={styles.cityWhite}>
                    {depTrain.to.city.name}
                  </div>
                  <div className={styles.stationGrey}>
                    {depTrain.to.railway_station_name} <br /> вокзал
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {arrTrain && (
        <div className={styles.section}>
          <div
            className={styles.sectionHeader}
            onClick={() => setIsArrOpen(!isArrOpen)}
          >
            <div className={styles.headerLeft}>
              <div className={styles.iconBox}>
                <span
                  className={classNames(styles.arrowIcon, styles.arrowLeft)}
                ></span>
              </div>
              <span className={styles.directionTitle}>Обратно</span>
              <span className={styles.headerDate}>
                {formatDate(arrTrain.from.datetime)}
              </span>
            </div>
            <div className={styles.toggleBtn}>{isArrOpen ? '-' : '+'}</div>
          </div>

          {isArrOpen && (
            <div className={styles.content}>
              <div className={styles.infoRow}>
                <span className={styles.labelGrey}>№ Поезда</span>
                <span className={styles.valueWhite}>
                  {getTrainName(arrTrain.train)}
                </span>
              </div>

              <div className={styles.infoRow}>
                <span className={styles.labelGrey}>Название</span>
                <div className={styles.routeNames}>
                  <span>{arrTrain.from.city.name}</span>
                  <span>{arrTrain.to.city.name}</span>
                </div>
              </div>

              <div className={styles.timeGrid}>
                <div className={styles.colLeft}>
                  <div className={styles.timeBig}>
                    {formatTime(arrTrain.to.datetime)}
                  </div>
                  <div className={styles.dateSmall}>
                    {formatDate(arrTrain.to.datetime)}
                  </div>
                  <div className={styles.cityWhite}>
                    {arrTrain.to.city.name}
                  </div>
                  <div className={styles.stationGrey}>
                    {arrTrain.to.railway_station_name} <br /> вокзал
                  </div>
                </div>

                <div className={styles.colCenter}>
                  <div className={styles.durationText}>
                    {formatDuration(arrTrain.duration)}
                  </div>
                  <div className={styles.arrowOrangeLeft}></div>
                </div>

                <div className={styles.colRight}>
                  <div className={styles.timeBig}>
                    {formatTime(arrTrain.from.datetime)}
                  </div>
                  <div className={styles.dateSmall}>
                    {formatDate(arrTrain.from.datetime)}
                  </div>
                  <div className={styles.cityWhite}>
                    {arrTrain.from.city.name}
                  </div>
                  <div className={styles.stationGrey}>
                    {arrTrain.from.railway_station_name} <br /> вокзал
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className={styles.section}>
        <div
          className={styles.sectionHeader}
          onClick={() => setIsPassOpen(!isPassOpen)}
        >
          <div className={styles.headerLeft}>
            <div className={styles.passengerIconWrapper}>
              <img
                src={iconPassenger}
                alt="passenger"
                className={styles.iconPersonImg}
              />
            </div>
            <span className={styles.directionTitle}>Пассажиры</span>
          </div>
          <div className={styles.toggleBtn}>{isPassOpen ? '-' : '+'}</div>
        </div>

        {isPassOpen && (
          <div className={styles.content}>
            <div className={styles.passRow}>
              <span className={styles.passLabel}>
                {passengerCount.adults} Взрослых
              </span>
              <div className={styles.passPrice}>
                {formatPrice(totalAdultPrice)}{' '}
                <span className={styles.rubIcon}>₽</span>
              </div>
            </div>
            {totalChildCount > 0 && (
              <div className={styles.passRow}>
                <span className={styles.passLabel}>
                  {totalChildCount} Ребенок
                </span>
                <div className={styles.passPrice}>
                  {formatPrice(totalChildPrice)}{' '}
                  <span className={styles.rubIcon}>₽</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className={styles.totalSection}>
        <div className={styles.totalLabel}>ИТОГ</div>
        <div className={styles.totalPrice}>
          {formatPrice(finalTotal)} <span className={styles.rubIconBig}>₽</span>
        </div>
      </div>
    </div>
  );
}