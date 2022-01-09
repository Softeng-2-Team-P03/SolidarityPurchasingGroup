# SolidarityPurchasingGroup

1. [SolidarityPurchasingGroup](#solidaritypurchasinggroup)
   1. [Team: P03](#team-p03)
   2. [React Client Application Routes](#react-client-application-routes)
   3. [Login samples to test the App](#login-samples-to-test-the-app)
      1. [Employee](#employee)
      2. [Client](#client)
      3. [Manager](#manager)
      4. [Farmer](#farmer)
      5. [Deliverer](#deliverer)
   4. [List of APIs offered by the server](#list-of-apis-offered-by-the-server)
      1. [Log in](#log-in)
      2. [Register new Client](#register-new-client)
      3. [Get All Users](#get-all-users)
      4. [Get List Of Products](#get-list-of-products)
      5. [Filter Products By TypeId](#filter-products-by-typeid)
      6. [Get List Of Types](#get-list-of-types)
      7. [Booking order](#booking-order)
      8. [Update Booking State](#update-booking-state)
      9. [Delete a Task](#delete-a-task)
      10. [Check for "enough credits" For a special Booking](#check-for-enough-credits-for-a-special-booking)
      11. [get Wallet Balance](#get-wallet-balance)
      12. [Send Available Product](#send-available-product)
      13. [Update Product State](#update-product-state)
      14. [get Orders](#get-orders)
      15. [get Orders filter by a special user](#get-orders-filter-by-a-special-user)
      16. [Add new product by farmer](#add-new-product-by-farmer)
      17. [Confirm Product Bookings](#confirm-product-bookings)
      18. [Confirm All Bookings](#confirm-all-bookings)
      19. [Confirm All Bookings Pending Cancelation](#confirm-all-bookings-pending-cancelation)
      20. [Send notifications by emails](#send-notifications-by-emails)
      21. [Send notification of available products (Telegram bot)](#send-notification-of-available-products-telegram-bot)
      22. [Update Booking](#update-booking)
   5. [Database Tables](#database-tables)
      1. [Database Structure](#database-structure)


## Team: P03

Team members:
* 290247 Micco Ferdinando
* 287871 Bianconi Luca
* 292496 Bincoletto Alessio
* 292479 Bodnarescul Paolo Stefanut
* 279240 Colangelo Maria Letizia
* 289587 Banouie Alireza
* 292457 De Florio Giovanni
## React Client Application Routes

- Route `/`: list of published surveys to wich unauthenticated users can reply
- Route `/login`: For Login Users.
- Route `/clients`: list of registered clients that only employee can see it.
- Route `/addClient`: the registration form to register new user.
- Route `/products`: list of product for show to all useres (authenticated and unauthenticated).
- Route `/orders`: the list of booked orders to show only for employee and manager.
- Route `/success`: show success after booking if booking finish with success status
## Login samples to test the App
A small list of usernames and plain text passwords for testing purposes.
### Employee

Username: `clodia@spg.com`

Password: `Mnbvcxz1234`

### Client

Username: `federico.clientespg@gmail.com`

Password: `26gKpQK9`

### Manager

Username: `luca@spg.com`

Password: `FgKECe4w`

### Farmer

Username: `paolo@spg.com`

Password: `eGB2VrUe`

### Deliverer

Username: `simone@spg.com`

Password: `+r[xe=kWpQ'4.2fT`

## List of APIs offered by the server

Provide a short description for API with the required parameters, follow the proposed structure.

* [HTTP Method] [URL, with any parameter]
* [One-line about what this API is doing]
* [Sample request, with body (if any)]
* [Sample response, with body (if any)]
* [Error responses, if any]


### Log in
- HTTP Method: `POST` URL: `/api/sessions`
- Description: authenticate the user who is trying to log in
- Request body: credentials of the user who is trying to log in
```
{ 
    "username": "email",
    "password": "password"
}
``` 
- Reponse: `200 OK` (success)
- Response body: authenticated user
```
{ 
    "id": id,
    "username": "email",
}
``` 
- Error responses: `500 Internal Server Error` (generic error), `401 Unauthorized User` (login failed)

### Register new Client
- HTTP Method: `POST` URL: `/api/new_client`
- Description: Sending user information to completing the registration of user
- Request body: all useres information for register in database
```
{ 

    "name": "Name",
    "surname": "Surname"
    "email": "xyz@xyz.com",
    "password": "password",
    "phoneNumber": "phoneNumber",
    "address": "Address"
}
``` 
- Reponse: `200 OK` (success)

- Error responses: `500 Internal Server Error` (generic error), `Database error during the creation of client.`

### Get All Users
- HTTP Method: `GET` URL: `/api/clients`
- Description: Get the list of useres for employee and manager
- Reponse: `200 OK` (success)
- Response body: authenticated user
```
[
    { 
        "id": 1,
        "name": "Name",
        "surname": "Surname"
        "email": "xyz@xyz.com",
        "accessType": 3,
        "wallet": 0.0,
        "password": "password",
        "phoneNumber": "phoneNumber",
        "address": "Address"
    },
    { 
        "id": 2,
        "name": "Name",
        "surname": "Surname"
        "email": "xyz@xyz.com",
        "accessType": 3,
        "wallet": 0.0,
        "password": "password",
        "phoneNumber": "phoneNumber",
        "address": "Address"
    },
]
``` 
- Error responses: `500 Internal Server Error`

### Get List Of Products
- HTTP Method: `GET` URL: `/api/products`
- Description: Get the list of products for all authenticated and unuthebticated useres
- Reponse: `200 OK` (success)
- Response body: list of products
```
[
    { 
        "id": 1,
        "farmerId": 1,
        "name": "Product 1"
        "description": "description",
        "quantity": 100,
        "state": 1 ,
        "typeId":1,
        "pricePerUnit": 0.0,
        "imagePath": "imagePath",
        "farmer":{
            "name":"Farmer's name",
            "surname":"Farmer's surname"
        }
    },
    { 
        "id": 2,
        "farmerId": 1,
        "name": "Product 1"
        "description": "description",
        "quantity": 100,
        "state": 1 ,
        "typeId":1,
        "pricePerUnit": 0.0,
        "imagePath": "imagePath",
        "farmer":{
            "name":"Farmer's name",
            "surname":"Farmer's surname"
        }
    },
]
``` 
- Error responses: `500 Internal Server Error`


### Filter Products By TypeId
- HTTP Method: `GET` URL: `/api/products/type/{typeId}`
- Description: Get the list of Products flitered by TypeId
- Reponse: `200 OK` (success)
- Response body: list of filtered products
```
[
    { 
        "id": 1,
        "farmerId": 1,
        "name": "Product 1"
        "description": "description",
        "quantity": 100,
        "state": 1 ,
        "typeId":1,
        "pricePerUnit": 0.0,
        "imagePath": "imagePath",
        "farmer":{
            "name":"Farmer's name",
            "surname":"Farmer's surname"
        }
    },
    { 
        "id": 2,
        "farmerId": 1,
        "name": "Product 1"
        "description": "description",
        "quantity": 100,
        "state": 1 ,
        "typeId":1,
        "pricePerUnit": 0.0,
        "imagePath": "imagePath",
        "farmer":{
            "name":"Farmer's name",
            "surname":"Farmer's surname"
        }
    },
]
``` 
- Error responses: `500 Internal Server Error`



### Get List Of Types
- HTTP Method: `GET` URL: `/api/types`
- Description: Get the list of Types
- Reponse: `200 OK` (success)
- Response body: list of Types
```
[
    { 
        "id": 1,
        "typeName": "typeName",
        
    },
    { 
        "id": 2,
        "typeName": "typeName",
        
    },
]
``` 
- Error responses: `500 Internal Server Error`

### Booking order
- HTTP Method: `POST` URL: `/api/booking`
- Description: Book one order by authnticated user
- Request body: the information of booking + the list of products dentro booking
```
{ 

    "bookingStartDate": "YYYY-MM-DD",
    "totalPrice": 100.0,
    "state": 1,
    "products": [
        {
            "productId":1,
            "quantity":60,
            "price":100
        },
        {
            "productId":2,
            "quantity":50,
            "price":100
        }
    ]
 
}
``` 
- Reponse: `200 OK` (success)
- Response body: Id of inserted Booking
```
{ 
    "id": id,
}
``` 

- Error responses: `503 Internal Server Error` (generic error), `Database error during the insert booking.`
- Error responses: `500 Internal Server Error`(generic error),`The minimum number of  product in booking is 1 .`

### Update Booking State
- HTTP Method: `PUT` URL: `/api/bookings/{id}`
- Description: Update the status of a booking ( 0=issued, 1=pending for cancelation, 2=paid, 3=handed out )
- Request body: 
```
{ 
    "state": 2,
}
``` 
- Reponse: `200 OK` (success)
- Response body: authenticated user
- Error responses: `503 Internal Server Error` (generic error), `Database error during the update Booking state.`

### Delete a Task

* DELETE `/api/deletebooking/:id`
* Description: Delete an existing order, identified by its code (passed by parameter).
* Request body: _None_
* Response: `204 OK` (success) or `503 Database error during the deletion of task` (generic error) or `404 Not Found` or `401 not authorized`.
* Response body: _None_

### Check for "enough credits" For a special Booking
- HTTP Method: `GET` URL: /api/clients/getRequiredChargeByBookingId?bookingId={id}`
- Description: return the needed credit for one booking, if rsualt <0 ==> client need to increase credit(how much money the client needs to recharge) else client have enough Credit
- Reponse: `200 OK` (success)
- Response body: authenticated user
```
    { 
       TotalPrice: -2
    }

``` 
- Error responses: `500 Internal Server Error`


### get Wallet Balance 
- HTTP Method: `GET` URL: /api/clients/getWallet`
- Description: When Client register an order we check how much money has in her/his wallet and controll it with current TotalPrice of booking  
- Reponse: `200 OK` (success)
- Response body: authenticated user
```
    { 
       Wallet: 0
    }

``` 
- Error responses: `500 Internal Server Error`

### Send Available Product
- HTTP Method: `PUT` URL: `/api/product/change-available-date/{Id}`
- Description: Update the available product by farmer
- Request body: 
```
{ 
    "availableDate": "yyyy-mm-dd",
    "Quantity":100
}
``` 
- Reponse: `200 OK` (success)
- Response body: authenticated user
- Error responses: `503 Internal Server Error` (generic error), `Database error during the update of Available Product`

### Update Product State
- HTTP Method: `PUT` URL: `/api/product/{State}/{Id}`
- Description: Update Product State to 1 for confirmed by farmer, to 2 for confirmed in warehouse
- Request body: 
```
    {
        "State": 1, 
        "Id":"1"
    }
``` 
- Reponse: `200 OK` (success)
- Response body: authenticated user
- Error responses: `503 Internal Server Error` (generic error), `Database error during the update of Available Product`,`403 Forbidden: User does not have`

### get Orders  
- HTTP Method: `GET` URL: `/api/bookings`
- Description: Shows all placed orders
- Reponse: `304 OK` (success)
- Response body: authenticated user
```
[
    {
        "BookingId":1,
        "UserName":"Luca",
        "UserSurname":"Abruzzi",
        "BookingStartDate":"2021-11-12",
        "UserId":1,
        "TotalPrice":22.5,
        "State":1,"PickupTime":"2021-11-12",
        "DeliveryTime":null
    },
    {
        "BookingId":2,
        "UserName":"Luca",
        "UserSurname":"Abruzzi",
        "BookingStartDate":"2021-11-12",
        "UserId":1,
        "TotalPrice":22.5,
        "State":1,
        "PickupTime":"2021-11-12",
        "DeliveryTime":null
    }
]
``` 
- Error responses: `500 Internal Server Error`,  `403 Forbidden: User does not have necessary permissions for this resource.`, `404 page not found`

### get Orders filter by a special user 
- HTTP Method: `GET` URL: `/api/users/{userId}/bookings`
- Description: Shows all placed orders for a special user
- Reponse: `304 OK` (success)
- Response body: authenticated user
```
[
    {
        "BookingId":1,
        "UserName":"Luca",
        "UserSurname":"Abruzzi",
        "BookingStartDate":"2021-11-12",
        "UserId":1,
        "TotalPrice":22.5,
        "State":1,"PickupTime":"2021-11-12",
        "DeliveryTime":null
    },
    {
        "BookingId":2,
        "UserName":"Luca",
        "UserSurname":"Abruzzi",
        "BookingStartDate":"2021-11-12",
        "UserId":1,
        "TotalPrice":22.5,
        "State":1,
        "PickupTime":"2021-11-12",
        "DeliveryTime":null
    }
]
``` 
- Error responses: `500 Internal Server Error`,  `403 Forbidden: User does not have necessary permissions for this resource.`, `404 page not found`

### Add new product by farmer
- HTTP Method: `POST` URL: `/api/product`
- Description: create a product by farmer
- Request body: all information about product 
```
{ 

    "name": "Name",
    "id": 0,
    "farmerId":1,
    "description": "descritpion",
    "quantity": 100,
    "state": 1,
    "typeId": 1,
    "pricePerUnit": 100
}
``` 
- Reponse: `200 OK` (success)

- Error responses: `500 Internal Server Error` (generic error), `Database error during the creation of client.`

### Confirm Product Bookings 
- HTTP Method: `GET` URL: `/api/confirmBookingProduct/:id`
- Description: (after Farmer has confirmed available product quantity) iterates into the bookings in cronological order by bookingId and decreases the available quantity in the product table confirming and charging for payment each order one by one until eventually manages the case where there is not enough product quantity available to confirm a booking.<br/>
If the confirmed quantity is not enough it gives all the remaining products to the booking in the confirmation process charging the client wallet only for the updated quantity and adds a notification in the notification table to let the user know about it.
- Reponse: `200 OK` (success) or `404 Not Found`
- Response body: *none*
- Error responses: `500 Internal Server Error`

### Confirm All Bookings 
- HTTP Method: `GET` URL: `/api/confirmAllBookings`
- Equivalent **cronjob** with schedule string: `0 9 * * 1` (Monday at 9am)
- Description: Api to receive payments for each booking having state = 0 = issued
 <br/> if a booking with state 0 = "issued" is linked to a client having a
 <br/>   wallet with credits > TotalPrice then decreases the wallet value and sets the booking state to 2 = "paid"
 <br/> else if wallet with credits < "paid" then it sets the booking state to 1 = "pending cancelation"<br/>
If the confirmed quantity is not enough it gives all the remaining products to the booking in the confirmation process charging the client wallet only for the updated quantity and adds a notification in the notification table to let the user know about it.
- Reponse: `200 OK` (success) or `404 Not Found`
- Response body: *none*
- Error responses: `500 Internal Server Error`


### Confirm All Bookings Pending Cancelation
- HTTP Method: `GET` URL: `/api/confirmAllBookingsPendingCancelation`
- Equivalent **cronjob** with schedule string: `59 23 * * 1` (Monday at 23:59)
- Description:  at 23.59 of monday a cronjob calls this api to process each booking having state = 1 = "pending cancelation"
 <br/> if a booking with state 1 = "pending cancelation" is linked to a client having a
 <br/>   wallet with credits > TotalPrice then decreases the wallet value and sets the booking state to 2 = "paid"
 <br/> else if wallet with credits < "paid" then it sets the booking state to 4 = "canceled"
- Reponse: `200 OK` (success) or `404 Not Found`
- Response body: *none*
- Error responses: `500 Internal Server Error`


### Send notifications by emails 
- HTTP Method: `GET` URL: `/api/send-mail-notifications`
- Equivalent **cronjob** with schedule string: `5 9 * * 1` (Monday at 09:05am)
- Description: Api to search all notifications logged in the notification table having notificationType=1 (notifications related to bookings) and send an email to each user having one or more notifications. for each sent notification, sets the status=1 (sent) in the database
- Reponse: `200 OK` (success)
- Response body: *none*
- Error responses: *none*

### Send notification of available products (Telegram bot)
- HTTP Method: `GET` URL: `/api/SNForAvailableProducts`
- Equivalent **cronjob** with schedule string: `* 9 * * 6` (Saturday at 09:00 am)
- Description:  Sends a notification to each user of the SPG's telegram bot to remind them thet new products are available for purchase
- Reponse: `200 OK` (success)
- Response body: *none*
- Error responses: `500 Internal Server Error`

### Update Booking
- HTTP Method: `PUT` URL: `/api/bookingUpdateByClient/`
- Description: Update a booking made by a client 
- Request body: 
```
{
    "bookingId":7,
    "deliveryTime": null,
    "totalSum":22.5,
    "pickupTime":"2021-11-12",
    "userId":3,
    "products":[
        {
            "productId":1,
            "quantity":2

        }
    ]
}
``` 
- Reponse: `200 OK` (success)
- Response body: {"lastID" : 0}
- Error responses: `503 Internal Server Error` (generic error),`500 Internal Server Error` (generic error), `401 Unauthorized User` (login failed)

## Database Tables
  
|Table `Users` - contains |  |
| ------ | --- |
| "Id"  INTEGER NOT NULL, | |
| "Password"  TEXT NOT NULL, | |
| "Name"  TEXT NOT NULL, | |
| "Surname"  TEXT NOT NULL, | |
| "Email"  TEXT NOT NULL, |
| "PhoneNumber" TEXT NOT NULL, |
| "AccessType"  INTEGER NOT NULL | 1-MANAGER, 2-EMPLOYEE, 3-CLIENT, 4-FARMER, 5-DELIVERER |
| "Wallet"  REAL NOT NULL, | DEFAULT = 0.0 |
| "Address"  TEXT NOT NULL |
| "UnretrievedCount" INTEGER | DEFAULT 0  |


| Table `Bookings` - contains | |
| ------ | --- |
| "Id"  INTEGER NOT NULL, | |
| "BookingStartDate"  TEXT NOT NULL, | format ISO 8601 ("yyyy-mm-dd")  used to know when the booking was issued |
| "UserId"  INTEGER NOT NULL, | |
| "TotalPrice"  REAL, | |
| "Paid"  REAL, | |
| "State"  INTEGER NOT NULL, | 0=issued, 1=pending for cancelation, 2=paid, 3=handed out, 4=canceled, 5=unretrieved|
| "PickupTime"  TEXT, | format ISO 8601 ("yyyy-mm-dd hh:mm") |
| "DeliveryTime"  TEXT, | format ISO 8601 ("yyyy-mm-dd hh:mm") |
| FOREIGN KEY("UserId") REFERENCES "Users"("Id"), | |
| PRIMARY KEY("Id") | |


| Table `Products` - contains | |
| ------ | --- |
| "Id"  INTEGER NOT NULL, | |
| "FarmerId"  INTEGER NOT NULL , | |
| "Name"  TEXT NOT NULL, | |
| "Description"  TEXT NOT NULL, | |
| "Quantity"  INTEGER NOT NULL, | |
| "State"  INTEGER, | 0="declared", 1="confirmed by farmer", 2="confirmed in warehouse"|
| "TypeId"  INTEGER NOT NULL, | |
| "ExpiringDate"  Text, | |
| "AvailableDate"  Text, | |
| PRIMARY KEY("Id"), | |
| FOREIGN KEY("FarmerId") REFERENCES "Users"("Id") | |


| Table `BookingAndProducts` - contains | |
| ------ | --- |
| "Id"  INTEGER NOT NULL, | |
| "BookingId"  INTEGER NOT NULL, | |
| "ProductId"  INTEGER NOT NULL, | |
| "Quantity"  INTEGER NOT NULL, | |
| "Price"  REAL NOT NULL, | |
| FOREIGN KEY("ProductId") REFERENCES "Products"("Id"), | |
| FOREIGN KEY("BookingId") REFERENCES "Bookings"("Id"), | |
| PRIMARY KEY("Id") | |

| Table `Candidates` - contains | |
| ------ | --- |
| "Id"  INTEGER NOT NULL, | |
| "Name"  TEXT NOT NULL, | |
| "Surname"  TEXT NOT NULL, | |
| "Email"  TEXT NOT NULL, | |
| "PhoneNumber"  TEXT, | |
| "Type"  INTEGER NOT NULL, | 0-FARMER, 1-DELIVERER |
| "Address"  TEXT NOT NULL, | |
| PRIMARY KEY("Id") | |

| Table `ProductTypes` - contains | |
| ------ | --- |
| "TypeId" INTEGER NOT NULL | |
| "TypeName" TEXT NOT NULL | |

| Table `ProductImages` - contains | |
| ------ | --- |
| "Id"  INTEGER NOT NULL, | |
| "ProductId"  INTEGER NOT NULL, | |
| "IsDefault"  INTEGER NOT NULL, | |
| "Path"  TEXT NOT NULL, | |
| FOREIGN KEY("ProductId") REFERENCES "Products"("Id"), | |
| PRIMARY KEY("Id") | |

| Table `Notifications` - contains | |
| ------ | --- |
| "NotificationId"  INTEGER NOT NULL, | |
| "UserId"  INTEGER NOT NULL, | |
| "NotificationHeader"  TEXT, | |
| "NotificationBody"  TEXT, | |
| "Visibility" INTEGER | 0-visible, 1-not visible|
| "NotificationType" INTEGER | 1- Booking Notification |
| "Status" INTEGER | 0-not sent , 1-sent|
| PRIMARY KEY("NotificationId") | |

| Table `UnretrievedFood` - contains | |
| ------ | --- |
| "Date"  TEXT NOT NULL, | |
| "ProductId"  INTEGER NOT NULL, | |
| "UnretrievedQuantity"  INTEGER NOT NULL, | |
| "ProductType"  INTEGER NOT NULL, | |
| "PickupTime" TEXT NOT NULL, | |
| PRIMARY KEY("Date", "ProductId") | |


| Table `Telegram` - contains | |
| ------ | --- |
| "ChatId"  TEXT NOT NULL, | |
| "Mobile"  TEXT NOT NULL, | |
| "HashedPassword"  TEXT NOT NULL, | |
| "Username"  TEXT NOT NULL, | |
| "SuccessLogin"  REAL NOT NULL DEFAULT 0 | |
| PRIMARY KEY("CatId") | |


### Database Structure

<img src="/assets/DBDesign_final.png" alt="SPGDatabase"/>
