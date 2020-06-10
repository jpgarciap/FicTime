import * as React from "react";
import * as COLORS from '../../constants/colors';
import * as ROUTES from '../../constants/routes';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types' 
import { withRouter } from 'react-router'


class AdminSlideBase extends React.Component {

    static propTypes = {
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    }

    constructor (props) {
        super(props);
        this.state = { 
          checked: false
        };
        this._isMounted = false;
    }

    componentDidMount(){
        this._isMounted = true;
        this.setState({
            checked : this.props.location.pathname.includes('admin')
        });
    }

    componentWillUnmount(){
        this._isMounted = false;
    }

    handleChange = (event) => {
        if (event.target.checked){
            this.props.history.push(ROUTES.ADMIN);
        } else{
            this.props.history.push(ROUTES.LANDING);
        }

        this.setState({
            [event.target.name] : event.target.checked
        });
    };

    render() {
        const { location } = this.props
        const checked = location.pathname.includes('admin') && this.state.checked;
        return (
            <FormControlLabel
            control={<Switch checked={checked} color="primary" onChange={this.handleChange} name="checked"/>}
            label={<Typography variant="h6" style={{color: COLORS.WATERMELON}}>Admin</Typography>}          />
        );
    }
}

const AdminSlide = withRouter(AdminSlideBase)

export default AdminSlide;


