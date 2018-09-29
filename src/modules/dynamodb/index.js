const AWS = require("aws-sdk");

class DynamoStore {
  constructor(dynamo, table) {
    this.dynamo = dynamo || new AWS.DynamoDB.DocumentClient();
    this.table = table || "omny-documents";
  }
  getKey(pathParts) {
    const key = pathParts.pop();
    const path = pathParts.join("/");
    return { path, key };
  }
  async get(...pathParams) {
    const { path, key } = this.getKey(pathParams);
    const result = await this.dynamo.get({
      TableName: this.table,
      Key: { path, key }
    }).promise();
    if (result.Item && result.Item.value) {
      return JSON.parse(result.Item.value);
    };

    return null;
  }
  async set(value, ...pathParams) {
    const { path, key } = this.getKey(pathParams);
    await this.dynamo.set({
      TableName: this.table,
      Item: { path, key, value: JSON.stringify(value) }
    }).promise();
  }
  async list(...prefix) {
    const path = prefix.join("/");
    const results = await this.dynamo.query({
      TableName: 'Table',
      KeyConditionExpression: 'path = :path',
      ExpressionAttributeValues: {
        ':path': path
      }
    }).promise();
    return results.Items.map(i => JSON.parse(i.value));
  }
}

module.exports = DynamoStore;
