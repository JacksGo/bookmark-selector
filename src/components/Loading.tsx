import { Body1, makeStyles, shorthands, Spinner, tokens } from '@fluentui/react-components';

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

const Loading = () => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Body1>Loading file...</Body1>
      <Spinner/>
    </div>
  );
}

export default Loading;