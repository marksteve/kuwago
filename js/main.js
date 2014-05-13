/** @jsx React.DOM */

function round(x, y) {
  y = y || 2;
  return Math.floor(x * Math.pow(10, y)) / Math.pow(10, y);
}

function api(path) {
  return '/thatsmyboard/api/index.php?__route__=' + path;
}

var Map = React.createClass({
  shouldComponentUpdate: function(nextProps) {
    return (
      !this.props.location ||
      nextProps.location.name != this.props.location.name
    );
  },
  componentDidUpdate: function() {
    if (!this.props.location) return;
    var loc = new google.maps.LatLng(
      this.props.location.x,
      this.props.location.y
    );
    var mapOptions = {
      zoom: 15,
      center: loc,
      mapTypeId: google.maps.MapTypeId.HYBRID
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
  componentWillMount: function() {
    this.animated = false;
  },
  componentDidUpdate: function(prevProps) {
    var ctx = this.refs.canvas.getDOMNode().getContext('2d');
    var labels = [];
    var data = [];
    var pos = parseInt(this.props.pos, 10);
    this.props.data.slice(pos, pos + 19).forEach(function(d) {
      labels.push(d.x);
      data.push(d.y);
    });
    switch (this.props.type) {
      case 'rainfall':
        var fillColor = "rgba(128, 192, 255, 0.1)";
        var strokeColor = "rgba(128, 192, 255, 1)";
        var pointColor = "rgba(128, 192, 255, 1)";
        break;
      case 'slope':
        var fillColor = "rgba(256, 192, 128, 0.1)";
        var strokeColor = "rgba(256, 192, 128, 1)";
        var pointColor = "rgba(256, 192, 128, 1)";
        break;
    }
    new Chart(ctx).Line({
      labels: labels,
      datasets: [
        {
          fillColor: fillColor,
          strokeColor: strokeColor,
          pointColor: pointColor,
          pointStrokeColor: "#333",
          data: data
        }
      ]
    }, {
      bezierCurve: false,
      scaleLineColor: "#999",
      scaleFontColor: "#999",
      scaleShowGridLines: false,
      animation: !this.animated
    });
    this.animated = true;
  },
  render: function() {
    var width = $(window).width() / 2 - 100;
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
    var current = round(this.props.data.y);
    var threshold = round(this.props.data.threshold);
    var className = "graph value " + this.props.type;
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

var Status = React.createClass({
  render: function() {
    var current = round(this.props.data.y);
    var threshold = round(this.props.data.threshold);
    var className = "graph status";
    var status;
    if (current >= threshold) {
      className += " warning";
      switch (this.props.type) {
        case 'rainfall':
          status = "Rainfall intensity at critical level. Chance of flooding is high.";
          break;
        case 'slope':
          status = "Slope displacement at critical level. Chance of soil erosion is high.";
          break;
      }
    } else {
      switch (this.props.type) {
        case 'rainfall':
          status = "Rainfall intensity at regular level.";
          break;
        case 'slope':
          status = "Slope displacement at regular level.";
          break;
      }
    }
    return (
      <div className={className}>
        {status}
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
    var currRainfall = this.props.rainfall[this.props.pos + 18];
    var currSlope = this.props.slope[this.props.pos + 18];
    return (
      <div>
        <div id="location">
          <select onChange={this.props.onChangeLocation}>{options}</select>
        </div>
        <div id="graphs">
          <TimeSeriesGraph
            type="rainfall"
            data={this.props.rainfall}
            pos={this.props.pos}
            title="Rainfall"
          />
          <Value
            type="rainfall"
            unit="mm"
            data={currRainfall}
          />
          <Status
            type="rainfall"
            data={currRainfall}
          />
          <TimeSeriesGraph
            type="slope"
            data={this.props.slope}
            pos={this.props.pos}
            title="Slope displacement"
          />
          <Value
            type="slope"
            unit="mm"
            data={currSlope}
          />
          <Status
            type="slope"
            data={currSlope}
          />
        </div>
      </div>
    );
  }
});

var App = React.createClass({
  getInitialState: function() {
    return {
      pos: 0,
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
    setInterval((function() {
      this.setState({pos: this.state.pos + 1});
    }).bind(this), 3000);
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
          pos={this.state.pos}
          locations={this.state.locations}
          rainfall={this.state.currLocation.rainfall}
          slope={this.state.currLocation.slope}
          onChangeLocation={this.changeLocation}
        />
      );
    } else {
      details = (
        <div id="graphs">
          <div className="graph">Loading&hellip;</div>
        </div>
      );
    }
    var owl =
      "   ___\n" +
      "__/_[])\n" +
      "  {O,O}\n" +
      "  /)_)\n" +
      '   " "';
    return (
      <div id="app">
        <h1>
          <pre>{owl}</pre>
          <span>KUWAGO</span>
        </h1>
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

