import 'package:flutter/material.dart';

//project colors
const colorBaseBoton = Color(0xFF0055bd);
const colorFondo =
    Color(0xFFd9d9d9); //dentro en vez de # para el hexa, se pone 0xFF
const constantPadding = EdgeInsets.symmetric(vertical: 20);

//Error conditionals constants
const badEmailText = "El correo ingesado no es valido";
const passwordDifferentText = "Las contraseñas no concuerdan";
const emptySpacesText = "Rellene todos los espacios porfavor";
const adminAttemptedText = "No puede crear cuentas con correo de administrador";
const unacceptablePasswordText = "La contraseña no es aceptable";
const userExistsText = "Este correo ya esta registrado";
const passwordDerivedText =
    "La contraseña no puede ser igual al nombre o correo";
const passwordShortText = "La contraseña debe tener almenos 5 caracteres";
const repeatedChamberNameText =
    "El usuario ya tiene registrado un aposento con este nombre";
const errorDeviceText = "Error al registrat el dispositivo";
const notIntegerDeviceText="El numero serial debe ser un numero";
const badChamberNameText ="El nombre del aposento no es correcto para este usuario";
const badDeviceTypeNameText = "El nombre del tipo de dispositivo no existe";

//DB tables constants
const clientTableName="Clientes";
const chamberTableName="Chamber";
const deviceTableName="Device";
const assignedDeviceTableName="AssignedDevice";
const chamberAssociationTableName="ChamberAssociation";
const certificateTableName="Certificate";
const deviceTypeTableName="DeviceType";