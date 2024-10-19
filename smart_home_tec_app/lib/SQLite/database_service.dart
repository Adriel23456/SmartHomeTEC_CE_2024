import 'package:intl/intl.dart';
import 'package:path/path.dart';
import 'package:smart_home_tec_app/JSONmodels/assigned_device.dart';
import 'package:smart_home_tec_app/JSONmodels/certificate.dart';
import 'package:smart_home_tec_app/JSONmodels/chamber.dart';
import 'package:smart_home_tec_app/JSONmodels/chamber_association.dart';
import 'package:smart_home_tec_app/JSONmodels/clientes.dart';
import 'package:smart_home_tec_app/JSONmodels/usage_log.dart';
import 'package:smart_home_tec_app/pages/created_objects/constantes.dart';
import 'package:http/http.dart' as http;
import 'dart:convert'; // Para decodificar JSON
import 'package:sqflite/sqflite.dart';

class DatabaseService {
  final String apiUrl = 'http://192.168.0.100:8000/api';  // Reemplaza con tu IP y puerto

  final projectDatabaseName= "smarthomesqlitedb.db"; //will later replace the previous dbs

  String clientes = '''
  CREATE TABLE '$clientTableName' (
  email TEXT PRIMARY KEY,
  password TEXT,
  region TEXT,
  continent TEXT,
  country TEXT,
  name TEXT,
  middleName TEXT,
  lastName TEXT
  )
  ''';
  String chamber = '''
  CREATE TABLE '$chamberTableName' (
  chamberID INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  clientEmail TEXT
  )
  ''';
  String device = '''
  CREATE TABLE '$deviceTableName' (
  serialNumber INTEGER PRIMARY KEY,
  price INTEGER,
  state TEXT,
  brand TEXT,
  amountAvailable INTEGER,
  electricalConsumption TEXT,
  name TEXT,
  description TEXT,
  deviceTypeName TEXT,
  legalNum INTEGER
  )
  ''';
  String assignedDevice = '''
  CREATE TABLE '$assignedDeviceTableName' (
  assignedID INTEGER PRIMARY KEY,
  serialNumberDevice INTEGER,
  clientEmail TEXT,
  state TEXT
  )
  ''';
  //asignedID es el id del dispositivo asignado
  String chamberAssociation = '''
  CREATE TABLE '$chamberAssociationTableName' (
  associationID INTEGER PRIMARY KEY AUTOINCREMENT,
  associationStartDate TEXT,
  warrantyEndDate TEXT,
  chamberID INT,
  assignedID INT
  )
  ''';
  //serialNumberDevice is associated to serialNumber on device table
  String certificate = '''
  CREATE TABLE '$certificateTableName' (
  serialNumberDevice INTEGER PRIMARY KEY,
  brand TEXT,
  deviceTypeName TEXT,
  clientFullName TEXT,
  warrantyEndDate TEXT,
  warrantyStartDate TEXT,
  billNum INT,
  clientEmail TEXT
  )
  ''';
  //name is associated to deviceTypeName in Certificate table and device table
  String deviceType = '''
  CREATE TABLE '$deviceTypeTableName' (
  name TEXT PRIMARY KEY,
  description TEXT,
  warrantyDays INT
  )
  ''';
  //assignedID is foreign key to assignedDevice, 
  String usageLog = '''
  CREATE TABLE '$usageLogTableName'(
  logID INT PRIMARY KEY AUTOINCREMENT,
  startDate TEXT,
  startTime TEXT,
  endDate TEXT,
  endTime TEXT,
  totalHours TEXT,
  clientEmail TEXT,
  assignedID INT
  )
  ''';
  //RESETS ALL DATABASES
  Future<void> deleteAllDatabases() async {
    final dbPath = await getDatabasesPath();

    // Delete the "chambers.db" database
    final chamberDbPath = join(dbPath, projectDatabaseName);
    await deleteDatabase(chamberDbPath);
  }
  //---------------

