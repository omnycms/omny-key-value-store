const DB_TYPE = process.env.DB_TYPE || "files";

module.exports = () => {
  switch (DB_TYPE.toLowerCase()) {
    case "files":
      return require("./modules/files");
    case "dynamo":
    case "dynamodb":
      return require("./modules/dynamodb");
    default:
      throw new Error(`${DB_TYPE} is not a valid database type`);
  }
};
