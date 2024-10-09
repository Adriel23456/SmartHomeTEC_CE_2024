import 'package:path/path.dart';
import 'package:smart_home_tec_app/JSONmodels/clientes.dart';
import 'package:sqflite/sqflite.dart';

class DatabaseHelper {
  final databaseName = "clientes.db";
  String clientes = '''
  CREATE TABLE clientes (
  userMail TEXT PRIMARY KEY,
  password TEXT,
  name TEXT,
  lastName TEXT,
  country TEXT,
  province TEXT,
  district TEXT,
  canton TEXT,
  infoAdicional TEXT
  )
  ''';

  Future<Database> initDB() async {
    final dbpath = await getDatabasesPath();
    final path = join(dbpath, databaseName);

    return openDatabase(path, version: 1, onCreate: (db, version) async {
      await db.execute(clientes);
    });
  }

  //Method for the login
  Future<bool> authenticate(Clientes cliente) async {
    final Database db = await initDB();
    var result = await db.rawQuery(
        "select * from clientes where userMail = '${cliente.userMail}' AND password = '${cliente.password}'");
    if (result.isNotEmpty) {
      return true;
    } else {
      return false;
    }
  }

  //Method for the sign in or register
  Future<int> createCliente(Clientes cliente) async {
    final Database db = await initDB();
    return db.insert("clientes", cliente.toJson());
  }

  //Get the user info
  Future<Clientes?> getCliente(String mail) async {
    final Database db = await initDB();
    var result =
        await db.query("clientes", where: "userMail = ?", whereArgs: [mail]);
    return result.isNotEmpty ? Clientes.fromJson(result.first) : null;
  }
}
