import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import {
  fetchRoutes,
  setSortBy,
  setLimit,
  setOffset,
} from '../../store/slices/trainsSlice';
import TrainCard from '../TrainCard/TrainCard';
import styles from './TrainList.module.scss';

export default function TrainList() {
  const dispatch = useDispatch();

  const {
    routes,
    total_count,
    loading,
    error,
    sortBy,
    limit,
    offset,
  } = useSelector((state) => state.trains);

  const [localSortLabel, setLocalSortLabel] = useState('времени');
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef(null);

  const sortOptions = [
    { value: 'date', label: 'времени' },
    { value: 'price', label: 'стоимости' },
    { value: 'duration', label: 'длительности' },
  ];

  useEffect(() => {
    const found = sortOptions.find((o) => o.value === sortBy);
    if (found) setLocalSortLabel(found.label);
  }, [sortBy]);

  useEffect(() => {
    const handleClick = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSortChange = (value, label) => {
    setLocalSortLabel(label);
    dispatch(setSortBy(value));
    dispatch(fetchRoutes());
    setSortOpen(false);
  };

  const handleLimitChange = (value) => {
    dispatch(setLimit(value));
    dispatch(fetchRoutes());
  };

  const handlePageChange = (page) => {
    const newOffset = (page - 1) * (limit || 5);
    dispatch(setOffset(newOffset));
    dispatch(fetchRoutes());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const limitValue = limit || 5;
  const countValue = total_count || 0;
  const totalPages = Math.ceil(countValue / limitValue);
  const activePage = Math.floor((offset || 0) / limitValue) + 1;

  if (loading) {
    return (
      <div
        style={{
          textAlign: 'center',
          marginTop: '50px',
          fontSize: '24px',
        }}
      >
        Идет поиск...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          textAlign: 'center',
          color: 'red',
          marginTop: '50px',
          fontSize: '24px',
        }}
      >
        Ошибка: {error}
      </div>
    );
  }

  return (
    <div className={styles.trainListContainer}>
      <div className={styles.sortPanel}>
        <div className={styles.foundCount}>найдено {countValue}</div>

        <div className={styles.sortControls}>
          <div className={styles.sortGroup} ref={sortRef}>
            <span>сортировать по:</span>
            <div
              className={styles.dropdownWrapper}
              onClick={() => setSortOpen(!sortOpen)}
            >
              <span className={styles.currentSort}>{localSortLabel}</span>
              {sortOpen && (
                <ul className={styles.sortDropdown}>
                  {sortOptions.map((opt) => (
                    <li
                      key={opt.value}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSortChange(opt.value, opt.label);
                      }}
                    >
                      {opt.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className={styles.limitGroup}>
            <span>показывать по:</span>
            {[5, 10, 20].map((val) => (
              <div
                key={val}
                className={classNames(styles.limitOption, {
                  [styles.active]: limitValue === val,
                })}
                onClick={() => handleLimitChange(val)}
              >
                {val}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.cardsList}>
        {routes && routes.length > 0 ? (
          routes.map((item) => (
            <TrainCard key={item.departure._id} data={item} />
          ))
        ) : (
          <div className={styles.noTrains}>
            Поездов по вашему запросу не найдено.
          </div>
        )}
      </div>

      {totalPages > 0 && (
        <div className={styles.pagination}>
          <div
            className={classNames(styles.arrowPage, styles.prev, {
              [styles.disabled]: activePage === 1,
            })}
            onClick={() => activePage > 1 && handlePageChange(activePage - 1)}
          />

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
            if (
              page === 1 ||
              page === totalPages ||
              (page >= activePage - 1 && page <= activePage + 1)
            ) {
              return (
                <div
                  key={page}
                  className={classNames(styles.pageItem, {
                    [styles.active]: activePage === page,
                  })}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </div>
              );
            } else if (page === activePage - 2 || page === activePage + 2) {
              return (
                <div key={page} className={styles.dots}>
                  ...
                </div>
              );
            }
            return null;
          })}

          <div
            className={classNames(styles.arrowPage, styles.next, {
              [styles.disabled]: activePage === totalPages,
            })}
            onClick={() =>
              activePage < totalPages && handlePageChange(activePage + 1)
            }
          />
        </div>
      )}
    </div>
  );
}