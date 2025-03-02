import {CSSProperties, forwardRef, KeyboardEvent, MouseEvent, ReactNodeArray, TouchEvent} from 'react';
import {observer} from 'mobx-react';

import ProgressBar from '../general/ProgressBar';
import SettingStore from '../../stores/SettingStore';
import TorrentListCell from './TorrentListCell';
import TorrentListColumns from '../../constants/TorrentListColumns';
import torrentStatusIcons from '../../util/torrentStatusIcons';

interface TorrentListRowCondensedProps {
  className: string;
  style: CSSProperties;
  hash: string;
  handleClick: (hash: string, event: MouseEvent) => void;
  handleDoubleClick: (hash: string) => void;
  handleRightClick: (hash: string, event: MouseEvent) => void;
  handleTouchStart: (event: TouchEvent) => void;
  handleTouchEnd: (event: TouchEvent) => void;
  handleKeyPress: (event: KeyboardEvent) => void;
}

const TorrentListRowCondensed = observer(
  forwardRef<HTMLDivElement, TorrentListRowCondensedProps>(
    (
      {
        className,
        style,
        hash,
        handleClick,
        handleDoubleClick,
        handleRightClick,
        handleTouchStart,
        handleTouchEnd,
        handleKeyPress,
      }: TorrentListRowCondensedProps,
      ref,
    ) => {
      const torrentListColumns = SettingStore.floodSettings.torrentListColumns.reduce(
        (accumulator: ReactNodeArray, {id, visible}) => {
          if (TorrentListColumns[id] == null) {
            return accumulator;
          }

          if (!visible) {
            return accumulator;
          }

          if (id === 'percentComplete') {
            accumulator.push(
              <TorrentListCell
                className="table__cell"
                key={id}
                hash={hash}
                column={id}
                content={(torrent) => (
                  <ProgressBar percent={Math.ceil(torrent.percentComplete)} icon={torrentStatusIcons(torrent.status)} />
                )}
                width={SettingStore.floodSettings.torrentListColumnWidths[id]}
              />,
            );

            return accumulator;
          }

          accumulator.push(
            <TorrentListCell
              className="table__cell"
              key={id}
              hash={hash}
              column={id}
              width={SettingStore.floodSettings.torrentListColumnWidths[id]}
            />,
          );

          return accumulator;
        },
        [],
      );

      return (
        <div
          className={className}
          role="row"
          style={style}
          tabIndex={0}
          onClick={(e) => handleClick(hash, e)}
          onContextMenu={(e) => handleRightClick(hash, e)}
          onDoubleClick={() => handleDoubleClick(hash)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onKeyPress={handleKeyPress}
          ref={ref}>
          {torrentListColumns}
        </div>
      );
    },
  ),
);

export default TorrentListRowCondensed;
