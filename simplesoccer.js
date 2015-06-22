GameConfigs = new Mongo.Collection("gameconfigs");

if (Meteor.isClient) {

  Template.gameConfig.helpers({
    configuration: function(){
      config = GameConfigs.find({});
      console.log(config);
      return config;
    }
  });

  Template.setupGame.events({
    'submit .newGame':function(events){
      console.log(events.target);
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
}

if (Meteor.isServer) { 
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
