function calculateInterchange(playerList, timespan, playersOnFieldAtATime){
  // TODO: Get this right
  var percentageOfTimeOnFieldPerPlayer = playerList.length / playersOnFieldAtATime;
  var timespanBetweenSubstitution = timespan / playerList.length; 
  // only need to cover the case where we have more people than spots
  var interchange = [];
  for (i = 0; i < playerList.length; i++){
    var time = Math.floor(timespanBetweenSubstitution * i / 1000);
    var friendlyTime = moment.utc(timespanBetweenSubstitution * i).format("mm:ss");     
    if (i+1 == playerList.length){
      interchange.push(
        {
          on: playerList[i],
          off: playerList[0], 
          time: time,
          friendlyTime: friendlyTime
        });     
    }else{
      interchange.push(
        {
          on: playerList[i],
          off: playerList[i+1], 
          time: time,
          friendlyTime: friendlyTime
        });
    }
  }

  return interchange;
}

GameConfigs = new Mongo.Collection("gameconfigs");
Games = new Mongo.Collection("games")
Schedules = new Mongo.Collection("schedules")
Router.route('/', function(){
  this.render('home');
})
Router.route('/game')
Router.route('/game/:_id', function(){
  this.render('game', {
    data: function(){
      return Games.findOne({_id:this.params._id})
    }
  });
});

    
if (Meteor.isClient) {
  Template.gameConfig.helpers({
    configuration: function(){
      config = GameConfigs.find({});
      console.log(config);
      return config;
    }
  });

  Template.setupConfiguration.events({
    'submit .newConfiguration':function(event){
      event.preventDefault();
      console.log(event.target);
      GameConfigs.insert({
        subs: event.target.subs.value,
        intervalCount: event.target.intervalCount.value,
        intervalLength: event.target.intervalLength.value,
        playersOnField: event.target.playersOnField.value,
        createdAt: new Date()
      });
      return false;
    }
  });

  Template.setupGame.events({
    'submit .newGame':function(event){
      event.preventDefault();
      console.log(event.target);

      var players = [];
      existingPlayers =  $("[id^=player-]").each(function(){
        if(this.value.length > 0){
          players.push(this.value);
        }
      });

      config = GameConfigs.find({});
      cfg = config.fetch()[0];
      timespan = parseInt(cfg.intervalLength) * 60 * 1000;
      var schedule = calculateInterchange(players, timespan, parseInt(cfg.playersOnField));

      Games.insert({
        gameTitle: event.target.gameTitle.value,
        playerList: players,
        createdAt: new Date(),
        status: "unstarted",
        schedule: schedule,
        config: cfg
      });
      return false;
    },

    'keyup #playerList input':function(event){
      // Check if there is already a blank field
  console.log(event.target);
  var maxCounter = 0;
existingPlayers =  $("[id^=player-]").each(function(){
  var playerNumber = this.id.replace("player-", "");
  if (maxCounter < parseInt(playerNumber)){
    maxCounter = parseInt(playerNumber);
  }
});
  
      var text = event.target.value;
      if (text.length == 1){
        var container = document.getElementById("playerList");
        var input = document.createElement("input")
        input.type = "text"
        input.className = "form-control"
        input.placeholder = "another name"
        input.id = "player-" + (maxCounter + 1);
        container.appendChild(input);
      }
    }
  });

  Template.startableGames.helpers({
    unstartedGames: function(){
      return Games.find({status:"unstarted"});
    }
  });
}

if (Meteor.isServer) { 
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
