import React from 'react';
import styles from './Footer.module.scss';
import phone from '../../images/phone.png';
import email from '../../images/email.png';
import skype from '../../images/skype.png';
import location from '../../images/location.png';
import youtube from '../../images/youtube.png';
import linkedin from '../../images/linkedin.png';
import google from '../../images/google.png';
import facebook from '../../images/facebook.png';
import twitter from '../../images/twitter.png';

export default function Footer() {
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <footer className={styles.footer} id="contacts">
      <div className={styles.container}>
        <div className={styles.topRow}>
          <div className={styles.col}>
            <h3 className={styles.title}>Свяжитесь с нами</h3>
            <div className={styles.contactItem}>
              <img src={phone} alt="phone" />
              <span>8 (800) 000 00 00</span>
            </div>
            <div className={styles.contactItem}>
              <img src={email} alt="email" />
              <span>inbox@mail.ru</span>
            </div>
            <div className={styles.contactItem}>
              <img src={skype} alt="skype" />
              <span>tu.train.tickets</span>
            </div>
            <div className={styles.contactItem}>
              <img src={location} alt="location" />
              <span>
                г. Москва
                <br />
                ул. Московская 27-35
                <br />
                555 555
              </span>
            </div>
          </div>

          <div className={styles.col}>
            <h3 className={styles.title}>Подписка</h3>
            <p style={{ marginBottom: '15px' }}>Будьте в курсе событий</p>
            <form className={styles.subscribeForm} onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="e-mail"
                className={styles.subInput}
              />
              <button type="submit" className={styles.subButton}>
                ОТПРАВИТЬ
              </button>
            </form>
            <h3 className={styles.title} style={{ marginBottom: '15px' }}>
              Подписывайтесь на нас
            </h3>
            <div className={styles.socials}>
              <img src={youtube} alt="yt" />
              <img src={linkedin} alt="in" />
              <img src={google} alt="g+" />
              <img src={facebook} alt="fb" />
              <img src={twitter} alt="tw" />
            </div>
          </div>
        </div>

        <div className={styles.bottomRow}>
          <div className={styles.logo}>Лого</div>
          <div className={styles.toTop} onClick={handleScrollTop}>
            ^
          </div>
          <div>2018 WEB</div>
        </div>
      </div>
    </footer>
  );
}