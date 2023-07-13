const express = require("express");
const app = express();
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
app.use(express.json());
const dbPath = path.join(__dirname, "restaurant.db");
let db = null;

const initilizationDbAndServer = async () => {
  try {
    db = await open({ filename: dbPath, driver: sqlite3.Database });
    app.listen(3000, () => {
      console.log("server running at http://localhost:3000");
    });
  } catch (e) {
    console.log(`Db Error ${e.message}`);
    process.exit(1);
  }
};

initilizationDbAndServer();

app.get("/owner/:ownerId/", async (request, response) => {
  const { ownerId } = request.params;
  const dbquery = `select * from owner ;`;
  const dbresponse = await db.all(dbquery);
  response.send(dbresponse);
});

// getting details of restaurant and its menuitems according to coupon code

app.post("/restaurant/", async (request, response) => {
  console.log(request.body);
  const bodydetails = request.body;
  const { location, couponCode } = bodydetails;
  const query = `select * from restaurantData join menuitems
   on restaurantData.id = menuitems.restaurantId 
   where location = '${location}' and couponCode = '${couponCode}';`;
  const dbresponse = await db.all(query);
  response.send(dbresponse);
});

// DATA WITH QUERY PARAMETERS
app.get("/restaurant/search/", async (request, response) => {
  console.log(request.query);
  const querydetails = request.query;
  const { location, couponCode } = querydetails;
  console.log(location);
  const query = `select * from restaurantData join menuitems
   on restaurantData.id = menuitems.restaurantId 
   where location = '${location}' and couponCode = '${couponCode}';`;
  const dbresponse = await db.all(query);
  response.send(dbresponse);
});

// get order details

app.get("/orderitems/:orderId/", async (request, response) => {
  const { orderId } = request.params;
  const query = `select restaurantData.restaurant_name,
  orderitem.orderid, sum(orderitem.quantity * menuitems.price) as bill
   from (orders join orderitem on 
  orders.id = orderitem.orderid )as t join 
   restaurantData on t.fromRestaurant = restaurantData.id 
   join menuitems on t.menuItemId = menuitems.id group by orderitem.orderid
   order by bill desc;`;
  const dbresponse = await db.all(query);
  response.send(dbresponse);
});

// add owner
app.post("/owner/", async (request, response) => {
  const { email, name } = request.body;
  const query = `insert into owner(name,email) 
    values('${name}','${email}')`;
  const dbresponse = await db.run(query);
  response.send("owner successfully added");
});
