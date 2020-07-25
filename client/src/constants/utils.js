import * as COLORS from '../constants/colors.js'


export const formStyles = theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: COLORS.WATERMELON,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  alert: {
    marginBottom: theme.spacing(10),
  }
});

export const chartsStyles = theme => ({
  root: {
    flexGrow: 1,
  },
  chart: {
    padding: theme.spacing(10),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
});


export const registTime = theme => ({
  tableContainer: {
      marginTop: theme.spacing(5),
      width: "%",
      overflowX: "auto",
      marginBottom: theme.spacing(2),
      margin: "auto",
      maxWidth: 800,
  },
  table: {
      minWidth: 700,
      width: "25%"
  },
  margin: {
    margin: theme.spacing(1),
  },
  container: {
    textAlign: "center",
  },
  vertically: {
    marginTop: '15%',
  }, 
  clock: {
    marginTop: theme.spacing(8),
    textAlign: "center",
  }
});

export const registIncidence = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: theme.spacing(2),
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  margin: {
    margin: theme.spacing(1),
  },
  formControl: {
    marginLeft: theme.spacing(3),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
});


export const workShiftSelector = theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  container: {
    margin: theme.spacing(4),
  }
});


export const navigation = theme => ({ 
    root: {
      flexGrow: 1,
    },
  
    title: {
      marginRight: theme.spacing(2),
    },
    adminmode: {
      flexGrow: 1,
    },
});

export const welcome = theme => ({
  container: {
    margin: theme.spacing(10),
    textAlign: "center",
  },
  title: {
    width: '100%',
    marginTop: theme.spacing(3)
  }
})
