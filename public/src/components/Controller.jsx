var React = require('react');

var Utils = require('../utils');

var SettingStore   = require('../stores/SettingStore');
var ParameterStore = require('../stores/ParameterStore');

const MOVE_STOP  = require('../constants').MOVE_STOP;
const MOVE_START = require('../constants').MOVE_START;


class Controller extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			startStatus: MOVE_STOP
		};
		
		this.gstart = () => {
			const start = new Date().getTime();
			// console.log(start);
			return start;
		}
		
		this._onStartClick = () => {
			if(this.state.startStatus === MOVE_START){
				SettingStore.set({status: MOVE_STOP});
				this.refs.start.innerHTML = 'Start';
				this.state.startStatus = MOVE_STOP;
			}else{
				SettingStore.set({status: MOVE_START});
				this.refs.start.innerHTML = 'Stop';
				this.state.startStatus = MOVE_START;
			}
		};
		this._onJumpClick = () => {
			ParameterStore['set' + this.props.role]({ jumping: true });
		};
		
		this.handleKeyPress = () => {
			window.starr = new Date().getTime();
			// document.getElementById("score").innerHTML =window.starr;
			// console.log('enter press here! ', this.gstart());
			ParameterStore['set' + this.props.role]({ jumping: true });
		}
	}
	
	
	
	render(){
		return (
				<div style={{ position: 'absolute', left: 520, top: '0'}} onKeyPress={this.handleKeyPress} onClick={this._onJumpClick} ref="jump">
				<p>Score: <span id="score"></span></p>
					<a ref="start" className="button" style={{background: '#e50', cursor: 'pointer'}}
						onClick={() => { this._onStartClick(); this.handleKeyPress();}}>Start</a>
					<a ref="jump"  className="button" style={{background: '#05e', cursor: 'pointer'}}
						onClick={this._onJumpClick}>Jump</a>
						
				</div>
				
			);
	}

	shouldComponentUpdate(nextProps){
		if(this.props.gameStatus !== nextProps.gameStatus)
			return this.listen(nextProps.gameStatus), false;
		return true;
	}

	listen(gameStatus){
		if(gameStatus === MOVE_STOP){
			var stop = new Date().getTime();
			console.log(stop);
			console.log(window.starr);
			let gg = stop - window.starr;
			// let name = prompt('Username: ');
			console.log(gg, '');
			document.getElementById("score").innerHTML =gg;
			return clearInterval(this._timer);
		}
		this._timer = setInterval(() => {
			if(Utils.gameover(
					ParameterStore['get' + this.props.role](), 
					ParameterStore.getObstacle()
				)){
				this.gameover();		
			}
		}, this.props.v * 0.1);
	}

	gameover(){
		SettingStore.set({gameover: true});
		this._onStartClick();

		setTimeout(() => {
			ParameterStore.reset();
			SettingStore.set({gameover: false});
		}, 5000);
	}
}

module.exports = Controller;