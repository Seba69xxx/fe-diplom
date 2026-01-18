import React from 'react';
import classNames from 'classnames';
import styles from './CoachScheme.module.scss';

import iconConductor from '../../images/icon-conductor.png';
import iconFood from '../../images/icon-food.png';
import iconTrash from '../../images/icon-trash.png';
import iconToilet from '../../images/icon-toilet.png';

export default function CoachScheme({
  seats,
  coach,
  selectedSeats = [],
  onSeatClick,
}) {
  if (!coach) return null;
  const type = coach.class_type;
  const isSitting = type === 'fourth';

  const Seat = ({ number }) => {
    const seatInfo = seats.find((s) => s.index === number);
    const isAvailable = seatInfo?.available;
    const isSelected = selectedSeats.includes(number);

    const handleClick = () => {
      if (!isAvailable) return;

      let price = coach.price;
      if (!price) {
        const isEven = number % 2 === 0;
        price = isEven
          ? coach.top_price || coach.price
          : coach.bottom_price || coach.price;
      }

      if (onSeatClick) {
        onSeatClick({ index: number, price });
      }
    };

    return (
      <div
        className={classNames(styles.seat, {
          [styles.available]: isAvailable,
          [styles.taken]: !isAvailable,
          [styles.selected]: isSelected,
        })}
        onClick={handleClick}
        title={`Место ${number}`}
      >
        {number}
      </div>
    );
  };

  const renderStandardGrid = (topContent, bottomContent = null) => {
    return (
      <div className={styles.gridStandard}>
        <div className={styles.standardTop}>{topContent}</div>
        <div className={styles.standardCorridor}></div>
        <div className={styles.standardBottom}>{bottomContent}</div>
      </div>
    );
  };

  const renderLux = () => {
    const coupes = [];
    for (let i = 0; i < 9; i++) {
      const start = i * 2 + 1;
      coupes.push(
        <div key={i} className={styles.luxBlock}>
          <div
            className={styles.seatRow}
            style={{
              justifyContent: 'space-between',
              height: '100%',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Seat number={start} />
            <Seat number={start + 1} />
          </div>
        </div>
      );
    }
    return renderStandardGrid(coupes, null);
  };

  const renderKupe = () => {
    const coupes = [];
    for (let i = 0; i < 9; i++) {
      const start = i * 4 + 1;
      coupes.push(
        <div key={i} className={styles.kupeBlock}>
          <div className={styles.seatRow}>
            <Seat number={start + 1} />
            <Seat number={start + 3} />
          </div>
          <div className={styles.seatRow}>
            <Seat number={start} />
            <Seat number={start + 2} />
          </div>
        </div>
      );
    }
    return renderStandardGrid(coupes, null);
  };

  const renderPlackart = () => {
    const mainBlocks = [];
    const sideSeats = [];

    for (let i = 0; i < 9; i++) {
      const start = i * 4 + 1;
      mainBlocks.push(
        <div key={`main-${i}`} className={styles.plackartBlock}>
          <div className={styles.seatRow}>
            <Seat number={start + 1} />
            <Seat number={start + 3} />
          </div>
          <div className={styles.seatRow}>
            <Seat number={start} />
            <Seat number={start + 2} />
          </div>
        </div>
      );
    }

    for (let i = 0; i < 9; i++) {
      const start = 54 - i * 2;
      sideSeats.push(
        <div key={`side-${i}`} className={styles.sideBlock}>
          <Seat number={start} />
          <Seat number={start - 1} />
        </div>
      );
    }

    return (
      <div className={styles.gridStandard}>
        <div className={styles.standardTop}>{mainBlocks}</div>
        <div className={styles.standardCorridor}></div>
        <div className={styles.plackartBottom}>
          <div className={styles.plackartSideContainer}>{sideSeats}</div>
        </div>
      </div>
    );
  };

  const renderSitting = () => {
    const topPairs = [];
    const bottomPairs = [];

    for (let i = 0; i < 14; i++) {
      const start = i * 4 + 1;
      topPairs.push(
        <div key={`top-${i}`} className={styles.sittingPairVertical}>
          <Seat number={start} />
          <Seat number={start + 1} />
        </div>
      );
      bottomPairs.push(
        <div key={`bottom-${i}`} className={styles.sittingPairVertical}>
          <Seat number={start + 2} />
          <Seat number={start + 3} />
        </div>
      );
    }
    return (
      <div className={styles.gridSitting}>
        <div className={styles.sittingTopHalf}>{topPairs}</div>
        <div className={styles.sittingAisle}></div>
        <div className={styles.sittingBottomHalf}>{bottomPairs}</div>
      </div>
    );
  };

  return (
    <div className={styles.schemeWrapper}>
      <div
        className={classNames(styles.wagonNose, {
          [styles['layout-sitting']]: isSitting,
        })}
      >
        <div className={styles.noseTop}>
          <div className={classNames(styles.techRoom, styles.toiletLeft)}>
            <img src={iconToilet} alt="toilet" />
          </div>
          <div className={classNames(styles.techRoom, styles.conductor)}>
            <img src={iconConductor} alt="conductor" />
          </div>
        </div>
        <div className={styles.noseCorridor}></div>
        <div className={styles.noseBottom}>
          <div className={classNames(styles.techRoom, styles.cafe)}>
            <img src={iconFood} alt="cafe" />
          </div>
          <div className={styles.exitArea}></div>
          <div className={styles.emptySpace}></div>
        </div>
      </div>

      <div className={styles.mainArea}>
        {type === 'second' && renderKupe()}
        {type === 'third' && renderPlackart()}
        {type === 'first' && renderLux()}
        {type === 'fourth' && renderSitting()}
      </div>

      <div
        className={classNames(styles.wagonTail, {
          [styles['layout-sitting']]: isSitting,
        })}
      >
        <div className={styles.tailTop}>
          <div className={styles.techRoom}>
            <img src={iconToilet} alt="toilet" />
          </div>
        </div>
        <div className={styles.tailCorridor}></div>
        <div className={styles.tailBottom}>
          <div className={classNames(styles.techRoom, styles.trashArea)}>
            <img src={iconTrash} alt="trash" />
          </div>
          <div className={styles.tailExit}></div>
        </div>
      </div>
    </div>
  );
}