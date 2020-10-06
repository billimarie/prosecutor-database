// import { Template }  from 'meteor/templating';
import { BlazeRenderer, FlowRouter } from 'meteor/ostrio:flow-router-extra';
import moment from 'moment';

import { Attorneys } from '../../api/attorneys.js';

// import '/client/main.html';
// import '/client/templates/loading.html';

/**
 * HELPERS
 */

// Register Date format helper
Template.registerHelper('formatDate', function(unixTimeStamp) {
    // js takes dates in milliseconds
    var date = new Date(unixTimeStamp * 1000);
    return moment(date).format('MM-DD-YYYY');
});

Template.recentlyUpdated.helpers({
  recentUpdates(count) {
    return Attorneys
        .find({}, {
          fields: { name: 1, role: 1, state: 1 },
          sort: { '_id' : -1 },
          limit: 5
        }).fetch();
  }
})

Template.attorneyView.helpers({
  Attorneys() {
    return Attorneys.find().fetch();
  }
});

/**
 * ROUTES
 */

Meteor.call("getPoliceDonation", function(error, result) {
  let {signed,declinedToSign,noResponse} = result;
});

FlowRouter.route('/', {
    name: 'home',
    conf: {
        forceReRender: true
    },
    whileWaiting() {
        this.render('main', 'loading');
    },
    waitOn() {
        return import('/client/templates/pages/home.html');
    },
    action() {
        this.render('main', 'home');
    }
});

FlowRouter.route('/:state/:role/:name', {
    name: 'attorneyView',
    whileWaiting() {
        this.render('main', 'loading');
    },
    waitOn(params) {
        return [
            import('/client/templates/sections/attorney-view.html'),
            Meteor.subscribe('Attorneys', params.name)
        ];
    },
    data(params) {
        return Attorneys.findOne({ name: params.name })
    },
    action(params, qs, data) {
        this.render('main', 'attorneyView', data)
    }
})

FlowRouter.route('/about', {
    name: 'about',
    whileWaiting() {
        this.render('main', 'loading');
    },
    waitOn() {
        return import('/client/templates/pages/about.html')
    },
    action() {
        this.render('main', 'about');
    }
});

FlowRouter.route('/contributors', {
    name: 'contributors',
    whileWaiting() {
        this.render('main', 'loading');
    },
    waitOn() {
        // TODO this template is missing
        return import('/client/templates/pages/contributors.html')
    },
    action() {
        this.render('main', 'contributors');
    }
});

FlowRouter.route('/glossary', {
    name: 'glossary',
    whileWaiting() {
        this.render('main', 'loading');
    },
    waitOn() {
        return import('/client/templates/pages/glossary.html')
    },
    action() {
        this.render('main', 'glossary');
    }
});
