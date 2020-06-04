import React, {Component} from 'react';
import { Line } from 'react-chartjs-2';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import * as Utils from '../../../../constants/utils';
import { app } from '../../../Firebase/firebase'
import NativeSelect from '@material-ui/core/NativeSelect';
import Button from '@material-ui/core/Button';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import Grid from '@material-ui/core/Grid';
import jsPDF from 'jspdf';


function processAverage(startAverage, endAverage){
  var labels = [];
  var startData = [];
  var endData = [];

  for (var entryStart of startAverage){
    labels.push(entryStart.date);
    startData.push(entryStart.average);
  }
  for (var entryEnd of endAverage){
    endData.push(entryEnd.average);
  }
  return buildCharData(labels, startData, endData);
}

const optionsGraphic = {
  responsive: true,
  scales: {
    xAxes: [
      {
        ticks: {
          autoSkip: true,
          maxTicksLimit: 5
        }
      }
    ],
  },
  legend: {
    labels: {
      boxWidth: 25
    },
  },
  tooltips: {
    mode: 'nearest',
    intersect: true,
  }
};

function buildCharData(labels, starData, endData){
   return {
    labels: labels,
    datasets: [
      {
        label: 'Start',
        fill: false,
        lineTension: 0.1,
        backgroundColor: '#17FD07',
        borderColor: '#17FD07',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: '#17FD07',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: starData
      },
      {
        label: 'End',
        fill: false,
        lineTension: 0.1,
        backgroundColor: '#FD0707',
        borderColor: '#FD0707',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: '#FD0707',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: endData
      }
    ]
  }
}

const styles = Utils.workShiftSelector;

function pad(s) { return (s < 10) ? '0' + s : s; }

function getLastMonthDateformat() {
    var today = new Date();
    today.setMonth(today.getMonth() - 1)
    return [today.getFullYear(), pad(today.getMonth() + 1), pad(today.getDate())].join('-')
}

function getTodayDateformat() {
  var today = new Date();
  return [today.getFullYear(), pad(today.getMonth() + 1), pad(today.getDate())].join('-')
}

function convertDate(date) {
  function pad(s) { return (s < 10) ? '0' + s : s; }
  return [pad(date.getDate()), pad(date.getMonth()+1), date.getFullYear()].join('/')
}

class LineChartBase extends Component {

  constructor (props) {
    super(props);
    this.state = { 
      workShifts: [],
      charData: buildCharData([],[],[])
    };
  }

  componentDidMount() {
    app.firestore().collection('workShifts')
    .orderBy('name', 'desc')
    .get()
    .then(workShiftDocs => {
      var workShiftsDb = [];
      workShiftDocs.forEach(workShiftDoc => {
        var data = workShiftDoc.data();
        workShiftsDb.push({name: data.name, 
        value: {id: workShiftDoc.id,
                  start: data.startTime,
                  end: data.endTime
        }})
      })
      this.setState({workShifts: workShiftsDb});
    })

  }

  findWorkShiftById(id) {
    var result = {start: "00:00", end: "00:00"};
    this.state.workShifts.forEach(workShift => {
      if (workShift.value.id === id){
        result = {start: workShift.value.start, end: workShift.value.end};
      }
    })
    return result;
  };

  buildStartRegist(workShiftHourData, historical) {
    var date = convertDate(historical.date.toDate());
    var start = historical.start == null ? workShiftHourData.start : historical.start;
    return {date: date, value: start};
  }

  buildEndRegist(workShiftHourData, historical) {
    var date = convertDate(historical.date.toDate());
    var end = historical.end == null ? workShiftHourData.end : historical.end;
    return {date: date, value: end};
  }

