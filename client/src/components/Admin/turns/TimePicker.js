import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { useField } from 'react-final-form';

const TimePicker = ({ name, label, defaultValue }) => {
    const {
        input: { onChange },
        meta: { touched, error }
    } = useField(name);

    const useStyles = makeStyles((theme) => ({
        container: {
            display: 'flex',
            flexWrap: 'wrap',
        },
        textField: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
            width: 200,
        },
    }));
  const classes = useStyles();

    return (
        <TextField
            name={name}
            margin="normal"
            label={label}
            onChange={onChange}
            className={classes.textField}
            error={!!(touched && error)}
            helperText={touched && error}
            defaultValue={defaultValue}
            type="time"
            InputLabelProps={{
                shrink: true,
            }}
            inputProps={{
                step: 300,
            }}
        />
    );
};

export default TimePicker;