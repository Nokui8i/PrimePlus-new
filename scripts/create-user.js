db = connect("mongodb://localhost:27017/primeplus");

db.User.insertOne({
  _id: ObjectId(),
  name: "Omri Amar",
  email: "omri.amar@example.com",
  username: "omriamar",
  nickname: "Omri",
  bio: "Welcome to my profile!",
  isOnline: true,
  lastSeen: new Date(),
  isVerifiedCreator: false,
  createdAt: new Date(),
  updatedAt: new Date()
}); 