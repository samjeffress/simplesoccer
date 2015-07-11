// from http://stackoverflow.com/questions/1191865/code-for-a-simple-javascript-countdown-timer by Niet the Dark Absol
function timer(time,update,complete) {
  var start = new Date().getTime();
  var interval = setInterval(function() {
    var now = time-(new Date().getTime()-start);
    if( now <= 0) {
        clearInterval(interval);
        complete();
    }
    else update(Math.floor(now/1000));
  },100); // the smaller this number, the more accurate the timer will be
}

if (Meteor.isClient) {
	Template.game.helpers({
    configuration: function(){
      config = GameConfigs.find({});
      return config;
    },
  });

	Template.game.events({
		'submit .startGame':function(event){
		  event.preventDefault();
		  timespan = parseInt(this.config.intervalLength) * 60 * 1000;
var schedule = this.schedule;
			timer(
		    timespan, // milliseconds
		    function(timeleft) { // called every step to update the visible countdown
		      document.getElementById('intervalElapsed').innerHTML = timeleft+" second(s)";
		      // work out the order & timing of interchange
		      var substitution = schedule.filter(function(i){return i.time == timeleft;});
		      
					Session.set("timeLeft", timeleft);
		      if (substitution.length > 0){
		      	document.getElementById('substitution').innerHTML = "substitution: on:" + substitution[0].on + ", off: " + substitution[0].off + " at " + substitution[0].time;
		      }
		    },
		    function() { // what to do after
		      alert("Timer complete!");
		    }
			);
    
		}
	});

}