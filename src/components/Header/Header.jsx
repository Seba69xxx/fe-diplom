import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import styles from './Header.module.scss';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const isTransparentPage =
    location.pathname === '/' ||
    location.pathname.startsWith('/order') ||
    location.pathname === '/success';

  const handleAnchorClick = (e, id) => {
    e.preventDefault();
    if (location.pathname === '/') {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(`/#${id}`);
    }
  };

  const handleContactsClick = (e) => {
    e.preventDefault();
    const footer = document.getElementById('contacts');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={classNames(styles.header, {
        [styles.headerInner]: !isTransparentPage,
      })}
    >
      <div className={styles.logoRow}>
        <div className={styles.container}>
          <NavLink to="/" className={styles.logo}>
            Лого
          </NavLink>
        </div>
      </div>

      <nav className={styles.navRow}>
        <div className={styles.container}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <a
                href="#about"
                className={styles.navLink}
                onClick={(e) => handleAnchorClick(e, 'about')}
              >
                О нас
              </a>
            </li>
            <li className={styles.navItem}>
              <a
                href="#how-it-works"
                className={styles.navLink}
                onClick={(e) => handleAnchorClick(e, 'how-it-works')}
              >
                Как это работает
              </a>
            </li>
            <li className={styles.navItem}>
              <a
                href="#reviews"
                className={styles.navLink}
                onClick={(e) => handleAnchorClick(e, 'reviews')}
              >
                Отзывы
              </a>
            </li>
            <li className={styles.navItem}>
              <a
                href="#contacts"
                className={styles.navLink}
                onClick={handleContactsClick}
              >
                Контакты
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}