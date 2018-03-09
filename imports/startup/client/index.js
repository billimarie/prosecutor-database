import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { Attorneys } from '../../api/attorneys.js';

import '/client/main.html';

Template.registerHelper( 'findAttorneyType', (attorneyType) => {
  if (attorneyType === "Attorney General") {
    return Attorneys.find( {
      "role" : "Attorney General"
    } );
  } else if (attorneyType === "US Attorney") {
    return Attorneys.find( {
      "role": "U.S. Attorney"
    } );
  } else if (attorneyType === "District Attorney") {
    return Attorneys.find( {
      "role": "District Attorney"
    } );
  } else if(attorneyType === "Municipal Attorney") {
    return Attorneys.find( {
      "role": "Municipal Attorney"
    } );
  }
});

Template.currentProsecutors.helpers({
  allAttorneys() {
    return Attorneys.find({});
  }
});

Router.route('/', {
  name: 'home',
  template: 'home'
});

Router.route('/attorney/:name', {
  name: 'attorneyView',
  template: 'attorneyView',
  data: function(){
    var currentAttorney = this.params.name;
    return Attorneys.findOne({ name: currentAttorney });
  }
});

Router.route('/about', {
  name: 'about',
  template: 'about'
})

Router.configure({
  layoutTemplate: 'main'
});
