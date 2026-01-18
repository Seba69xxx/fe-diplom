import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import TrainCard from '../../components/TrainCard/TrainCard';
import { formatPrice } from '../../utils/formatters';
import styles from './Verification.module.scss';
import iconPerson from '../../images/icon-passenger.png';

export default function Verification() {
  const navigate = useNavigate();
  const {
    selectedTrain,
    passengers,
    payer,
    selectedSeatsDeparture,
    selectedSeatsArrival,
  } = useSelector((state) => state.order);

  const trainDataForCard = {
    departure: selectedTrain.departure,
    arrival: selectedTrain.arrival,
  };

  const totalPrice =
    selectedSeatsDeparture.reduce((acc, s) => acc + s.price, 0) +
    selectedSeatsArrival.reduce((acc, s) => acc + s.price, 0);

  const handleSubmit = () => {
    navigate('/success');
  };

  if (!selectedTrain.departure) {
    return (
      <div className={styles.page}>
        Нет данных о поезде. Вернитесь к выбору.
      </div>
    );
  }

  return (
    <div className={styles.verificationPage}>
      <div className={styles.sectionBlock}>
        <div className={styles.header}>
          <h2 className={styles.title}>Поезд</h2>
        </div>
        <div className={styles.bodyTrain}>
          <div className={styles.trainCardWrapper}>
            <TrainCard
              data={trainDataForCard}
              hideButton={true}
              compact={true}
            />
          </div>
          <div className={styles.footerTrain}>
            <button
              className={styles.changeBtn}
              onClick={() => navigate('/order')}
            >
              Изменить
            </button>
          </div>
        </div>
      </div>

      <div className={styles.sectionBlock}>
        <div className={styles.header}>
          <h2 className={styles.title}>Пассажиры</h2>
        </div>
        <div className={styles.bodyPassengers}>
          <div className={styles.passengersList}>
            {passengers.map((p, i) => (
              <div key={i} className={styles.passengerItem}>
                <div className={styles.passLeft}>
                  <div className={styles.avatarCircle}>
                    <img src={iconPerson} alt="user" />
                  </div>
                  <div className={styles.passType}>
                    {p.isAdult ? 'Взрослый' : 'Детский'}
                  </div>
                </div>

                <div className={styles.passDetails}>
                  <div className={styles.passName}>
                    {p.surname} {p.name} {p.patron}
                  </div>
                  <div className={styles.passMeta}>
                    Пол {p.gender ? 'мужской' : 'женский'}
                  </div>
                  <div className={styles.passMeta}>
                    Дата рождения {p.birthday}
                  </div>
                  {p.isLimitedMobility && (
                    <div
                      className={styles.passMeta}
                      style={{ color: '#292929' }}
                    >
                      Ограниченная подвижность
                    </div>
                  )}
                  <div className={styles.passDoc}>
                    {p.docType} {p.docSeries} {p.docNumber}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.passTotal}>
            <div className={styles.totalRow}>
              <span>Всего</span>
              <span className={styles.totalSum}>
                {formatPrice(totalPrice)} ₽
              </span>
            </div>
            <button
              className={styles.changeBtn}
              onClick={() => navigate('/order/passengers')}
            >
              Изменить
            </button>
          </div>
        </div>
      </div>

      <div className={styles.sectionBlock}>
        <div className={styles.header}>
          <h2 className={styles.title}>Способ оплаты</h2>
        </div>
        <div className={styles.bodyPayment}>
          <div className={styles.paymentContent}>
            <div className={styles.paymentText}>
              {payer.paymentMethod === 'cash' ? 'Наличными' : 'Онлайн'}
            </div>
            {payer.paymentMethod === 'online' && (
              <div className={styles.paymentSubtext}>
                Банковской картой
                <br />
                PayPal
                <br />
                Visa QIWI Wallet
              </div>
            )}
          </div>

          <div className={styles.footerRight}>
            <button
              className={styles.changeBtn}
              onClick={() => navigate('/order/payment')}
            >
              Изменить
            </button>
          </div>
        </div>
      </div>

      <div className={styles.actionFooter}>
        <button className={styles.confirmBtn} onClick={handleSubmit}>
          ПОДТВЕРДИТЬ
        </button>
      </div>
    </div>
  );
}