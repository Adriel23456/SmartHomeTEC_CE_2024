import 'dart:ffi';

import 'package:path/path.dart';
import 'package:smart_home_tec_app/JSONmodels/clientes.dart';
import 'package:sqflite/sqflite.dart';

class DatabaseHelper {
  final databaseName = "cliente.db";
  String clientes = '''
  CREATE TABLE clientes {
  usrId INTEGER PRIMARY KEY AUTOINCREMENT,
  userMail TEXT,
  password TEXT,
  name TEXT,
  lastName TEXT,
  country TEXT,
  province TEXT,
  district TEXT,
  canton TEXT,
  homeInfo TEXT
  }
  ''';

  Future<Database> initDB() async {
    final dbpath = await getDatabasesPath();
    final path = join(dbpath, databaseName);

    return openDatabase(path, version: 1, onCreate: (db, version) async {
      await db.execute(clientes);
    });
  }

  Future<bool> authenticate(Clientes cliente) async {
    final Database db = await initDB();
    var result = await db.query(
        'select * from clientes where userMail = ${cliente.userMail} AND password = ${cliente.password}');
    if (result.isNotEmpty) {
      return true;
    } else {
      return false;
    }
  }
}
