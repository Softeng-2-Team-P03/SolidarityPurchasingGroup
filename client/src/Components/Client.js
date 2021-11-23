function ClientList(clients = []) {
    this.clients = clients;
    this.add = (t) => { this.clients.push(t) };
}

function Client(name, surname, email,password, phoneNumber, address, id, wallet) {//NOSONAR
    this.name = name;
    this.surname = surname;
    this.email = email;
    this.password = password;
    this.phoneNumber = phoneNumber;
    this.address = address;
    this.id = id;
    this.accessType= 3;
    this.wallet= wallet;
}


export { Client, ClientList };