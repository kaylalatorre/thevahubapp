const mongoose = require('mongoose');

var clientSchema = new mongoose.Schema({
	clienteID: String,
	companyRep: String,
	companyName: String,
	activeVA: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	recommVAs: [{
			VA: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
			status: String
	}],
	contactDate: Date
}, {collection: "Client"});

module.exports = mongoose.model('Client', clientSchema);