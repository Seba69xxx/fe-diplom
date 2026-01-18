import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearOrder } from '../../store/slices/orderSlice';
import { formatPrice } from '../../utils/formatters';
import styles from './Success.module.scss';
import iconComp from '../../images/comp-ticket.png';
import iconTickets from '../../images/tickets.png';
import iconProvodnik from '../../images/provodnik-2.png';
import iconStars from '../../images/Stars.png';

export default function Success() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { payer, selectedSeatsDeparture, selectedSeatsArrival } = useSelector(
    (state) => state.order
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const totalPrice =
    selectedSeatsDeparture.reduce((acc, s) => acc + s.price, 0) +
    selectedSeatsArrival.reduce((acc, s) => acc + s.price, 0);

  const orderNumber = '285АА';

  const handleHome = () => {
    dispatch(clearOrder());
    navigate('/');
  };

  const userName =
    payer.name && payer.patron
      ? `${payer.name} ${payer.patron}!`
      : 'Пользователь!';

  return (
    <div className={styles.successPage}>
      <div className={styles.heroSection}>
        <div className={styles.heroContainer}>
          <h1 className={styles.heroTitle}>Благодарим Вас за заказ!</h1>
        </div>
      </div>

      <div className={styles.orderCard}>
        <div className={styles.cardHeader}>
          <div className={styles.orderNum}>№Заказа {orderNumber}</div>
          <div className={styles.orderSum}>
            сумма <span>{formatPrice(totalPrice)}</span> ₽
          </div>
        </div>

        <div className={styles.stepsBlock}>
          <div className={styles.stepItem}>
            <div className={styles.iconCircle}>
              <img src={iconComp} alt="email" className={styles.iconImg} />
            </div>
            <p>
              билеты будут
              <br />
              отправлены
              <br />
              на ваш e-mail
            </p>
          </div>
          <div className={styles.stepItem}>
            <div className={styles.iconCircle}>
              <img src={iconTickets} alt="print" className={styles.iconImg} />
            </div>
            <p>
              распечатайте
              <br />
              и сохраняйте билеты
              <br />
              до даты поездки
            </p>
          </div>
          <div className={styles.stepItem}>
            <div className={styles.iconCircle}>
              <img
                src={iconProvodnik}
                alt="controller"
                className={styles.iconImg}
              />
            </div>
            <p>
              предъявите
              <br />
              распечатанные
              <br />
              билеты при посадке
            </p>
          </div>
        </div>

        <div className={styles.messageBlock}>
          <h2 className={styles.nameTitle}>{userName}</h2>

          <div className={styles.messageText}>
            <p>
              Ваш заказ успешно оформлен.
              <br />В ближайшее время с вами свяжется наш оператор для
              подтверждения.
            </p>
          </div>

          <div className={styles.thanksText}>
            Благодарим Вас за оказанное доверие и желаем приятного путешествия!
          </div>
        </div>

        <div className={styles.cardFooter}>
          <div className={styles.rateBlock}>
            <span>Оценить сервис</span>
            <div className={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((i) => (
                <img
                  key={i}
                  src={iconStars}
                  alt="star"
                  className={styles.starIcon}
                />
              ))}
            </div>
          </div>
          <button className={styles.homeBtn} onClick={handleHome}>
            ВЕРНУТЬСЯ НА ГЛАВНУЮ
          </button>
        </div>
      </div>
    </div>
  );
}