const {
  DynamoDBClient,
  ScanCommand,
  GetItemCommand,
} = require("@aws-sdk/client-dynamodb");
require("dotenv").config();

type Habit = {
  habitsId: string;
  name: string;
  details?: string;
  createdAt: number;
};

const clientConfig = {
  region: process.env.AWS_DEFAULT_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
};

const dynamoClient = new DynamoDBClient(clientConfig);
const TABLE_NAME = "habits";

const getHabits = async () => {
  const params = {
    TableName: TABLE_NAME,
  };

  const command = new ScanCommand(params);
  return await dynamoClient.send(command);
};

const addOrUpdateHabit = async (habit: Habit) => {
  const params = {
    TableName: TABLE_NAME,
    Item: habit,
  };

  return await dynamoClient.updateItem(params).promise();
};

const getHabitById = async (habitsId: string) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      habitsId: { S: habitsId },
    },
  };

  const command = new GetItemCommand(params);
  return await dynamoClient.send(command);
};

const deleteHabitById = async (habitsId: string) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      habitsId: { S: habitsId },
    },
  };

  return await dynamoClient.deleteItem(params).promise();
};

export {
  dynamoClient,
  getHabits,
  addOrUpdateHabit,
  getHabitById,
  deleteHabitById,
};
