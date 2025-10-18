import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.js";

class Organization extends Model {}

Organization.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    organizationName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    gstNumber: { type: DataTypes.STRING, allowNull: false },
    mobileNumber: { type: DataTypes.STRING, allowNull: false }, // ✅ added mobile number
    role: { type: DataTypes.STRING, defaultValue: "organization" },
  },
  {
    sequelize,
    modelName: "Organization",
    tableName: "organizations",
    timestamps: true,
  }
);

export default Organization;
