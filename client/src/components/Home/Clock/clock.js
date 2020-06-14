import React from 'react';
import ReactAwesomeClock from "react-awesome-clock";

export default class MyClock extends React.Component {

  render() {
    return (
        <div>
            <ReactAwesomeClock
                clockSeparator= ":"
                style={{
                    color: "grey",
                    fontSize: 60,
                    textShadow: "0 0 10px grey",
                    fontFamily: "aerial"
                }}
            />

        </div>

    );
  }
}
