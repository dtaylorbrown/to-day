const {
  DynamoDBClient,
  ScanCommand,
  GetItemCommand,
  UpdateItemCommand,
} = require("@aws-sdk/client-dynamodb");
import { marshall } from "@aws-sdk/util-dynamodb";
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
  const marshalledHabit = marshall(habit);

  // remove habitsId from marshalledHabit
  delete marshalledHabit.habitsId;

  // TODO - Refactor this to util ?!
  let UpdateExpression = "SET";
  let ExpressionAttributeNames = {} as any;
  let ExpressionAttributeValues = {} as any;
  for (const property in marshalledHabit) {
    UpdateExpression += ` #${property} = :${property},`;
    ExpressionAttributeNames["#" + property] = property;
    ExpressionAttributeValues[":" + property] =
      marshalledHabit[property as keyof Habit];
  }

  UpdateExpression = UpdateExpression.slice(0, -1);

  const params = {
    TableName: TABLE_NAME,
    Key: {
      habitsId: { S: habit.habitsId },
    },
    UpdateExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    ReturnValues: "ALL_NEW",
  };

  const command = new UpdateItemCommand(params);
  return await dynamoClient.send(command);
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
