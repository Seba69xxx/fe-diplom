import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import styles from './Coach.module.scss';
import { formatPrice } from '../../utils/formatters';
import CoachScheme from '../CoachScheme/CoachScheme';
import { toggleService } from '../../store/slices/orderSlice';

import iconAc from '../../images/icon-ac.png';
import iconWifi from '../../images/icon-wifi.png';
import iconLinens from '../../images/icon-linens.png';
import iconFood from '../../images/icon-food.png';

export default function Coach({ data, allCoaches = [], selectedSeats = [], onSeatClick }) {
  const dispatch = useDispatch();
  const { coach, seats } = data;

  const selectedOptions = useSelector(state =>
    state.order.selectedAdditionalOptions[coach._id] || {}
  );

  const seatsPrice = selectedSeats.reduce((acc, s) => acc + s.price, 0);
  const count = selectedSeats.length || 0;

  let servicesPrice = 0;
  if (selectedOptions.wifi && coach.wifi_price) servicesPrice += coach.wifi_price * count;
  if (selectedOptions.linens && coach.linens_price) servicesPrice += coach.linens_price * count;

  const totalPrice = seatsPrice + servicesPrice;

  const handleServiceClick = (service, isIncluded, isAvailable) => {
    if (isIncluded || !isAvailable) return;
    dispatch(toggleService({ coachId: coach._id, service }));
  };

  const renderServiceIcon = (id, icon, label, isAvailable, isIncluded, price) => {
    const isSelected = !!selectedOptions[id];
    if (!isAvailable && !isIncluded) return null;

    let stateClass = styles.default;
    let tooltip = `${label}`;

    if (isIncluded) {
      stateClass = styles.included;
      tooltip += ' (включено в стоимость)';
    } else if (isSelected) {
      stateClass = styles.selected;
      tooltip += price ? ` - ${price} ₽` : '';
    } else {
      stateClass = styles.selectable;
      tooltip += price ? ` - ${price} ₽` : '';
    }

    return (
      <div
        key={id}
        className={classNames(styles.serviceIcon, stateClass)}
        onClick={() => handleServiceClick(id, isIncluded, isAvailable)}
        title={tooltip}
      >
        <img src={icon} alt={id} />
      </div>
    );
  };

  const getCoachName = (coachId) => {
    const found = allCoaches.find(c => c.coach._id === coachId);
    if (found) {
      const number = found.coach.name.replace(/\D/g, '');
      return `Вагон ${number}`;
    }
    return '';
  };

  return (
    <div className={styles.coachContainer}>
      <div className={styles.coachInfo}>
        <div className={styles.coachNumberBlock}>
          <span className={styles.coachBigNumber}>{coach.name.replace(/\D/g, '')}</span>
          <span className={styles.coachLabel}>вагон</span>
        </div>

        <div className={styles.coachDetails}>
          <div className={styles.detailsColumn}>
            <div className={styles.columnTitle}>
              Места <span className={styles.columnTitleRight}>Стоимость</span>
            </div>

            <div className={styles.seatsList}>
              {selectedSeats.length > 0 ? (
                selectedSeats.map((seat, index) => (
                  <div key={`${seat.coach_id}-${seat.seat_number}-${index}`} className={styles.seatRow}>
                    <div className={styles.seatInfo}>
                      <span className={styles.seatNum}>Место {seat.seat_number}</span>
                      <span className={styles.seatWagon}>{getCoachName(seat.coach_id)}</span>
                    </div>
                    <span className={styles.seatPrice}>{formatPrice(seat.price)} ₽</span>
                  </div>
                ))
              ) : (
                <div className={styles.emptyText}>Места не выбраны</div>
              )}
            </div>
          </div>

          <div className={styles.spacer} />

          <div className={styles.detailsColumnRight}>
            <div className={styles.columnTitleRight}>
              Обслуживание <span className={styles.org}>ФПК</span>
            </div>
            <div className={styles.servicesRow}>
              {renderServiceIcon('ac', iconAc, 'Кондиционер', coach.have_air_conditioning, true, 0)}
              {renderServiceIcon('wifi', iconWifi, 'Wi-Fi', coach.have_wifi, !coach.wifi_price, coach.wifi_price)}
              {renderServiceIcon(
                'linens',
                iconLinens,
                'Белье',
                coach.have_linens || coach.is_linens_included,
                coach.is_linens_included,
                coach.linens_price
              )}
              {renderServiceIcon('food', iconFood, 'Питание', coach.have_food, false, 0)}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.seatsScheme}>
        <div className={styles.schemeInner}>
          <CoachScheme
            seats={seats}
            coach={coach}
            selectedSeats={selectedSeats
              .filter(s => s.coach_id === coach._id)
              .map(s => s.seat_number)}
            onSeatClick={onSeatClick}
          />
        </div>
      </div>

      {totalPrice > 0 && (
        <div className={styles.bottomPriceBar}>
          <span className={styles.finalPrice}>{formatPrice(totalPrice)} ₽</span>
        </div>
      )}
    </div>
  );
}