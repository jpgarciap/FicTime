import React, {Component} from 'react';
import { withStyles } from '@material-ui/core';
import { Bar, Doughnut } from 'react-chartjs-2';
import PropTypes from 'prop-types';
import * as Utils from '../../../../constants/utils';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { app } from '../../../Firebase/firebase'
import FindReplaceIcon from '@material-ui/icons/FindReplace';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import jsPDF from 'jspdf';
import LinearProgress from '@material-ui/core/LinearProgress';


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

function generateColor (quantity) {
    var result = [];
    for (var i = 0; i < quantity; i++) {
        var color = '#' +  Math.random().toString(16).substr(-6);
        result.push(color);
    }
    return result;
}


function buildDougData(labels, data, backgroundColors, hoverBGColors) {
    return{
        labels: labels,
        datasets: [
            {
                label: 'Rainfall',
                backgroundColor: backgroundColors,
                hoverBackgroundColor: hoverBGColors,
                data: data
            }
        ]
    }
}

function buildBarData(labels, data, backgroundColors, hoverBGColors){
    return {
        labels: labels,
        datasets: [
            { 
                label: 'Average',
                backgroundColor: backgroundColors,
                borderColor: hoverBGColors,
                borderWidth: 1,
                data: data
            }   
        ]
    }
}

const optionsBar = {
    legend:{
        display:true,
        position:'right'
    }
};

const optionsDoug = {
    title:{
        display:true,
        text:'Records By Shift',
        fontSize:20
    },
    legend:{
        display:true,
        position:'right'
    }
}


class BarsChartBase extends Component {

    constructor (props){
        super(props);
        this.state = {
            loading: false,
            workShifts: [],
            barData: buildBarData([],[]),
            dougData: buildDougData(["None"], [100])
        }
    }

    componentDidMount() {
        app.firestore().collection('workShifts')
        .orderBy('name', 'desc')
        .get()
        .then(workShiftDocs => {
          var workShiftsDb = [];
          workShiftDocs.forEach(workShiftDoc => {
            var data = workShiftDoc.data();
            workShiftsDb.push({id: workShiftDoc.id, 
            value: {name: data.name,
                    start: data.startTime,
                    end: data.endTime
            }})
          })
          this.setState({workShifts: workShiftsDb});
        })
    }


    handleDownload = () => {
        var barChart = document.querySelector('#barChart');
        var dougChart = document.querySelector('#dougChart')
    
        var imgDataBar = barChart.toDataURL('image/png');
        var imgDataDoug = dougChart.toDataURL('image/png');

    
        var doc = new jsPDF('landscape');
        doc.text(15, 15, "Average hours worked per shift in the last 30 days");
        doc.addImage(imgDataBar, 'PNG', 20, 20, 200, 75);
        doc.addImage(imgDataDoug, 'PNG', 20, 120, 150, 75);
        doc.save('chart.pdf');
    }    

    calculateData = async () => {
        this.setState({loading: true});
        var rawData = await this.findData();
        var groupedData = this.groupData(rawData);
        var labels = this.getLabels(groupedData);
        var averages = this.getAverages(groupedData);
        var dataQuantity = this.getDataQuantity(groupedData);
        var backgroundColors = generateColor(labels.length);
        var hoverBGColors = generateColor(labels.length);
        var barData = buildBarData(labels,averages, backgroundColors, hoverBGColors);
        var dougData = buildDougData(labels, dataQuantity, backgroundColors, hoverBGColors);
        
        this.setState({barData: barData, dougData: dougData, loading: false});
    }

    getLabels(groupedData){
        var result = []
        for (var data of groupedData) {
            result.push(data.workShift);
        }
        return result;
    }

    getAverages(groupedData){
        var result = []
        for (var entry of groupedData){
            result.push(this.calculateAverage(entry.data));
        }
        return result;
    }

    calculateAverage(data){
        var count = 0;
        for (var value of data) {
          count += value;
        }
        return count > 0 ? (count/data.length).toFixed(2) : 0;
    }

    getDataQuantity(groupedData){
        var result = []
        for (var entry of groupedData){
            result.push(entry.data.length);
        }
        return result;
    }

    findData = async () => {
        var result = []
        let historicalRef = app.firestore().collection('historicals');
        let historicals = await historicalRef
                                .where('date', '>=', new Date(getLastMonthDateformat()))
                                .where('date', '<=', new Date(getTodayDateformat()))
                                .orderBy('date', 'asc')
                                .get();
        for (var historical of historicals.docs){
            let userDocId = historical.data().user;
            let userRef = app.firestore().collection('users');
            let userDoc = await userRef.doc(userDocId).get();
            if (userDoc.exists) {
                var historicalData = historical.data();
                var workShift = this.findWorkShiftById(userDoc.data().workShift);
                if (workShift != null) {
                    var workedTime = this.getWorkedTime(historicalData, workShift);
                    result.push({key: workShift.value.name, value: workedTime})
                }
            }
        }       
        return result;                         
    }

    getWorkedTime (historical, workShift) {
        var start = historical.start != null ? historical.start : workShift.value.start;
        var end = historical.end != null ? historical.end : workShift.value.end;
        var startInt = this.parseStringHourToNumber(start);
        var endInt = this.parseStringHourToNumber(end);

        var result = endInt - startInt;
        if (startInt > endInt) {
            result = result + 24
        }
        return result;
    }

    groupData (data) {
        var accumulatedData = [];

        for (var newEntry of data){
            var needAdd = true;
            for (var entry of accumulatedData) {
                if (entry.workShift === newEntry.key){
                    entry.data.push(newEntry.value);
                    needAdd = false;
                }
            }
            if (needAdd){
                accumulatedData.push({workShift: newEntry.key, data: [newEntry.value]});
            }            
        }
        return accumulatedData;
    }

    parseStringHourToNumber(stringHour) {
        var split = stringHour.split(':');
        return parseFloat(split[0]) + parseFloat(split[1]/60);
    }

    findWorkShiftById = (id) => {
        var workShifts = this.state.workShifts;
        for (var i = 0; i < workShifts.length; i++){
            var workShift = workShifts[i];
            if (workShift.id === id){
                return workShift;
            }
        }
        return null;
    }

    render() {
        const { classes } = this.props;
        const { loading } = this.state;

        return (
            <div>
                <div className={classes.container}>
                    <Grid justify="space-between" container>
                        <Grid item>
                            <Button disabled={this.state.loading} variant="contained" startIcon={<FindReplaceIcon />} size="small" color="primary" onClick={this.calculateData}>Calculate</Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" startIcon={<PictureAsPdfIcon />} size="small" color="primary" onClick={this.handleDownload}>Download</Button>
                        </Grid>
                    </Grid>
                </div>
                {loading && <LinearProgress color="secondary" />}
                <div className={classes.container}>
                    <Bar id="barChart" ref="barChart" data={this.state.barData} options={optionsBar}/>
                </div>
                <div className={classes.container}> 
                    <Doughnut id="dougChart" ref="dougChart" data={this.state.dougData} options={optionsDoug}/>
                </div>
            </div>

        );

    }


}


BarsChartBase.propTypes = {
    classes: PropTypes.object.isRequired,
}

const BarsChart = withStyles(styles) (BarsChartBase);

export default BarsChart;