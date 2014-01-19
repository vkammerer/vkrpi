var mongoose = require('mongoose'),
	_ = require('underscore'),
	Schema = mongoose.Schema;

var TaskSchema = new Schema({
	name: {
		type: String,
		default: '',
		trim: true
	},
	description: {
		type: String,
		default: '',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	actions : [{
		gpio: {
			gpio : {
				type: Schema.ObjectId,
				ref: 'Gpio'
			},
			status : {
				type: String
			}
		},
		rfcd: {
			rfcd : {
				type: Schema.ObjectId,
				ref: 'Rfcd'
			},
			status: {
				type: String
			}
		},
		delay: {
			length: {
				type: Number
			}
		}
	}]
});

var requiredFields = ['name'];

_.each(requiredFields, function(requiredField){
	TaskSchema.path(requiredField).validate(function(name) {
		return name && name.length;
	}, requiredField + ' cannot be blank');
});

TaskSchema.statics = {
	load: function(id, cb) {
		this.findOne({
			_id: id
		}).exec(cb);
	}
};

mongoose.model('Task', TaskSchema);
