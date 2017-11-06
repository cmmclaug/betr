// Define auto formatting of dates in Blaze HTML templates
Template.registerHelper('formatDate', function(date) {
  return moment(date).format('MM-DD-YYYY HH:MM:SS');
});