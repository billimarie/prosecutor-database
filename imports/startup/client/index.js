import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { Attorneys } from '../../api/attorneys.js';

import '/client/main.html';

Template.currentProsecutors.helpers({
  attorneyGeneral() {
    return Attorneys.find( {
      "role" : "Attorney General"
    } );
  },
  usAttorney() {
    return Attorneys.find( {
      "role": "U.S. Attorney"
    } );
  },
  districtAttorney() {
    return Attorneys.find( {
      "role": "District Attorney"
    } );
  },
  municipalAttorney() {
    return Attorneys.find( {
      "role": "Municipal Attorney"
    } );
  },
  allAttorneys() {
    return Attorneys.find({});
  }
});
