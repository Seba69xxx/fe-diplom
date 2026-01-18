import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { setFilterType } from '../../store/slices/orderSlice';
import styles from './CoachFilters.module.scss';

export default function CoachFilters() {
  const dispatch = useDispatch();
  const { seatsData, filterType } = useSelector((state) => state.order);

  const availableTypes = {
    fourth: seatsData.some((item) => item.coach.class_type === 'fourth'),
    third: seatsData.some((item) => item.coach.class_type === 'third'),
    second: seatsData.some((item) => item.coach.class_type === 'second'),
    first: seatsData.some((item) => item.coach.class_type === 'first'),
  };

  const handleSelect = (type) => {
    dispatch(setFilterType(type));
  };

  return (
    <div className={styles.filters}>
      {availableTypes.fourth && (
        <div
          className={classNames(styles.filterItem, {
            [styles.active]: filterType === 'fourth',
          })}
          onClick={() => handleSelect('fourth')}
        >
          <span className={styles.icon}>🪑</span>
          <span className={styles.title}>Сидячий</span>
        </div>
      )}
      {availableTypes.third && (
        <div
          className={classNames(styles.filterItem, {
            [styles.active]: filterType === 'third',
          })}
          onClick={() => handleSelect('third')}
        >
          <span className={styles.icon}>🚃</span>
          <span className={styles.title}>Плацкарт</span>
        </div>
      )}
      {availableTypes.second && (
        <div
          className={classNames(styles.filterItem, {
            [styles.active]: filterType === 'second',
          })}
          onClick={() => handleSelect('second')}
        >
          <span className={styles.icon}>🚪</span>
          <span className={styles.title}>Купе</span>
        </div>
      )}
      {availableTypes.first && (
        <div
          className={classNames(styles.filterItem, {
            [styles.active]: filterType === 'first',
          })}
          onClick={() => handleSelect('first')}
        >
          <span className={styles.icon}>💎</span>
          <span className={styles.title}>Люкс</span>
        </div>
      )}
    </div>
  );
}