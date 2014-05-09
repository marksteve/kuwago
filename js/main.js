/** @jsx React.DOM */

function api(path) {
  return '/thatsmyboard/api/index.php?__route__=' + path;
}

var Map = React.createClass({
  componentDidUpdate: function() {
    if (!this.props.location) return;
    var loc = new google.maps.LatLng(
      this.props.location.x,
      this.props.location.y
    );
    var mapOptions = {
      zoom: 15,
      center: loc,
      mapTypeId: google.maps.MapTypeId.SATELLITE
    };
    var map = new google.maps.Map(this.getDOMNode(), mapOptions);
    var marker = new google.maps.Marker({
      animation: google.maps.Animation.DROP,
      position: loc,
      map: map,
      title: this.props.location.name
    });
  },
  render: function() {
    var style = {height: "100%"};
    return (
      <div style={style}></div>
    );
  }
});

var TimeSeriesGraph = React.createClass({
  componentDidUpdate: function() {
    var ctx = this.refs.canvas.getDOMNode().getContext('2d');
    var labels = [];
    var data = [];
    this.props.data.forEach(function(d) {
      labels.push(d.x);
      data.push(d.y);
    });
    new Chart(ctx).Line({
      labels: labels,
      datasets: [
        {
          fillColor: "rgba(128, 192, 255, 0.1)",
          strokeColor: "rgba(128, 192, 255, 1)",
          pointColor: "rgba(128, 192, 255, 1)",
          pointStrokeColor: "#333",
          data: data
        }
      ]
    }, {
      bezierCurve: false,
      scaleLineColor: "#999",
      scaleFontColor: "#999",
      scaleShowGridLines: false
    });
  },
  render: function() {
    var width = window.screen.width / 2 - 100;
    return (
      <div className="graph timeseries">
        <h2>{this.props.title}</h2>
        <canvas ref="canvas" width={width} />
      </div>
    );
  }
});

var Value = React.createClass({
  render: function() {
    var unit = this.props.unit;
    var current = Math.round(this.props.data.y);
    var threshold = Math.round(this.props.data.threshold);
    var className = "graph value";
    if (current >= threshold) {
      className += " warning";
    }
    return (
      <div className={className}>
        <div className="current">{current} {unit}</div>
        <div className="threshold">Threshold: {threshold} {unit}</div>
      </div>
    );
  }
});

var Details = React.createClass({
  render: function() {
    var options = [];
    this.props.locations.forEach(function(option, i) {
      options.push(
        <option key={i} value={i}>{option.name}</option>
      );
    });
    return (
      <div>
        <div id="location">
          <select onChange={this.props.onChangeLocation}>{options}</select>
        </div>
        <div id="graphs">
          <TimeSeriesGraph
            data={this.props.rainfall}
            title="Rainfall"
          />
          <Value
            unit="mm"
            data={this.props.rainfall[this.props.rainfall.length - 1]}
          />
          <TimeSeriesGraph
            data={this.props.slope}
            title="Slope displacement"
          />
          <Value
            unit="mm"
            data={this.props.slope[this.props.slope.length - 1]}
          />
        </div>
      </div>
    );
  }
});

var App = React.createClass({
  getInitialState: function() {
    return {
      locations: [],
      currLocation: null
    };
  },
  componentWillMount: function() {
    $.ajax({
      type: 'get',
      dataType: 'json',
      url: api('/locations.json')
    }).done((function(resp) {
      this.setState({currLocation: resp[0]});
      this.setState({locations: resp});
    }).bind(this));
  },
  changeLocation: function(e) {
    this.setState({
      currLocation: this.state.locations[e.target.value]
    });
  },
  render: function() {
    var details;
    if (this.state.currLocation) {
      details = (
        <Details
          locations={this.state.locations}
          rainfall={this.state.currLocation.rainfall}
          slope={this.state.currLocation.slope}
          onChangeLocation={this.changeLocation}
        />
      );
    } else {
      details = (
        <p>Loading&hellip;</p>
      );
    }
    return (
      <div id="app">
        <div id="map">
          <Map location={this.state.currLocation} />
        </div>
        <div id="details">
          {details}
        </div>
      </div>
    );
  }
});

React.renderComponent(
  <App />,
  document.body
);

