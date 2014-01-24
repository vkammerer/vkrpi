var mongoose = require('mongoose'),
	_ = require('underscore'),
	Schema = mongoose.Schema;

var RfcdSchema = new Schema({
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
	oncode: {
		type: String,
		default: '',
		trim: true
	},
	offcode: {
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
	rpi: {
		type: Schema.ObjectId,
		ref: 'Rpi'
	}
});

var requiredFields = ['name', 'oncode', 'offcode'];

_.each(requiredFields, function(requiredField){
	RfcdSchema.path(requiredField).validate(function(name) {
		return name && name.length;
	}, requiredField + ' cannot be blank');
});

RfcdSchema.statics = {
	load: function(id, cb) {
		this.findOne({
			_id: id
		}).populate('rpi').exec(cb);
	}
};

mongoose.model('Rfcd', RfcdSchema);
