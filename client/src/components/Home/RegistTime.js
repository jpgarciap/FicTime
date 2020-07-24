import React from 'react';
import { app } from '../Firebase/firebase'
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import InputIcon from '@material-ui/icons/Input';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Table from '@material-ui/core/Table';
import PropTypes from 'prop-types';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import * as Utils from '../../constants/utils';
import * as COLORS from '../../constants/colors';
import { compose } from 'recompose';
import IncidenceBtn from './IncidenceBtn';
import HistoricalBtn from './HistoricalBtn';
import { GreenButton } from '../../constants/buttons';
import MyClock from './Clock/clock';
import Grid from '@material-ui/core/Grid';
import InsertCommentIcon from '@material-ui/icons/InsertComment';
import TextField from '@material-ui/core/TextField';


const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: COLORS.WATERMELON,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }))(TableCell);
  
  const StyledTableRow = withStyles((theme) => ({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.background.default,
      },
    },
  }))(TableRow);
  
const styles = Utils.registTime;

function createData(dateWithoutFormat, start, end, commentStart, commentEnd) {
  var date = convertDate(dateWithoutFormat);
  return { date, start, end, commentStart, commentEnd};
}

function convertDate(date) {
  function pad(s) { return (s < 10) ? '0' + s : s; }
  return [pad(date.getDate()), pad(date.getMonth()+1), date.getFullYear()].join('/')
}

function isToday(date){
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
}

function getTime() {
  var today = new Date();
  var minutes = (today.getMinutes()<10?'0':'') + today.getMinutes();
  return today.getHours() + ":" + minutes;
}

function getTodayDateformat() {
  var today = new Date();
  function pad(s) { return (s < 10) ? '0' + s : s; }
  return [today.getFullYear(), pad(today.getMonth()+1), pad(today.getDate())].join('-')
}

class RegistTimeBase extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
      rows: [],
      actionBtns: {
        disableStart : true,
        disableEnd: true
      },
      width: 0,
      comment: '',
      userDocId: null,
      historicalTodayDocId: null
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
    this.updateDimensions();
    this.loadData();
  }

  updateDimensions = () => {
    this.setState({ width: window.innerWidth });
  };

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  loadData(){
    var email = this.props.email;    
    var historicals = app.firestore().collection('historicals');

    app.firestore()
    .collection('users').where('email','==', email)
    .get()
    .then(userDocs => {
        userDocs.forEach(userDoc => {
            historicals.where('user', '==', userDoc.id)
            .orderBy('date', 'desc')
            .limit(7)
            .get()
            .then(historicalDocs => {
                var result = [];
                var historicalTodayDocId = null;
                var actionBtns = { disableStart: false, disableEnd : false};
            
                historicalDocs.forEach(historicalDoc => {
                    var data = historicalDoc.data();

                    if ((data.date != null) && isToday(data.date.toDate())){
                      actionBtns.disableStart = (data.start != null) || (data.end != null);
                      actionBtns.disableEnd = (data.end != null);
                      historicalTodayDocId = historicalDoc.id;
                    }
                    var row = createData(data.date.toDate(), data.start, data.end, data.commentStart, data.commentEnd);
                    result.push(row);
                })
                this.setState({ rows: result, actionBtns: actionBtns, userDocId: userDoc.id, historicalTodayDocId: historicalTodayDocId });
            })            
        })

    });
  }


  onStart = () => {
    const { userDocId, historicalTodayDocId, comment } = this.state;
    var time = getTime();
    if (historicalTodayDocId == null){
      var historical = {
        date: new Date(getTodayDateformat()),
        user: userDocId,
        start: time, 
        commentStart: comment
      };
      this.addHistorical(historical);
    } else{
      var updateData = {
        start: time,
        commentStart: comment
      }
      this.updateHistorical(historicalTodayDocId, updateData);
    }
    this.loadData();
    this.setState({comment: ""})
    this.forceUpdate();
  };

  onChange = event => {
    this.setState({
       [event.target.name] : event.target.value
      });
  };

  onEnd = () => {
    const { userDocId, historicalTodayDocId, comment } = this.state;
    var time = getTime();

    if (historicalTodayDocId == null){
      var historical = {
        date: new Date(getTodayDateformat()),
        user: userDocId,
        end: time,
        commentEnd: comment
      };
      this.addHistorical(historical);
    } else{
      var updateData = {
        end: time,
        commentEnd: comment
      }
      this.updateHistorical(historicalTodayDocId, updateData);
    }
    this.loadData();
    this.setState({comment: ""})
    this.forceUpdate();
  }

  addHistorical (data) {
    app.firestore().collection('historicals').add(data)
      .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
      })
      .catch(function(error) {
        console.error("Error adding document: ", error);
      });
  }

  updateHistorical (historicalId, data) {
    var historicalDoc = app.firestore().collection('historicals').doc(historicalId);

    historicalDoc.update(data)
    .then(function() {
      console.log("Document successfully updated!");
    })
    .catch(function(error) {
      console.error("Error updating document: ", error);
    });
  }

  render() {

    const { classes } = this.props;
    const { actionBtns } = this.state;
    return(
      <div className={classes.container}>
          <Grid container justify="center" alignItems="center">
            <Grid item xs={5}>
              <MyClock/>
            </Grid>
          </Grid>
          <div>
              <GreenButton variant="contained" startIcon={<InputIcon />} size="large" onClick={this.onStart} className={classes.margin} disabled={actionBtns.disableStart} >Start</GreenButton>
              <Button variant="contained" startIcon={<ExitToAppIcon />} size="large" color="primary" onClick={this.onEnd} className={classes.margin} disabled={actionBtns.disableEnd}>End</Button>
          </div>
          <div>
            <Grid container spacing={1} justify="center" alignItems="flex-end">
              <Grid item>
                <InsertCommentIcon />
              </Grid>
              <Grid item>
                <TextField id = "comment"
                name="comment"
                label = "Comment"
                value = {this.state.comment}
                onChange = {this.onChange}
                inputProps={{ maxLength: 50 }} />
              </Grid>
            </Grid>
          </div>
          <div>
              { this.state.rows.length > 0 &&
                <TableContainer component={Paper} className={classes.tableContainer}>
                    <Table aria-label="customized table">
                        <TableHead>
                        <TableRow>
                            <StyledTableCell>Date</StyledTableCell>
                            <StyledTableCell align="right">Start</StyledTableCell>
                            <StyledTableCell align="right">End</StyledTableCell>
                            {this.state.width >= 760 ? <StyledTableCell align="center">Comments</StyledTableCell>: null}
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {this.state.rows.map((row) => (
                            <StyledTableRow key={row.date}>
                              <StyledTableCell component="th" scope="row">
                                  {row.date}
                              </StyledTableCell>
                              <StyledTableCell align="right">{row.start}</StyledTableCell>
                              <StyledTableCell align="right">{row.end}</StyledTableCell>
                              {this.state.width >= 760 ? <StyledTableCell align="center">{row.commentStart}{row.commentStart != null && row.commentStart.length > 0 ? "\n" : null}{row.commentEnd}</StyledTableCell>: null}
                            </StyledTableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
              }
          </div>
          <div>
              <IncidenceBtn variant="contained" userDocId={this.state.userDocId} className={classes.margin}/>
              <HistoricalBtn variant="contained" userDocId={this.state.userDocId} className={classes.margin}/>
          </div>          

      </div>
    )

      
  }

}

RegistTimeBase.propTypes = {
  classes: PropTypes.object.isRequired,
};

const RegistTime = compose(withStyles(styles)) (RegistTimeBase);

export default RegistTime;