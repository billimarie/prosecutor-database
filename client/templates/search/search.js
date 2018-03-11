Template.search.onCreated( () => {
  let template = Template.instance();

  template.searchQuery = new ReactiveVar();
  template.searching = new ReactiveVar( false );

  template.autorun( () => {
    template.subscribe( 'Attorneys', template.searchQuery.get(), () => {
      setTimeout( () => {
        template.searching.set( false );
      }, 300 );
    });
  });
});

Template.search.helpers({
  searching() {
    return Template.instance().searching.get();
  },
  query() {
    return Template.instance().searchQuery.get();
  },
  Attorneys() {
    let Attorneys = Attorneys.find();
    if ( Attorneys ) {
      return Attorneys;
    }
  }
});

Template.search.events({
  'keyup [name="search"]' ( event, template ) {
    let value = event.target.value.trim();

    if ( value !== '' && event.keyCode === 13 ) {
      template.searchQuery.set( value );
      template.searching.set( true );
    }

    if ( value === '' ) {
      template.searchQuery.set( value );
    }
  }
});
