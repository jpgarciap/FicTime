import React from 'react';
import { AppBar } from 'react-admin';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles({
    root: {
        flexGrow: 1,
      },
    title: {
        flex: 1,
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
    },
    spacer: {
        flex: 1,
    },
});

const MyAppBar = props => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <AppBar color="primary">
                <Typography
                    variant="h6"
                    color="inherit"
                    className={classes.title}
                    id="react-admin-title"
                />
            </AppBar>
        </div>

    );
};

export default MyAppBar;