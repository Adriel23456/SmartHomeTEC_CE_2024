import 'package:flutter/material.dart';
import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart';

class DatabaseHelper{
  final databaseName="cliente.db";
  String clientes='''
  CREATE TABLE clientes {
  usrId INTEGER PRIMARY KEY AUTOINCREMENT,
  }
  ''';

  Future<Database> initDB ()async{
    final dbpath = await getDatabasesPath();
    final path = join(dbpath, databaseName);

    return openDatabase(path,version: 1, onCreate: (db,version){

    });
  }
}