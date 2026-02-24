import mongoose from "mongoose";
import Company from "./company.js";

const schema = mongoose.Schema;

const jobSchema = new schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  category: { type: String, required: true },
  level: { type: String, required: true },
  salary: { type: Number, required: true },
  date: { type: Number, required: true },
  visible: { type: Boolean, default: true },
companyId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Company',   // must match your Company model name
  required: true,
}
});

const Job = mongoose.model('Job', jobSchema);
export default Job