/** @jsx React.DOM */

function api(path) {
  return '/thatsmyboard/api/index.php?__route__=' + path;
}

var Map = React.createClass({
  componentDidUpdate: function() {
    if (!this.props.location) return;
    var loc = new google.maps.LatLng(this.props.location.x, this.props.location.y);
    var mapOptions = {
      zoom: 15,
      center: loc
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

function randomData(x) {
  var data = {
    labels: [],
    data: []
  };
  for (var i = 0; i < x; i++) {
    data.labels.push(i);
    data.data.push(Math.random() * 10);
  }
  return data;
}

var TimeSeriesGraph = React.createClass({
  componentDidMount: function() {
    var ctx = this.refs.canvas.getDOMNode().getContext('2d');
    var data = randomData(10);
    new Chart(ctx).Line({
      labels: data.labels,
      datasets: [
        {
          fillColor: "rgba(128, 192, 255, 0.1)",
          strokeColor: "rgba(128, 192, 255, 1)",
          pointColor: "rgba(128, 192, 255, 1)",
          pointStrokeColor: "#333",
          data: data.data
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
    var current = Math.ceil(Math.random() * 100);
    var threshold = Math.ceil(Math.random() * 100);
    var unit = this.props.unit;
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
          <TimeSeriesGraph title="Rainfall" />
          <Value unit="mm" />
          <TimeSeriesGraph title="Slope displacement" />
          <Value unit="mm" />
        </div>
      </div>
    );
  }
});

var App = React.createClass({
  getInitialState: function() {
    return {
      locations: [],
      currLocation: null,
      slope: [],
      rainfall: []
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
    return (
      <div id="app">
        <div id="map"><Map location={this.state.currLocation} /></div>
        <div id="details">
          <Details
            locations={this.state.locations}
            onChangeLocation={this.changeLocation}
          />
        </div>
      </div>
    );
  }
});

React.renderComponent(
  <App />,
  document.body
);