  Future<Database> initDB() async {
    final dbpath = await getDatabasesPath();
    final path = join(dbpath, projectDatabaseName);

     return openDatabase(path, version: 1, onCreate: (db, version) async {
      // Execute the SQL for creating each table
      await db.execute(clientes);
      await db.execute(chamber);
      await db.execute(device);
      await db.execute(assignedDevice);
      await db.execute(chamberAssociation);
      await db.execute(certificate);
      await db.execute(deviceType);
      await db.execute(usageLog);
    });
  }

  
  //Generate 5 mock devices if table is empty
    // Generates 5 random devices for the device table
  Future<void> generateRandomDevices() async {
    final Database db = await initDB();

    // If the device table is empty, insert random data
    var result = await db.query(deviceTableName);
    if (result.isEmpty) {
      // Generate 5 device types
      List<Map<String, dynamic>> deviceTypes = List.generate(5, (index) {
        return {
          'name': 'Type${index + 1}',
          'description': 'Description for Type${index + 1}',
          'warrantyDays': (365 + index * 30),
        };
      });

      // Insert device types into the deviceType table
      for (var deviceType in deviceTypes) {
        await db.insert(deviceTypeTableName, deviceType);
      }

      // Generate 10 random devices, assigning one of the 5 device types to each
      List<Map<String, dynamic>> devices = List.generate(10, (index) {
        return {
          'serialNumber': index + 1,
          'price': (100 + index * 10),
          'state': 'New',
          'brand': 'Brand${index + 1}',
          'amountAvailable': (5 + index),
          'electricalConsumption': '${(100 + index * 10)}W',
          'name': 'Device${index + 1}',
          'description': 'Description for Device${index + 1}',
          'deviceTypeName': 'Type${(index % 5) + 1}',  // Assign one of the 5 device types
          'legalNum': 1000 + index,
        };
      });

      // Insert devices into the device table
      for (var device in devices) {
        await db.insert(deviceTableName, device);
      }
    }
  }
  //SYNC METHODS
  // Método para obtener todos los clientes desde la API
  Future<List<Clientes>> fetchClientes() async {
    final response = await http.get(Uri.parse('$apiUrl/clientes'));

    if (response.statusCode == 200) {
      List<dynamic> clientesJson = json.decode(response.body);
      
      // Mapeamos cada JSON en una lista de objetos Clientes
      return clientesJson.map((json) => Clientes.fromJson(json)).toList();
    } else {
      throw Exception('Error al obtener los clientes');
    }
  }

  // Método para actualizar un cliente existente en el API
  Future<void> updateCliente(Clientes cliente) async {
    final response = await http.put(
      Uri.parse('$apiUrl/clientes/${cliente.email}'),  // Asumo que el endpoint usa el email como ID
      headers: {
        'Content-Type': 'application/json',
      },
      body: json.encode(cliente.toJson()),
    );

    if (response.statusCode != 200) {
      throw Exception('Error al actualizar el cliente');
    }
  }



  // Método para agregar un nuevo cliente a través del API
  Future<void> postCliente(Clientes cliente) async {
    final response = await http.post(
      Uri.parse('$apiUrl/clientes'),
      headers: {
        'Content-Type': 'application/json',
      },
      body: json.encode(cliente.toJson()),
    );

    if (response.statusCode != 201) {
      throw Exception('Error al crear el cliente');
    }
  }

  // Método para eliminar un cliente a través del API
  Future<void> deleteCliente(String email) async {
    final response = await http.delete(
      Uri.parse('$apiUrl/clientes/$email'),
    );

    if (response.statusCode != 200) {
      throw Exception('Error al eliminar el cliente');
    }
  }

  //Ejemplo
  Future<void> syncClientes() async {
    // Primero obtienes los clientes desde el servidor
    List<Clientes> clientesRemotos = await fetchClientes();

    // Puedes iterar y actualizar la base de datos local con los clientes del servidor
    for (Clientes cliente in clientesRemotos) {
      bool existeLocalmente = await clienteExists(cliente.email);
      
      if (!existeLocalmente) {
        await postCliente(cliente); // Método para insertar en la base de datos local
      } else {
        // Puedes también actualizar si ya existe
        await updateCliente(cliente);
      }
    }
  }





  

  //logUsage table methods
  //checks if the log for a device has been created
  Future<bool> logExists(String clientEmail, int assignedID) async {
    final Database db = await initDB();
    // == select * from usageLog where clientEmail....
    // check if the log exists for the device assigned for the specific client
    //an usage log is created when the device is on
    var result = await db.query(usageLogTableName,
     where: "clientEmail = ? AND assignedID = ? ",
     whereArgs: [clientEmail, assignedID]);
    if(result.isNotEmpty){
      return true;
    }else{
      return false;
    }
  }

  //Device methods/

  //gets the assignedID for a device
  Future<int> getDeviceAssignedID(String clientEmail, int serialNumber)async{
    final Database db = await initDB();
    var result= await db.query(assignedDeviceTableName,
    columns: ["assignedID"],
    where: "clientEmail = ? AND serialNumberDevice = ? AND state = ? ",
    whereArgs: [clientEmail, serialNumber, "Present"]);
    if(result.isNotEmpty){
      return result.first["assignedID"] as int;
    }else{
      return -1;
    }

  }

  Future<UsageLog> getUsageLog(int serialNumber, String clientEmail)async{
    final Database db = await initDB();
    return UsageLog(startDate: "",
     startTime: "", clientEmail: clientEmail,
      assignedId: 0);

  }

