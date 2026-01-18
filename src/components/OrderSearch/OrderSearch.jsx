import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCities, setSearchField } from '../../store/slices/searchSlice';
import { fetchRoutes, setOffset } from '../../store/slices/trainsSlice';
import Datepicker from '../Datepicker/Datepicker';
import styles from './OrderSearch.module.scss';

import iconLocation from '../../images/location.png';
import iconRefresh from '../../images/refresh.png';
import iconCalendar from '../../images/calendar.png';

export default function OrderSearch() {
  const dispatch = useDispatch();
  const { form, cities } = useSelector((state) => state.search);

  const [showFromList, setShowFromList] = useState(false);
  const [showToList, setShowToList] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarField, setCalendarField] = useState(null);
  const formRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setShowFromList(false);
        setShowToList(false);
        setShowCalendar(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const capitalize = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';

  const getFilteredCities = (query) => {
    if (!cities || !Array.isArray(cities)) return [];
    let result = [...cities];
    if (query) {
      result = result.filter((city) =>
        city.name.toLowerCase().startsWith(query.toLowerCase())
      );
    }
    return result.sort((a, b) => a.name.localeCompare(b.name));
  };

  const handleCityChange = (e, field) => {
    const value = e.target.value;
    dispatch(setSearchField({ field: `${field}_name`, value }));
    dispatch(setSearchField({ field: `${field}_id`, value: '' }));
    if (value.trim()) dispatch(fetchCities(value));
  };

  const handleSelectCity = (city, field) => {
    dispatch(
      setSearchField({ field: `${field}_name`, value: capitalize(city.name) })
    );
    dispatch(setSearchField({ field: `${field}_id`, value: city._id }));
    setShowFromList(false);
    setShowToList(false);
  };

  const clearDate = (e, field) => {
    e.stopPropagation();
    dispatch(setSearchField({ field: field, value: '' }));
  };

  const handleSwap = () => {
    const fromName = form.from_city_name;
    const fromId = form.from_city_id;
    dispatch(
      setSearchField({ field: 'from_city_name', value: form.to_city_name })
    );
    dispatch(setSearchField({ field: 'from_city_id', value: form.to_city_id }));
    dispatch(setSearchField({ field: 'to_city_name', value: fromName }));
    dispatch(setSearchField({ field: 'to_city_id', value: fromId }));
  };

  const openCalendar = (field) => {
    setCalendarField(field);
    setShowCalendar(true);
    setShowFromList(false);
    setShowToList(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(setOffset(0));
    dispatch(fetchRoutes());
  };

  return (
    <form
      className={styles.searchWrapper}
      onSubmit={handleSubmit}
      ref={formRef}
    >
      <div className={styles.gridRow}>
        <div>
          <label className={styles.label}>Направление</label>
          <div className={styles.inputWrapper}>
            <input
              placeholder="Откуда"
              className={styles.input}
              value={form.from_city_name}
              onChange={(e) => handleCityChange(e, 'from_city')}
              onFocus={() => setShowFromList(true)}
            />
            <img src={iconLocation} alt="loc" className={styles.icon} />
            {showFromList && (
              <ul className={styles.dropdown}>
                {getFilteredCities(form.from_city_name).length > 0 ? (
                  getFilteredCities(form.from_city_name).map((city) => (
                    <li
                      key={city._id}
                      onClick={() => handleSelectCity(city, 'from_city')}
                    >
                      {capitalize(city.name)}
                    </li>
                  ))
                ) : (
                  <li style={{ color: '#999', padding: '10px' }}>Не найдено</li>
                )}
              </ul>
            )}
          </div>
        </div>

        <div className={styles.swapButton} onClick={handleSwap}>
          <img src={iconRefresh} alt="swap" />
        </div>

        <div>
          <label className={styles.label}>&nbsp;</label>
          <div className={styles.inputWrapper}>
            <input
              placeholder="Куда"
              className={styles.input}
              value={form.to_city_name}
              onChange={(e) => handleCityChange(e, 'to_city')}
              onFocus={() => setShowToList(true)}
            />
            <img src={iconLocation} alt="loc" className={styles.icon} />
            {showToList && (
              <ul className={styles.dropdown}>
                {getFilteredCities(form.to_city_name).length > 0 ? (
                  getFilteredCities(form.to_city_name).map((city) => (
                    <li
                      key={city._id}
                      onClick={() => handleSelectCity(city, 'to_city')}
                    >
                      {capitalize(city.name)}
                    </li>
                  ))
                ) : (
                  <li style={{ color: '#999', padding: '10px' }}>Не найдено</li>
                )}
              </ul>
            )}
          </div>
        </div>

        <div>
          <label className={styles.label}>Дата</label>
          <div className={styles.inputWrapper}>
            <input
              placeholder="ДД/ММ/ГГ"
              className={styles.input}
              value={form.date_start}
              onClick={() => openCalendar('date_start')}
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
              onClick={() => openCalendar('date_start')}
            />

            {showCalendar && calendarField === 'date_start' && (
              <Datepicker
                value={form.date_start}
                onClose={() => setShowCalendar(false)}
                onChange={(val) => {
                  dispatch(setSearchField({ field: 'date_start', value: val }));
                  setShowCalendar(false);
                }}
              />
            )}
          </div>
        </div>

        <div>
          <label className={styles.label}>&nbsp;</label>
          <div className={styles.inputWrapper}>
            <input
              placeholder="ДД/ММ/ГГ"
              className={styles.input}
              value={form.date_end}
              onClick={() => openCalendar('date_end')}
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
              onClick={() => openCalendar('date_end')}
            />

            {showCalendar && calendarField === 'date_end' && (
              <Datepicker
                value={form.date_end}
                onClose={() => setShowCalendar(false)}
                onChange={(val) => {
                  dispatch(setSearchField({ field: 'date_end', value: val }));
                  setShowCalendar(false);
                }}
              />
            )}
          </div>
        </div>
      </div>

      <div className={styles.gridRow} style={{ marginTop: '20px' }}>
        <button type="submit" className={styles.submitButton}>
          НАЙТИ БИЛЕТЫ
        </button>
      </div>
    </form>
  );
}