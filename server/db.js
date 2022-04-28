const Mongoose = require("mongoose");

const localDB = `mongodb+srv://ryan_hutzley:JmubTsEEbbPXIjqA@cluster0.d718r.mongodb.net/riMeetingBooker?retryWrites=true&w=majority`;
const connectDB = async () => {
	await Mongoose.connect(localDB, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
	console.log("MongoDB Connected");
};
module.exports = connectDB;