  handleChange = async(event) => {
    if (event.target.value !== "NONE") {
      try {
        var startAccumulateData = [];
        var endAccumulateData = [];
        var workShiftHourData = this.findWorkShiftById(event.target.value);
        var historicals = await this.findHistoricals(event.target.value);
        this.accumulateData(historicals, workShiftHourData, startAccumulateData, endAccumulateData);
        var startAverage = this.calculateAverage(startAccumulateData);
        var endAverage = this.calculateAverage(endAccumulateData);
        this.setState({charData: processAverage(startAverage, endAverage)});

      } catch(err){
        console.log('ERROR')
      }      
    } else{
      this.setState({charData: buildCharData([], [], [])});

    }
  }

  handleDownload = event => {

    var chart = document.querySelector('#chart');
    
    var imgData = chart.toDataURL('image/png');
    var doc = new jsPDF('landscape');
    doc.text(15, 15, "Average start/end time per work shift in the last 30 days");
    doc.addImage(imgData, 'PNG', 20, 20);
    doc.save('chart.pdf');
  }

  findHistoricals = async(workShiftId) => {
    let usersRef = app.firestore().collection('users');
    let users = await usersRef.where('workShift', '==', workShiftId).get();
    var result = [];
    for (var user of users.docs) {
      let historicalRef = app.firestore().collection('historicals');
      let historicals = await historicalRef.where('user', '==', user.id)
            .where('date', '>=', new Date(getLastMonthDateformat()))
            .where('date', '<=', new Date(getTodayDateformat()))
            .orderBy('date', 'asc')
            .get()
      for (var historical of historicals.docs){
        result.push(historical.data());
      }
    }
    return result;
  } 

  accumulateData(historicals, workShiftHourData, startAccumulateData, endAccumulateData){
    historicals.forEach(historical => {
      var startRegist = this.buildStartRegist(workShiftHourData, historical);
      var endRegist = this.buildEndRegist(workShiftHourData, historical);
      this.addOrUpdateData(startAccumulateData, startRegist);
      this.addOrUpdateData(endAccumulateData, endRegist);
    })
  }
  
  calculateAverage(accumulatedData) {
    var result = []
    for(var i = 0; i < accumulatedData.length; i++){
      var entry = accumulatedData[i];
      var average = this.averageInArray(entry.data);
      result.push({date: entry.date, average: average})
    }
    return result;
  }

  averageInArray(array){
    var count = 0;
    for (var i = 0; i < array.length; i++) {
      var data = this.parseStringHourToNumber(array[i]);
      count += data;
    }
    return count > 0 ? (count/array.length).toFixed(2) : 0;
  }

  parseStringHourToNumber(stringHour) {
    var split = stringHour.split(':');
    return parseFloat(split[0]) + parseFloat(split[1]/60);
  }

  addOrUpdateData (accumulatedData, regist) {
    if (accumulatedData.length === 0){
      accumulatedData.push({date: regist.date, data: [regist.value]});
    } else{
      var needAdd = true;
      for (var i = 0; i < accumulatedData.length; i++) {
        var entry = accumulatedData[i];
        if (entry.date === regist.date){
          entry.data.push(regist.value);
          needAdd = false;
          break;
        }
      }
      if (needAdd){
        accumulatedData.push({date: regist.date, data: [regist.value]});
      }
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
          <div>
            <Grid justify="space-between" container>
              <Grid item>
                <FormControl className={classes.formControl}>
                <InputLabel> Work Shift</InputLabel>
                  <NativeSelect
                    onChange={this.handleChange}
                    >
                    <option value={"NONE"}></option>
                    { this.state.workShifts.map((workShift) =>
                      <option key={workShift.value.id} value={workShift.value.id}>{workShift.name}</option>
                    )}
                  </NativeSelect>
                </FormControl>
              </Grid>
              <Grid item>
                <Button variant="contained" startIcon={<PictureAsPdfIcon />} size="small" color="primary" onClick={this.handleDownload}>Download</Button>
              </Grid>
            </Grid>
          </div>
          <div>
            <Line id="chart" ref="chart" data={this.state.charData} options={optionsGraphic}/>
          </div>
      </div>
    );
  }
}

LineChartBase.propTypes = {
  classes: PropTypes.object.isRequired,
}
const LineChar = withStyles(styles) (LineChartBase);
export default LineChar;