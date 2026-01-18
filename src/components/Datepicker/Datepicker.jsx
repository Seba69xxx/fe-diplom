import React, { useEffect, useRef, useState } from 'react';
import styles from './Datepicker.module.scss';

const monthNames = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
];

export default function Datepicker({ value, onChange, onClose }) {
  const containerRef = useRef(null);

  const getInitialDate = () => {
    if (value) {
      const [day, month, year] = value.split('.');
      return new Date(year, month - 1, day);
    }
    return new Date();
  };

  const [currentDate, setCurrentDate] = useState(getInitialDate());

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        if (onClose) onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const startDayIndex = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDateClick = (day) => {
    const d = String(day).padStart(2, '0');
    const m = String(month + 1).padStart(2, '0');
    const y = year;
    onChange(`${d}.${m}.${y}`);
    if (onClose) onClose();
  };

  const isSelected = (day) => {
    if (!value) return false;
    const [vDay, vMonth, vYear] = value.split('.');
    return (
      parseInt(vDay) === day &&
      parseInt(vMonth) === month + 1 &&
      parseInt(vYear) === year
    );
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const renderDays = () => {
    const days = [];

    for (let i = 0; i < startDayIndex; i++) {
      days.push(<div key={`empty-${i}`} className={styles.emptyDay}></div>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const classes = [styles.day];
      if (isSelected(i)) classes.push(styles.selected);
      if (isToday(i)) classes.push(styles.today);

      days.push(
        <div
          key={i}
          className={classes.join(' ')}
          onClick={() => handleDateClick(i)}
        >
          {i}
        </div>
      );
    }
    return days;
  };

  return (
    <div className={styles.datepicker} ref={containerRef}>
      <div className={styles.header}>
        <div className={styles.navButton} onClick={handlePrevMonth}>
          &lt;
        </div>
        <div className={styles.title}>
          {monthNames[month]} {year}
        </div>
        <div className={styles.navButton} onClick={handleNextMonth}>
          &gt;
        </div>
      </div>

      <div className={styles.weekDays}>
        <span>Пн</span>
        <span>Вт</span>
        <span>Ср</span>
        <span>Чт</span>
        <span>Пт</span>
        <span>Сб</span>
        <span>Вс</span>
      </div>

      <div className={styles.daysGrid}>{renderDays()}</div>
    </div>
  );
}