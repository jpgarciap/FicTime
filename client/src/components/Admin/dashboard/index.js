import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import LineChart from './charts/LineChart'
import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import * as Utils from '../../../constants/utils';


const styles = Utils.cardStyles;

class DashboardBase extends React.Component {

    render() {
        const { classes } = this.props;
        return (
            <div>
                <div className={classes.container}>
                    <Card>
                        <CardHeader title="Average start/end time per work shift in the last 30 days" />
                        <LineChart/>
                    </Card>
                </div>
                <div className={classes.container}>
                    <Card>
                        <CardHeader title="Media de horas trabajadas por turno" />
                        <CardContent>Lorem ipsum sic dolor amet...</CardContent>
                    </Card> 
                </div>
            </div> 
        )
    }

}

DashboardBase.propTypes = {
    classes: PropTypes.object.isRequired,
}

const Dashboard = withStyles(styles) (DashboardBase);

export default Dashboard;