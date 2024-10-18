import 'package:flutter/material.dart';
import 'package:smart_home_tec_app/JSONmodels/assigned_device.dart';
import 'package:smart_home_tec_app/JSONmodels/clientes.dart';
import 'package:smart_home_tec_app/SQLite/sql_helper.dart';
import 'package:smart_home_tec_app/pages/created_objects/button.dart';
import 'package:smart_home_tec_app/pages/created_objects/constantes.dart';
import 'package:smart_home_tec_app/pages/created_objects/textentry.dart';

//en esta vista se permite asociar un dispsitivo del usuario a un aposento existente
class AsociarDispositivoNuevo extends StatefulWidget {
  final Clientes? clienteData;
  const AsociarDispositivoNuevo({super.key, this.clienteData});
  
  @override
  State<AsociarDispositivoNuevo> createState()=> _AsociarDispositivoNuevo();
}
class _AsociarDispositivoNuevo extends State<AsociarDispositivoNuevo>{
  final serialNumber = TextEditingController();
  final deviceType = TextEditingController();
  final description = TextEditingController();
  final brand = TextEditingController();
  final consumption = TextEditingController();
  final chamberName = TextEditingController();
  final db = DatabaseHelper();

  bool error=false;
  bool emptySpaces=false;
  bool notInteger=false;
  bool badChamberName=false;
  bool badDeviceTypeName=false;

  _resetDeviceVariables(){
    setState(() {
      error=false;
    });
    setState(() {
      emptySpaces=false;
    });
    setState(() {
      notInteger=false;
    });
    setState(() {
      badChamberName=false;
    });
    setState(() {
      badDeviceTypeName=false;
    });
    
  }

  bool _deviceFieldsFilled(){
    if(serialNumber.text.isNotEmpty && deviceType.text.isNotEmpty
    && description.text.isNotEmpty && brand.text.isNotEmpty &&
    consumption.text.isNotEmpty && chamberName.text.isNotEmpty){
      return true;
    }else{
      return false;
    }
  }

  bool _checkSerialInt(){
    return int.tryParse(serialNumber.text) != null;
  }

  Future<bool> _checkChamberName() async {
    return await db.chamberExists(chamberName.text, widget.clienteData!.email);
  }

  Future<bool> _checkDeviceTypeExistance() async {
    return await db.deviceTypeExists(deviceType.text);
  }

  _registerDevice() async {
    if(_deviceFieldsFilled()){
      if(_checkSerialInt()) {
        if( await _checkChamberName()){
          if( await _checkDeviceTypeExistance()){
            var res = await db.createDispositivo(AssignedDevice(
              serialNumberDevice: int.parse(serialNumber.text), 
              clientEmail: widget.clienteData!.email, 
              state: 'Present'),
              deviceType.text,
              description.text,
              brand.text,
              consumption.text,
              chamberName.text,
              widget.clienteData!
              );
            if(res){
              if (!mounted) return;
                int count = 0;
                Navigator.popUntil(context, (route) {
                  return count++ == 1;
                });
            }else{
              setState(() {
                error=true;
              });
            }
          }else{
            setState(() {
              badDeviceTypeName=true;
            });
          }
        }else{
          setState(() {
            badChamberName=true;
          });
        }
      }else{
        setState(() {
          notInteger=true;
        });
      }

    }else{
      setState(() {
        emptySpaces=true;
      });
    }

  }

  @override
  Widget build(BuildContext context){
    return Scaffold(
      backgroundColor: colorFondo,
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            child: Padding(
              padding: constantPadding,
              child:Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text("Ingrese los datos de la habitacion",
                    style: TextStyle(
                        fontSize: 40,
                        fontWeight: FontWeight.bold,
                        color: colorBaseBoton),
                        ),
                        TextEntry(
                          writtenText: "Numero Serial:",
                          icon: Icons.settings,
                          controller: serialNumber),
                        TextEntry(
                          writtenText: "Tipo de Dispositivo:", 
                          icon: Icons.settings, 
                          controller: deviceType),
                        TextEntry(
                          writtenText: "Marca:", 
                          icon: Icons.settings, 
                          controller: brand),
                        TextEntry(
                          writtenText: "Descripcion:", 
                          icon: Icons.settings, 
                          controller: description),
                        TextEntry(
                          writtenText: "Consumo:", 
                          icon: Icons.charging_station, 
                          controller: consumption),
                        TextEntry(
                          writtenText: "Aposento a asignar:", 
                          icon: Icons.settings, 
                          controller: chamberName),
                        Button(
                          texto: "Registrar dispositivo",
                          funcion: (){_registerDevice();}),
                        emptySpaces
                          ? Text(emptySpacesText,
                            style:TextStyle(
                            color: Colors.red.shade900,
                            ),
                          ):const SizedBox(),
                        error
                          ? Text(errorDeviceText,
                            style:TextStyle(
                            color: Colors.red.shade900,
                            ),
                          ):const SizedBox(),
                        notInteger
                          ? Text(notIntegerDeviceText,
                            style:TextStyle(
                            color: Colors.red.shade900,
                            ),
                          ):const SizedBox(),
                        badChamberName
                          ? Text(badChamberNameText,
                            style:TextStyle(
                            color: Colors.red.shade900,
                            ),
                          ):const SizedBox(),
                        badDeviceTypeName
                          ? Text(badDeviceTypeNameText,
                            style:TextStyle(
                            color: Colors.red.shade900,
                            ),
                          ):const SizedBox(),
                ],))
          ),
        ))
    );
  }

}
