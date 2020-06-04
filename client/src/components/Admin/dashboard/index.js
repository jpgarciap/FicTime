import React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import LineChart from './charts/LineChart'
import BarsChart from './charts/BarsChart';
import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import * as Utils from '../../../constants/utils';
import Grid from '@material-ui/core/Grid';

const styles = Utils.chartsStyles;

class DashboardBase extends React.Component {

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <Grid container spacing={3} justify="center" alignItems="center">
                    <Grid item xs={8}>
                        <Card className={classes.chart}>
                            <CardHeader title="Average start/end time per work shift in the last 30 days" />
                            <LineChart/>
                        </Card>
                    </Grid>
                    <Grid item xs={8}>
                        <Card className={classes.chart}>
                            <CardHeader title="Average hours worked per shift in the last 30 days" />
                            <BarsChart/>
                        </Card> 
                    </Grid>
                </Grid>
            </div> 
        )
    }

}

DashboardBase.propTypes = {
    classes: PropTypes.object.isRequired,
}

const Dashboard = withStyles(styles) (DashboardBase);

export default Dashboard;