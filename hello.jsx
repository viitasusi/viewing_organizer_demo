import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Button from 'react-bootstrap/lib/Button';
import lightBaseTheme from 'material-ui/lib/styles/baseThemes/lightBaseTheme';
import MuiThemeProvider from 'material-ui/lib/MuiThemeProvider';
import getMuiTheme from 'material-ui/lib/styles/getMuiTheme';
import {AppBar, Paper, Subheader, List, ListItem, Toggle, Dialog, Divider, RaisedButton} from 'material-ui';
import injectTapEventPlugin from 'react-tap-event-plugin';
//import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router'
import Table from 'material-ui/lib/table/table';
import TableHeaderColumn from 'material-ui/lib/table/table-header-column';
import TableRow from 'material-ui/lib/table/table-row';
import TableHeader from 'material-ui/lib/table/table-header';
import TableRowColumn from 'material-ui/lib/table/table-row-column';
import TableBody from 'material-ui/lib/table/table-body';
import {GeolocationMarker} from 'geolocation-marker/geolocation-marker';

injectTapEventPlugin();


const lightMuiTheme = getMuiTheme(lightBaseTheme);

var divStyle = {
    width: '1000px',
    height: '1000px'
};

var paperCss = {
 marginBottom: '20px',
 paddingTop: '10px',
 paddingBottom: '10px',
 width: '100%',
 paddingLeft: '5px',
 paddingRight: '5px'
}

var mapCss = {
    //marginBottom: '20px',
    paddingTop: '10px',
    paddingBottom: '10px',
    height: '400px',
    paddingLeft: '5px',
    paddingRight: '5px'
}

var topBarStyle = {
    height: '38px',
    fontSize: '24px',
    paddingTop: '5px',
    textAlign: 'center'
};

var centered = {
    textAlign: 'center'
}

function changeStatus(data, address) {
    console.log(data)
    $.ajax({
        type: 'post',
        url: "/updatestatus",
        data: JSON.stringify(data),
        success: function(response){
            console.log('success');
            for (var i = 0; i < gigsObject['giglist']['gigs'].length; i++) {
                console.log(gigsObject['giglist']['gigs'][i]['participants'].length);
                console.log("1")
                if(gigsObject['giglist']['gigs'][i]['address'] == address) {
                    console.log("2")
                    for(var j = 0; j < gigsObject['giglist']['gigs'][i]['participants'].length; j++) {
                        console.log("3")
                        console.log(data['name'])
                        console.log(gigsObject['giglist']['gigs'][i]['participants'][j]['name'])
                        if(gigsObject['giglist']['gigs'][i]['participants'][j]['name'] == data['name']) {
                            console.log("4")
                            console.log(gigsObject['giglist']['gigs'][i]['participants'][j]['status'])
                            console.log("----------")
                            gigsObject['giglist']['gigs'][i]['participants'][j]['status'] = 'attended'
                            console.log(gigsObject['giglist']['gigs'][i]['participants'][j]['status'])
                            mainrender(address);
                            return;
                        }
                    }
                }
            }
        }
    });
}

function loadData() {
    $.ajax({
        type: 'get',
        url: '/example',
        success: function(response){
            gigsObject = response;
            console.log('success_example');
            console.log(gigsObject);
            mainrender("list")
        }
    })
}

var gigsObject = {gigs: [{address:'loading', time: '', participants: []}]}

var Gigs = React.createClass ({
    showContent: function() {
        if(this.props.content === "list") {
            return <Giglist state={this.props.state}/>
        }
        else {
            for(var i = 0; i < gigsObject['gigs'].length; i++) {
                console.log("searching for the gig")
                console.log(this.props.content)
                console.log(gigsObject['gigs'][i]['address'])
                var a = JSON.stringify(this.props.content)
                var b = JSON.stringify(gigsObject['gigs'][i]['address'])
                if (a === b) {
                    return <Viewing gig={this.props.state.gigs[i]}/>
                    //<p>Apartment details</p>
                    /*
                    $('#d').append("apartment details")
                    $('#d').append(b)
                    $('#d').append(JSON.stringify(gigsObject['giglist']['gigs'][i]['time']))*/
                }
                else {
                    console.log("incorrect item")
                }
            }
        }
    },
    getInitialState: function() {
        return gigsObject;
    },
    componentDidMount: function () {
      loadData();
    },
    render: function() {
        return (
            <MuiThemeProvider muiTheme={lightMuiTheme}>
                <div>
                    <AppBar title="lifelife Apartment Viewings" showMenuIconButton=""/>
                    <div id="d">
                        {this.showContent()}
                    </div>
                </div>
            </MuiThemeProvider>
                )
    }
})

