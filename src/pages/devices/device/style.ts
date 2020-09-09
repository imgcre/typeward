import { Theme, createStyles } from "@material-ui/core";

export default (theme: Theme) => createStyles({
  card: {
    padding: theme.spacing(2),
  },
  canvas: {
    minWidth: '100%',
  },
  icon: {
    transform: 'rotate(90deg) scale(2)',
  },
});