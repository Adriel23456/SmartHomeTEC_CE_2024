import 'package:flutter/material.dart';
import 'package:smart_home_tec_app/JSONmodels/clientes.dart';
import 'package:smart_home_tec_app/SQLite/sql_helper.dart';
import 'package:smart_home_tec_app/pages/created_objects/button.dart';
import 'package:smart_home_tec_app/pages/created_objects/constantes.dart';
import 'package:smart_home_tec_app/pages/created_objects/textentry.dart';
import 'package:smart_home_tec_app/pages/login_page.dart';

class RegisterPage extends StatefulWidget {
  const RegisterPage({super.key});

  @override
  State<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {
  final email = TextEditingController();
  final password = TextEditingController();
  final name = TextEditingController();
  final middleName = TextEditingController();
  final lastName = TextEditingController();
  final passwordConfirm = TextEditingController();
  final country = TextEditingController();
  final continent = TextEditingController();
  final region = TextEditingController();
  final db = DatabaseHelper();

  //variable for showing error texts
  bool badEmail = false;
  bool passwordsDifferent = false;
  bool emptySpaces = false;
  bool adminAttempted = false;
  bool unaccceptablePassowrd = false;
  bool userExists = false;
  bool passwordDerived = false;
  bool passwordShort = false;

  void _resetVariables() {
    setState(() {
      badEmail = false;
    });
    setState(() {
      passwordsDifferent = false;
    });
    setState(() {
      emptySpaces = false;
    });
    setState(() {
      adminAttempted = false;
    });
    setState(() {
      unaccceptablePassowrd = false;
    });
    setState(() {
      userExists = false;
    });
    setState(() {
      passwordDerived = false;
    });
    setState(() {
      passwordShort = false;
    });
  }

  Future<bool> _isExistentUser() async {
    //checks for the mail in the database of clientes
    //if it exists, return false
    var clienteExistance = await db.clienteExists(email.text);
    if (clienteExistance) {
      setState(() {
        userExists = true;
      });
      return true;
    }
    return false;
  }

  bool _isAcceptablePassowrd() {
    if (password.text == passwordConfirm.text) {
      if ((password.text != email.text) &&
          password.text != name.text &&
          password.text != lastName.text &&
          password.text != (email.text.split("@"))[0]) {
        //passowrd cant be equal to the mail, name, last name or the mail first part

        if ((password.text.length >= 4)) {
          //password must have 5 or more characters
          return true;
        } else {
          setState(() {
            passwordShort = true;
          });
        }
      } else {
        setState(() {
          passwordDerived = true;
        });
      }
    } else {
      setState(() {
        passwordsDifferent = true;
      });
    }
    return false;
  }

  bool _isAcceptableMail() {
    if (email.text.contains("@") && !(email.text.contains(" "))) {
      //the mail contains a @ and has no white spaces
      if ((email.text.split("@")[0]).isNotEmpty &&
          email.text.split("@")[1].isNotEmpty) {
        //there is text on both side of the @
        if ((!(email.text.split("@")[0]).contains("@")) &&
            (!(email.text.split("@")[1]).contains("@"))) {
          //there is no other @ in the email address
          if (!(email.text.split("@")[1]).contains("admin")) {
            //the user is not tryring to forcefully create an admin account
            return true;
          } else if ((email.text.split("@")[1]).contains("admin")) {
            setState(() {
              adminAttempted = true;
            });
          }
        }
      }
    }
    return false;
  }

  bool fieldsFilled() {
    if (email.text.isNotEmpty &&
        password.text.isNotEmpty &&
        name.text.isNotEmpty &&
        lastName.text.isNotEmpty &&
        country.text.isNotEmpty &&
        middleName.text.isNotEmpty &&
        continent.text.isNotEmpty) {
      if (_isAcceptableMail()) {
        //checks if mail has an @ and if it has something before the @
        return true;
      } else {
        setState(() {
          badEmail = true;
        });
      }
    } else {
      setState(() {
        emptySpaces = true;
      });
    }
    return false;
  }

  register() async {
    _resetVariables(); //resets the bool variables in case a new error is presented and a old one is solved
    if (fieldsFilled()) {
      //veridfy if all fields have text and checks email
      if (_isAcceptablePassowrd()) {
        //verify password constraints
        if (!(await _isExistentUser())) {
          //checks if the user exists already
          var result = await db.createCliente(Clientes(
              email: email.text,
              password: password.text,
              region: region.text,
              continent: continent.text,
              country: country.text,
              name: name.text,
              middleName: middleName.text,
              lastName: lastName.text));

          if (result > 0) {
            if (!mounted) return;
            Navigator.push(context,
                MaterialPageRoute(builder: (context) => const LoginPage()));
          }
        }
      } else {
        setState(() {
          unaccceptablePassowrd = true;
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
                        padding: const EdgeInsets.symmetric(vertical: 20),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Text(
                              "Registrar la cuenta",
                              style: TextStyle(
                                  fontSize: 40,
                                  fontWeight: FontWeight.bold,
                                  color: colorBaseBoton),
                            ),
                            TextEntry(
                                writtenText: "Correo",
                                icon: Icons.mail,
                                controller: email),
                            TextEntry(
                                writtenText: "Nombre",
                                icon: Icons.account_circle,
                                controller: name),
                              TextEntry(
                                writtenText: "Segundo nombre",
                                icon: Icons.account_circle,
                                controller: middleName),
                            TextEntry(
                                writtenText: "Apellidos",
                                icon: Icons.account_circle,
                                controller: lastName),
                            TextEntry(
                                writtenText: "Contraseña",
                                icon: Icons.lock,
                                controller: password,
                                passwordVisibility: true),
                            TextEntry(
                                writtenText: "Confirmar contraseña",
                                icon: Icons.lock,
                                controller: passwordConfirm,
                                passwordVisibility: true),
                            TextEntry(
                                writtenText: "Region",
                                icon: Icons.add_location_alt_outlined,
                                controller: region),
                            TextEntry(
                                writtenText: "País",
                                icon: Icons.add_location_alt_outlined,
                                controller: country),
                            TextEntry(
                                writtenText: "Continente",
                                icon: Icons.add_location_alt_outlined,
                                controller: continent),
                            Button(
                                texto: "Registrarse",
                                funcion: () {
                                  register();
                                }),
                            Row(
                              children: [
                                Text(
                                  "Ya tienes una cuenta? ",
                                  style: TextStyle(color: Colors.grey),
                                ),
                                TextButton(
                                    onPressed: () {
                                      Navigator.push(
                                          context,
                                          MaterialPageRoute(
                                              builder: (context) =>
                                                  const LoginPage()));
                                    },
                                    child: const Text("Inicia Sesión"))
                              ],
                            ),
                            badEmail
                                ? Text(
                                    badEmailText,
                                    style: TextStyle(
                                      color: Colors.red.shade900,
                                    ),
                                  )
                                : const SizedBox(),
                            passwordsDifferent
                                ? Text(
                                    passwordDifferentText,
                                    style: TextStyle(
                                      color: Colors.red.shade900,
                                    ),
                                  )
                                : const SizedBox(),
                            emptySpaces
                                ? Text(
                                    emptySpacesText,
                                    style: TextStyle(
                                      color: Colors.red.shade900,
                                    ),
                                  )
                                : const SizedBox(),
                            adminAttempted
                                ? Text(
                                    adminAttemptedText,
                                    style: TextStyle(
                                      color: Colors.red.shade900,
                                    ),
                                  )
                                : const SizedBox(),
                            userExists
                                ? Text(
                                    userExistsText,
                                    style: TextStyle(
                                      color: Colors.red.shade900,
                                    ),
                                  )
                                : const SizedBox(),
                            passwordDerived
                                ? Text(
                                    passwordDerivedText,
                                    style: TextStyle(
                                      color: Colors.red.shade900,
                                    ),
                                  )
                                : const SizedBox(),
                            unaccceptablePassowrd
                                ? Text(
                                    unacceptablePasswordText,
                                    style: TextStyle(
                                      color: Colors.red.shade900,
                                    ),
                                  )
                                : const SizedBox(),
                            passwordShort
                                ? Text(
                                    passwordShortText,
                                    style: TextStyle(
                                      color: Colors.red.shade900,
                                    ),
                                  )
                                : const SizedBox(),
                          ],
                        ))))));
  }
}
