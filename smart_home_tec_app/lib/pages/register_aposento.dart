import 'package:flutter/material.dart';
import 'package:smart_home_tec_app/JSONmodels/chamber.dart';
import 'package:smart_home_tec_app/JSONmodels/clientes.dart';
import 'package:smart_home_tec_app/SQLite/database_service.dart';
import 'package:smart_home_tec_app/pages/created_objects/button.dart';
import 'package:smart_home_tec_app/pages/created_objects/constantes.dart';
import 'package:smart_home_tec_app/pages/created_objects/textentry.dart';

class RegisterAposento extends StatefulWidget {
  final Clientes? clienteData;
  const RegisterAposento({super.key, this.clienteData});

  @override
  State<RegisterAposento> createState() => _RegisterAposento();
}

class _RegisterAposento extends State<RegisterAposento> {
  final chamberName = TextEditingController();
  final db = DatabaseService();

  bool repeatedChamberName = false;

  void _resetChamberVariables() {
    setState(() {
      repeatedChamberName = false;
    });
  }

  Future<bool> _isExistentChamber() async {
    var chamberExistente =
        await db.chamberExists(chamberName.text, widget.clienteData!.email);
    if (chamberExistente) {
      setState(() {
        repeatedChamberName = true;
      });
      return true;
    }
    return false;
  }

  registerChamber() async {
    _resetChamberVariables();
    if (!(await _isExistentChamber())) {
      //checks if the chamber already exists for the user
      var result = await db.createChamber(Chamber(
          name: chamberName.text, clientEmail: widget.clienteData!.email));
      if (result > 0) {
        if (!mounted) return;
        int count = 0;
        Navigator.popUntil(context, (route) {
          return count++ == 1;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: colorFondo,
      body: SafeArea(
          child: Center(
        child: SingleChildScrollView(
            child: Padding(
          padding: constantPadding,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Text(
                "Ingrese los datos de la habitacion",
                style: TextStyle(
                    fontSize: 40,
                    fontWeight: FontWeight.bold,
                    color: colorBaseBoton),
              ),
              TextEntry(
                  writtenText: "Nombre",
                  icon: Icons.home,
                  controller: chamberName),
              Button(
                  texto: "Registrar aposento",
                  funcion: () {
                    registerChamber();
                  }),
              repeatedChamberName
                  ? Text(
                      repeatedChamberNameText,
                      style: TextStyle(
                        color: Colors.red.shade900,
                      ),
                    )
                  : const SizedBox(),
            ],
          ),
        )),
      )),
    );
  }
}
