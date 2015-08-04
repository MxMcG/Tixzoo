var loaderObj = {
    templates : [
    'tmpl/modal.html',
    'tmpl/ticketfeed.html',
    'tmpl/mainpage.html',
    'tmpl/postticket.html',
    'tmpl/userprofile.html',
    'tmpl/viewticket.html',
    'tmpl/confirmticket.html'
    ],
    css : [
    '../../css/bootstrap.css',
    '../../css/buttons.css',
    '../../css/media_queries.css',
    '../../css/normalize.css',
    '../../css/search.css',
    '../../css/slideshow.css',
    '../../css/style.css',
    '../../css/ticket-feed.css',
    '../../css/to-post-ticket.css',
    '../../css/date_test.css',
    '../../css/user-profile.css',
    '../../css/view-ticket.css'
  ]
};


//This function loads all templates into the view
function loadTemplates(templates) {
    $(templates).each(function() {
        var tempObj = $('<script>');
        tempObj.attr('type', 'text/x-handlebars');
        var dataTemplateName = this.substring(0, this.indexOf('.'));
        tempObj.attr('data-template-name', dataTemplateName);
        $.ajax({
            async: false,
            type: 'GET',
            url: 'js/views/' + this,
            success: function(resp) {
                tempObj.html(resp);
                $('body').append(tempObj);
            }
        });
    });

}
//This function loads all css into the html body
function loadCss(css) {
    $(css).each(function() {
        var tempObjCss = $('<style>');

        var dataTemplateNameCss = this.substring(0, this.indexOf('.'));
        $.ajax({
            async: false,
            type: 'GET',
            url: 'js/views/' + this,
            success: function(resp) {
                tempObjCss.html(resp);
                $('body').append(tempObjCss);
            }
        });
    });
}

loadCss(loaderObj.css);
loadTemplates(loaderObj.templates);

App = Ember.Application.create();

App.Router.map(function() {
  this.resource("ticket-feed", function(){
    this.route("buy", { path: "/:ticketID" });
  });
  this.resource("main-page", function(){
    this.route("load", { path: "/" });
  });
  this.resource("post-ticket", function(){
    this.route("load", { path: "/" });
  });
  this.resource("confirm-ticket", function(){
    this.route("load", { path: "/" });
  });
  this.resource("user-profile", function(){
    this.route("load", { path: "/" });
  });
  this.resource("view-ticket", function(){
    this.route("load", { path: "/" });
  });
});



App.ApplicationController = Ember.Controller.extend({
  username: '',
  password: '',
  loginSuccess: false,
  artist: '',
  artistText: 'Artist | Event',
  venue: '',
  venueText: 'Venue',
  date: '',
  dateText: 'Date',
  quantity: '',
  quantityText: 'Quantity',
  price: '',
  searchMag: 'img/searchbar1.png',
  ticketJson: [],
  tempTicketJson: [],
  init: function() {
    this._super();
    var that = this;
    var message = null;
    var xhr = $.ajax({
        url: "Rest/mainController.php",
        type: "GET",
        dataType:'json',
        data: {init: true},
          success: function(data){
            console.log(data);
              that.set('ticketJson',data["tickets"]);
              that.set('tempTicketJson',data["tickets"]);
              that.set('ticketEn',true);
            if(data["cookie"]){
              that.set('username',data["cookie"]["user"]["username"]);
              that.set('password',data["cookie"]["user"]["password"]);
              that.set('loginSuccess',true);
            }
          },
        error: function(data){
          console.log(data);
        }
        });

    if (xhr.status != 200) { // error
      message = { errorCode: xhr.status, errorMessage: xhr.statusText };
    }
    var url = window.location.href.split("/");
    if(url[3] === null || url[3] === ""){
      this.transitionToRoute('main-page');
    }
  },
    actions: {
    query: function() {
      // the current value of the text field
      var query = this.get('search');
      this.transitionToRoute('search', { query: query });
    }
  }
});

/*
 * ApplicationRoute
 */
App.ApplicationRoute = Ember.Route.extend({
  actions: {
    showModal: function(name, model) {

      this.render(name, {
        into: 'application',
        outlet: 'modal',
        model: model
      });
    },
    removeModal: function() {
      this.disconnectOutlet({
        outlet: 'modal',
        parentView: 'application'
      });
    }
  }
});


/*
 * IndexRoute
 */
App.IndexRoute = Ember.Route.extend({

  model: function() {
    return Ember.Object.create({ username: 'My username'});
  }
});

/*
 * LogoutModalController
 */
App.LogoutModalController = Ember.Controller.extend({
  actions: {
    logout: function() {
      alert('logout');
    }
  }
});

/*
 * MyModalComponent
 */
App.MyModalComponent = Ember.Component.extend({
  actions: {
    ok: function() {
      this.$('.modal').modal('hide');
      this.sendAction('ok');
    }
  },
  show: function() {
    this.$('.modal').modal().on('hidden.bs.modal', function() {
      this.sendAction('close');
    }.bind(this));
  }.on('didInsertElement')
});

