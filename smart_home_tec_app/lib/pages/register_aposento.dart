import 'package:flutter/material.dart';
import 'package:smart_home_tec_app/SQLite/sql_helper.dart';

class RegisterAposento extends StatefulWidget {
  const RegisterAposento({super.key});

  @override
  State<RegisterAposento> createState() => _RegisterAposento();
}

class _RegisterAposento extends State<RegisterAposento> {
  final nombreAposento = TextEditingController();

  final db = DatabaseHelper();

  @override
  Widget build(BuildContext context) {
    return Scaffold();
  }
}
