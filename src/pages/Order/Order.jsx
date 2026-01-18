import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import TrainList from '../../components/TrainList/TrainList';
import SeatSelection from '../../components/SeatSelection/SeatSelection';
import Sidebar from '../../components/Sidebar/Sidebar';
import TripDetails from '../../components/TripDetails/TripDetails';
import OrderSearch from '../../components/OrderSearch/OrderSearch';
import Passengers from '../Passengers/Passengers';
import Payment from '../Payment/Payment';
import Verification from '../Verification/Verification';
import styles from './Order.module.scss';

export default function Order() {
  const location = useLocation();
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (location.pathname.includes('/passengers')) {
      setStep(2);
    } else if (location.pathname.includes('/payment')) {
      setStep(3);
    } else if (location.pathname.includes('/check')) {
      setStep(4);
    } else {
      setStep(1);
    }
  }, [location]);

  const isSearchMode = step === 1;
  const headerClass = isSearchMode
    ? styles.topSection
    : styles.topSectionTicket;

  return (
    <div className={styles.orderPage}>
      <div className={headerClass}>
        <div className={styles.searchContainer}>
          <OrderSearch />
        </div>
      </div>

      <div className={styles.progressBar}>
        <div className={styles.stepsContainer}>
          <div
            className={classNames(styles.step, {
              [styles.active]: step === 1,
              [styles.completed]: step > 1,
            })}
          >
            <div className={styles.stepNum}>1</div>
            <span className={styles.stepText}>Билеты</span>
          </div>

          <div
            className={classNames(styles.step, {
              [styles.active]: step === 2,
              [styles.completed]: step > 2,
            })}
          >
            <div className={styles.stepNum}>2</div>
            <span className={styles.stepText}>Пассажиры</span>
          </div>

          <div
            className={classNames(styles.step, {
              [styles.active]: step === 3,
              [styles.completed]: step > 3,
            })}
          >
            <div className={styles.stepNum}>3</div>
            <span className={styles.stepText}>Оплата</span>
          </div>

          <div
            className={classNames(styles.step, {
              [styles.active]: step === 4,
            })}
          >
            <div className={styles.stepNum}>4</div>
            <span className={styles.stepText}>Проверка</span>
          </div>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.sidebarColumn}>
          {isSearchMode ? <Sidebar /> : <TripDetails />}
        </div>

        <div className={styles.mainContent}>
          <Routes>
            <Route path="/" element={<TrainList />} />
            <Route path="/seats/:id" element={<SeatSelection />} />
            <Route path="/passengers" element={<Passengers />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/check" element={<Verification />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}