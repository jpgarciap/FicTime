import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import * as Utils from '../../constants/utils';
import NotificationImportantRoundedIcon from '@material-ui/icons/NotificationImportantRounded';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import { app } from '../Firebase/firebase'
import NativeSelect from '@material-ui/core/NativeSelect';
import InputLabel from '@material-ui/core/InputLabel';
import { YellowButton } from '../../constants/buttons';
import { Alert, AlertTitle } from '@material-ui/lab';


const styles = Utils.registIncidence;

class IncidenceBtnBase extends React.Component {

    constructor (props) {
        super(props);
        this.state = { 
            open: false,
            date: this.getTodayDateformat(),
            type: "Start",
            hour: "07:30",
            showAlert: false
        };
    }

    getTodayDateformat() {
        var today = new Date();
        function pad(s) { return (s < 10) ? '0' + s : s; }
        return [today.getFullYear(), pad(today.getMonth()+1), pad(today.getDate())].join('-')
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

    handleRegist = () => {
        var dateToRegist = new Date(this.state.date);
        app.firestore().collection('historicals')
        .where('user', '==', this.props.userDocId)
        .where('date', '==', dateToRegist)
        .limit(1)
        .get()
        .then(historicalDocs => {
            if (historicalDocs.size === 1){
                this.updateHistorical(historicalDocs.docs[0]);                
            } else {
                this.addHistorical();
            }
        });
    };

    updateHistorical (historical) {
        var data = historical.data();
        var canRegistStart = this.state.type === "Start" && data.start == null;
        var canRegistEnd = this.state.type === "End" && data.end == null;
        if (canRegistStart){
            this.updateEntry(historical.id, {start: this.state.hour })
        } else if (canRegistEnd){
            this.updateEntry(historical.id, {end: this.state.hour })
        } else {
            this.setState({showAlert: true});
        }
    }

    updateEntry(historicalId, data){
        var historicalDoc = app.firestore().collection('historicals').doc(historicalId);

        historicalDoc.update(data)
        .then(function() {
          console.log("Document successfully updated!");
          window.location.reload();
        })
        .catch(function(error) {
          console.error("Error updating document: ", error);
        });
    }

    addHistorical () {
        var historical = {
            date: new Date(this.state.date),
            user: this.props.userDocId
        };
        if (this.state.type === "Start") {
            historical["start"] = this.state.hour;
        } else {
            historical["end"] = this.state.hour;
        }

        app.firestore().collection('historicals').add(historical)
            .then(function(docRef) {
              window.location.reload();

            })
          .catch(function(error) {
            console.error("Error adding document: ", error);
          });
    }

    onChange = event => {
        this.setState({
           [event.target.name] : event.target.value
        });
    };

    closeAlert = () => {
        this.setState({ showAlert: false})
    }

    render() {
        const { classes } = this.props;
        const { open } = this.state;
        const today = new Date();
        return(
            <div>
                <YellowButton variant="contained" startIcon={<NotificationImportantRoundedIcon />} size="large" color="primary" onClick={this.handleClickOpen} className={classes.margin}>
                    Regist other day
                </YellowButton>
                <Dialog open={open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
                    {this.state.showAlert && 
                        <Alert severity="warning" onClose={this.closeAlert}>
                            <AlertTitle>Warning</AlertTitle>
                            you have already registered this day
                        </Alert>
                    }
                    <DialogTitle id="form-dialog-title">Regist other day</DialogTitle>
                    <DialogContent>
                        <form className={classes.container}>
                            <TextField
                                label="Date"
                                type="date"
                                maxdate={today}
                                name="date"
                                defaultValue={this.state.date}
                                onChange={this.onChange}
                                className={classes.textField}
                                InputProps={{ inputProps: { max: this.state.date } }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </form>
                        <form className={classes.container}>
                            <TextField
                                label="Hour"
                                type="time"
                                name="hour"
                                onChange={this.onChange}
                                defaultValue={this.state.hour}
                                className={classes.textField}
                                InputLabelProps={{
                                shrink: true,
                                }}
                                inputProps={{
                                step: 300, // 5 min
                                }}
                            />
                        </form>

                        <FormControl className={classes.formControl}>
                            <InputLabel>Type</InputLabel>
                            <NativeSelect
                                name="type"
                                value={this.state.type}
                                onChange={this.onChange}
                                >
                                <option value={"Start"}>Start</option>
                                <option value={"End"}>End</option>
                            </NativeSelect>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.handleRegist} color="primary">
                            Regist
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }

}

IncidenceBtnBase.propTypes = {
    classes: PropTypes.object.isRequired,
};

const IncidenceBtn = withStyles(styles) (IncidenceBtnBase);
export default IncidenceBtn;