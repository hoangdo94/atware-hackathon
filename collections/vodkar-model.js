/**
 * Created by hoangdo on 1/16/16.
 */
VodkarModel = new Meteor.Collection('vodkarModel');

VodkarModel.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

VodkarModel.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

let VodkarModelSchema = new SimpleSchema({
  "title": {
    type: String
  },
  "imageUrl": {
    type: String
  },
  "price": {
    type: Number
  }
});

VodkarModel.attachSchema(VodkarModelSchema);
