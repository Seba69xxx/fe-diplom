import React, { useState, useRef, useEffect } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter, setSearchField } from '../../store/slices/searchSlice';
import { fetchRoutes } from '../../store/slices/trainsSlice';
import Datepicker from '../Datepicker/Datepicker';
import { formatPrice } from '../../utils/formatters';
import styles from './Sidebar.module.scss';

import iconKupe from '../../images/icon-kupe.png';
import iconPlackart from '../../images/icon-plackart.png';
import iconSitting from '../../images/icon-sitting.png';
import iconLux from '../../images/icon-lux.png';
import iconWifi from '../../images/icon-wifi.png';
import iconExpress from '../../images/icon-express.png';
import iconCalendar from '../../images/calendar.png';
import iconFood from '../../images/icon-food.png';

const RangeBlock = ({
  min,
  max,
  value,
  onChange,
  onAfterChange,
  formatVal = (val) => val,
}) => {
  return (
    <div className={styles.sliderContainer}>
      <div className={styles.sliderHeaderLabels}>
        <span>от</span>
        <span>до</span>
      </div>
      <Slider
        range
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        onAfterChange={onAfterChange}
        handleRender={(node, props) => {
          return React.cloneElement(
            node,
            { key: props.index },
            <div className={styles.handleLabel}>{formatVal(props.value)}</div>
          );
        }}
      />
    </div>
  );
};

