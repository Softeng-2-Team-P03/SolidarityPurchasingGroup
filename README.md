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
- Route `/clients`: Show all clients for employee.
- Route `/addClient`: Show registration form for register new user.
- Route `/products`: Show all products.
- Route `/orders`: show the list of orders, only employee and manager can see it.
- Route `/success`: show success after booking if booking finish with success status
## Login samples to test the App
A small list of usernames and plain text passwords for testing purposes.
### Employee

Username: `put here username`

Password: `put here password`

### Client

Username: `put here username`

Password: `put here password`

### Manager

Username: `put here username`

Password: `put here password`

### Farmer

Username: `put here username`

Password: `put here password`

## List of APIs offered by the server

Provide a short description for API with the required parameters, follow the proposed structure.

* [HTTP Method] [URL, with any parameter]
* [One-line about what this API is doing]
* [Sample request, with body (if any)]
* [Sample response, with body (if any)]
* [Error responses, if any]

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
