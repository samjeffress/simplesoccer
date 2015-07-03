GameConfigs = new Mongo.Collection("gameconfigs");
Games = new Mongo.Collection("games")
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

console.log($("[id^=player-]"));
var players = [];
existingPlayers =  $("[id^=player-]").each(function(){
  if(this.value.length > 0){
    players.push(this.value);
  }
});
console.log(players);
      // TODO: Get list of names from array of fields
      Games.insert({
        gameTitle: event.target.gameTitle.value,
        playerList: players,
        createdAt: new Date(),
        status: "unstarted"
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