export default function Sidebar() {
  const dispatch = useDispatch();
  const { filters, form } = useSelector((state) => state.search);

  const [showCalendarStart, setShowCalendarStart] = useState(false);
  const [showCalendarEnd, setShowCalendarEnd] = useState(false);
  const startRef = useRef(null);
  const endRef = useRef(null);

  const [isOpenTuda, setIsOpenTuda] = useState(false);
  const [isOpenObratno, setIsOpenObratno] = useState(false);

  const [priceRange, setPriceRange] = useState([
    filters.price_from || 0,
    filters.price_to || 7000,
  ]);
  const [depTimeFrom, setDepTimeFrom] = useState([0, 24]);
  const [arrTimeFrom, setArrTimeFrom] = useState([0, 24]);
  const [depTimeBack, setDepTimeBack] = useState([0, 24]);
  const [arrTimeBack, setArrTimeBack] = useState([0, 24]);

  useEffect(() => {
    const handleClick = (e) => {
      if (startRef.current && !startRef.current.contains(e.target))
        setShowCalendarStart(false);
      if (endRef.current && !endRef.current.contains(e.target))
        setShowCalendarEnd(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const updateFilter = (field, value) => {
    dispatch(setFilter({ field, value }));
    dispatch(fetchRoutes());
  };

  const updateDate = (field, value) => {
    dispatch(setSearchField({ field, value }));
    dispatch(fetchRoutes());
    if (field === 'date_start') setShowCalendarStart(false);
    if (field === 'date_end') setShowCalendarEnd(false);
  };

  const clearDate = (e, field) => {
    e.stopPropagation();
    updateDate(field, '');
  };

  const updateSliderRedux = (fieldFrom, fieldTo) => (val) => {
    dispatch(setFilter({ field: fieldFrom, value: val[0] }));
    updateFilter(fieldTo, val[1]);
  };

  const formatTime = (val) => (val === 24 ? '23:59' : `${val}:00`);
  const formatPriceVal = (val) => val;

  const lastTickets = [
    {
      id: 1,
      from: 'Санкт-Петербург',
      to: 'Самара',
      fromSt: 'Курский',
      toSt: 'Московский',
      price: 2500,
    },
    {
      id: 2,
      from: 'Москва',
      to: 'Казань',
      fromSt: 'Курский',
      toSt: 'Московский',
      price: 3500,
    },
    {
      id: 3,
      from: 'Казань',
      to: 'Нижний Новгород',
      fromSt: 'Московский',
      toSt: 'Нижний',
      price: 3800,
    },
  ];

  const toggles = [
    { id: 'have_second_class', label: 'Купе', icon: iconKupe },
    { id: 'have_third_class', label: 'Плацкарт', icon: iconPlackart },
    { id: 'have_fourth_class', label: 'Сидячий', icon: iconSitting },
    { id: 'have_first_class', label: 'Люкс', icon: iconLux },
    { id: 'have_wifi', label: 'Wi-Fi', icon: iconWifi },
    { id: 'have_express', label: 'Экспресс', icon: iconExpress },
  ];

  return (
    <div className={styles.sidebarWrapper}>
      <aside className={styles.sidebarDark}>
        <div className={styles.section}>
          <label className={styles.dateLabel}>Дата поездки</label>
          <div className={styles.dateWrapper} ref={startRef}>
            <input
              type="text"
              placeholder="ДД/ММ/ГГ"
              className={styles.dateInput}
              value={form.date_start}
              onClick={() => setShowCalendarStart(true)}
              readOnly
            />
            {form.date_start && (
              <span
                className={styles.clearIcon}
                onClick={(e) => clearDate(e, 'date_start')}
              >
                ×
              </span>
            )}
            <img
              src={iconCalendar}
              alt="cal"
              className={styles.icon}
              onClick={() => setShowCalendarStart(true)}
            />
            {showCalendarStart && (
              <Datepicker
                value={form.date_start}
                onChange={(val) => updateDate('date_start', val)}
                onClose={() => setShowCalendarStart(false)}
              />
            )}
          </div>

          <label className={styles.dateLabel}>Дата возвращения</label>
          <div className={styles.dateWrapper} ref={endRef}>
            <input
              type="text"
              placeholder="ДД/ММ/ГГ"
              className={styles.dateInput}
              value={form.date_end}
              onClick={() => setShowCalendarEnd(true)}
              readOnly
            />
            {form.date_end && (
              <span
                className={styles.clearIcon}
                onClick={(e) => clearDate(e, 'date_end')}
              >
                ×
              </span>
            )}
            <img
              src={iconCalendar}
              alt="cal"
              className={styles.icon}
              onClick={() => setShowCalendarEnd(true)}
            />
            {showCalendarEnd && (
              <Datepicker
                value={form.date_end}
                onChange={(val) => updateDate('date_end', val)}
                onClose={() => setShowCalendarEnd(false)}
              />
            )}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.toggleList}>
            {toggles.map((item) => (
              <div className={styles.toggleItem} key={item.id}>
                <div className={styles.toggleLabel}>
                  <img src={item.icon} alt="icon" /> {item.label}
                </div>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={filters[item.id]}
                    onChange={(e) => updateFilter(item.id, e.target.checked)}
                  />
                  <span className={styles.sliderSwitch}></span>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Стоимость</div>
          <RangeBlock
            min={0}
            max={7000}
            value={priceRange}
            onChange={setPriceRange}
            onAfterChange={updateSliderRedux('price_from', 'price_to')}
            formatVal={formatPriceVal}
          />
        </div>

        <div
          className={styles.section}
          style={{ borderBottom: isOpenTuda ? '1px solid #3E3E3E' : 'none' }}
        >
          <div className={styles.timeHeader}>
            <div className={styles.headerLeft}>
              <div className={`${styles.directionIcon} ${styles.right}`}></div>
              <span className={styles.accordionTitle}>Туда</span>
            </div>
            <div
              className={styles.toggleBtn}
              onClick={() => setIsOpenTuda(!isOpenTuda)}
            >
              {isOpenTuda ? '-' : '+'}
            </div>
          </div>
          {isOpenTuda && (
            <div className={styles.timeBlock}>
              <div className={styles.timeTitleLeft}>Время отбытия</div>
              <RangeBlock
                min={0}
                max={24}
                value={depTimeFrom}
                onChange={setDepTimeFrom}
                onAfterChange={updateSliderRedux(
                  'start_departure_hour_from',
                  'start_departure_hour_to'
                )}
                formatVal={formatTime}
              />
              <div style={{ height: '20px' }}></div>
              <div className={styles.timeTitleRight}>Время прибытия</div>
              <RangeBlock
                min={0}
                max={24}
                value={arrTimeFrom}
                onChange={setArrTimeFrom}
                onAfterChange={updateSliderRedux(
                  'start_arrival_hour_from',
                  'start_arrival_hour_to'
                )}
                formatVal={formatTime}
              />
            </div>
          )}
        </div>

        <div
          className={styles.section}
          style={{ paddingTop: isOpenTuda ? '30px' : '10px' }}
        >
          <div className={styles.timeHeader}>
            <div className={styles.headerLeft}>
              <div className={`${styles.directionIcon} ${styles.left}`}></div>
              <span className={styles.accordionTitle}>Обратно</span>
            </div>
            <div
              className={styles.toggleBtn}
              onClick={() => setIsOpenObratno(!isOpenObratno)}
            >
              {isOpenObratno ? '-' : '+'}
            </div>
          </div>
          {isOpenObratno && (
            <div className={styles.timeBlock}>
              <div className={styles.timeTitleLeft}>Время отбытия</div>
              <RangeBlock
                min={0}
                max={24}
                value={depTimeBack}
                onChange={setDepTimeBack}
                onAfterChange={updateSliderRedux(
                  'end_departure_hour_from',
                  'end_departure_hour_to'
                )}
                formatVal={formatTime}
              />
              <div style={{ height: '20px' }}></div>
              <div className={styles.timeTitleRight}>Время прибытия</div>
              <RangeBlock
                min={0}
                max={24}
                value={arrTimeBack}
                onChange={setArrTimeBack}
                onAfterChange={updateSliderRedux(
                  'end_arrival_hour_from',
                  'end_arrival_hour_to'
                )}
                formatVal={formatTime}
              />
            </div>
          )}
        </div>
      </aside>

      <div className={styles.lastTickets}>
        <div className={styles.lastTitle}>ПОСЛЕДНИЕ БИЛЕТЫ</div>
        {lastTickets.map((ticket) => (
          <div key={ticket.id} className={styles.ticketCard}>
            <div className={styles.ticketRow}>
              <div className={`${styles.ticketCity} ${styles.leftText}`}>
                {ticket.from}
              </div>
              <div className={`${styles.ticketCity} ${styles.rightText}`}>
                {ticket.to}
              </div>
            </div>
            <div className={styles.ticketRow}>
              <div className={`${styles.ticketStation} ${styles.leftText}`}>
                {ticket.fromSt} <br /> вокзал
              </div>
              <div className={`${styles.ticketStation} ${styles.rightText}`}>
                {ticket.toSt} <br /> вокзал
              </div>
            </div>
            <div className={styles.ticketRow} style={{ marginTop: '15px' }}>
              <div className={styles.ticketIcons}>
                <img src={iconWifi} alt="wifi" />
                <img src={iconExpress} alt="express" />
                <img src={iconFood} alt="food" />
              </div>
              <div className={styles.ticketPrice}>
                <span>от</span>
                {formatPrice(ticket.price)}{' '}
                <span style={{ fontSize: '28px' }}>₽</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}