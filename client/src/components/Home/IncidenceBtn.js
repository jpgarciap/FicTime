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

const styles = Utils.registIncidence;

class IncidenceBtnBase extends React.Component {

    constructor (props) {
        super(props);
        this.state = { 
            open: false,
            date: "",
            type: "Start",
            hour: "07:30"
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

    handleRegist = () => {

        //TODO sin implementar
        // var dateToRegist = new Date(this.state.date);
        // app.firestore().collection('historicals')
        // .where('user', '==', this.props.userDocId)
        // .where('date', '==', dateToRegist)
        // .limit(1)
        // .get();

        console.log("jpjp click " + JSON.stringify(this.state));

        this.setState({
            open: false
        })
    };

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
                <Button variant="contained" startIcon={<NotificationImportantRoundedIcon />} size="large" color="primary" onClick={this.handleClickOpen} className={classes.margin}>
                    Incidence
                </Button>
                <Dialog open={open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Regist Incidence</DialogTitle>
                    <DialogContent>
                        <form className={classes.container}>
                            <TextField
                                id="date"
                                label="Date"
                                type="date"
                                required
                                name="date"
                                onChange={this.onChange}
                                className={classes.textField}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </form>
                        <form className={classes.container}>
                            <TextField
                                id="time"
                                label="Hour"
                                type="time"
                                required
                                name="time"
                                onChange={this.onChange}
                                defaultValue="07:30"
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