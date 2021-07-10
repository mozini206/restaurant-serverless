const AWS = require('aws-sdk');
AWS.config.update( {
  region: 'sa-east-1'
});
const dynamodb = new AWS.DynamoDB.DocumentClient();
const dynamodbTableName = 'restaurant';
const restaurantPath = '/restaurant';
const restaurantsPath = '/restaurants';

exports.handler = async function(event) {
  console.log('Request event: ', event);
  let response;
  switch(true) {
    case event.httpMethod === 'GET' && event.path === restaurantPath:
        let lastRecord = await getLastRestaurantItem();
        console.log("lastRecord",JSON.parse(lastRecord.body))
        let data = JSON.parse(lastRecord.body);
         let prevId = data.Count;
        let randomNumber = getRandomInt(1,prevId);
        console.log("randomNumber",randomNumber);
        // let id =randomNumber;
        // console.log("id",id)
        response = await getRestaurantName(randomNumber);
        break;
    case event.httpMethod === 'GET' && event.path === restaurantsPath:
      response = await getRestaurantNames();
      break;
    case event.httpMethod === 'POST' && event.path === restaurantPath:
      response = await saveRestaurant(JSON.parse(event.body));
      break;
  }
  return response;
}

function getRandomInt(min, max) {
  console.log("data range", min,max)
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
async function saveRestaurant(requestBody) {
  console.log("requestBody",requestBody)
          let lastRecord = await getLastRestaurantItem();
        console.log("lastRecord",JSON.parse(lastRecord.body))
        let data = JSON.parse(lastRecord.body);
         let prevId = data.Count;
           console.log("prevId",prevId)
        let id = 0;
        if(prevId > 0){
          id = prevId + 1;
          console.log("final id if",id)
        }
        else{
          id =1;
             console.log("final id else",id)
        }
       console.log("ifsdfdff",id)
  let reqbody = {
    restaurantName : requestBody.restaurantName,
    restaurantId : id
  }
   console.log("final",reqbody)
  const params = {
    TableName: dynamodbTableName,
    Item: reqbody
  }
  return await dynamodb.put(params).promise().then(() => {
    const body = {
      Operation: 'SAVE',
      Message: 'SUCCESS',
      Item: reqbody
    }
    return buildResponse(200, body);
  }, (error) => {
    console.error('Do your custom error handling here. I am just gonna log it: ', error);
  })
}
async function getRestaurantName(restaurantId) {
  console.log("id",restaurantId)
  const params = {
    TableName: dynamodbTableName,
    Key: {
       'restaurantId' : restaurantId
    }
  }
  return await dynamodb.get(params).promise().then((response) => {
    console.log("response",response)
    return buildResponse(200, response.Item);
  }, (error) => {
    console.error('Error', error);
  });
}

async function getLastRestaurantItem() {
  const params = {
    TableName: dynamodbTableName
  }
  return await dynamodb.scan(params).promise().then((response) => {
    console.log("response",response)
    return buildResponse(200, response);
  }, (error) => {
    console.error('Error', error);
  });
}

async function getRestaurantNames() {
  const params = {
    TableName: dynamodbTableName
  }
  const allRestaurants = await scanDynamoRecords(params, []);
  const body = {
    restaurants: allRestaurants
  }
  return buildResponse(200, body);
}

async function scanDynamoRecords(scanParams, itemArray) {
  try {
    const dynamoData = await dynamodb.scan(scanParams).promise();
    itemArray = itemArray.concat(dynamoData.Items);
    if (dynamoData.LastEvaluatedKey) {
      scanParams.ExclusiveStartkey = dynamoData.LastEvaluatedKey;
      return await scanDynamoRecords(scanParams, itemArray);
    }
    return itemArray;
  } catch(error) {
    console.error('Error', error);
  }
}


function buildResponse(statusCode, body) {
  return {
    statusCode: statusCode,
    headers: {
      'Content-Type': 'application/json',
      "Access-Control-Allow-Headers" : "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
    },
    body: JSON.stringify(body)
  }
}