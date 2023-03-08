import { Body1, Button, makeStyles, shorthands, tokens } from '@fluentui/react-components';

interface Props {
  onFile: (file: File) => void,
}

const useStyles = makeStyles({
  container: {
    paddingBlock: tokens.spacingVerticalM,
    paddingInline: tokens.spacingHorizontalM,
    display: 'inline-flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalM,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    color: tokens.colorNeutralForeground2,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke1),
    ...shorthands.borderRadius(tokens.borderRadiusLarge),
  },
});

// Patch the file picker method onto the Window interface.
declare global {
  interface Window {
    showOpenFilePicker(options?: {multiple?: boolean, excludeAcceptAllOption?: boolean, types?: {description?: string, accept: Record<string, string[]>}[]}): Promise<FileSystemFileHandle[]>
  }
}

const Uploader = ({onFile}: Props) => {
  const classes = useStyles();

  const handleUploadClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {

    const pickerOptions = {
      multiple: false,
      types: [{
        accept: {
          'text/html': ['.html', '.htm']
        }
      }]
    };

    try {
      const [fileHandle] = await window.showOpenFilePicker(pickerOptions);  
      if (fileHandle) {
        const file = await fileHandle.getFile();
        onFile(file);
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className={classes.container}>
      <Body1>To begin, upload an existing bookmarks file.</Body1>
      <Button
        appearance='primary'
        onClick={(e) => handleUploadClick(e)}
      >
        Upload
      </Button>
    </div>
  );
}

export default Uploader;