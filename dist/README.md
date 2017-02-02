# Grafana Gauge Panel

This panel plugin provides a [FlipClock](http://flipclockjs.com/) based counter panel for [Grafana](http://www.grafana.org) 3.x

### Screenshots

##### Example counter

![Screenshot](https://raw.githubusercontent.com/saboorian/grafana-counter-panel/master/src/screenshots/counter1.png)

![Screencast](https://raw.githubusercontent.com/saboorian/grafana-counter-panel/master/src/screenshots/counter.gif)

## Building

This plugin relies on Grunt/NPM/Bower, typical build sequence:

```
npm install
bower install
grunt
```

For development, you can run:
```
grunt watch
```
The code will be parsed then copied into "dist" if "jslint" passes without errors.


## External Dependencies

* Grafana 3.x

## Build Dependencies

* npm
* bower
* grunt

#### Acknowledgements

This panel is based on [FlipClock](http://flipclockjs.com/) and built upon [Grafana gauge panel](https://github.com/briangann/grafana-gauge-panel) skeleton.

#### Changelog


##### v0.0.2
- Initial commit
