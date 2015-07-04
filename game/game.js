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

function calculateInterchange(playerList, timespan, playersOnFieldAtATime){
	// TODO: Get this right
	var percentageOfTimeOnFieldPerPlayer = playerList.length / playersOnFieldAtATime;
 	var timespanBetweenSubstitution = timespan / playerList.length; 
 	// only need to cover the case where we have more people than spots
 	var interchange = [];
 	for (i = 0; i < playerList.length; i++){
 		if (i+1 == playerList.length){
 	 	 	interchange.push(
	 	 		{
	 	 			on: playerList[i],
	 	 			off: playerList[0], 
	 	 			time: Math.floor(timespanBetweenSubstitution * i/1000)
	 	 		});			
 		}else{
	 	 	interchange.push(
	 	 		{
	 	 			on: playerList[i],
	 	 			off: playerList[i+1], 
	 	 			time: Math.floor(timespanBetweenSubstitution * i/1000)
	 	 		});
 	 	}
 	}

 	return interchange;
}

if (Meteor.isClient) {
	Template.game.helpers({
    configuration: function(){
      config = GameConfigs.find({});
      console.log(config);
      return config;
    }});

	Template.game.events({
		'submit .startGame':function(event){
		  event.preventDefault();

		  config = GameConfigs.find({});
			cfg = config.fetch()[0];
		  timespan = parseInt(cfg.intervalLength) * 60 * 1000;
			var interchange = calculateInterchange(this.playerList, timespan, parseInt(cfg.playersOnField));
console.log(interchange);

			timer(
		    timespan, // milliseconds
		    function(timeleft) { // called every step to update the visible countdown
		      document.getElementById('intervalElapsed').innerHTML = timeleft+" second(s)";
		      // work out the order & timing of interchange
		      var substitution = interchange.filter(function(i){return i.time == timeleft;});
		      
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