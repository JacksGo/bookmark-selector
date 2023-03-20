/// <reference types="vite-plugin-svgr/client" />

import { Body1, makeStyles, tokens } from '@fluentui/react-components';
import { useContext, useEffect } from 'react';

import { ReactComponent as MarkusLogo } from './assets/markus.svg';
import Bookmarks from './components/Bookmarks';
import Loading from './components/Loading';
import Uploader from './components/Uploader';
import { setAllBookmarks, setDOMData, setPhase, setShiftPressed } from './state/actions';
import { StateContext } from './state/reducer';
import { getAllBookmarks, getPhase } from './state/selectors';
import { parseFile } from './utils/parse';

type Phase = 'upload' | 'loading' | 'edit';

const useStyles = makeStyles({
  body: {
    paddingBlock: tokens.spacingVerticalS,
    paddingInline: tokens.spacingHorizontalS,
    display: 'inline-flex',
    flexDirection: 'column',
  },
  title: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalS,
    marginBlockEnd: tokens.spacingVerticalL
  },
  logo: {
    height: '60px'
  }
});

function App() {
  const classes = useStyles();

  const [useSelector, dispatch] = useContext(StateContext);

  const phase = useSelector(getPhase);
  const bookmarks = useSelector(getAllBookmarks);

  useEffect(() => {
    const downListener = (e: KeyboardEvent) => { if (e.key === 'Shift') dispatch(setShiftPressed(true)) }
    const upListener = (e: KeyboardEvent) => { if (e.key === 'Shift') dispatch(setShiftPressed(false)) }
    
    window.addEventListener('keydown', downListener);
    window.addEventListener('keyup', upListener);

    return () => {
      window.removeEventListener('keydown', downListener);
      window.removeEventListener('keyup', upListener);
    }
  });

  return (
    <div className={classes.body}>
      <div className={classes.title}>
        <style>{`#flag { fill: #f00; }`}</style>
        <MarkusLogo className={classes.logo}/>
        <Body1>Enables a user to import only a portion of their Chromium bookmarks.</Body1>
      </div>
      
      { phase === 'upload' && (
        <Uploader onFile={async (file) => {
          dispatch(setPhase('loading'));
          const [bookmarks, folders, document, length] = await parseFile(file);

          if (length > 0) {
            dispatch(setAllBookmarks(bookmarks, folders, length));
            dispatch(setDOMData(document));
          } else {
            dispatch(setPhase('upload'));
          }
        }}/>
      )}

      { phase === 'loading' && (
        <Loading />
      )}

      { phase === 'edit' && (
        <Bookmarks
          items={bookmarks}
        />
      )}
      
    </div>
  )
}

export default App
