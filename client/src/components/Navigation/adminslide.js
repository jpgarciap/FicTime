import * as React from "react";
import IosSwitchMaterialUi from "ios-switch-material-ui";
import * as COLORS from '../../constants/colors';
import Typography from '@material-ui/core/Typography';

class AdminSlide extends React.Component {

    render() {
        return (
            <div>
                <IosSwitchMaterialUi
                    defaultKnobOnLeft="true"
                    aspectRatio="4"
                    colorKnobOnLeft={COLORS.CARBON}
                    colorKnobOnRight={COLORS.WATERMELON}
                    onChange={this.handleChange}
                />
                <Typography variant="h6">Admin</Typography>
            </div>
        );
    }
  
    handleChange = (disable) => {
        console.log("jpjp disable " + disable);
    };
}

export default AdminSlide;


