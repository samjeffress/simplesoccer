GameConfigs = new Mongo.Collection("gameconfigs");
Games = new Mongo.Collection("games")

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
      Games.insert({
        gameTitle: event.target.gameTitle.value,
        playerList: event.target.playerList.value,
        createdAt: new Date(),
        status: "unstarted"
      });
      return false;
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
