import BookmarkItem from './BookmarkItem';
import { Folder, Link } from '../types/Bookmark';
import { Body1, Button, makeStyles, shorthands, tokens } from '@fluentui/react-components';
import { StateContext } from '../state/reducer';
import { MouseEventHandler, useContext } from 'react';
import { getExportState } from '../state/selectors';
import { exportBookmarks } from '../utils/export';

interface BookmarksProps {
  items: (Folder | Link)[],
}

const useStyles = makeStyles({
  container: {
    paddingBlock: tokens.spacingVerticalM,
    paddingInline: tokens.spacingHorizontalM,
    display: 'inline-block',
    position: 'relative',
    color: tokens.colorNeutralForeground2,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke1),
    ...shorthands.borderRadius(tokens.borderRadiusLarge),
  },
  instructions: {
    display: 'flex',
    flexDirection: 'row',
    marginBlockEnd: tokens.spacingVerticalM,
  },
  exportButton: {
    marginInlineStart: 'auto',
  }
});

const Bookmarks = ({items}: BookmarksProps) => {
  const classes = useStyles();
  
  const [useSelector] = useContext(StateContext);
  const exportData = useSelector(getExportState);

  const handleSaveFile: MouseEventHandler<HTMLButtonElement> = (e) => {
    exportBookmarks(exportData);
  };

  return (
    <div className={classes.container}>
      <div className={classes.instructions}>
        <Body1>Select the items you want to keep.</Body1>
        <Button
          appearance="primary"
          size="small"
          className={classes.exportButton}
          onClick={handleSaveFile}
        >
          Export
        </Button>
      </div>
      {items.map((item, k) => (
        <BookmarkItem data={item} key={k}/>
      ))}
    </div>
  );
}

export default Bookmarks;
