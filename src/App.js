import React, { Component } from 'react';
import './App.css';
import * as d3 from 'd3';

class App extends Component {
  constructor(props) {
    super(props);
    this.myReference = React.createRef();
  }

  componentDidMount() {
    this.update();
  }

  update(){

    const w = 1200;
    const h = 500;
    const padding = 60;
    const dataset = this.props.data;

    let tooltip = d3.select('#tooltip');

    const xScale = d3.scaleLinear()
                     .domain([d3.min(dataset['monthlyVariance'], (d) => d['year']), d3.max(dataset['monthlyVariance'], (d) => d['year'])])
                     .range([padding, w - padding]);
    const yScale = d3.scaleBand()
                     .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
                     .range([h - padding, padding]);
    const zScale = d3.scaleLinear()
                     .domain([d3.min(dataset['monthlyVariance'], (d) => d['variance']), d3.max(dataset['monthlyVariance'], (d) => d['variance'])])
                     .range([0, 450]);

    const svg = d3.select(this.myReference.current)
                  .append('svg')
                  .attr('width', w)
                  .attr('height', h);

    
    svg.selectAll('rect')
       .data(dataset['monthlyVariance'])
       .enter()
       .append('rect')
       .attr('class', 'cell')
       .attr('width', 5)
       .attr('height', 30)
       .attr('x', (d, i) => {
         return xScale(d['year']);
       })
       .attr('y', (d, i) => {
        return yScale(d['month'] - 1);
      })
       .attr('fill', (d) => {
         if(d['variance'] < -5.5){
           return dataset['color'][0];
         }else if(d['variance'] < -4){
           return dataset['color'][1];
         }else if(d['variance'] < -2.5){
           return dataset['color'][2];   
         }else if(d['variance'] < -0.9){
           return dataset['color'][3];
         }else if(d['variance'] < 0.5){
          return dataset['color'][4];
         }else if(d['variance'] < 2){
          return dataset['color'][5];
         }else if(d['variance'] < 3.5){
          return dataset['color'][6];
         }else return dataset['color'][7];
       })
       .attr('data-month', (d) => d['month'] - 1)
       .attr('data-year', (d) => d['year'])
       .attr('data-temp', (d) => d['variance'])
       .on('mouseover', (d, i) => {
        tooltip.transition()
               .style('visibility', 'visible')
               .style('left', d.pageX + 'px')
               .style('top', d.pageY - 50 + 'px');
        tooltip.html(
            'Year: ' +
            i.year + ' ,' +
            'Month: ' +
            i.month +
            '<br/>' +
            'variance: ' +
            i.variance
          );

        document.querySelector('#tooltip').setAttribute('data-year', i['year']);
      })
      .on('mouseout', () => {
        tooltip.transition()
               .style('visibility', 'hidden');
      });
;
    
    const yAxis = d3.axisLeft(yScale)
                    .tickFormat(function (month) {
                      var date = new Date(0);
                      date.setUTCMonth(month);
                      var format = d3.timeFormat('%B');
                      return format(date);
                    });
    const xAxis = d3.axisBottom(xScale)
                    .tickFormat(d3.format('d'));

    svg.append('g')
       .attr('transform', `translate(0, ${h - padding})`)
       .call(xAxis)
       .attr('id', 'x-axis');

    svg.append('g')
       .attr('transform', `translate(${padding}, 0)`)
       .call(yAxis)
       .attr('id', 'y-axis');

    const legend =  d3.select('#legend');

  
    legend.selectAll('rect')
          .data(dataset['color'])
          .enter()
          .append('rect')
          .attr('width', 60)
          .attr('height', 37.5)
          .attr('x', (d, i) => i * 56)
          .attr('y', 10)
          .attr('fill', (d, i) => d);

    const zAxis = d3.axisBottom(zScale);

    legend.append('g')
    .attr('transform', `translate(0, ${padding})`)
    .call(zAxis)
    .attr('id', 'z-axis');

  }
  state = {}
  render() { 
    return (
      <div className='App'>
        <h1 id='title'>Monthly Global Land-Surface Temperature</h1>
        <p id='description'>1753 - 2015: base temperature 8.66℃</p>
        <div className='contianer'>
          <div className='graph' ref={this.myReference}></div>
          <svg id="legend" width={500} height={75}></svg>
        </div>
        <div id='tooltip'></div>
      </div>
    );
  }
}
 
export default App;