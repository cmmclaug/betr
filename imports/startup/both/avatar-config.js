import { Meteor } from 'meteor/meteor';

Avatar.setOptions({
  defaultImageUrl : "/img/user-default.svg",
  backgroundColor : "#FF6600",
  customImageProperty : 'profile.picture',
  imageSizes: {
    'large': 80,
    'profile': 160,
  } 
} );