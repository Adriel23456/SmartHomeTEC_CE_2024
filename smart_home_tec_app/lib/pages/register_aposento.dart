import 'package:flutter/material.dart';
import 'package:smart_home_tec_app/JSONmodels/chamber.dart';
import 'package:smart_home_tec_app/JSONmodels/clientes.dart';
import 'package:smart_home_tec_app/SQLite/sql_helper.dart';

class RegisterAposento extends StatefulWidget {
  final Clientes? clienteData;
  const RegisterAposento({super.key, this.clienteData});

  @override
  State<RegisterAposento> createState() => _RegisterAposento();
}

class _RegisterAposento extends State<RegisterAposento> {
  final chamberName = TextEditingController();
  final db = DatabaseHelper();

  bool repeatedChamberName = false;

  void _resetChamberVariables(){
    setState((){
      repeatedChamberName=false;
    });
  }

  Future<bool> _isExistentChamber() async {
    var chamberExistente = await db.chamberExists(chamberName.text,widget.clienteData!.email);
    if(chamberExistente){
      setState((){
        repeatedChamberName = true;
      });
      return true;
    }
    return false;
  }

  registerChamber() async {
    _resetChamberVariables();
    if(!(await _isExistentChamber())){
      var result = await db.createChamber(Chamber(name: chamberName.text, clientEmail: widget.clienteData!.email));
      if(result>0){
        if(!mounted) return;
        int count=0;
        Navigator.popUntil(context, (route){
          return count++==2;
          });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold();
  }
}
