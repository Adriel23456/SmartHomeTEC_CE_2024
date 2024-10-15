import 'package:path/path.dart';
import 'package:smart_home_tec_app/JSONmodels/chamber.dart';
import 'package:smart_home_tec_app/JSONmodels/clientes.dart';
import 'package:sqflite/sqflite.dart';

class DatabaseHelper {
  final clienteDatabaseName = "clientes.db";
  final chamberDatabaseName = "chambers.db";
  String clientes = '''
  CREATE TABLE clientes (
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
  CREATE TABLE chamber (
  chamberID INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  clientEmail TEXT
  )
  ''';
  String device = '''
  CREATE TABLE device (
  serialNumber INTEGER PRIMARY KEY,
  price TEXT,
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
  CREATE TABLE assigneddevice (
  assignedID INTEGER PRIMARY KEY,
  serialNumberDevice INTEGER,
  clientEmail TEXT,
  state TEXT
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

  //chamber taable methods
  Future<bool> chamberExists(String chamberName, String clientEmail) async {
    final Database db = await initChamberDB();
    var result = await db.rawQuery(
        "select * from chamber where name = '${chamberName}' AND clientEmail = '${clientEmail}'");
    if (result.isNotEmpty) {
      return true;
    } else {
      return false;
    }
  }

  //registering a chamber
  Future<int> createChamber(Chamber chamber) async {
    final Database db = await initChamberDB();
    return db.insert("chamber", chamber.toJson());
  }

  //client table methods
  //Method for the login
  Future<bool> authenticate(Clientes cliente) async {
    final Database db = await initClientesDB();
    var result = await db.rawQuery(
        "select * from clientes where email = '${cliente.email}' AND password = '${cliente.password}'");
    if (result.isNotEmpty) {
      return true;
    } else {
      return false;
    }
  }

  Future<bool> clienteExists(String email) async {
    final Database db = await initClientesDB();
    var result =
        await db.rawQuery("select * from clientes where email = '${email}'");
    if (result.isNotEmpty) {
      return true;
    } else {
      return false;
    }
  }

  //Method for the sign in or register
  Future<int> createCliente(Clientes cliente) async {
    final Database db = await initClientesDB();
    return db.insert("clientes", cliente.toJson());
  }

  //Get the user info
  Future<Clientes?> getCliente(String email) async {
    final Database db = await initClientesDB();
    var result =
        await db.query("clientes", where: "email = ?", whereArgs: [email]);
    return result.isNotEmpty ? Clientes.fromJson(result.first) : null;
  }
}
