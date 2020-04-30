import React from 'react';
import PlacesAutocomplete, {geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import TextField from '@material-ui/core/TextField';
import * as COLORS from '../../../constants/colors';

export default class PlaceAutocomplete extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            location: this.props.record.location ? this.props.record.location : "",
            coordinates: {
                lat: null,
                lng: null
            }
        }
    }

    handleChange = location => {
        this.setState({ location });
    }

    handleSelect = location => {
        geocodeByAddress(location)
            .then(results => getLatLng(results[0]))
            .then(latLng => {
                this.setState({ location : location});
                this.setState({ coordinates: latLng });
                const form = this.props.formData;
                form.change('location', location);
                form.change('coordinates', latLng);
            })
            .catch(
                error => console.error('Error', error)
            );
    };


    render(){
        return (
            <div>
                <PlacesAutocomplete
                    value={this.state.location}
                    onChange={this.handleChange}
                    onSelect={this.handleSelect}
                >
                    {({ getInputProps, suggestions, getSuggestionItemProps, loading}) => (
                        <div>

                            <TextField
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                required
                                {...getInputProps()}
                                id="location"
                                label="Location"/>
                            <div>
                                {loading ? <div>...loading</div> : null}
                            
                                {suggestions.map(suggestion => {
                                    const className = suggestion.active
                                        ? 'suggestion-item--active'
                                        : 'suggestion-item';
                                    const style = suggestion.active
                                        ? { backgroundColor: COLORS.SKY, cursor: 'pointer', verticalAlign: "top"}
                                        : { backgroundColor: '#ffffff', cursor: 'pointer', verticalAlign: 'middle'};        
                                    return( 
                                        <div {...getSuggestionItemProps(suggestion, { className, style })}>
                                            <span>{suggestion.description}</span>
                                        </div>
                                    );
                                })}

                            </div>
                        </div>
                    )}
                </PlacesAutocomplete>
            </div>
        );

      }
}