  //turns on and off a device and ads it to the log
  Future<bool> devicePower(int serialNumber, Clientes clientData, bool setToOn)async{
    final Database db = await initDB();
    final int assignedIDdevice = await getDeviceAssignedID(clientData.email, serialNumber);
    final bool state = await logExists(clientData.email, assignedIDdevice);
    if(setToOn && state!=setToOn){ //if turning on, create the log
      DateTime today = DateTime.now();
      String formattedTime = DateFormat('HH:mm').format(today); // Format current time to HH:mm
      UsageLog logAdd = UsageLog( 
        startDate: getFormatedDate(today),
        startTime:formattedTime,//format hh:mm 
        clientEmail: clientData.email,
        assignedId: assignedIDdevice);
      await db.insert(usageLogTableName, logAdd.toJson());

      return state;
    }else if(!setToOn && state!=setToOn){ //if set to off, create the log
      
      return false;
    }else{
      return false;
    }

  }

  //Checks if the device exists in devices table
  Future<bool> deviceExists(int serialNumber) async {
    await generateRandomDevices(); //if table is empty, generate mock data
    final Database db = await initDB();
    var result = await db.rawQuery(
        "select * from '$deviceTableName' where serialNumber = '$serialNumber'");
    if (result.isNotEmpty) {
      return true;
    } else {
      return false;
    }
  }

  //checks if the device is not assigned to an user
  Future<bool> deviceAvailability(int serialNumber) async {
    final Database db = await initDB();
    var result = await db.query(assignedDeviceTableName,
    where: "serialNumberDevice = ? AND state = ?",
    whereArgs: [serialNumber,'Present']);
    if(result.isEmpty){
      return true;
    }
    return false;

  }

  //checks if the deviceTypeExists
  Future<bool> deviceTypeExists(String deviceTypeName)async{
    await generateRandomDevices(); //if table is empty, generate mock data
    final Database db = await initDB();
    var result = await db.rawQuery(
        "select * from '$deviceTypeTableName' where name = '${deviceTypeName}'");
    if (result.isNotEmpty) {
      return true;
    } else {
      return false;
    }


  }
  //gets the warranty days of the device
  Future<int> getDeviceTypeWarrantyDays(String deviceTypeName) async {
    final Database db = await initDB();
    var result = await db.query(
      deviceTypeTableName, 
      columns: ["warrantyDays"], 
      where: "name = ?", 
      whereArgs: [deviceTypeName]
    );
    if (result.isNotEmpty) {
      return result.first["warrantyDays"] as int;  
    } else {
      return -1; 
    }
  }

  //get todays date
  String getFormatedDate(DateTime date) {
    final DateFormat formatter = DateFormat('yyyy-MM-dd');
    return formatter.format(date);
  }

  Future<int> getChamberId(String chamberName, String clientEmail)async{
    Database db = await initDB();
    var result = await db.query(
      chamberTableName
      ,columns: ["chamberID"],
      where: "name = ? AND clientEmail = ?",
      whereArgs: [chamberName,clientEmail]);
    if(result.isNotEmpty){
      return result.first["chamberID"] as int;
    }else{
      return -1;
    }
  }


  //find the first next unused number id
  Future<int> getNewAssignedID() async {
    final Database db = await initDB();
    var result = await db.rawQuery("select max(assignedID) as maxID from '$assignedDeviceTableName'");
    
    int maxID = result[0]['maxID'] != null ? (result[0]['maxID'] as int) : 0;
    return maxID + 1;
  }
  //adds a device to the assigneddevice table, if there is an error it returns false
  Future<bool> createDispositivo(
    AssignedDevice assignedDeviceNew,
    String deviceTypeInput,
    String descriptionInput,
    String brandInput,
    String consumptionInput,
    String chamberNameInput,
    Clientes clientData) async{
    final db = await initDB();

    //checks if the device exists
    bool result = await deviceExists(assignedDeviceNew.serialNumberDevice);
    if(result){
      //if the device exists, check if it is not assigned to someone
      if(await deviceAvailability(assignedDeviceNew.serialNumberDevice)){//if the device is available
        //this case is if there is no present user
        //get the ID for the device
        int newAssignedID = await getNewAssignedID();
        assignedDeviceNew.assignedId=newAssignedID;
        var result =await  db.insert(assignedDeviceTableName, assignedDeviceNew.toJson());
        //adds the other data to other tables
        //get warranty days from device type table
        DateTime today = DateTime.now();
        int warrantyDaysDevice=await getDeviceTypeWarrantyDays(deviceTypeInput);
        String warrantyEndDateDevice=getFormatedDate(today.add(Duration(days: warrantyDaysDevice)));
        //create the certificate model
        Certificate cerftificateAdd = Certificate(
          serialNumberDevice: assignedDeviceNew.serialNumberDevice,
          brand: brandInput,
          deviceTypeName: deviceTypeInput,
          clientFullName: "${clientData.name ?? ""} ${clientData.middleName ?? ""} ${clientData.lastName ?? ""}",
          warrantyEndDate: warrantyEndDateDevice,
          warrantyStartDate: getFormatedDate(today),
          billNum: null,
          clientEmail: clientData.email
          );
        ChamberAssociation chamberAssociationAdd = ChamberAssociation(
          associationID: 1,
          associationStartDate: getFormatedDate(today),//today
          warrantyEndDate: warrantyEndDateDevice,
          chamberID: await getChamberId(chamberNameInput, clientData.email), //get the chamber id
          assignedID: newAssignedID
          );
        //add the classes to the corresponding tables
        var resultCertificate = await db.insert(certificateTableName, cerftificateAdd.toJson());
        var resultChamberAssociation = await db.insert(chamberAssociationTableName, chamberAssociationAdd.toJson());

        if(result > 0 && resultCertificate>0 && resultChamberAssociation >0){
          return true;
        }else{
          return false; 
        }
      }else{
        return false;
      }
    }else{
      return false;
    }

  }

