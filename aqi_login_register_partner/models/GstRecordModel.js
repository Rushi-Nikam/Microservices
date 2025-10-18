import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.js";

class GstRecord extends Model {}

GstRecord.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    gst_number: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    company_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { sequelize, modelName: "GstRecord", tableName: "gst_records", timestamps: false }
);

export default GstRecord;
