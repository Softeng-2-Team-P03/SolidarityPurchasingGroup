# SolidarityPurchasingGroup

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

Username: `federico@spg.com`

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
- Description: Update the status of a booking 
- Request body: 
```
{ 
    "state": 2,
}
``` 
- Reponse: `200 OK` (success)
- Response body: authenticated user
- Error responses: `503 Internal Server Error` (generic error), `Database error during the update Booking state.`

### __Delete a Task__

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
| "Wallet"  REAL NOT NULL, | default = 0.0 |
| "Address"  TEXT NOT NULL |


| Table `Bookings` - contains | |
| ------ | --- |
| "Id"  INTEGER NOT NULL, | |
| "BookingStartDate"  TEXT NOT NULL, | format ISO 8601 ("yyyy-mm-dd")  used to know when the booking was issued |
| "UserId"  INTEGER NOT NULL, | |
| "TotalPrice"  REAL, | |
| "State"  INTEGER NOT NULL, | 0=issued, 1=pending for cancelation, 2=paid, 3=handed out|
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

### Database Structure

<img src="/assets/DBDesign_final.png" alt="SPGDatabase"/>
