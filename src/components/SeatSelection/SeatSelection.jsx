import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import {
  fetchSeats,
  fetchSeatsArrival,
  setPassengerCount,
  toggleSeat,
  clearSectionSeats,
  setSelectedTrain,
} from '../../store/slices/orderSlice';
import Coach from '../Coach/Coach';
import { formatTime } from '../../utils/formatters';
import styles from './SeatSelection.module.scss';

import iconTrain from '../../images/icon-train.png';
import iconClock from '../../images/clock.png';
import iconSitting from '../../images/icon-sitting.png';
import iconPlackart from '../../images/icon-plackart.png';
import iconKupe from '../../images/icon-kupe.png';
import iconLux from '../../images/icon-lux.png';

const ArrowRightSvg = ({ color = 'black' }) => (
  <svg
    width="30"
    height="30"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5 12H19M19 12L12 5M19 12L12 19"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const formatDate = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('ru-RU');
};

const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export default function SeatSelection() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const routeData = useSelector((state) =>
    state.trains.routes.find((r) => r.departure._id === id)
  );

  const {
    seatsData,
    seatsDataArrival,
    passengerCount,
    selectedSeatsDeparture,
    selectedSeatsArrival,
    selectedTrain,
  } = useSelector((state) => state.order);

  useEffect(() => {
    if (routeData && !selectedTrain.departure) {
      dispatch(
        setSelectedTrain({
          departure: routeData.departure,
          arrival: routeData.arrival || null,
        })
      );
    }
  }, [routeData, selectedTrain, dispatch]);

  const [typeDep, setTypeDep] = useState(null);
  const [coachIdDep, setCoachIdDep] = useState(null);

  const [typeArr, setTypeArr] = useState(null);
  const [coachIdArr, setCoachIdArr] = useState(null);

  useEffect(() => {
    if (id) dispatch(fetchSeats(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (routeData?.arrival?._id) {
      dispatch(fetchSeatsArrival(routeData.arrival._id));
    }
  }, [dispatch, routeData]);

  useEffect(() => {
    if (seatsData.length > 0) {
      const availableTypes = [
        ...new Set(seatsData.map((item) => item.coach.class_type)),
      ];
      if (availableTypes.length > 0) {
        if (!typeDep || !availableTypes.includes(typeDep)) {
          setTypeDep(availableTypes[0]);
        }
      }
    }
  }, [seatsData, typeDep]);

  useEffect(() => {
    if (seatsDataArrival.length > 0) {
      const availableTypes = [
        ...new Set(seatsDataArrival.map((item) => item.coach.class_type)),
      ];
      if (availableTypes.length > 0) {
        if (!typeArr || !availableTypes.includes(typeArr)) {
          setTypeArr(availableTypes[0]);
        }
      }
    }
  }, [seatsDataArrival, typeArr]);

  const handleTypeChange = (direction, newType) => {
    dispatch(clearSectionSeats({ direction }));
    if (direction === 'departure') {
      setTypeDep(newType);
      setCoachIdDep(null);
    } else {
      setTypeArr(newType);
      setCoachIdArr(null);
    }
  };

  const coachesDep = useMemo(
    () => seatsData.filter((c) => c.coach.class_type === typeDep),
    [seatsData, typeDep]
  );

  useEffect(() => {
    if (coachesDep.length > 0) {
      if (!coachesDep.find((c) => c.coach._id === coachIdDep)) {
        setCoachIdDep(coachesDep[0].coach._id);
      }
    }
  }, [coachesDep, coachIdDep]);

  const coachesArr = useMemo(
    () => seatsDataArrival.filter((c) => c.coach.class_type === typeArr),
    [seatsDataArrival, typeArr]
  );

  useEffect(() => {
    if (coachesArr.length > 0) {
      if (!coachesArr.find((c) => c.coach._id === coachIdArr)) {
        setCoachIdArr(coachesArr[0].coach._id);
      }
    }
  }, [coachesArr, coachIdArr]);

  const handleBack = () => navigate('/order');
  const handleNext = () => navigate('/order/passengers');

  const isRoundTrip = !!routeData?.arrival;
  const validDeparture = selectedSeatsDeparture.length > 0;
  const validArrival = selectedSeatsArrival.length > 0;
  const canProceed =
    (validDeparture || validArrival) &&
    passengerCount.adults + passengerCount.children > 0;

  const updatePassengers = (type, val) => {
    const num = parseInt(val, 10);
    if (isNaN(num) || num < 0) return;
    const currentTotal =
      passengerCount.adults +
      passengerCount.children +
      passengerCount.childrenNoSeat;
    const oldValue = passengerCount[type];
    const newTotal = currentTotal - oldValue + num;
    if (newTotal <= 5) {
      dispatch(setPassengerCount({ type, count: num }));
    }
  };

  const renderTrainBlock = (
    direction,
    routeObj,
    currentType,
    currentCoachId,
    setCoachId,
    availableCoaches,
    selectedSeats,
    allSeatsSource
  ) => {
    if (!routeObj) return null;

    const activeCoachData = availableCoaches.find(
      (c) => c.coach._id === currentCoachId
    );
    const hours = Math.floor(routeObj.duration / 3600);
    const minutes = Math.floor((routeObj.duration % 3600) / 60);

    let trainName = 'Поезд';
    if (routeObj.train && routeObj.train.name) trainName = routeObj.train.name;
    if (typeof trainName === 'string' && trainName.includes('undefined')) {
      trainName = trainName.replace('undefined', '').trim();
      if (trainName.endsWith('-')) trainName = trainName.slice(0, -1).trim();
    }

    const handleSeatClick = (seat) => {
      const totalPass = passengerCount.adults + passengerCount.children;
      if (totalPass === 0) {
        alert('Сначала выберите количество пассажиров (с местом)!');
        return;
      }
      dispatch(
        toggleSeat({
          direction,
          seat: {
            coach_id: currentCoachId,
            seat_number: seat.index,
            price: seat.price,
            type: 'adult',
          },
        })
      );
    };

    const availableTypesSet = new Set(
      allSeatsSource.map((s) => s.coach.class_type)
    );
    const allTypes = [
      { id: 'fourth', label: 'Сидячий', icon: iconSitting },
      { id: 'third', label: 'Плацкарт', icon: iconPlackart },
      { id: 'second', label: 'Купе', icon: iconKupe },
      { id: 'first', label: 'Люкс', icon: iconLux },
    ];
    const visibleTypes = allTypes.filter((t) => availableTypesSet.has(t.id));

    return (
      <div className={styles.trainBlock}>
        <div className={styles.routeBar}>
          <div className={styles.trainInfo}>
            <div className={styles.iconTrain}>
              <img src={iconTrain} alt="" />
            </div>
            <div className={styles.trainText}>
              <div className={styles.number}>{trainName}</div>
              <div className={styles.cities}>
                {capitalize(routeObj.from.city.name)} &#8594; <br />
                {capitalize(routeObj.to.city.name)}
              </div>
            </div>
          </div>
          <div className={styles.routeTimes}>
            <div className={styles.timeItem}>
              <div className={styles.time}>
                {formatTime(routeObj.from.datetime)}
              </div>
              <div className={styles.date}>
                {formatDate(routeObj.from.datetime)}
              </div>
              <div className={styles.city}>
                {capitalize(routeObj.from.city.name)}
              </div>
              <div className={styles.station}>
                {routeObj.from.railway_station_name} вокзал
              </div>
            </div>
            <div className={styles.arrowCenter}>
              <ArrowRightSvg color="#FFA800" />
            </div>
            <div className={styles.timeItem}>
              <div className={styles.time}>
                {formatTime(routeObj.to.datetime)}
              </div>
              <div className={styles.date}>
                {formatDate(routeObj.to.datetime)}
              </div>
              <div className={styles.city}>
                {capitalize(routeObj.to.city.name)}
              </div>
              <div className={styles.station}>
                {routeObj.to.railway_station_name} вокзал
              </div>
            </div>
          </div>
          <div className={styles.duration}>
            <img src={iconClock} alt="time" className={styles.clockIcon} />
            <div className={styles.durationText}>
              <span>{hours} часов</span>
              <span>{minutes} минут</span>
            </div>
          </div>
        </div>

        <div className={styles.passengersSection}>
          <div className={styles.sectionTitle}>Количество билетов</div>
          <div className={styles.inputsRow}>
            <div className={styles.inputGroup}>
              <div className={styles.inputBox}>
                <span>Взрослых</span> —
                <input
                  type="number"
                  value={passengerCount.adults}
                  onChange={(e) => updatePassengers('adults', e.target.value)}
                />
              </div>
              <div className={styles.subText}>
                Можно добавить еще{' '}
                {5 -
                  (passengerCount.adults +
                    passengerCount.children +
                    passengerCount.childrenNoSeat)}{' '}
                пассажиров
              </div>
            </div>
            <div className={styles.inputGroup}>
              <div className={styles.inputBox}>
                <span>Детских</span> —
                <input
                  type="number"
                  value={passengerCount.children}
                  onChange={(e) => updatePassengers('children', e.target.value)}
                />
              </div>
              <div className={styles.subText}>
                Детский билет дешевле взрослого на 50%, без места - бесплатно
              </div>
            </div>
            <div className={styles.inputGroup}>
              <div className={styles.inputBox}>
                <span style={{ fontSize: '16px' }}>Детских «без места»</span> —
                <input
                  type="number"
                  value={passengerCount.childrenNoSeat}
                  onChange={(e) =>
                    updatePassengers('childrenNoSeat', e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.typeSection}>
          <div className={styles.sectionTitle}>Тип вагона</div>
          <div className={styles.typeIcons}>
            {visibleTypes.length > 0 ? (
              visibleTypes.map((t) => (
                <div
                  key={t.id}
                  className={classNames(styles.typeItem, {
                    [styles.active]: currentType === t.id,
                  })}
                  onClick={() => handleTypeChange(direction, t.id)}
                >
                  <div className={styles.iconWrap}>
                    <img src={t.icon} alt={t.label} />
                  </div>
                  <span>{t.label}</span>
                </div>
              ))
            ) : (
              <div style={{ padding: '20px', color: '#928F94' }}>
                Нет доступных типов вагонов
              </div>
            )}
          </div>
        </div>

        {availableCoaches.length > 0 && activeCoachData ? (
          <div className={styles.coachWrapper}>
            <div className={styles.coachNumbers}>
              <span className={styles.label}>Вагоны</span>
              {availableCoaches.map((c) => (
                <span
                  key={c.coach._id}
                  className={classNames(styles.num, {
                    [styles.active]: c.coach._id === currentCoachId,
                  })}
                  onClick={() => setCoachId(c.coach._id)}
                >
                  {c.coach.name.replace(/\D/g, '')}
                </span>
              ))}
              <span className={styles.note}>
                Нумерация вагонов начинается с головы поезда
              </span>
            </div>

            <Coach
              data={activeCoachData}
              allCoaches={availableCoaches}
              selectedSeats={selectedSeats}
              onSeatClick={handleSeatClick}
            />
          </div>
        ) : (
          <div className={styles.noData}>Вагоны не найдены</div>
        )}
      </div>
    );
  };

  if (!routeData) {
    return (
      <div className={styles.page}>
        <h1 className={styles.mainTitle}>ВЫБОР МЕСТА</h1>
        <div style={{ padding: '20px' }}>Загрузка данных...</div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.mainTitle}>ВЫБОР МЕСТА</h1>
      <div className={styles.topButtons}>
        <button className={styles.backArrow} onClick={handleBack}>
          <ArrowRightSvg color="white" />
        </button>
        <button className={styles.btnWhite} onClick={handleBack}>
          Выбрать другой поезд
        </button>
      </div>

      {renderTrainBlock(
        'departure',
        routeData.departure,
        typeDep,
        coachIdDep,
        setCoachIdDep,
        coachesDep,
        selectedSeatsDeparture,
        seatsData
      )}

      {isRoundTrip && routeData.arrival && (
        <div style={{ marginTop: '50px' }}>
          {renderTrainBlock(
            'arrival',
            routeData.arrival,
            typeArr,
            coachIdArr,
            setCoachIdArr,
            coachesArr,
            selectedSeatsArrival,
            seatsDataArrival
          )}
        </div>
      )}

      <div className={styles.footer}>
        <button
          className={styles.nextBtn}
          disabled={!canProceed}
          onClick={handleNext}
        >
          ДАЛЕЕ
        </button>
      </div>
    </div>
  );
}