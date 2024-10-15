
import 'dart:convert';

Chamber chamberFromJson(String str) => Chamber.fromJson(json.decode(str));

String chamberToJson(Chamber data) => json.encode(data.toJson());

class Chamber {
    int? chamberId;
    final String name;
    final String clientEmail;

    Chamber({
        this.chamberId,
        required this.name,
        required this.clientEmail,
    });

    void setID(int idNum){
      chamberId=idNum;
    }

    factory Chamber.fromJson(Map<String, dynamic> json) => Chamber(
        chamberId: json["chamberID"],
        name: json["name"],
        clientEmail: json["clientEmail"],
    );

    Map<String, dynamic> toJson() => {
        "chamberID": chamberId,
        "name": name,
        "clientEmail": clientEmail,
    };
}
