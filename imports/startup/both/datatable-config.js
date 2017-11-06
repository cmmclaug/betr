import Tabular from 'meteor/aldeed:tabular';
import { Template } from 'meteor/templating';
import moment from 'moment';
import { Meteor } from 'meteor/meteor';
import { Bets } from '/imports/api/bets/bets.js';

new Tabular.Table({
  name: "BetTable",
  collection: Bets,
  columns: [
    {
      data: "createdAt",
      title: "Bet Created",
      render: function (val, type, doc) {
        if (val instanceof Date) {
          return moment(val).format('MM-DD-YYYY HH:MM:SS');
        } else {
          return "";
        }
      }
    },
    {data: "betState", title: "Bet State"},
    {data: "title", title: "Title"},
    {
        data: "creatorId", 
        title: "Creator",
        render: function( val, type, doc) {
          if( Meteor.isClient ){
            if( val ){
              return Meteor.users.findOne({ _id: val }).username;
             }
             else {
               return val;
             }
          }
        }
    },
    {
        data: "opponentId", 
        title: "Opponent",
        render: function( val, type, doc) {
          if( Meteor.isClient ){
            if( val ){
              return Meteor.users.findOne({ _id: val }).username;
             }
             else {
               return val;
             }
          }
        }
    },
    {
        title: "View",
        tmpl: Meteor.isClient && Template.viewButton,
		tmplContext(rowData) {
          return {
            item: rowData,
		   }
		}
    },
  ]
});