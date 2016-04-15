import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

// //Misc JQuery
// $(document).ready(function(){
// 	$('.edit').click(function(){
// 		event.preventDefault();
// 	 	$(this).closest('tr').find('input').removeAttr('readonly');
// 	 })
// })
//Couldn't get above to work in time so ignore.
//Intention was to remove the "readonly" form attribute when clicking the edit button.








if(Meteor.isClient){
    // client code goes here

 Meteor.subscribe('grades');
  //This allows us to see all the grades on the client.

Template.gradeTable.helpers({
  'ding': function() {  
    return Grades.find();
    //returns every document from the collection.
  },
})

Template.averageGrade.helpers({
  'boing': function() { 
  	var grades = Grades.find().fetch(); //return all grades as readable array.
  	var total = 0; //initialize total 
  	for (i = 0; i < grades.length; i++) {
  		total += grades[i].grade; 
  		//iterate through grades and add them up
  		//console.log(grades[i].grade) for testing values
  	}

  	avg = total /grades.length //avg formula
  	return avg
  }
})




Template.gradeTable.events({
  'submit form': function(event) {
  //adds a new grade.  
    event.preventDefault(); //STOP normal form behaviour (one page application, we don't need to go anywhere-else)
    var pupil = event.target.pupil.value;
    var subject = event.target.subject.value;
    var grade = parseInt(event.target.grade.value); //Extremely important to parseInt here or the grade will be a string and ruin the averaging later!
    Meteor.call('createNewGrade',pupil,subject,grade);
    event.target.pupil.value = "";
   	event.target.subject.value = "";
    event.target.grade.value = 0;
    //clear the forms after adding new grade
  },
  'click .delete': function(event) {
  //deletes the specified grade document.   
    event.preventDefault();
    var documentId = this._id; 
    Meteor.call('deleteGrade',documentId);
	},
	//'click .edit': function(event){
	//event.preventDefault();
	//$(".modify").attr("readonly","")
	//trying the above jquery code within the meteor event world. 
	//},
	'keyup [name=pupMod]': function(event) {
  //modify the specified grade pupil field for that document.   
    event.preventDefault();
    var documentId = this._id
    var latestVal = event.target.value;
    Meteor.call('nameChange',documentId,latestVal);
    },
    'keyup [name=subMod]': function(event) {
  //modify the specified grade subject field for that document.   
    event.preventDefault();
    var documentId = this._id
    var latestVal = event.target.value;
    Meteor.call('subjectChange',documentId,latestVal);
    },
    'keyup [name=gradeMod]': function(event) {
  //modify the specified "grade grade" field for that document.   
    event.preventDefault();
    var documentId = this._id
    var latestVal = parseInt(event.target.value);
    Meteor.call('gradeChange',documentId,latestVal);
    },

});
};

if(Meteor.isServer){
    // server code goes here

    Meteor.publish('grades', function releaseTheHounds(){
    	return Grades.find();
    });

    Meteor.methods({
    	'createNewGrade': function(pupil,subject,grade) {
    	Grades.insert({
    		pupil: pupil,
    		subject: subject,
    		grade: grade
    });
    },
    	'deleteGrade': function(documentId) {
    	 Grades.remove({
    	_id: documentId
    });
    	},
    	'nameChange': function(documentId,latestVal){
    		Grades.update({ _id : documentId},
     		{$set: {pupil: latestVal}}); 
    	},
    	'subjectChange': function(documentId,latestVal){
    		Grades.update({ _id : documentId},
     		{$set: {subject: latestVal}});
     	},
     	'gradeChange': function(documentId,latestVal){
    		Grades.update({ _id : documentId},
     		{$set: {grade: latestVal}}); 
    	}
    });
};

Grades = new Mongo.Collection('grades');