  //return all the devices for an user
  Future<List<String>> getDevices(String clienteEmail) async {
    final Database db = await initDB();
    // Query the chamber table to find all chambers for the given clientEmail
    final List<Map<String, dynamic>> devicesNames = await db.query(
      assignedDeviceTableName,
      columns: ["serialNumberDevice"],
      where: "clientEmail = ? AND state = ?",
      whereArgs: [clienteEmail,'Present'],
    );

    // Extract the list of serialNumberDevice (as int)
    List<int> assignedDevicesTempList = devicesNames.map((assignedDevice) => assignedDevice["serialNumberDevice"] as int).toList();

    final Database dbDevices = await initDB();
    List<Map<String, dynamic>> devicesReturn = [];
    for (int object in assignedDevicesTempList) {
      var result = await dbDevices.query(
        deviceTableName,
        columns: ["name"],
        where: "serialNumber = ?",
        whereArgs: [object],
      );
      devicesReturn.addAll(result);
    }

    // Return the list of device names
    return devicesReturn.map((device) => device["name"] as String).toList();
  }

  //chamber taable methods
  //Checks if chamber already exists for the user
  Future<bool> chamberExists(String chamberName, String clientEmail) async {
    final Database db = await initDB();
    var result = await db.rawQuery(
        "select * from '$chamberTableName' where name = '${chamberName}' AND clientEmail = '${clientEmail}'");
    if (result.isNotEmpty) {
      return true;
    } else {
      return false;
    }
  }

  //registering a chamber
  Future<int> createChamber(Chamber chamber) async {
    final Database db = await initDB();
    return db.insert(chamberTableName, chamber.toJson());
  }

  //return all the chambers for an user
  Future<List<String>> getChambers(String clienteEmail) async {
    final Database db = await initDB();
    // Query the chamber table to find all chambers for the given clientEmail
    final List<Map<String, dynamic>> chambers = await db.query(
      chamberTableName,
      columns: ["name"],
      where: "clientEmail = ?",
      whereArgs: [clienteEmail],
    );

    return chambers.map((chamber) => chamber["name"] as String).toList();
  }

  //delete chamber from database
  Future<void> deleteChamber(String name, String clientEmail) async {
    final Database db = await initDB();
    await db.delete(chamberTableName,
        where: "name = ? AND clientEmail = ?", whereArgs: [name, clientEmail]);
  }

  //client table methods
  //Method for the login
  Future<bool> authenticate(Clientes cliente) async {
    final Database db = await initDB();
    var result = await db.rawQuery(
        "select * from '$clientTableName' where email = '${cliente.email}' AND password = '${cliente.password}'");
    if (result.isNotEmpty) {
      return true;
    } else {
      return false;
    }
  }

  Future<bool> clienteExists(String email) async {
    final Database db = await initDB();
    var result =
        await db.rawQuery("select * from '$clientTableName' where email = '${email}'");
    if (result.isNotEmpty) {
      return true;
    } else {
      return false;
    }
  }

  //Method for the sign in or register
  Future<int> createCliente(Clientes cliente) async {
    final Database db = await initDB();
    return db.insert(clientTableName, cliente.toJson());
  }

  //Get the user info
  Future<Clientes?> getCliente(String email) async {
    final Database db = await initDB();
    var result =
        await db.query(clientTableName, where: "email = ?", whereArgs: [email]);
    return result.isNotEmpty ? Clientes.fromJson(result.first) : null;
  }
}
