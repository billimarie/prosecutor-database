import moment from 'moment';

// Register Date format helper
Template.registerHelper('formatDate', function(unixTimeStamp) {
    // js takes dates in milliseconds
    var date = new Date(unixTimeStamp * 1000);
    return moment(date).format('MM-DD-YYYY');
});