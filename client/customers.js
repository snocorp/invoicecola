/* jshint node: true */
/* global Iron, Meteor, ReactiveVar, Router, Template, Customers */
'use strict';

Template.CustomersEdit.onCreated(function() {
  this.nameError = new ReactiveVar('');
  this.descriptionError = new ReactiveVar('');

  this.description = new ReactiveVar('');

  var self = this;
  var id = Iron.controller().params._id;

  this.subscribe('customers', function() {
    var customer = Customers.findOne(id);
    self.description.set(customer.description);
  });
});

Template.CustomersEdit.events({
  'click #customers_edit_update_customer': function(event, template) {
    var error = false;
    var name = template.find('#customers_edit_name').value;
    var description = template.find('#customers_edit_description').value;
    var percentage = template.find('#customers_edit_percentage').value;

    if (name === null || name.length === 0) {
      template.nameError.set('Name is required');
      error = true;
    } else {
      template.nameError.set('');
    }

    if (description === null || description.length === 0) {
      template.descriptionError.set('Description is required');
      error = true;
    } else {
      template.descriptionError.set('');
    }

    if (error) return;

    var id = Iron.controller().params._id;
    Meteor.call(
      'updateCustomer',
      id,
      {
        name: name,
        description: description,
        percentage: percentage
      },
      function(error, result) {
        if (error) return;

        Router.go('customers.show', {_id: id});
      }
    );
  },
  'click #customers_edit_cancel': function(event, template) {
    var id = Iron.controller().params._id;
    Router.go('customers.show', {_id: id});
  },
  'keyup, change #customers_edit_description': function(event, template) {
    var description = template.find('#customers_edit_description').value;

    Template.instance().description.set(description);

    return true;
  }
});

Template.CustomersEdit.helpers({
  nameError: function() {
    return Template.instance().nameError.get();
  },
  descriptionError: function() {
    return Template.instance().descriptionError.get();
  },
  customer: function() {
    var id = Iron.controller().params._id;
    return Customers.findOne(id);
  },
  description: function() {
    return Template.instance().description.get();
  }
});

Template.CustomersNew.onCreated(function() {
  this.nameError = new ReactiveVar('');
  this.descriptionError = new ReactiveVar('');

  this.description = new ReactiveVar('');
});

Template.CustomersNew.events({
  'click #customers_new_create_customer': function(event, template) {
    var error = false;
    var name = template.find('#customers_new_name').value;
    var description = template.find('#customers_new_description').value;
    var percentage = template.find('#customers_new_percentage').value;

    if (name === null || name.length === 0) {
      template.nameError.set('Name is required');
      error = true;
    } else {
      template.nameError.set('');
    }

    if (description === null || description.length === 0) {
      template.descriptionError.set('Description is required');
      error = true;
    } else {
      template.descriptionError.set('');
    }

    if (error) return;

    var params = Iron.controller().params;

    Meteor.call(
      'createCustomer',
      {
        name: name,
        description: description,
        percentage: percentage
      },
      function(error, result) {
        if (error) return;

        if (params.query.route) {
          var route = params.query.route;
          delete params.query.route;

          Router.go(route, params.query);
        } else {
          Router.go('customers.show', {_id: result.id});
        }
      }
    );
  },
  'click #customers_new_cancel': function(event, template) {
    var params = Iron.controller().params;
    if (params.query.route) {
      var route = params.query.route;
      delete params.query.route;

      Router.go(route, params.query);
    } else {
      Router.go('customers');
    }
  },
  'keyup, change #customers_new_description': function(event, template) {
    var description = template.find('#customers_new_description').value;

    Template.instance().description.set(description);

    return true;
  }
});

Template.CustomersNew.helpers({
  nameError: function() {
    return Template.instance().nameError.get();
  },
  descriptionError: function() {
    return Template.instance().descriptionError.get();
  },
  description: function() {
    return Template.instance().description.get();
  }
});

Template.Customers.onCreated(function() {
  this.displayArchived = new ReactiveVar(false);
});

Template.Customers.events({
  'click #customers_toggle_display_archived': function(event, template) {
    var value = Template.instance().displayArchived.get();
    Template.instance().displayArchived.set(!value);
  }
});

Template.Customers.helpers({
  customers: function() {
    var selector = {
      userId: Meteor.userId()
    };

    if (!Template.instance().displayArchived.get()) {
      selector.active = true;
    }

    return Customers.find(selector, {
      sort: {
        name: 1
      }
    });
  },
  displayArchived: function() {
    return Template.instance().displayArchived.get();
  }
});

Template.CustomersShow.helpers({
  customer: function() {
    var id = Iron.controller().params._id;
    return Customers.findOne(id);
  }
});

Template.CustomersShow.events({
  'click #customers_show_edit_customer': function(event, template) {
    var id = Iron.controller().params._id;
    Router.go('customers.edit', {_id: id});
  },
  'click #customers_show_remove_customer': function(event, template) {
    var id = Iron.controller().params._id;
    Meteor.call('archiveCustomer', id);
  }
});
