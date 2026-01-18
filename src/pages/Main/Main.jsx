import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import classNames from 'classnames';
import SearchForm from '../../components/SearchForm/SearchForm';
import styles from './Main.module.scss';
import iconMonitor from '../../images/icon-monitor.png';
import iconOffice from '../../images/icon-office.png';
import iconWorld from '../../images/icon-world.png';
import avatar1 from '../../images/avatar-1.png';
import avatar2 from '../../images/avatar-2.png';

const reviewsData = [
  {
    id: 1,
    name: 'Екатерина Вальнова',
    text: 'Доброжелательные подсказки на всех этапах помогут правильно заполнить поля.',
    img: avatar1,
  },
  {
    id: 2,
    name: 'Евгений Стрыкало',
    text: 'СМС-сопровождение до посадки. Сразу после оплаты ж/д билетов мы пришлем вам СМС.',
    img: avatar2,
  },
  {
    id: 3,
    name: 'Анна К.',
    text: 'Очень удобный сайт, все интуитивно понятно, купила билет за 5 минут.',
    img: avatar1,
  },
  {
    id: 4,
    name: 'Сергей П.',
    text: 'Огромный выбор направлений, нашел билеты, которых не было в кассе.',
    img: avatar2,
  },
  {
    id: 5,
    name: 'Ольга М.',
    text: 'Техподдержка работает отлично, помогли с возвратом билета.',
    img: avatar1,
  },
  {
    id: 6,
    name: 'Иван Д.',
    text: 'Нравится, что можно выбрать места на схеме вагона, очень наглядно.',
    img: avatar2,
  },
  {
    id: 7,
    name: 'Татьяна Б.',
    text: 'Пользуюсь сервисом уже год, никаких нареканий, все четко.',
    img: avatar1,
  },
  {
    id: 8,
    name: 'Дмитрий В.',
    text: 'Удобное приложение, билеты всегда под рукой.',
    img: avatar2,
  },
  {
    id: 9,
    name: 'Елена Р.',
    text: 'Быстро, качественно, надежно. Рекомендую всем друзьям.',
    img: avatar1,
  },
  {
    id: 10,
    name: 'Михаил С.',
    text: 'Лучший сервис для покупки билетов, спасибо разработчикам!',
    img: avatar2,
  },
];

export default function Main() {
  const [activeIndex, setActiveIndex] = useState(0);
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);
      const element = document.getElementById(id);

      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [location]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current === 4 ? 0 : current + 1));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const currentReviews = reviewsData.slice(
    activeIndex * 2,
    activeIndex * 2 + 2
  );

  return (
    <main className={styles.mainPage}>
      <SearchForm />

      <section className={styles.aboutSection} id="about">
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>О НАС</h2>
          <div className={styles.aboutContent}>
            <p>
              Мы рады видеть вас! Мы работаем для Вас с 2003 года. 14 лет мы
              наблюдаем, как с каждым днем все больше людей заказывают жд билеты
              через интернет.
            </p>
            <p>
              Сегодня можно заказать железнодорожные билеты онлайн всего в 2
              клика, но стоит ли это делать? Мы расскажем о преимуществах заказа
              через интернет.
            </p>
            <p style={{ fontWeight: 'bold' }}>
              Покупать жд билеты дешево можно за 90 суток до отправления поезда.
              Благодаря динамическому ценообразованию цена на билеты в это время
              самая низкая.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.howItWorks} id="how-it-works">
        <div className={styles.container}>
          <div className={styles.featuresHeader}>
            <h2 className={styles.sectionTitleWhite}>КАК ЭТО РАБОТАЕТ</h2>
            <button className={styles.ghostButton}>Узнать больше</button>
          </div>
          <div className={styles.featuresGrid}>
            <div className={styles.featureItem}>
              <div className={styles.iconCircle}>
                <img src={iconMonitor} alt="icon" />
              </div>
              <p>Удобный заказ на сайте</p>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.iconCircle}>
                <img src={iconOffice} alt="icon" />
              </div>
              <p>Нет необходимости ехать в офис</p>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.iconCircle}>
                <img src={iconWorld} alt="icon" />
              </div>
              <p>Огромный выбор направлений</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.reviews} id="reviews">
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>ОТЗЫВЫ</h2>

          <div className={styles.reviewCards}>
            {currentReviews.map((review) => (
              <div key={review.id} className={styles.reviewItem}>
                <img
                  src={review.img}
                  alt="avatar"
                  className={styles.reviewPhoto}
                />
                <div className={styles.reviewText}>
                  <h4>{review.name}</h4>
                  <p>{review.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.sliderDots}>
            {[0, 1, 2, 3, 4].map((index) => (
              <span
                key={index}
                className={classNames(styles.dot, {
                  [styles.activeDot]: index === activeIndex,
                })}
                onClick={() => setActiveIndex(index)}
              ></span>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}