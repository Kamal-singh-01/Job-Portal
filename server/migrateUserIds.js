import mongoose from "mongoose";
import { ObjectId } from "mongodb"; // needed to convert strings to ObjectId

const runMigration = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/yourDBName", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const JobApplication = mongoose.connection.collection("jobapplications");

    const cursor = JobApplication.find({});
    while (await cursor.hasNext()) {
      const app = await cursor.next();

      // convert userId if it's a string
      if (app.userId && typeof app.userId === "string") {
        await JobApplication.updateOne(
          { _id: app._id },
          { $set: { userId: new ObjectId(app.userId) } }
        );
      }

      // convert companyId if it's a string
      if (app.companyId && typeof app.companyId === "string") {
        await JobApplication.updateOne(
          { _id: app._id },
          { $set: { companyId: new ObjectId(app.companyId) } }
        );
      }
    }

    console.log("Migration complete ✅");
    process.exit(0);
  } catch (err) {
    console.error("Migration error:", err);
    process.exit(1);
  }
};

runMigration();
