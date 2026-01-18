import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { setPassengers } from '../../store/slices/orderSlice';
import styles from './Passengers.module.scss';

const isValidDate = (day, month, year) => {
  const d = parseInt(day, 10);
  const m = parseInt(month, 10);
  const y = parseInt(year, 10);
  if (isNaN(d) || isNaN(m) || isNaN(y)) return false;
  if (m < 1 || m > 12) return false;
  if (d < 1 || d > 31) return false;
  if (y < 1900 || y > 2100) return false;
  const date = new Date(y, m - 1, d);
  return (
    date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d
  );
};

const validateBirthCertificate = (value) => {
  const regex = /^([IVXLCDM]{1,4}-[А-Я]{2}-\d{6})$/;
  return regex.test(value);
};

const PassengerCard = ({
  id,
  index,
  type,
  onDelete,
  totalCount,
  onValidationChange,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const [formData, setFormData] = useState({
    id: id,
    isAdult: type === 'adult',
    surname: '',
    name: '',
    patron: '',
    gender: true,
    birthday: '',
    docType: 'Паспорт РФ',
    docSeries: '',
    docNumber: '',
    isLimitedMobility: false,
  });

  const handleNameInput = (field, value) => {
    let cleanValue = value.replace(/[^a-zA-Zа-яА-ЯёЁ\s-]/g, '');
    if (cleanValue.length > 0) {
      cleanValue =
        cleanValue.charAt(0).toUpperCase() + cleanValue.slice(1).toLowerCase();
    }
    setFormData((prev) => ({ ...prev, [field]: cleanValue }));
  };

  const handleDateInput = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 8);
    let res = '';
    if (digits.length > 0) res += digits.slice(0, 2);
    if (digits.length > 2) res += '.' + digits.slice(2, 4);
    if (digits.length > 4) res += '.' + digits.slice(4, 8);
    setFormData((prev) => ({ ...prev, birthday: res }));
  };

  const handleDocInput = (field, value) => {
    if (formData.docType === 'Паспорт РФ') {
      const cleanValue = value.replace(/\D/g, '');
      setFormData((prev) => ({ ...prev, [field]: cleanValue }));
    } else {
      const cleanValue = value
        .replace(/[^0-9а-яА-ЯёЁIVXLCDMivxlcdm-]/g, '')
        .toUpperCase();
      setFormData((prev) => ({ ...prev, [field]: cleanValue }));
    }
  };

  const handleDocTypeChange = (e) => {
    const newType = e.target.value;
    setFormData((prev) => ({
      ...prev,
      docType: newType,
      docSeries: newType === 'Паспорт РФ' ? prev.docSeries : '',
      docNumber: '',
    }));
  };

  const handleChangeGeneral = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isBirthCert = formData.docType === 'Свидетельство о рождении';
  const isBirthCertValidUI =
    isBirthCert && validateBirthCertificate(formData.docNumber);
  const isBirthCertErrorUI =
    isBirthCert && formData.docNumber.length > 0 && !isBirthCertValidUI;

  useEffect(() => {
    const { surname, name, patron, birthday, docType, docSeries, docNumber } =
      formData;
    const isNameValid =
      surname.trim().length > 0 &&
      name.trim().length > 0 &&
      patron.trim().length > 0;
    let isBirthValid = false;
    if (birthday.length === 10) {
      const parts = birthday.split('.');
      if (parts.length === 3)
        isBirthValid = isValidDate(parts[0], parts[1], parts[2]);
    }
    let isDocValid = false;
    if (docType === 'Паспорт РФ') {
      isDocValid = docSeries.length === 4 && docNumber.length === 6;
    } else {
      isDocValid = validateBirthCertificate(docNumber);
    }
    const isValid = isNameValid && isBirthValid && isDocValid;
    onValidationChange(id, isValid, formData);
  }, [formData, id, onValidationChange]);

  const handleGoToNext = (e) => {
    e.preventDefault();
    const nextElement = document.getElementById(`passenger-card-${index + 1}`);
    if (nextElement) {
      nextElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const isPassport = formData.docType === 'Паспорт РФ';

  return (
    <div className={styles.passengerCard} id={`passenger-card-${index}`}>
      <div
        className={classNames(styles.header, { [styles.headerActive]: isOpen })}
      >
        <div className={styles.headerLeft} onClick={() => setIsOpen(!isOpen)}>
          <div className={styles.toggleIcon}>{isOpen ? '-' : '+'}</div>
          <span className={styles.title}>Пассажир {index}</span>
        </div>
        <div className={styles.deleteBtn} onClick={onDelete}>
          ×
        </div>
      </div>

      {isOpen && (
        <div className={styles.formBody}>
          <div className={styles.row}>
            <select
              className={styles.select}
              value={formData.isAdult ? 'Взрослый' : 'Детский'}
              onChange={(e) =>
                handleChangeGeneral('isAdult', e.target.value === 'Взрослый')
              }
            >
              <option value="Взрослый">Взрослый</option>
              <option value="Детский">Детский</option>
            </select>
          </div>
          <div className={styles.row3}>
            <div className={styles.inputGroup}>
              <label>Фамилия</label>
              <input
                type="text"
                value={formData.surname}
                onChange={(e) => handleNameInput('surname', e.target.value)}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Имя</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleNameInput('name', e.target.value)}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Отчество</label>
              <input
                type="text"
                value={formData.patron}
                onChange={(e) => handleNameInput('patron', e.target.value)}
              />
            </div>
          </div>
          <div className={styles.row2}>
            <div className={styles.genderGroup}>
              <label>Пол</label>
              <div className={styles.genderSwitch}>
                <div
                  className={classNames(styles.genderBtn, {
                    [styles.active]: formData.gender,
                  })}
                  onClick={() => handleChangeGeneral('gender', true)}
                >
                  М
                </div>
                <div
                  className={classNames(styles.genderBtn, {
                    [styles.active]: !formData.gender,
                  })}
                  onClick={() => handleChangeGeneral('gender', false)}
                >
                  Ж
                </div>
              </div>
            </div>
            <div className={styles.inputGroup}>
              <label>Дата рождения</label>
              <input
                type="text"
                placeholder="ДД.ММ.ГГГГ"
                value={formData.birthday}
                onChange={(e) => handleDateInput(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.checkboxGroup}>
            <input
              type="checkbox"
              id={`mobility-${index}`}
              checked={formData.isLimitedMobility}
              onChange={(e) =>
                handleChangeGeneral('isLimitedMobility', e.target.checked)
              }
            />
            <label htmlFor={`mobility-${index}`}>ограниченная подвижность</label>
          </div>

          <div className={styles.docSection}>
            <div className={styles.docType}>
              <label>Тип документа</label>
              <select
                className={styles.selectDoc}
                value={formData.docType}
                onChange={handleDocTypeChange}
              >
                <option value="Паспорт РФ">Паспорт РФ</option>
                <option value="Свидетельство о рождении">
                  Свидетельство о рождении
                </option>
              </select>
            </div>
            {isPassport ? (
              <>
                <div
                  className={styles.docNum}
                  style={{ width: '100px', flex: 'none' }}
                >
                  <label>Серия</label>
                  <input
                    type="text"
                    placeholder="__ __ __ __"
                    maxLength={4}
                    value={formData.docSeries}
                    onChange={(e) => handleDocInput('docSeries', e.target.value)}
                    className={styles.passportInput}
                  />
                </div>
                <div className={styles.docNum} style={{ flex: 1 }}>
                  <label>Номер</label>
                  <input
                    type="text"
                    placeholder="__ __ __ __ __ __"
                    maxLength={6}
                    value={formData.docNumber}
                    onChange={(e) => handleDocInput('docNumber', e.target.value)}
                    className={styles.passportInput}
                  />
                </div>
              </>
            ) : (
              <div className={styles.docNumFull}>
                <label>Номер</label>
                <input
                  type="text"
                  placeholder="Пример: VIII-ЫП-123456"
                  maxLength={14}
                  value={formData.docNumber}
                  onChange={(e) => handleDocInput('docNumber', e.target.value)}
                />
              </div>
            )}
          </div>

          {isBirthCertErrorUI && (
            <div className={styles.errorBox}>
              <div className={styles.errorIcon}>✕</div>
              <div className={styles.errorText}>
                Номер свидетельства о рождении указан некорректно <br /> Пример:
                <strong>VIII-ЫП-123456</strong>
              </div>
            </div>
          )}

          {isBirthCertValidUI && (
            <div className={styles.successBox}>
              <div className={styles.successLeft}>
                <div className={styles.successIcon}>✓</div>
                <span>Готово</span>
              </div>
              {index < totalCount && (
                <button
                  className={styles.nextPassBtnSuccess}
                  onClick={handleGoToNext}
                >
                  Следующий пассажир
                </button>
              )}
            </div>
          )}

          {isPassport && index < totalCount && (
            <div className={styles.nextPassContainer}>
              <button className={styles.nextPassBtn} onClick={handleGoToNext}>
                Следующий пассажир
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default function Passengers() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { passengerCount } = useSelector((state) => state.order);
  const [passengersList, setPassengersList] = useState([]);
  const [dataMap, setDataMap] = useState({});

  useEffect(() => {
    if (passengersList.length === 0) {
      const list = [];
      for (let i = 0; i < passengerCount.adults; i++)
        list.push({ id: Math.random().toString(36), type: 'adult' });
      for (let i = 0; i < passengerCount.children; i++)
        list.push({ id: Math.random().toString(36), type: 'child' });
      for (let i = 0; i < passengerCount.childrenNoSeat; i++)
        list.push({ id: Math.random().toString(36), type: 'child' });
      if (list.length === 0)
        list.push({ id: Math.random().toString(36), type: 'adult' });
      setPassengersList(list);
    }
  }, [passengerCount, passengersList.length]);

  const addPassenger = () =>
    setPassengersList([
      ...passengersList,
      { id: Math.random().toString(36), type: 'adult' },
    ]);

  const removePassenger = (id) => {
    if (passengersList.length > 1) {
      setPassengersList((prev) => prev.filter((p) => p.id !== id));
      setDataMap((prev) => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
    } else {
      alert('Должен быть хотя бы один пассажир');
    }
  };

  const handleValidationChange = useCallback((id, isValid, data) => {
    setDataMap((prev) => ({ ...prev, [id]: { isValid, data } }));
  }, []);

  const isAllValid =
    passengersList.length > 0 &&
    passengersList.every((p) => dataMap[p.id]?.isValid);

  const handleNext = () => {
    if (isAllValid) {
      const collectedData = passengersList.map((p) => dataMap[p.id].data);
      dispatch(setPassengers(collectedData));
      navigate('/order/payment');
    } else {
      alert('Пожалуйста, заполните все поля корректно');
    }
  };

  return (
    <div className={styles.passengersPage}>
      {passengersList.map((p, i) => (
        <PassengerCard
          key={p.id}
          id={p.id}
          index={i + 1}
          type={p.type}
          onDelete={() => removePassenger(p.id)}
          totalCount={passengersList.length}
          onValidationChange={handleValidationChange}
        />
      ))}
      <div className={styles.addPassenger} onClick={addPassenger}>
        <div className={styles.addTitle}>Добавить пассажира</div>
        <div className={styles.plusBtn}>+</div>
      </div>
      <div className={styles.footerAction}>
        <button
          className={styles.nextButton}
          onClick={handleNext}
          disabled={!isAllValid}
        >
          ДАЛЕЕ
        </button>
      </div>
    </div>
  );
}