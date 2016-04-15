import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
});

if(Meteor.isClient){
    // client code goes here
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
})
}

Grades = new Mongo.Collection('grades');