var Viewing = React.createClass({
    loadMap: function() {
        console.log("test")
        var latitude;
        var longitude;
        var geocoder = new google.maps.Geocoder();
        var address = this.props.gig.address;
        geocoder.geocode( { 'address': address}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                latitude = results[0].geometry.location.lat();
                longitude = results[0].geometry.location.lng();
                var aaa = new google.maps.Map(document.getElementById('map'), {center: {lat: latitude, lng: longitude}, zoom: 12});
                var marker = new google.maps.Marker({
                    position: {lat: latitude, lng: longitude},
                    map: aaa,
                    title: 'test' //this.props.gig.address
                });
                if (navigator.geolocation) {
                    var GeoMarker = new GeolocationMarker(aaa);
                    navigator.geolocation.getCurrentPosition(function(position) {
                        var pos = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };
                        //map.setCenter(pos);
                    }, function() {
                        //handleLocationError(true, infoWindow, map.getCenter());
                    });
                } else {
                    // Browser doesn't support Geolocation
                    //handleLocationError(false, infoWindow, map.getCenter());
                }

    }})
    },
    render: function() {
        return (
            <div>
                <Paper zDepth='3' style={paperCss}>
                <Subheader>Place and Time</Subheader>
                <p style={centered}>{this.props.gig.address}</p>
                <Divider/>
                <p style={centered}>{this.props.gig.time}</p>
                <Divider/>
                {this.loadMap()}
                </Paper>
                <Paper zDepth='3' style={paperCss}>
                <Subheader>Property on Map</Subheader>
                <div id='map' style={mapCss}></div>
                </Paper>
                <Paper zDepth='3' style={paperCss}>
                    <Listing/>
                </Paper>
                <Paper zDepth='3' style={paperCss}>
                <Participantlist data={this.props.gig}/>
                </Paper>
            </div>
        )
    }
})

var Listing = React.createClass({
    render: function() {
        return (
            <div>
                <Subheader>Listing</Subheader>
                <p style={centered}><a href="https://lifelife.io/en/properties/lutzelsteiner-weg-18-berlin" target="_blank">View Listing </a></p>
                <Divider/>
                <p  style={centered}>Submit Question</p>

                {/* **Submit questions to lifelife**
                <Divider/>
                <Dialog open ref="dialog" title="Dialogi">
                    <p>nappijakaikkee</p>
                </Dialog>
                */}
            </div>
        )
    }
})

var Participantlist = React.createClass ({
    render: function() {
        var address = this.props.data.address
        var participantNodes = this.props.data.participants.map(function(participant) {
            return (
                <Participant key={participant.name} participant={participant} address={address}/>
            );
        });
        return (
            <div className="participantList" >
                <Subheader>Participants</Subheader>
                <Table>
                    <TableHeader displaySelectAll="">
                        <TableRow>
                            <TableHeaderColumn>Participant</TableHeaderColumn>
                            <TableHeaderColumn>Attended</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {participantNodes}
                    </TableBody>
                </Table>

            </div>
        );
    }
});

var Participant = React.createClass ({
    updateStatus: function() {
        changeStatus(this.props.participant, this.props.address)
        return true
    },
    handleStatusChange: function() {
        //changeStatus({name: this.props.participant.name, status: 'attended'}, this.props.address)
    },
    render: function() {
        return (
            <TableRow>
                <TableRowColumn>
                    <p>
                    {this.props.participant.name}<br />
                    {this.props.participant.phone}<br />
                    {this.props.participant.email}
                    </p>
                </TableRowColumn>
                <TableRowColumn>
                    <Toggle onToggle={this.updateStatus} toggled={this.props.participant.status == 'attended'}/>
                </TableRowColumn>
            </TableRow>
        );
    }
});

var Giglist = React.createClass ({
    render: function() {
        var gigNodes = this.props.state.gigs.map(function(gig) {
            return (
                <ListItem key={gig.address}>
                    <Gig key={gig.address} address={gig.address} time={gig.time}/>
                    <Divider/>
                </ListItem>
            );
        });
        return (
            <div>
                <Paper zDepth='3' style={paperCss}>
                <List>
                <Subheader>Incoming Viewings</Subheader>
                {gigNodes}
                </List>
                </Paper>
            </div>
        );
    }
})

var Gig = React.createClass ({
    show: function() {
      mainrender(this.props.address)
    },
    render: function() {
        return (
            <div className='gig' onClick={this.show}>
            <p>{this.props.address}</p>
            <p>{this.props.time}</p>
            </div>
        )
    }
})

var Hello = React.createClass ({
    loadGig: function() {
        var map = {};
        $.get('/example', function(result){
            console.log(result)
            gigsObject = result
            if (this.isMounted()) {
                var latitude;
                var longitude;
                var geocoder = new google.maps.Geocoder();
                var address = result.address;
                geocoder.geocode( { 'address': address}, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        latitude = results[0].geometry.location.lat();
                        longitude = results[0].geometry.location.lng();
                        var aaa = new google.maps.Map(document.getElementById('map'), {center: {lat: latitude, lng: longitude}, zoom: 15});
                        var marker = new google.maps.Marker({
                            position: {lat: latitude, lng: longitude},
                            map: aaa,
                            title:result.address
                        });
                        this.setState({map: aaa});
                    }
                });
                this.setState({data: result});
            }
        }.bind(this));
    },
    getInitialState: function() {
        return gigsObject;
    },
    componentDidMount: function() {
      this.loadGig();
    },
    render: function() {
        return (
            <div>
                <div style={topBarStyle}>
                    <Glyphicon glyph="arrow-left" /> Job Details
                </div>
                {this.state.data.address}
                <div id='map' style={divStyle}></div>
                <Participantlist data={this.state.data}/>
            </div>

        );
    },
});

function mainrender(content) {
ReactDOM.render(
    <Gigs state={gigsObject} content={content}/>, document.getElementById('hello')
);
}

mainrender("list");



//let STATE3 = {giglist: {gigs: []}, map:''}
//let STATE2 = {giglist:{}}
