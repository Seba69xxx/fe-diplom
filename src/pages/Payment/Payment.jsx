import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  updatePayerField,
  setPaymentMethod,
} from '../../store/slices/orderSlice';
import styles from './Payment.module.scss';

export default function Payment() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { payer } = useSelector((state) => state.order);

  const handleChangeName = (field, value) => {
    let cleanValue = value.replace(/[^a-zA-Zа-яА-ЯёЁ\s-]/g, '');

    if (cleanValue.length > 0) {
      cleanValue =
        cleanValue.charAt(0).toUpperCase() + cleanValue.slice(1).toLowerCase();
    }

    dispatch(updatePayerField({ field, value: cleanValue }));
  };

  const handleChangeEmail = (value) => {
    const cleanValue = value.replace(/[а-яА-ЯёЁ]/g, '');
    dispatch(updatePayerField({ field: 'email', value: cleanValue }));
  };

  const handlePhoneChange = (e) => {
    const val = e.target.value;
    const digits = val.replace(/\D/g, '');
    let formatted = '';

    if (!digits) {
      dispatch(updatePayerField({ field: 'phone', value: '' }));
      return;
    }

    const numbers = digits.substring(0, 11);
    let firstDigit = numbers[0];

    if (firstDigit === '9') firstDigit = '7';

    const isEight = firstDigit === '8';
    const prefix = isEight ? '8' : '+7';

    if (digits.length > 0) {
      if (['7', '8', '9'].includes(digits[0])) {
        let body = digits;
        if (digits[0] === '7' || digits[0] === '8') {
          body = digits.substring(1);
        }
        body = body.substring(0, 10);

        formatted = prefix;
        if (body.length > 0) formatted += ' ' + body.substring(0, 3);
        if (body.length >= 4) formatted += ' ' + body.substring(3, 6);
        if (body.length >= 7) formatted += ' ' + body.substring(6, 8);
        if (body.length >= 9) formatted += ' ' + body.substring(8, 10);
      } else {
        formatted = '+' + digits.substring(0, 15);
      }
    }

    dispatch(updatePayerField({ field: 'phone', value: formatted }));
  };

  const isOnline = payer.paymentMethod === 'online';
  const isCash = payer.paymentMethod === 'cash';

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  const isEmailValid = emailRegex.test(payer.email);

  const phoneDigits = payer.phone.replace(/\D/g, '');
  const isPhoneValid = phoneDigits.length === 11;

  const isFioValid =
    payer.surname.trim() && payer.name.trim() && payer.patron.trim();

  const isValid = isFioValid && isPhoneValid && isEmailValid;

  const handleSubmit = () => {
    if (isValid) {
      navigate('/order/check');
    }
  };

  return (
    <div className={styles.paymentPage}>
      <div className={styles.sectionBlock}>
        <div className={styles.header}>
          <h2 className={styles.title}>Персональные данные</h2>
        </div>

        <div className={styles.formBody}>
          <div className={styles.row3}>
            <div className={styles.inputGroup}>
              <label>Фамилия</label>
              <input
                type="text"
                value={payer.surname}
                onChange={(e) => handleChangeName('surname', e.target.value)}
                placeholder="Мартынюк"
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Имя</label>
              <input
                type="text"
                value={payer.name}
                onChange={(e) => handleChangeName('name', e.target.value)}
                placeholder="Ирина"
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Отчество</label>
              <input
                type="text"
                value={payer.patron}
                onChange={(e) => handleChangeName('patron', e.target.value)}
                placeholder="Эдуардовна"
              />
            </div>
          </div>

          <div className={styles.row1}>
            <div className={styles.inputGroup}>
              <label>Контактный телефон</label>
              <input
                type="tel"
                value={payer.phone}
                onChange={handlePhoneChange}
                placeholder="+7 999 999 99 99"
              />
            </div>
          </div>

          <div className={styles.row1}>
            <div className={styles.inputGroup}>
              <label>E-mail</label>
              <input
                type="email"
                value={payer.email}
                onChange={(e) => handleChangeEmail(e.target.value)}
                placeholder="inbox@gmail.ru"
              />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.sectionBlock}>
        <div className={styles.header}>
          <h2 className={styles.title}>Способ оплаты</h2>
        </div>

        <div className={styles.paymentOptions}>
          <div className={styles.optionRow}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={isOnline}
                onChange={() => dispatch(setPaymentMethod('online'))}
              />
              <span className={styles.customCheckbox}></span>
              <span className={styles.optionText}>Онлайн</span>
            </label>

            <div className={styles.methodsList}>
              <span className={styles.methodItem}>
                Банковской
                <br />
                картой
              </span>
              <span className={styles.methodItem}>PayPal</span>
              <span className={styles.methodItem}>Visa QIWI Wallet</span>
            </div>
          </div>

          <div className={styles.divider}></div>

          <div className={styles.optionRow}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={isCash}
                onChange={() => dispatch(setPaymentMethod('cash'))}
              />
              <span className={styles.customCheckbox}></span>
              <span className={styles.optionText}>Наличными</span>
            </label>
          </div>
        </div>
      </div>

      <div className={styles.footerAction}>
        <button
          className={styles.buyBtn}
          onClick={handleSubmit}
          disabled={!isValid}
        >
          КУПИТЬ БИЛЕТЫ
        </button>
      </div>
    </div>
  );
}