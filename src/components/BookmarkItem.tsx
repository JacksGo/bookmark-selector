import React, { useContext, useMemo, useState } from 'react';
import { Body1, Body1Strong, Checkbox, Button, makeStyles, mergeClasses, tokens, shorthands } from "@fluentui/react-components";
import { Folder20Regular, FolderOpen20Regular, ChevronDown20Regular, ChevronRight20Regular, Earth20Regular } from "@fluentui/react-icons";

import { Folder, Link } from "../types/Bookmark";
import { StateContext } from '../state/reducer';
import { getBookmarkChecked } from '../state/selectors';
import { setBookmarkChecked } from '../state/actions';

interface Props {
  data: Folder | Link,
}

const useStyles = makeStyles({
  item: {
    display: 'flex',
    flexDirection: 'column',
    marginInlineStart: '24px',
  },
  itemLeaf: {
    marginBlockStart: '1px',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: '8px',
  },
  button: {
    minWidth: 0,
    paddingInline: 0,
    paddingBlock: 0,
    marginInlineStart: '-2px',
  },
  icon: {
    width: 'auto',
  },
  typeIcon: {
    display: 'flex',
    alignItems: 'center',
    marginInlineEnd: '6px',
  },
  nonButtonTitle: {
    display: 'flex',
    flexDirection: 'row',
  },
  nonCaretSpacer: {
    width: '25px',
  },
  checkbox: {
    width: '16px',
    height: '16px',
    position: 'absolute',
    insetInlineStart: tokens.spacingHorizontalM,
    overflowX: 'hidden',
    overflowY: 'hidden',
    // Not? Supported?? Huh???
    // overflowBlock: 'hidden',
    // overflowInline: 'hidden',
  },
  checkboxInner: {
    position: 'absolute',
    insetBlockStart: '-8px',
    insetInlineStart: '-8px',
  },
  panel: {
    marginInlineStart: '34px',
    ...shorthands.borderLeft('1px', 'solid', tokens.colorNeutralStroke2),
  },
});

const BookmarkItem = ({data}: Props) => {
  const classes = useStyles();

  const [expanded, setExpanded] = useState(false);
  
  const [useSelector, dispatch] = useContext(StateContext);
  const checked = useSelector(getBookmarkChecked(data.id));

  const icon = <div className={classes.icon}>
    { expanded ? <ChevronDown20Regular/> : <ChevronRight20Regular/>}
  </div>

  const title = data.type === 'folder'
    ? (
      <Button
        className={classes.button}
        appearance="transparent"
        icon={icon}
        onClick={() => {setExpanded(prev => !prev)}}
      >
        <div className={classes.typeIcon}>
          {expanded ? <FolderOpen20Regular/> : <Folder20Regular/>}
        </div>
        <Body1Strong>{data.title}</Body1Strong>
      </Button>
    )
    : (
      <div className={classes.nonButtonTitle}>
        <div className={classes.nonCaretSpacer}></div>
        <div className={classes.typeIcon} aria-hidden="true">
          <Earth20Regular/>
        </div>
        <Body1>{data.title}</Body1>
      </div>
    );

  const itemClass = data.type === 'folder'
    ? classes.item
    : mergeClasses(classes.item, classes.itemLeaf);

  return useMemo(() => (
    <div className={itemClass}>
      <div className={classes.header}>
        <div className={classes.checkbox}>
          <Checkbox
            className={classes.checkboxInner}
            checked={checked}
            onChange={(e, {checked}) => {
              dispatch(setBookmarkChecked(data.id, checked));
            }}
          />
        </div>
        {title}
      </div>

      {data.type === 'folder' && expanded &&
        <div className={classes.panel}>
          {data.type === 'folder' && data.items.map((item, k) => (
            <BookmarkItem data={item as any} key={k}/>
          ))} 
        </div>
      }
    </div>
  ), [data, checked, expanded]);
}

export default BookmarkItem;
