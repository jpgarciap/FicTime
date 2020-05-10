import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import * as Utils from '../../constants/utils';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { app } from '../Firebase/firebase'
import jsPDF from 'jspdf'
import * as COLORS from '../../constants/colors';
import 'jspdf-autotable';
const styles = Utils.registIncidence;

function convertDate(date) {
    return [pad(date.getDate()), pad(date.getMonth() + 1), date.getFullYear()].join('/')
}

function getTodayDateformat() {
    var today = new Date();
    return [today.getFullYear(), pad(today.getMonth() + 1), pad(today.getDate())].join('-')
}

function pad(s) { return (s < 10) ? '0' + s : s; }

function getLastMonthDateformat() {
    var today = new Date();
    today.setMonth(today.getMonth() - 1)
    return [today.getFullYear(), pad(today.getMonth() + 1), pad(today.getDate())].join('-')
}

class HistoricalBtnBase extends React.Component {

    constructor (props) {
        super(props);
        this.state = { 
            open: false,
            startDate: getLastMonthDateformat(),
            endDate: getTodayDateformat(),
        };
    }

    handleClickOpen = () => {
        this.setState({
            open: true
        })
    };
    
    handleClose = () => {
        this.setState({
            open: false
        })
    };

    handleExport = () => {

        var startDate = new Date(this.state.startDate);
        var endDate = new Date(this.state.endDate)
        app.firestore().collection('historicals')
        .where('user', '==', this.props.userDocId)
        .where('date', '>=', startDate)
        .where('date', '<=', endDate)
        .orderBy('date', 'desc')
        .get()
        .then(historicalDocs => {
            var rows = [];
            historicalDocs.forEach(historicalDoc => {
                var row = this.parseHistoricalData(historicalDoc.data());
                rows.push(row);
            });
            this.jsPdfGenerator(rows);
        });
    };

    parseHistoricalData = (historical) => {
        var date = historical.date == null ? "" : convertDate(historical.date.toDate());
        var start = historical.start == null ? "" : historical.start;
        var end = historical.end == null ? "" : historical.end;
        return [ date, start, end];
    }


    jsPdfGenerator = (data) => {
        const doc = new jsPDF()

        doc.autoTable({ html: '#my-table' })
        
        doc.autoTable({
            headStyles: { fillColor: COLORS.WATERMELON },
            head: [['Date', 'Start', 'End']],
            body: data,
        })
        
        doc.save('Historical.pdf')
    }

    onChange = event => {
        this.setState({
           [event.target.name] : event.target.value
        });
    };

    render() {
        const { classes } = this.props;
        const { open } = this.state;

        return(
            <div>
                <Button variant="contained" startIcon={<ImportExportIcon />} size="large" color="primary" onClick={this.handleClickOpen} className={classes.margin}>
                    Export Historical
                </Button>
                <Dialog open={open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Export Historical</DialogTitle>
                    <DialogContent>
                        <form className={classes.container}>
                            <TextField
                                label="Start Date"
                                type="date"
                                name="startDate"
                                defaultValue={this.state.startDate}
                                onChange={this.onChange}
                                className={classes.textField}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </form>
                        <form className={classes.container}>
                            <TextField
                                label="End Date"
                                type="date"
                                name="endDate"
                                defaultValue={this.state.endDate}
                                onChange={this.onChange}
                                className={classes.textField}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </form>                        
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.handleExport} color="primary">
                            Export
                        </Button>
                    </DialogActions>
                </Dialog>    
            </div>
        )
    }

}

HistoricalBtnBase.propTypes = {
    classes: PropTypes.object.isRequired,
};

const HistoricalBtn = withStyles(styles) (HistoricalBtnBase);
export default HistoricalBtn;