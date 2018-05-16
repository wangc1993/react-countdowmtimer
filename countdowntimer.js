import React, {Component} from 'react';

const MAX_ENDTIME = 48 * 60 * 60 * 1000;

function getParseString(time) {
  return time < 10 ? '0' + time : time.toString();
}

export default class CountdownTimer extends Component {
  constructor(props) {
    super(props);
    this.TimeRemaining = this.getTimeRemaining();
    this.state = {
        isRender: true,
        timeRemaining: this.TimeRemaining,
    };
  }

  updateRender(bool) {
    this.setState({
      isRender: bool
    });
  }

  componentWillMount() {
    if(this.state.timeRemaining < 0){
      this.props.updateCustom(this.props.id);
    }else if(this.state.timeRemaining > MAX_ENDTIME) {
      this.updateRender(false);
    }
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  getTimeRemaining() {
    if(this.props.endTime){
      return this.props.endTime.getTime() - new Date().getTime();
    }
    return Infinity;
  }

  tick() {
    let timeR = this.getTimeRemaining();
    if(timeR < 0){
      this.props.updateCustom(this.props.id);
    }else if(timeR > MAX_ENDTIME) {
      this.updateTR(timeR);
    }else{
      this.updateTR(timeR);
      this.state.isRender ? null : this.updateRender(true);
    }
  }

  updateTR(timeR) {
    this.setState({
      timeRemaining: timeR
    })
  }

  render() {
    const timer = [{
      id: 0,
      type: 'hours',
      number: '00'
    },
    {
      id: 1,
      type: 'minutes',
      number: '00'
    },
    {
      id: 2,
      type: 'seconds',
      number: '00'
    }];
    let totalSeconds = Math.round(this.state.timeRemaining / 1000);
    timer.forEach(time => {
      switch (time.type){
        case 'seconds':
          time.number = getParseString(parseInt(totalSeconds % 60, 10));
          break;
        case 'minutes':
          time.number = getParseString(parseInt(totalSeconds / 60, 10) % 60);
          break;
        case 'hours':
          time.number = getParseString(parseInt(totalSeconds / 3600, 10));
          break;
      }
    });
    return this.state.isRender ? (
      <div className="CountdownTimer">
        <p>Berakhir dalam</p>
        {timer.map(time =>
            <div key={time.id}>
              <span className="time">{time.number}</span>
              {time.type != 'seconds' ? <span className="colon">:</span> : null}
            </div>
          )}
      </div>
    ) : null
  }
}