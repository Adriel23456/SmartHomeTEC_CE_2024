import 'package:intl/intl.dart';
import 'package:path/path.dart';
import 'package:smart_home_tec_app/JSONmodels/assigned_device.dart';
import 'package:smart_home_tec_app/JSONmodels/certificate.dart';
import 'package:smart_home_tec_app/JSONmodels/chamber.dart';
import 'package:smart_home_tec_app/JSONmodels/chamber_association.dart';
import 'package:smart_home_tec_app/JSONmodels/clientes.dart';
import 'package:smart_home_tec_app/pages/created_objects/constantes.dart';
import 'package:sqflite/sqflite.dart';

class DatabaseHelper {
  final clienteDatabaseName = "clientes.db";
  final chamberDatabaseName = "chambers.db";
  final deviceDatabaseName = "device.db";
  final assignedDeviceDatabaseName = "assigneddevice.db";
  final chamberAsssociationDatabaseName = "chamberassociation.db";
  final certificateDatabaseName = "certificate.db";
  final deviceTypeDatabaseName = "devicetype.db";
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
  //RESETS ALL DATABASES
  Future<void> deleteAllDatabases() async {
    final dbPath = await getDatabasesPath();

    // Delete the "clientes.db" database
    final clienteDbPath = join(dbPath, clienteDatabaseName);
    await deleteDatabase(clienteDbPath);

    // Delete the "chambers.db" database
    final chamberDbPath = join(dbPath, chamberDatabaseName);
    await deleteDatabase(chamberDbPath);
  }
  //---------------

  Future<Database> initClientesDB() async {
    final dbpath = await getDatabasesPath();
    final path = join(dbpath, clienteDatabaseName);

    return openDatabase(path, version: 2, onCreate: (db, version) async {
      await db.execute(clientes);
    });
  }

  Future<Database> initChamberDB() async {
    final dbpath = await getDatabasesPath();
    final path = join(dbpath, chamberDatabaseName);

    return openDatabase(path, version: 1, onCreate: (db, version) async {
      await db.execute(chamber);
    });
  }

  Future<Database> initDeviceDB() async {
    final dbpath = await getDatabasesPath();
    final path = join(dbpath, deviceDatabaseName);
    return openDatabase(path, version: 1, onCreate: (db, version) async {
      await db.execute(device);
    });
  }

  Future<Database> initAssignedDeviceDB() async {
    final dbpath = await getDatabasesPath();
    final path = join(dbpath, assignedDeviceDatabaseName);
    return openDatabase(path, version: 1, onCreate: (db, version) async {
      await db.execute(assignedDevice);
    });
  }

  Future<Database> initChamberAssociationDB() async {
    final dbpath = await getDatabasesPath();
    final path = join(dbpath, chamberAsssociationDatabaseName);

    return openDatabase(path, version: 1, onCreate: (db, version) async {
      await db.execute(chamberAssociation);
    });
  }

  Future<Database> initCertificateDB() async {
    final dbpath = await getDatabasesPath();
    final path = join(dbpath, certificateDatabaseName);

    return openDatabase(path, version: 1, onCreate: (db, version) async {
      await db.execute(certificate);
    });
  }

  Future<Database> initDeviceTypeDB() async {
    final dbpath = await getDatabasesPath();
    final path = join(dbpath, deviceTypeDatabaseName);

    return openDatabase(path, version: 1, onCreate: (db, version) async {
      await db.execute(deviceType);
    });
  }
  //Generate 5 mock devices if table is empty
    // Generates 5 random devices for the device table
  Future<void> generateRandomDevices() async {
    final Database dbDevice = await initDeviceDB();
    final Database dbDeviceType = await initDeviceTypeDB();

    // If the device table is empty, insert random data
    var result = await dbDevice.query(deviceTableName);
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
        await dbDeviceType.insert(deviceTypeTableName, deviceType);
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
        await dbDevice.insert(deviceTableName, device);
      }
    }
  }



  //Device methods/
  //Checks if the device exists in devices table
  Future<bool> deviceExists(int serialNumber) async {
    await generateRandomDevices(); //if table is empty, generate mock data
    final Database db = await initDeviceDB();
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
    final Database db = await initAssignedDeviceDB();
    var result = await db.query(assignedDeviceTableName,
    where: "serialNumberDevice = ? AND state = ?",
    whereArgs: [serialNumber,'Present']);
    if(result.isEmpty){
      return true;
    }
    return false;

  }
  Future<bool> deviceTypeExists(String deviceTypeName)async{
    await generateRandomDevices(); //if table is empty, generate mock data
    final Database db = await initDeviceTypeDB();
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
    final Database db = await initDeviceTypeDB();
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
    Database db = await initChamberDB();
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
    final Database db = await initAssignedDeviceDB();
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
    final dbAssignedDevice = await initAssignedDeviceDB();

    //checks if the device exists
    bool result = await deviceExists(assignedDeviceNew.serialNumberDevice);
    if(result){
      //if the device exists, check if it is not assigned to someone
      if(await deviceAvailability(assignedDeviceNew.serialNumberDevice)){//if the device is available
        //this case is if there is no present user
        //get the ID for the device
        int newAssignedID = await getNewAssignedID();
        assignedDeviceNew.assignedId=newAssignedID;
        var result =await  dbAssignedDevice.insert(assignedDeviceTableName, assignedDeviceNew.toJson());
        //adds the other data to other tables
        Database dbCertificate = await initCertificateDB();
        Database dbChamberAssociation = await initChamberAssociationDB();
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
        var resultCertificate = await dbCertificate.insert(certificateTableName, cerftificateAdd.toJson());
        var resultChamberAssociation = await dbChamberAssociation.insert(chamberAssociationTableName, chamberAssociationAdd.toJson());

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
    final Database db = await initAssignedDeviceDB();
    // Query the chamber table to find all chambers for the given clientEmail
    final List<Map<String, dynamic>> devicesNames = await db.query(
      assignedDeviceTableName,
      columns: ["serialNumberDevice"],
      where: "clientEmail = ? AND state = ?",
      whereArgs: [clienteEmail,'Present'],
    );

    // Extract the list of serialNumberDevice (as int)
    List<int> assignedDevicesTempList = devicesNames.map((assignedDevice) => assignedDevice["serialNumberDevice"] as int).toList();

    final Database dbDevices = await initDeviceDB();
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
    final Database db = await initChamberDB();
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
    final Database db = await initChamberDB();
    return db.insert(chamberTableName, chamber.toJson());
  }

  //return all the chambers for an user
  Future<List<String>> getChambers(String clienteEmail) async {
    final Database db = await initChamberDB();
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
    final Database db = await initChamberDB();
    await db.delete(chamberTableName,
        where: "name = ? AND clientEmail = ?", whereArgs: [name, clientEmail]);
  }

  //client table methods
  //Method for the login
  Future<bool> authenticate(Clientes cliente) async {
    final Database db = await initClientesDB();
    var result = await db.rawQuery(
        "select * from '$clientTableName' where email = '${cliente.email}' AND password = '${cliente.password}'");
    if (result.isNotEmpty) {
      return true;
    } else {
      return false;
    }
  }

  Future<bool> clienteExists(String email) async {
    final Database db = await initClientesDB();
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
    final Database db = await initClientesDB();
    return db.insert(clientTableName, cliente.toJson());
  }

  //Get the user info
  Future<Clientes?> getCliente(String email) async {
    final Database db = await initClientesDB();
    var result =
        await db.query(clientTableName, where: "email = ?", whereArgs: [email]);
    return result.isNotEmpty ? Clientes.fromJson(result.first) : null;
  }
}
