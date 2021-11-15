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
| "State"  INTEGER NOT NULL, | 0=issued, 1=pending for cancelation, 2=confirmed |
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

### Database Structure

<img src="/assets/DBDesign_final.png" alt="SPGDatabase"/>
